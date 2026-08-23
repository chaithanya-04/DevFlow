import mongoose from "mongoose";

export const  userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },

    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },

    role: {
        type : String,
        enum: ['Admin', 'Project Manager', 'Developer'],
        default: 'Developer',
    },

    avatar: {
      type: String,
      default: '',
    },

    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
    },
  },
  {
    timestamps: true,
  }

);

const User = mongoose.model("User", userSchema);
export default User;



