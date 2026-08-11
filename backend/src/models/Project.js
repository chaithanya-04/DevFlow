import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    startdate: {
        type: Date,
        required: [true, 'Please provide a startdate']
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a deadline']
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['Planning', 'Active', 'On Hold', 'Completed'],
      default: 'Planning'
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;