import mongoose, { Schema } from "mongoose";

const couseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: "Professor",
        required: true
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "Student"
        }
    ],
    classes : [
        {
            type : Schema.Types.ObjectId,
            ref : "Class"
        }
    ]
}, {
    timestamps: true
});

export const Course = mongoose.model("Course", couseSchema)