import mongoose, { model, models, Schema } from "mongoose";

const userschema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId ,
      ref: "User",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    Duedate:{
        type:Date,
        required:true
    },
    createdby: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = models?.Task || model("Task", userschema);
export default Task;