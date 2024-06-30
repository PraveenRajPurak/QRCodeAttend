import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Student } from "../models/student.mjs";
import { User } from "../models/user.mjs";
import { Course } from "../models/course.mjs";
import { Student } from "../models/student.mjs";
import { Class } from "../models/class.mjs";

const setupStudent = asyncHandler(async (req, res) => {

        const { enrollNo, institute_name, batch, } = req.body
        if(!(enrollNo || institute_name || batch)) {
            throw new ApiError(400, "All fields are required");
        }

        const institute = await College.findOne({
            name: institute_name
        })

        const student = await Student.create({
            user: req.user._id,
            enrollNo,
            institute: institute._id,
            batch
        })

        if(!student) {
            throw new ApiError(400, "Something went wrong");
        }

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
                professor : 0,
                name : 1,
                code : 1,
                owner : 0,
                students : 0,
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

    const courseId = req.params.courseId;

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

export const studentController = {
    setupStudent,
    getCourses,
    getClasses
}