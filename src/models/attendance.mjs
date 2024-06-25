import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
    student : {
        type : Schema.Types.ObjectId,
        ref : "Student"
    },
    class : {
        type : Schema.Types.ObjectId,
        ref : "Class"
    },
    date : {
        type : Date,
        required : true
    },
    status : {
        type : Boolean,
        required : true
    },
},{
    timestamps : true
});

export const Attendance = mongoose.model("Attendance", attendanceSchema)
