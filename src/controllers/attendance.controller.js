import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";

import { Attendance } from "../models/attendance.mjs";
import { Class } from "../models/class.mjs";
import { Student } from "../models/student.mjs";

const takeAttendance = asyncHandler(async (req, res) => {

    const { classId } = req.body;

    if (!classId) {
        throw new ApiError(400, "Class id is required");
    }

    const class_ = await Class.findById(classId);

    if (!class_) {
        throw new ApiError(404, "Class not found");
    }

    class_.status = "Regular"
    await class_.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Class updated successfully", class_)
        );
});

const markAttendance = asyncHandler(async (req, res) => {

    const user = req.user._id

    const student = await Student.findOne({
        user
    })

    if(!student) {
        throw new ApiError(500, "Student AC details could not be fetched.")
    }

    const { classId } = req.params.classId;
    const { code } = req.body;

    if (!classId) { 
       throw new ApiError(400, "Class id is required");
    }

    const class_ = await Class.findById(classId);

    if (!class_) {
        throw new ApiError(404, "Class not found");
    }   

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

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Attendance marked successfully", attendanceCreation )
        )

});

// const getAttendance = asyncHandler(async (req, res) => {

//     const classId = req.params.classId;
    
// });

export const attendanceController = {
    takeAttendance,
    markAttendance,
    // getAttendance
}