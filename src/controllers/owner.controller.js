import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Owner } from "../models/owner.mjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessandRefreshToken = async(userId) => {

    try { 
      const owner = await Owner.findById(userId);
      console.log("Owner found: ", owner);
      if(!owner) {
          throw new ApiError(404, "User not found");
      }
  
      const accessToken = owner.generateAccessToken();
  
      const refreshToken = owner.generateRefreshToken();
  
      console.log("Access Token: ", accessToken);
      console.log("Refresh Token: ", refreshToken);
  
      owner.refreshToken = refreshToken;
      await owner.save({ validateBeforeSave: false });
  
      return {accessToken, refreshToken};
  }
  catch(error){
      throw new ApiError(501, "Token could not be verified due to internal server error", error?.message);
  }
  };

const registerOwner = asyncHandler(async (req, res, next) => {

    const {phoneNumber, email, password, institutionType} = req.body;

    //console.log("Phone number, email, password, institutionType",phoneNumber, email, password, institutionType);

    if(!phoneNumber || !email || !password || !institutionType) {
        throw new ApiError(400, "All fields are required");
    }

    const owner = await Owner.create({
        phoneNumber,
        email,
        password,
        InstitutionType: institutionType
    });

    const addedOwner = await Owner.findById(owner._id).select("-password -refreshToken");

    return res
    .status(201)
    .json(
        new ApiResponse(201, "Owner created successfully", addedOwner)
    );
});

const loginOwner = asyncHandler(async (req, res) => {
    const {email, phoneNumber, password} = req.body;

    if(!email && !phoneNumber) {
        throw new ApiError(400, "All fields are required");
    }

    const owner = await Owner.findOne({$or : [{email}, {phoneNumber}]});

    if(!owner) {
        throw new ApiError(404, "Owner not found");
    }

    const isMatch = await owner.matchPassword(password);

    if(!isMatch) {  
        throw new ApiError(401, "Invalid credentials");
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(owner._id);

    const loggedInOwner = await Owner.findById(owner._id).select("-password -refreshToken");

    const options = {
        secure : true,
        httpOnly : true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, "Owner logged in successfully", loggedInOwner)
    );
});

export { registerOwner, loginOwner }