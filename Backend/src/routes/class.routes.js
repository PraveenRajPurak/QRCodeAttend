import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    createClass,
    getStudentsInaClass,
    getAttendanceRecordFortheClass,
    getAttendanceofaStudent,
    getClassCode,
    createClassRoom
} from "../controllers/class.controller.js";

const router = Router();

router.route("/create-class").post(verifyOwnerToken, createClass);
router.route("/get-students/:classId").get(getStudentsInaClass);
router.route("/get-attendance/:classId").get(getAttendanceRecordFortheClass);
router.route("/get-attendance-of-a-student/:classId").get(verifyUserToken, getAttendanceofaStudent);
router.route("/get-class-code/:classId").get(getClassCode);
router.route("/create-classroom").post(verifyOwnerToken, createClassRoom);

export default router;

