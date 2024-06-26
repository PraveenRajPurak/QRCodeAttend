import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Class } from "../models/class.mjs";
import { Course } from "../models/course.mjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createClass = asyncHandler(async (req, res) => {});

const getStudentsInaClass = asyncHandler(async (req, res) => {});

const getAttendanceRecordFortheClass = asyncHandler(async (req, res) => {});

export const classController = {
    createClass,
    getStudentsInaClass,
    getAttendanceRecordFortheClass
};
