import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";

import { Attendance } from "../models/attendance.mjs";

const takeAttendance = asyncHandler(async (req, res) => {});

const markAttendance = asyncHandler(async (req, res) => {});

const getAttendance = asyncHandler(async (req, res) => {});

export const attendanceController = {
    takeAttendance,
    markAttendance,
    getAttendance
}