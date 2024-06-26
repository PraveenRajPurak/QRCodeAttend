import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    setupCourse,
    getClasses,
    getstudentsInaCourse,
    getAttendanceRecordInaCourse
} from "../controllers/course.controller.js";

const router = Router();

router.route("/setup-course").post(verifyOwnerToken, setupCourse);
router.route("/get-classes").get(getClasses);
router.route("/get-students").get(getstudentsInaCourse);
router.route("/get-attendance").get(getAttendanceRecordInaCourse);

export default router;

