import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Professor } from "../models/professor.mjs";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

    const isMatch = await professor.comparePassword(password);

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

const logoutProfessor = asyncHandler(async (req, res) => {});

const refreshProfessorToken = asyncHandler(async (req, res) => {});

export { loginProfessor,
    logoutProfessor,
    refreshProfessorToken
 }