import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { College } from "../models/college.mjs";
import { Student } from "../models/student.mjs";
import { Professor } from "../models/professor.mjs";
import { Course } from "../models/course.mjs";

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
        institute: collegeId
    }).select("-password -refreshToken");

    if (!students) {
        throw new ApiError(404, "Students not found");
    }

    return res
        .status(201)
        .jsonI(
            new ApiResponse(201, "Students fetched successfully", students)
        )
});

const getProfessorsRecords = asyncHandler(async (req, res) => {

    const collegeId = req.params.collegeId;

    const professors = await Professor.find({
        college: collegeId
    })

    if (!professors) {
        throw new ApiError(404, "Professors not found");
    }

    professors.populate("courses");
    await professors.save({
        validateBeforeSave: false
    });

    return res
        .status(201)
        .jsonI(
            new ApiResponse(201, "Professors fetched successfully", professors)
        )
});

const setupProfessor = asyncHandler(async (req, res) => {

    const { profId, password } = req.body;
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
        college: college._id,
    })

    if (!professor) {
        throw new ApiError(404, "Professor not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Professor created successfully", professor)
        )
});

const coursesInaCollege = asyncHandler(async (req, res) => {

    const collegeId = req.params.collegeId;

    const courses = await Course.find({
        college: collegeId
    })

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

export const collegeController = {
    setupCollege,
    getStudentsRecords,
    getProfessorsRecords,
    setupProfessor,
    coursesInaCollege
};
