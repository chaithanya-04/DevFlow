import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
   },
   description:{
    type: String,
    default: "",
   },

   project:{
    type:mongoose.Schema.Types.ObjectID,
    ref: "Project",
    required: true,
   },
   assignedTo:{
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
    default: null,
   },

   priority:{
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
   },

   estimatedTime:{
    type: String,
    default:"",
   },

   deadline:{
    type: Date,
    default: null,
   },

   status:{
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do',
   }
},
{
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
export default Task;