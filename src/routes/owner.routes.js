import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyOwnerToken } from "../middlewares/auth.middleware.js";

import { 
    registerOwner,
    loginOwner
 } from "../controllers/owner.controller.js";

const router = Router();

router.route("/register").post(registerOwner);

router.route("/login").post(loginOwner);

export default router