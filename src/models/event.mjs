import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "Owner"
    },
    managers : [
        {
            type : Schema.Types.ObjectId,
            ref : "EventManager"
        }
    ],
    invitees : [
        {
            type : Schema.Types.ObjectId,
            ref : "Invitee"
        }
    ],
},
    {
        timestamps: true
    });

export const Event = mongoose.model("Event", eventSchema)