import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    setupCollege,
    getStudentsRecords,
    getProfessorsRecords,
    setupProfessor,
    coursesInaCollege
} from "../controllers/college.controller.js";

const router = Router();

router.route("/setup-college").post(verifyOwnerToken, setupCollege);
router.route("/get-students/:collegeId").get(verifyOwnerToken, getStudentsRecords);
router.route("/get-professors/:collegeId").get(verifyOwnerToken, getProfessorsRecords);
router.route("/setup-professor").post(verifyOwnerToken, setupProfessor);
router.route("/courses-in-a-college/:collegeId").get(verifyOwnerToken, coursesInaCollege)

export default router;