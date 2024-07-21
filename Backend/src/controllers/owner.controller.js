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
  
      const owneraccessToken = owner.generateAccessToken();
  
      const ownerrefreshToken = owner.generateRefreshToken();
  
      console.log("Access Token: ", owneraccessToken);
      console.log("Refresh Token: ", ownerrefreshToken);
  
      owner.refreshToken = ownerrefreshToken;
      await owner.save({ validateBeforeSave: false });
  
      return {owneraccessToken, ownerrefreshToken};
  }
  catch(error){
      throw new ApiError(501, "Token could not be verified due to internal server error", error?.message);
  }
  };

const registerOwner = asyncHandler(async (req, res, next) => {

    const {phoneNumber, email, password, institutionType} = req.body;

   console.log("Phone number, email, password, institutionType",phoneNumber, email, password, institutionType);

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

    const {owneraccessToken, ownerrefreshToken} = await generateAccessandRefreshToken(owner._id);

    const loggedInOwner = await Owner.findById(owner._id).select("-password -refreshToken");

    const options = {
        secure : true,
        httpOnly : true,
    }

    return res
    .status(200)
    .cookie("owneraccessToken", owneraccessToken, options)
    .cookie("ownerrefreshToken", ownerrefreshToken, options)
    .json(
        new ApiResponse(200,
            {
            owner : loggedInOwner,
            owneraccessToken,
            ownerrefreshToken
        },
         "Owner logged in successfully"
        )
    );
});

const logoutOwner = asyncHandler(async (req, res) => {

    const options = {
        secure : true,
        httpOnly : true,
    }

    await Owner.findByIdAndUpdate(req.owner._id, {
            $set : {
                refreshToken : undefined
            }
    },
    {
        new : true,
    })

    return res
    .status(200)
    .clearCookie("owneraccessToken", options)
    .clearCookie("ownerrefreshToken", options)
    .json(
        new ApiResponse(200, "Owner logged out successfully")
    )

});

const handlerefreshToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.ownerrefreshToken || req.body.ownerrefreshToken;

    if(!refreshToken) {
        throw new ApiError(401, "Invalid Token");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if(!decoded) {
        throw new ApiError(401, "Invalid Token");
    }

    const owner = await Owner.findById(decoded._id).select("-password -refreshToken");

    if(!owner) {
        throw new ApiError(401, "Owner not found");
    }


    const storedRefreshToken = owner.refreshToken;

    if( refreshToken != storedRefreshToken) {

        throw new ApiError(401, "Invalid Token");
    }

    const {owneraccessToken, newownerrefreshToken} = await generateAccessandRefreshToken(owner._id);

    const options = {
        secure : true,
        httpOnly : true,
    }

    return res
    .status(200)
    .cookie("owneraccessToken", owneraccessToken, options)
    .cookie("ownerrefreshToken", newownerrefreshToken, options)
    .json(
        new ApiResponse(200, "Token refreshed successfully")
    )
});

const updateDetails = asyncHandler(async (req, res) => {
    
});

const updatePassword = asyncHandler(async (req, res) => {

});

export { registerOwner, loginOwner, logoutOwner,handlerefreshToken, updateDetails, updatePassword };