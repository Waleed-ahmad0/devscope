import mongoose, { models, Schema, model } from "mongoose";

const activitySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  action: {type:String,
  required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  
})

const activity = models?.activity || model("activity", activitySchema);
export default activity;
