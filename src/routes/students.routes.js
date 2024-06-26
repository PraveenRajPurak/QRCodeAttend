import { Router } from "express";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    setupStudent,
    getCourses,
    getClasses
    
} from "../controllers/students.controller.js";

const router = Router();

router.route("/setup-student").post(verifyUserToken, setupStudent);
router.route("/get-courses").get(verifyUserToken, getCourses);
router.route("/get-classes").get(verifyUserToken, getClasses);

export default router;

