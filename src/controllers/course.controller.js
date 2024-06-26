import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { College } from "../models/college.mjs";
import { Course } from "../models/course.mjs";

const setupCourse = asyncHandler(async (req, res) => {

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
