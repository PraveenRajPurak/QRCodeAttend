import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { College } from "../models/college.mjs";
import { Course } from "../models/course.mjs";
import { Professor } from "../models/professor.mjs";

const setupCourse = asyncHandler(async (req, res) => {
        const college = await College.findOne({ owner: req.user._id });

        if(!college) {
            throw new ApiError(404, "College not found");
        }

        const {name, code, profId} = req.body;

        const professor = await Professor.findOne({profId : profId});

        if(!professor) {
            throw new ApiError(404, "Wrong ProfId provided");
        }

        const courseCreation = await Course.create({
            name,
            code,
            college: college._id,
            owner: req.user._id,
            professor: professor._id
        })

        if(!courseCreation) {
            throw new ApiError(500, "Course could not be created"); 
        }

        res.status(201).json({message: "Course created successfully", course: courseCreation});
});

const getClasses = asyncHandler(async (req, res) => {
        
});

const getstudentsInaCourse = asyncHandler(async (req, res) => {
    
});

const getAttendanceRecordInaCourse = asyncHandler(async (req, res) => {

});

export const courseController = {
    setupCourse,
    getClasses,
    getstudentsInaCourse,
    getAttendanceRecordInaCourse

};
