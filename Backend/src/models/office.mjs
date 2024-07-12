import mongoose, { Schema } from "mongoose";

const officeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    website : {
        type : String,  
    },
    officeEmailId : {
        type : String,
        required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "Owner"
    },
    managers : [
        {
            type : Schema.Types.ObjectId,
            ref : "Manager"
        }
    ],
    employees : [
        {
            type : Schema.Types.ObjectId,
            ref : "Employee"
        }
    ]   
},
    {
        timestamps: true
    });
export const Event = mongoose.model("Office", officeSchema)