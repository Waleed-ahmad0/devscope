import mongoose, { models, Schema, model } from "mongoose";

interface ActivityInterface {
  userId?: mongoose.Schema.Types.ObjectId;
  teamId?: mongoose.Schema.Types.ObjectId;
  projectId?: mongoose.Schema.Types.ObjectId;
  taskId?: mongoose.Schema.Types.ObjectId;
  action: string;
  userName: string;
}

const activitySchema = new Schema<ActivityInterface>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,                  
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      index: true,                  
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,                  
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      index: true,                 
    },

    action: {
      type: String,
      required: true,
      index: true,                  
    },

    userName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


activitySchema.index({ projectId: 1, createdAt: -1 });

activitySchema.index({ teamId: 1, createdAt: -1 });

activitySchema.index({ userId: 1, createdAt: -1 });

activitySchema.index({ taskId: 1, createdAt: -1 });

activitySchema.index({ projectId: 1, action: 1, createdAt: -1 });

activitySchema.index({ teamId: 1, action: 1, createdAt: -1 });

activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

const Activity = models?.Activity || model("Activity", activitySchema);
export default Activity;