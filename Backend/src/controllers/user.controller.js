import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.mjs";
import { Student } from "../models/student.mjs";
import { Attendance } from "../models/attendance.mjs"
import { Course } from "../models/course.mjs";
import { Class } from "../models/class.mjs";
import { ClassRoom } from "../models/classroom.mjs";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const EARTH_RADIUS = 6371000;

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function haversine(lat1, lon1, lat2, lon2) {
    let φ1 = lat1;
    let φ2 = lat2;
    let Δφ = lat2 - lat1;
    let Δλ = lon2 - lon1;

    console.log("Value of φ1: ", φ1);
    console.log("Value of φ2: ", φ2);
    console.log("Value of Δφ: ", Δφ);
    console.log("Value of Δλ: ", Δλ);

    // Haversine formula
    let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    console.log("Value of c: ", c);

    let distance = EARTH_RADIUS * c;

    return distance;
}

const generateAccessandRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId);
        console.log("User found: ", user);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();

        const refreshToken = user.generateRefreshToken();

        console.log("Access Token: ", accessToken);
        console.log("Refresh Token: ", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(501, "Token could not be verified due to internal server error", error?.message);
    }
};


const registerUser = asyncHandler(async (req, res, next) => {

    const { phoneNumber, email, fullname, password, dob, role } = req.body;

    console.log("Phone number, email, fullname, password, dob, role",phoneNumber, email, fullname, password, dob, role);

    if (!phoneNumber || !email || !fullname || !password || !dob || !role) {
        throw new ApiError(400, "All fields are required");
    }

    let avatarfilepath = "";
    if (req.file) {
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
        avatar: avatar.url || ""
    });

    const addedUser = await User.findById(user._id).select("-password -refreshToken");

    if (!addedUser) {
        throw new ApiError(400, "User could not be created");
    }

    res.status(201).json(new ApiResponse(201, "User created successfully", addedUser));

});


const loginUser = asyncHandler(async (req, res, next) => {

    const { phoneNumber, email, password } = req.body;

    if (!phoneNumber && !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [
            { phoneNumber },
            { email }
        ]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const passwordCheck = await user.matchPassword(password);

    if (!passwordCheck) {
        throw new ApiError(400, "Invalid credentials");
    }

    console.log("User ID: ", user._id);

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken,
            options,)
        .cookie("refreshToken", refreshToken,
            options,)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            }, "User logged in successfully")
        )
});

const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        secure: true,
        httpOnly: true,
    }

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true,
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

    if (!refreshToken) {
        throw new ApiError(401, "Invalid Token");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
        throw new ApiError(401, "Invalid Token");
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const storedRefreshToken = user.refreshToken;

    if (refreshToken != storedRefreshToken) {

        throw new ApiError(401, "Invalid Token");
    }

    const { accessToken, newRefreshToken } = await generateAccessandRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true,
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

const updateEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            email
        }
    }, {
        new: true
    }).select(
        "-password -refreshToken"
    );

    if (!updatedUser) {
        throw new ApiError(400, "User could not be updated");
    }

    return res.status(200).json(new ApiResponse(200, "Email updated successfully", updatedUser));

});

const updatePhoneNumber = asyncHandler(async (req, res) => {

    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            phoneNumber
        }
    }, {
        new: true
    }).select(
        "-password -refreshToken"
    );

    if (!updatedUser) {
        throw new ApiError(400, "User could not be updated");
    }

    return res.status(200).json(new ApiResponse(200, "Phone number updated successfully", updatedUser));
});

const updateName = asyncHandler(async (req, res) => {
    const { firstName, lastName } = req.body;

    const fullname = firstName + " " + lastName;

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            fullname
        }
    }, {
        new: true
    }).select(
        "-password -refreshToken"
    );

    if (!updatedUser) {
        throw new ApiError(400, "User could not be updated");
    }

    return res.status(200).json(new ApiResponse(200, "Name updated successfully", updatedUser));
});

const updatePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;


    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    console.log("User found: ", user);

    const passwordMatch = await user.matchPassword(oldPassword);

    if (!passwordMatch) {
        throw new ApiError(400, "Old password is incorrect");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            password: newPassword
        }
    }, {
        new: true
    }).select(
        "-password -refreshToken"
    );

    if (!updatedUser) {
        throw new ApiError(400, "User could not be updated");
    }

    return res.status(200).json(new ApiResponse(200, "Password updated successfully", updatedUser));
});

const updateAvatar = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const avatarFilePath = req.file?.path;

    if (!avatarFilePath) {
        throw new ApiError(400, "Avatar not found");
    }

    const avatar = await uploadOnCloudinary(avatarFilePath);

    if (!avatar) {
        throw new ApiError(400, "Avatar could not be uploaded");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar.url
        }
    }, {
        new: true
    }).select(
        "-password -refreshToken"
    );

    if (!updatedUser) {
        throw new ApiError(400, "User could not be updated");
    }

    return res.status(200).json(new ApiResponse(200, "Avatar updated successfully", updatedUser));

});

const trackselfAttendance = asyncHandler(async (req, res) => {

    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
        return res.status(404).json(new ApiResponse(404, "Student account not found"));
    }

    const courses = await Course.find({ students: student._id }).populate('classes');

    const attendanceRecord = await Promise.all(courses.map(async (course) => {
        const totalClasses = course.classes.length;

        const attendedClassesCount = await Attendance.countDocuments({
            student: student._id,
            course: course._id
        });

        const attendancePercentage = totalClasses > 0 ? (attendedClassesCount / totalClasses) * 100 : 0;

        return {
            courseId: course._id,
            courseName: course.name,
            totalClasses,
            attendedClassesCount,
            attendancePercentage
        };
    }));

    return res.status(200).json(new ApiResponse(200, "Attendance record fetched successfully", { attendanceRecord }));
});

const localityValidator = asyncHandler(async (req, res, next) => {

    let valid = false;
    
    const { classId, user_latitude, user_longitude, user_altitude } = req.body;

    console.log("Information from User : ","Class Id : ", classId, "Latitude : ", user_latitude, "Longitude : ", user_longitude, "Altitude : ", user_altitude);

    if(!classId || !user_latitude || !user_longitude || !user_altitude) {
        throw new ApiError(400, "All fields are required");
    }

    const class_ = await Class.findById(classId);
    if(!class_) {
        throw new ApiError(404, "Class not found");
    }

    const classRoom_ = await ClassRoom.findById(class_.classRoom);
    if(!classRoom_) {
        throw new ApiError(404, "Classroom not found");
    }

    const { longitude, latitude, altitude, radius } = classRoom_;

    console.log("Classroom Information : ","Longitude : ", longitude, "Latitude : ", latitude, "Altitude : ", altitude, "Radius : ", radius);

    const user_latitude_in_rad = toRadians(user_latitude);
    const user_longitude_in_rad = toRadians(user_longitude);

    const cr_latitude_in_rad = toRadians(latitude);
    const cr_longitude_in_rad = toRadians(longitude);

    const difference_altitute = Math.abs(user_altitude - altitude);

    console.log("Difference Altitude : ", difference_altitute);

    if(difference_altitute > 3){
        valid = false;
        console.log("Check if user is in the same altitude. "," Value of value variable : ", valid);
        return res.status(200).json(
            new ApiResponse(200, "User is not in the same altitude as the classroom", valid)
        )
    }

    const distance = haversine(user_latitude_in_rad, user_longitude_in_rad, cr_latitude_in_rad, cr_longitude_in_rad);

    console.log("Distance : ", distance);

    if(distance > radius) {
        valid = false;
        return res.status(200).json(
            new ApiResponse(200, "User is not in the same locality as the classroom", valid)
        )
    }

    valid = true;
    return res.status(200).json(
        new ApiResponse(200, "User is in the same locality as the classroom", valid)
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    handleuserRefreshToken,
    updateName,
    updateEmail,
    updatePhoneNumber,
    updatePassword,
    updateAvatar,
    trackselfAttendance,
    localityValidator
}

