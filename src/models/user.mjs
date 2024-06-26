import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    phoneNumber : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index : true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    dateOfBirth : {
        type : Date,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String
    }
},{
    timestamps : true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
}) // We had to store password in plain text. So we are hashing it and then saving it to ensure security.

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
} // User does not know that the password is hashed. So we are comparing plain text password with hashed password.


userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            role : this.role,
            fullname : this.fullname,
            email : this.email,
            phoneNumber : this.phoneNumber
        },
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    },
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            role : this.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)