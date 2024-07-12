import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";

import { 
    registerOwner,
    loginOwner,
    logoutOwner,
    handlerefreshToken,
    updateDetails,
    updatePassword
 } from "../controllers/owner.controller.js";

const router = Router();

router.route("/register").post(registerOwner);

router.route("/login").post(loginOwner);

router.route("/logout").post(verifyOwnerToken, logoutOwner);

router.route("/refreshToken").get(verifyOwnerToken, handlerefreshToken);

router.route("/update-details").post(verifyOwnerToken, updateDetails);

router.route("/update-password").post(verifyOwnerToken, updatePassword);

export default router