import {upload} from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { verifyUserToken } from "../middlewares/auth.middleware.js";
import { 
    registerUser, 
    loginUser,
    logoutUser,
    handleuserRefreshToken,
    updateDetails,
    updatePassword,
    updateAvatar,
    trackselfAttendance
} 
from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyUserToken, logoutUser);

router.route("/refreshToken").get(verifyUserToken, handleuserRefreshToken);

router.route("/update-details").post(verifyUserToken, updateDetails);

router.route("/update-password").post(verifyUserToken, updatePassword);

router.route("/update-avatar").post(verifyUserToken, upload.single("avatar"), updateAvatar);

router.route("/track-self-attendance").post(verifyUserToken, trackselfAttendance);

export default router