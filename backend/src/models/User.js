import mongoose from "mongoose";

export const  userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },

    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type : String,
        enum: ['Admin', 'Project Manager', 'Developer'],
        default: 'Developer',
    }
},
{
    timestamps: true
}

);

const User = mongoose.model("User", userSchema);
export default User;



