import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Student } from "../models/student.mjs";
import { User } from "../models/user.mjs";

const setupStudent = asyncHandler(async (req, res) => {

});

const getCourses = asyncHandler(async (req, res) => {

});

const getClasses = asyncHandler(async (req, res) => {
    
});

export const studentController = {
    setupStudent,
    getCourses,
    getClasses
}