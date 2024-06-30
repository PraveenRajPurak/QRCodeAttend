import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken";

const professorSchema = new Schema(
    {
        profId: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        college : {
            type : Schema.Types.ObjectId,
            ref : "College"
        },
        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course"
            }
        ],
        refreshToken : {
            type : String
        }
    }, { timestamps: true });

professorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

professorSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

professorSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            profId: this.profId,
        },
         process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

professorSchema.methods.generateRefreshToken = function() {

    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Professor = mongoose.model("Professor", professorSchema)