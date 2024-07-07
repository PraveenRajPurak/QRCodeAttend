import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    takeAttendance,
    markAttendance,
} from "../controllers/attendance.controller.js";

const router = Router();

router.route("/create-attendance/:classId").post(verifyProfessorToken, takeAttendance);
router.route("/mark-attendance/:classId").post(verifyUserToken, markAttendance);

export default router;

