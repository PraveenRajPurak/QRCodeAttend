import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    setupCourse,
    enrollInaCourse,
    getClasses,
    getstudentsInaCourse,
    getAttendanceRecordInaCourse,
    getCourseDetails
} from "../controllers/course.controller.js";

const router = Router();

router.route("/setup-course").post(verifyOwnerToken, setupCourse);
router.route("/enroll-in-a-course").post(verifyUserToken, enrollInaCourse);
router.route("/get-classes/:courseId").get(getClasses);
router.route("/get-students/:courseId").get(getstudentsInaCourse);
router.route("/get-attendance/:courseId").get(getAttendanceRecordInaCourse);
router.route("/get-course-details/:courseId").get(getCourseDetails);

export default router;

