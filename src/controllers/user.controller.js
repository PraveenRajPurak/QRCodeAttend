import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.mjs";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessandRefreshToken = async(userId) => {

  try { 
    const user = await User.findById(userId);
    console.log("User found: ", user);
    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    console.log("Access Token: ", accessToken);
    console.log("Refresh Token: ", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {accessToken, refreshToken};
}
catch(error){
    throw new ApiError(501, "Token could not be verified due to internal server error", error?.message);
}
};


const registerUser = asyncHandler (async (req, res, next) => {

    const {phoneNumber, email, fullname, password, dob, role} = req.body;

   if(!phoneNumber || !email || !fullname || !password || !dob || !role) {
       throw new ApiError(400, "All fields are required");
   }

   let avatarfilepath = "";
   if(req.file) {
       avatarfilepath = req.file.path;
   }

   const avatar = await uploadOnCloudinary(avatarfilepath);

   const user = await User.create({
       phoneNumber,
       email,
       fullname,
       password,
       dateOfBirth: new Date(dob),
       role,
       avatar : avatar.url || ""
   });

   const addedUser = await User.findById(user._id).select("-password -refreshToken");

   if(!addedUser) {
       throw new ApiError(400, "User could not be created");
   }

   res.status(201).json(new ApiResponse(201, "User created successfully", addedUser));

});


const loginUser = asyncHandler(async (req, res, next) => {

    const {phoneNumber, email, password} = req.body;

    if(!phoneNumber && !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or : [
            {phoneNumber},
            {email}
        ]
    });

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const passwordCheck = await user.matchPassword(password);

    if(!passwordCheck) {
        throw new ApiError(400, "Invalid credentials");
    }

    console.log("User ID: ", user._id);

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure : true,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken,
        options,)
    .cookie("refreshToken", refreshToken,
        options,)
    .json(
        new ApiResponse(200,{
            user : loggedInUser,
            accessToken,
            refreshToken
        }, "User logged in successfully")
    )
});

export {registerUser, 
    loginUser
}

