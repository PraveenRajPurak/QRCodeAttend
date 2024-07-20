import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Student } from "../models/student.mjs";
import { User } from "../models/user.mjs";
import { Course } from "../models/course.mjs";
import { Class } from "../models/class.mjs";
import { College } from "../models/college.mjs";

import mongoose from "mongoose";

const setupStudent = asyncHandler(async (req, res) => {

        const { enrollNo, institute_name, batch} = req.body
        if(!(enrollNo || institute_name || batch)) {
            throw new ApiError(400, "All fields are required");
        }

        console.log("EnrollNo, institute_name, batch : ", enrollNo, institute_name, batch)

        const institute = await College.findOne({
            name: institute_name
        })

        console.log("Institute : ", institute)

        const student = await Student.create({
            user: req.user._id,
            enrollNo,
            institute: institute._id,
            batch
        })

        if(!student) {
            throw new ApiError(400, "Something went wrong");
        }

        institute.students.push(student._id)

        await institute.save(
            {
                validateBeforeSave : false
            }
        )

        res.status(201).json({message: "Student created successfully", student});

});

const getCourses = asyncHandler(async (req, res) => {

    const student = await Student.findOne({
        user: req.user._id
    })

    if(!student) {
        throw new ApiError(404, "Student account not found");
    }

    const courses = await Course.aggregate([
        {
            $unwind : "$students"
        },
        {
            $match : {
                students : student._id
            }
        },
        {
            $lookup : {
                from : "professors",
                localField : "professor",
                foreignField : "_id",
                as : "professor",
            }
        },
        {
            $addFields : {
                professorName : {$arrayElemAt : ["$professor.name", 0]},
            }
        },
        {
            $project : {
                _id : 1,
                name : 1,
                code : 1,
                professorName : 1
            }
        }
    ]
    )

    if(!courses) {
        throw new ApiError(404, "Courses not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Courses fetched successfully", courses)
    );

});

const getClasses = asyncHandler(async (req, res) => {

    const { courseId } = req.params

    if(!courseId) {
        throw new ApiError(400, "Course id is required");
    }

    const classes = await Class.find({
        course: courseId
    })

    if(!classes) {
        throw new ApiError(404, "Classes not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Classes fetched successfully", classes)
    );

});

const checkStudentAccountPresence = asyncHandler(async (req, res) => {

    const student = await Student.findOne({
        user: new mongoose.Types.ObjectId(req.user._id)
    })

    if(!student) {
        return res.status(200).json({isPresent: false});
    }

    return res.status(200).json({isPresent: true});
})

const getStudentdata = asyncHandler (async (req, res) => {

    const student = await Student.findOne({
        user: new mongoose.Types.ObjectId(req.user._id)
    })

    if(!student) {
        throw new ApiError(500, "Student AC details could not be fetched.")
    }

    return res.status(200).
    json(
        new ApiResponse(200, "Student details fetched successfully", student)
    )
})

export {
    setupStudent,
    getCourses,
    getClasses,
    checkStudentAccountPresence,
    getStudentdata
}