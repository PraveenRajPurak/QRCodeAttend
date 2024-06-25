import mongoose , {Schema} from "mongoose";

const studentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    enrollNo : {
        type : String,
        required : true
    },
    institute : {
        type : String,
        required : true
    },
    batch : {
        type : String,
        required : true
    },
    course : [{
        type : Schema.Types.ObjectId,
        ref : "Course"
    }],
    attendanceRecord : [{
        type : Schema.Types.ObjectId,
        ref : "Attendance"
    }]
},{
    timestamps : true
});

export const Student = mongoose.model("Student", studentSchema)
