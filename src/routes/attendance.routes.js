import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    createAttendance,
    markAttendance,
    getAttendance,
} from "../controllers/attendance.controller.js";

const router = Router();

router.route("create-attendance").post(verifyProfessorToken, createAttendance);
router.route("mark-attendance").post(verifyUserToken, markAttendance);
router.route("get-attendance").get(getAttendance);

export default router;

