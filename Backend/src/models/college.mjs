import mongoose, { Schema } from "mongoose";

const collegeSchema = new Schema({
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
        match: [/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]+)+([/?].*)?$/, 'Please fill a valid website address']

    },
    officeEmailId : {
        type : String,
        required : true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    banner : {
        type : String 
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "Owner",
        required : true
    },
    professors : [
        {
            type : Schema.Types.ObjectId,
            ref : "Professor"
        }
    ],
    students : [
        {
            type : Schema.Types.ObjectId,
            ref : "Student"
        }
    ],
    courses : [
        {
            type : Schema.Types.ObjectId,
            ref : "Course"
        }
    ]   
},
    {
        timestamps: true
    });

export const College = mongoose.model("College", collegeSchema);