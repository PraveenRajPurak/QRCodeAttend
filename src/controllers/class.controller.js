import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Class } from "../models/class.mjs";
import { Course } from "../models/course.mjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Attendance } from "../models/attendance.mjs";
import { Student } from "../models/student.mjs";

function generateUniqueCode() {
    let code;
    do {
        code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (generatedCodes.has(code));

    generatedCodes.add(code);
    return code;
}

const createClass = asyncHandler(async (req, res) => {
    const { courseCode, date, startTime, endTime } = req.body;
    // CourseCode is taken as input to find out the id of the course this class belongs to
    const course = await Course.findOne(
        {
            code: courseCode
        }
    )

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const classCode = generateUniqueCode();

    const classCreation = await Class.create({
        code: classCode,
        course: course._id,
        date,
        startTime,
        endTime
    })

    if (!classCreation) {
        throw new ApiError(400, "Something went wrong in class creation");
    }

    // Add the class code to the course
    course.classes.push(classCreation._id);
    await course.save(
        {
            validateBeforeSave: false
        }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(201, "Class created successfully", classCreation)
        )

});

const getStudentsInaClass = asyncHandler(async (req, res) => {

    const classId = req.params.classId;

    if (!classId) {
        throw new ApiError(400, "Class id is required");
    }

    const courses = await Course.aggregate([{
        $unwind: "$classes"
    },
    {
        $match: {
            "classes": mongoose.Types.ObjectId(classId)
        }
    }]);

    if (courses.legnth > 0) {
        throw new ApiError(404, "Class not found");
    }

    const students = await Student.find({

        course: {
            $in: [
                courses[0]._id
            ]
        }
    
    }).select("-password -refreshToken");

    if(!students) {
        throw new ApiError(404, "Students not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Students fetched successfully", students)
        );

});

const getAttendanceofaStudent = asyncHandler(async (req, res) => {

    const {classId} = req.params.classId;
    const {user} = req.user._id;

    const student = await Student.findOne({
        user
    })

    if(!student) {
        throw new ApiError(500, "Student AC details could not be fetched.")
    }

    const attendanceRecord = await Attendance.findOne({
        $and : [
            {
                class : mongoose.Types.ObjectId(classId)
            },
            {
                student : mongoose.Types.ObjectId(student._id)
            }
        ]
    }).select ("-password -refreshToken");

    if(!attendanceRecord) {
        throw new ApiError(404, "Attendance record not found");
    }

    let attendanceStatus = "Absent";

    if(attendanceRecord.status === true) {
        attendanceStatus = "Present";
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Attendance record fetched successfully", attendanceStatus)
        );
})

const getAttendanceRecordFortheClass = asyncHandler(async (req, res) => { 

    const classId = req.params.classId; 

    if(!classId) {
        throw new ApiError(400, "Class id is required");
    }

    const class_ = await Class.findOne({
        _id: classId
    })

    const attendances = await Attendance.find({
        classCode: class_.code
    })

    if(!attendances) {
        throw new ApiError(404, "Attendances not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Attendances fetched successfully", attendances)
        );

 });

export const classController = {
    createClass,
    getStudentsInaClass,
    getAttendanceRecordFortheClass,
    getAttendanceofaStudent,
    
};
