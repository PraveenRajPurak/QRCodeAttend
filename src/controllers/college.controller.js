import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { College } from "../models/college.mjs";

const setupCollege = asyncHandler(async (req, res) => {

});

const getStudentsRecords = asyncHandler(async (req, res) => {

});

const getProfessorsRecords = asyncHandler(async (req, res) => {

});

const setupProfessor = asyncHandler(async (req, res) => {

});

export const collegeController = {
    setupCollege,
    getStudentsRecords,
    getProfessorsRecords,
    setupProfessor
};
