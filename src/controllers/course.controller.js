import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { College } from "../models/college.mjs";
import { Course } from "../models/course.mjs";
import { Professor } from "../models/professor.mjs";
import { Class } from "../models/class.mjs";
import { Student } from "../models/student.mjs";

const setupCourse = asyncHandler(async (req, res) => {
    const college = await College.findOne({ owner: req.user._id });

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    const { name, code, profId } = req.body;

    const professor = await Professor.findOne({ profId: profId });

    if (!professor) {
        throw new ApiError(404, "Wrong ProfId provided");
    }

    const courseCreation = await Course.create({
        name,
        code,
        college: college._id,
        owner: req.user._id,
        professor: professor._id
    })

    if (!courseCreation) {
        throw new ApiError(500, "Course could not be created");
    }

    professor.courses.push(courseCreation._id)

    await professor.save();

    res.status(201).json({ message: "Course created successfully", course: courseCreation });
});

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

    const students = await Student.aggregate([
        {
            $unwind: "$courses"
        },
        {
            $match: {
                courses: courseId
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

    const attendanceRecord = await Course.aggregate([
        {
            $match: {
                _id: courseId
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
                                        course: courseId
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
                            name: 1,
                            enrollNo: 1,
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
                            $and: [{
                                course: courseId
                            }, {
                                status: "regular"
                            }]
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
                    $multiply: [100, { $divide: ["$studentInfo.attendanceCount", "$classCount"] }]
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

export const courseController = {
    setupCourse,
    getClasses,
    getstudentsInaCourse,
    getAttendanceRecordInaCourse

};
