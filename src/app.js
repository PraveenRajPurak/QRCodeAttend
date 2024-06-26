import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin : process.env.CORS_URL,
    credentials : true
}))

app.use(express.json({ limit: "16Kb"})) // for parsing application/json

app.use(express.urlencoded({extended : true, limit: "16Kb"})) // for parsing application/x-www-form-urlencoded

app.use(express.static("public"))  // for serving static files

app.use(cookieParser()) // for parsing cookies

export {app};


//Routes

import userRoutes from "./routes/user.routes.js";

import ownerRoutes from "./routes/owner.routes.js";

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/owner",ownerRoutes);