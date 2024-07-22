import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { College } from "../models/college.mjs";
import { Course } from "../models/course.mjs";
import { Professor } from "../models/professors.mjs";
import { Class } from "../models/class.mjs";
import { Student } from "../models/student.mjs";

import mongoose from "mongoose";

const setupCourse = asyncHandler(async (req, res) => {
    const college = await College.findOne({ owner: req.owner._id });
    
    console.log("College : ", college)

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    const { name, code, profId } = req.body;

    console.log("name : ", name)
    console.log("code : ", code)
    console.log("profId : ", profId)

    if (!name || !code || !profId) {
        throw new ApiError(400, "All fields are required");
    }

    const professor = await Professor.findOne({ profId: profId });

    console.log("professor : ", professor)

    if (!professor) {
        throw new ApiError(404, "Wrong ProfId provided");
    }

    const courseCreation = await Course.create({
        name,
        code,
        college: new mongoose.Types.ObjectId(college._id),
        owner: new mongoose.Types.ObjectId(req.owner._id),
        professor: new mongoose.Types.ObjectId(professor._id)
    })

    if (!courseCreation) {
        throw new ApiError(500, "Course could not be created");
    }

    professor.courses.push(courseCreation._id)

    await professor.save(
        {
            validateBeforeSave : false
        }
    );

    college.courses.push(courseCreation._id)

    await college.save({
        validateBeforeSave : false
    });
    

    res.status(201).json({ message: "Course created successfully", course: courseCreation });
});

const enrollInaCourse = asyncHandler (async (req,res) => {

    const {code} = req.body;

    const course = await Course.findOne({code});

    const student = await Student.findOne({user: new mongoose.Types.ObjectId(req.user._id)});

    if(!course) {
        throw new ApiError(404, "Course not found");
    }

    course.students.push(new mongoose.Types.ObjectId(student._id));
    await course.save(
        {
            validateBeforeSave : false
        }
    );

    student.course.push(new mongoose.Types.ObjectId(course._id));
    await student.save(
        {
            validateBeforeSave : false
        }
    );

    const result = await Course.findOne({code}).select("-owner -professor -students -classes");

    if(!result) {
        throw new ApiError(404, "Course not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Course enrolled successfully", result)
    );

})

const getClasses = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;

    if (!courseId) {
        throw new ApiError(400, "Course id is required");
    }

    const classes = await Class.find({
        course: courseId
    })

    if (!classes) {
        throw new ApiError(404, "Classes not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Classes fetched successfully", classes)
        );
});

const getstudentsInaCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;
    console.log("courseId : ", courseId)
    const students = await Student.aggregate([
        {
            $unwind: "$course"
        },
        {
            $match: {
                course: new mongoose.Types.ObjectId(courseId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $addFields : {
                name : {$arrayElemAt : ["$user.fullname", 0]},
            }
        },
        {
            $project: {
                name : 1,
                enrollNo : 1,
            }
        }
    ])

    if (!students) {
        throw new ApiError(404, "Students not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Students fetched successfully", students)
        );
});

const getAttendanceRecordInaCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;
    console.log("Course ID : ", courseId)
    const attendanceRecord = await Course.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId)
            },
        },
        {
            $lookup: {
                from: "students",
                localField: "students",
                foreignField: "_id",
                as: "studentInfo",
                pipeline: [
                    {
                        $lookup: {
                            from: "attendances",
                            localField: "_id",
                            foreignField: "student",
                            as: "attendances",
                            pipeline: [
                                {
                                    $match: {
                                        course: new mongoose.Types.ObjectId(courseId)
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            attendanceCount: { $size: "$attendances" }
                        }
                    },
                    {
                        $project: {
                            attendanceCount: 1,
                            _id: 0,
                            fullname: 1,
                            enrollNo: 1,
                            //attendances : 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "classes",
                localField: "classes",
                foreignField: "_id",
                as: "classInfo",
                pipeline: [
                    {
                        $match: {
                            status : "Regular"
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                classCount: {
                    $size: "$classInfo"
                }
            }
        },
        {
            $unwind: "$studentInfo"
        },
        {
            $addFields: {
                attendancePercentage: {
                    $cond: {
                        if: { $eq: ["$classCount", 0] },
                        then: 0,
                        else: { $multiply: [100, { $divide: ["$studentInfo.attendanceCount", "$classCount"] }] }
                    }
                }
            }
        },
        {
            $project: {
                studentInfo: 1,
                classCount: 1,
                attendancePercentage: 1,
            }
        }
    ])

    if (!attendanceRecord) {
        throw new ApiError(404, "Attendance record not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Attendance record fetched successfully", attendanceRecord)
        );

});

const getCourseDetails = asyncHandler (async (req, res) => {

    const { courseId } = req.params;

    if(!courseId) {
        throw new ApiError(400, "Course id is required");
    }

    const courseDetails = await Course.findById(courseId).select("-students -classes -owner -professor -attendances");

    if(!courseDetails) {
        throw new ApiError(404, "Course not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Course details fetched successfully", courseDetails)
        );
})

export {
    setupCourse,
    enrollInaCourse,
    getClasses,
    getstudentsInaCourse,
    getAttendanceRecordInaCourse,
    getCourseDetails
};
