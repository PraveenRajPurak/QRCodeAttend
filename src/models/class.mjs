import mongoose, { Schema } from "mongoose";

const classSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    status :{
        type : String,
        default : "Cancelled"
    },
    course : {
        type : Schema.Types.ObjectId,
        ref : "Course"
    },
    date : {
        type : Date,
        required : true
    },
    startTime : {
        type : String,
        required : true

    },
    endTime : {
        type : String,
        required : true
    },
    attendances : [
        {
            type : Schema.Types.ObjectId,
            ref : "Attendance"
        }
    ],
},{
    timestamps : true
});

export const Class = mongoose.model("Class", classSchema)