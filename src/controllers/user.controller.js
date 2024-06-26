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

const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        secure : true,
        httpOnly : true,
    }

    await User.findByIdAndUpdate(req.user._id, {
            $set : {
                refreshToken : undefined
            }
    },
    {
        new : true,
    })

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, "User logged out successfully")
    )
});

const handleuserRefreshToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!refreshToken) {
        throw new ApiError(401, "Invalid Token");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if(!decoded) {
        throw new ApiError(401, "Invalid Token");
    }

    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if(!user) {
        throw new ApiError(401, "User not found");
    }

    const storedRefreshToken = user.refreshToken;

    if( refreshToken != storedRefreshToken) {

        throw new ApiError(401, "Invalid Token");
    }

    const {accessToken, newRefreshToken} = await generateAccessandRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure : true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,
        options,)
    .cookie("refreshToken", newRefreshToken,
        options,)
    .json(
        new ApiResponse(200, "Token refreshed successfully")
    )
});

const updateDetails = asyncHandler(async (req, res) => {

});

const updatePassword = asyncHandler(async (req, res) => {

});

const updateAvatar = asyncHandler(async (req, res) => {

});

const trackselfAttendance = asyncHandler(async (req, res) => {
    
});


export {registerUser, 
    loginUser,
    logoutUser,
    handleuserRefreshToken,
    updateDetails,
    updatePassword,
    updateAvatar,
    trackselfAttendance
}

