import mongoose , { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ownerSchema = new Schema({
    phoneNumber : {
        type : String,
        required : true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    InstitutionType : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String
    }
},{
    timestamps : true
});

ownerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

ownerSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

ownerSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            phoneNumber : this.phoneNumber,
        },
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    },
    )
}

ownerSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Owner = mongoose.model("Owner", ownerSchema)