import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    setupCollege,
    getStudentsRecords,
    getProfessorsRecords,
    setupProfessor
} from "../controllers/college.controller.js";

const router = Router();

router.route("/setup-college").post(verifyOwnerToken, setupCollege);
router.route("/get-students").get(getStudentsRecords);
router.route("/get-professors").get(verifyOwnerToken, getProfessorsRecords);
router.route("/setup-professor").post(verifyOwnerToken, setupProfessor);

export default router;