import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Professor } from "../models/professors.mjs";
import { Course } from "../models/course.mjs";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.mjs";

const generateAccessandRefreshToken = async(userId) => {

    try { 
      const professor = await Professor.findById(userId);
      console.log("professor found: ", professor);
      if(!professor) {
          throw new ApiError(404, "Professor not found");
      }
  
      const profaccessToken = professor.generateAccessToken();
  
      const profrefreshToken = professor.generateRefreshToken();
  
      console.log("Access Token: ", profaccessToken);
      console.log("Refresh Token: ", profrefreshToken);
  
      professor.refreshToken = profrefreshToken;
      await professor.save({ validateBeforeSave: false });
  
      return {profaccessToken, profrefreshToken};
  }
  catch(error){
      throw new ApiError(501, "Token could not be verified due to internal server error", error?.message);
  }
  };

const loginProfessor = asyncHandler(async (req, res) => {

    const {profId, password} = req.body;

    if(!profId || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const professor = await Professor.findOne({profId});

    if(!professor) {
        throw new ApiError(404, "Professor not found");
    }

    const isMatch = await professor.matchPassword(password);

    if(!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const {profaccessToken, profrefreshToken} = await generateAccessandRefreshToken(professor._id);

    const loggedInProfessor = await Professor.findById(professor._id).select("-password -refreshToken");

    const options = {
        secure : true,
        httpOnly : true,
    }

    return res
    .status(200)
    .cookie("profaccessToken", profaccessToken, options)
    .cookie("profrefreshToken", profrefreshToken, options)
    .json(
        new ApiResponse(200, "Login successful", loggedInProfessor)
    )
});

const logoutProfessor = asyncHandler(async (req, res) => {

    const options = {
        secure : true,
        httpOnly : true,
    }

    await Professor.findByIdAndUpdate(req.professor._id, {
            $set : {
                refreshToken : undefined
            }
    },
    {
        new : true,
    })

    return res
    .status(200)
    .clearCookie("profaccessToken", options)
    .clearCookie("profrefreshToken", options)
    .json(
        new ApiResponse(200, "Professor logged out successfully")
    )
    
});

const refreshProfessorToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.profrefreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!refreshToken) {
        throw new ApiError(401, "Invalid Token");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if(!decoded) {
        throw new ApiError(401, "Invalid Token");
    }

    const prof = await Professor.findById(decoded._id).select(-"password")

    if(!prof) {
        throw new ApiError(400, "User not found")
    }

    const storedRefreshToken = prof.refreshToken

    if(!storedRefreshToken) {
        throw new ApiError(401, "Invalid Token");
    }

    if(refreshToken != storedRefreshToken) {

        throw new ApiError(401, "Token Match Failed");
    }

    const {profaccessToken, newprofrefreshToken} = await generateAccessandRefreshToken(prof._id);

    const options = {
        secure : true,
        httpOnly : true,
    }

    return res
    .status(200)
    .cookie("profaccessToken", profaccessToken, options)
    .cookie("profrefreshToken", newprofrefreshToken, options)
    .json(
        new ApiResponse(200, "Professor Token refreshed successfully")
    )
});

const coursesTaughtbyProfessor = asyncHandler(async (req, res) => {

    const professor = await Professor.findById(req.professor._id);

    if(!professor) {
        throw new ApiError(404, "Professor not found");
    }

    const courses = await Course.find({professor: professor._id});

    if(!courses) {
        throw new ApiError(404, "Courses not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, courses, "Courses fetched successfully",)
        );
});


export { loginProfessor,
    logoutProfessor,
    refreshProfessorToken,
    coursesTaughtbyProfessor,
 }