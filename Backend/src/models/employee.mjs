import mongoose , {Schema} from "mongoose";

const employeeSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    empId : {
        type : String,
        required : true
    },
    institute : {
        type : String,
        required : true
    },
    department : {
        type : String,
        required : true
    },
    attendanceRecord : {
        type : String,
        required : true
    }
},{
    timestamps : true
});

export const Employee = mongoose.model("Employee", employeeSchema)
