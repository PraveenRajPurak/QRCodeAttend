import mongoose , {Schema} from "mongoose";

const inviteeSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    Id : {
        type : String,
        required : true
    },
    event : {
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

export const Invitee = mongoose.model("Invitee",  inviteeSchema)
