import { Router } from "express";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";
import { verifyProfessorToken } from "../middlewares/auth.middleware.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

import {
    loginProfessor,
    logoutProfessor,
    handlerefreshToken,

} from "../controllers/professor.controller.js";

const router = Router();

router.route("/login").post(loginProfessor);

router.route("/logout").post(verifyUserToken, logoutProfessor);

router.route("/refreshToken").get(verifyUserToken, handlerefreshToken);

export default router;

