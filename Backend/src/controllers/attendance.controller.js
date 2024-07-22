import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Attendance } from "../models/attendance.mjs";
import { Class } from "../models/class.mjs";
import { Student } from "../models/student.mjs";
import mongoose from "mongoose";

const takeAttendance = asyncHandler(async (req, res) => {

    const  classId  = req.params.classId;
    console.log("Class Id : ",classId)

    if (!classId) {
        throw new ApiError(400, "Class id is required");
    }

    const class_ = await Class.findById(classId);

    console.log("Class fetched : ",class_)

    if (!class_) {
        throw new ApiError(404, "Class not found");
    }

    class_.status = "Regular"
    await class_.save(
        { validateBeforeSave: false }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Class updated successfully", class_)
        );
});

const markAttendance = asyncHandler(async (req, res) => {

    const student = await Student.findOne({
        user: new mongoose.Types.ObjectId(req.user._id)
    })

    if(!student) {
        throw new ApiError(500, "Student AC details could not be fetched.")
    }

    const { classId } = req.params;
    const { code } = req.body;

    if (!classId) { 
       throw new ApiError(400, "Class id is required");
    }

    const class_ = await Class.aggregate([
        {$match: {
            $and: [
                { _id: new mongoose.Types.ObjectId(classId) },
                { status: "Regular" }
            ]
        }
    }
    ])

    console.log("Class : ", class_)

    if (!class_) {
        throw new ApiError(404, "Class not found");
    }   

    console.log("Code received : ", code);

    console.log("Code stored : ", class_.code);

    if(code !== class_.code) {
        throw new ApiError(400, "Code is not correct");
    }

    const attendanceCreation = await Attendance.create({
        class: classId,
        student : student._id,
        course : class_.course,
        classCode : class_.code,
        date : new Date(),
        status : true
    })
    
    if(!attendanceCreation) {
        throw new ApiError(500, "Attendance could not be marked.")
    }

    console.log("Attendance : ", attendanceCreation)

    class_.attendances.push(attendanceCreation._id);
    await class_.save(
        { validateBeforeSave: false }
    );

    student.attendanceRecord.push(attendanceCreation._id);
    await student.save(
        { validateBeforeSave: false }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Attendance marked successfully", attendanceCreation )
        )

});

// const getAttendance = asyncHandler(async (req, res) => {

//     const classId = req.params.classId;
    
// });

export {
    takeAttendance,
    markAttendance,
    // getAttendance
}