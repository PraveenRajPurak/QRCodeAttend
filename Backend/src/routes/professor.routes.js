import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    loginProfessor,
    logoutProfessor,
    refreshProfessorToken,
    coursesTaughtbyProfessor,
} from "../controllers/professor.controller.js";

const router = Router();

router.route("/login").post(loginProfessor);

router.route("/logout").post(verifyProfessorToken, logoutProfessor);

router.route("/refreshProfessorToken").get(verifyProfessorToken, refreshProfessorToken);

router.route("/courses-taught-by-professor").get(verifyProfessorToken, coursesTaughtbyProfessor);

export default router;

