import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    createClass,
    getStudentsInaClass,
    getAttendanceRecordFortheClass
    
} from "../controllers/class.controller.js";

const router = Router();

router.route("/create-class").post(verifyOwnerToken, createClass);
router.route("/get-students").get(getStudentsInaClass);
router.route("/get-attendance").get(getAttendanceRecordFortheClass);

export default router;

