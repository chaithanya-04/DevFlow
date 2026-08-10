import mongoose from "mongoose";

export const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    Descrption:{
        type: String,
        required: true,
    },

    StartDate: {
        type: Date,
        required: true,
    },

    Deadline: {
        type: Date,
        required: true,
    },

    owner:{
        type: mongoose.Schema.type.ObjectId,
        ref: "User",
        required: true,
    }
},
{
    timestamps: true
}
);

const Project = mongoose.model("Project", projectSchema);
export default Project;