import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { College } from "../models/college.mjs";
import { Student } from "../models/student.mjs";
import { Professor } from "../models/professors.mjs";
import { Course } from "../models/course.mjs";

import mongoose from "mongoose";

const setupCollege = asyncHandler(async (req, res) => {
    const { name, location, website, officeEmailId } = req.body
    const owner = req.owner._id

    const college = await College.create({
        name,
        location,
        website,
        officeEmailId,
        owner
    })

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "College created successfully", college)
        );
});

const getStudentsRecords = asyncHandler(async (req, res) => {
    const collegeId = req.params.collegeId;

    if (!collegeId) {
        throw new ApiError(400, "College id is required");
    }

    const students = await Student.find({
        institute: new mongoose.Types.ObjectId(collegeId)
    }).select("-password -refreshToken -course -attendanceRecord");

    if (!students) {
        throw new ApiError(404, "Students not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, "Students fetched successfully", students)
        )
});

const getProfessorsRecords = asyncHandler(async (req, res) => {

    const collegeId = req.params.collegeId;

    console.log("College Id : ", collegeId)

    const professors = await Professor.aggregate([
        {
            $match : {
                college : new mongoose.Types.ObjectId(collegeId)
            }
        },
        {
            $lookup : {
                from : "courses",
                localField : "courses",
                foreignField : "_id",
                as : "courses",
                pipeline : [
                    {
                        $project : {
                            name : 1,
                            _id : 1,
                            code : 1
                        }
                    }
                ]
            }
        },
        {
            $project : {
                name : 1,
                courses : 1,
                profId : 1
            }
        }
    ]);

    console.log("Professors fetched : ", professors);

    return res
        .status(201)
        .json(
            new ApiResponse(201, professors, "Professors fetched successfully")
        )
});

const setupProfessor = asyncHandler(async (req, res) => {

    const { profId, password, name } = req.body;
    const owner = req.owner._id;

    if (!profId || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const college = await College.findOne({ owner });

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    const professor = await Professor.create({
        profId,
        password,
        name,
        college: college._id,
    })

    if (!professor) {
        throw new ApiError(404, "Professor not found");
    }

    college.professors.push(professor._id);
    await college.save(
        {
            validateBeforeSave : false
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Professor created successfully", professor)
        )
});

const coursesInaCollege = asyncHandler(async (req, res) => {

    const collegeId = req.params.collegeId;

    const courses = await Course.aggregate([
        {
            $match : {
                college : new mongoose.Types.ObjectId(collegeId)
            }
        },
        {
            $lookup : {
                from : "professors",
                localField : "professor",
                foreignField : "_id",
                as : "professors",
                pipeline : [
                    {
                        $project : {
                            name : 1,
                            profId : 1
                        }
                    }
                ]
            }
        },
        {
            $project : {
                name : 1,
                code : 1,
                professors : 1
            }
        }
    ])

    if (!courses) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, "No course found","")
            )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Courses fetched successfully", courses)
        )
});

const checkCollegeOwnershipPresence = asyncHandler(async (req, res) => {

    const college = await College.findOne({
        owner: new mongoose.Types.ObjectId(req.owner._id)
    })

    if(!college) {
        return res.status(200).json({isPresent: false});
    }

    return res.status(200).json({isPresent: true});
})

const getAllCollegeNames = asyncHandler (async (req, res) => {
    const colleges = await College.find({}).select("name");
    return res.status(200)
    .json(
        new ApiResponse("200", "Colleges fetched successfully",colleges)
    )
})

export {
    setupCollege,
    getStudentsRecords,
    getProfessorsRecords,
    setupProfessor,
    coursesInaCollege,
    checkCollegeOwnershipPresence,
    getAllCollegeNames
};
