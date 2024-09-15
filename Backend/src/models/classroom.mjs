import {mongoose, Schema} from "mongoose";

const classRoomSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    intitute : {
        type : Schema.Types.ObjectId,
        ref : "College",
        required : true
    },
    longitude : {
        type : Number,
        required : true
    },
    latitude : {
        type : Number,
        required : true
    },
    radius : {
        type : Number,
        required : true
    },
    altitude : {
        type : Number,
        required : true
    }
}, {
    timestamps : true
});

export const ClassRoom = mongoose.model("ClassRoom", classRoomSchema)