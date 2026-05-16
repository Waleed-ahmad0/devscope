import mongoose, { model, models, Schema } from "mongoose";

interface TaskInterface {
  title: string;
  description: string;
  status: "pending" | "in progress" | "completed";
  assignedTo?: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
  Duedate: Date;
  createdBy: string;
}

const taskSchema = new Schema<TaskInterface>(
  {
    title: {
      type: String,
      required: true,
      index: true,                  
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
      index: true,                  
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,                  
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,                  
    },
    Duedate: {                     
      type: Date,
      required: true,
      index: true,                  
    },
    createdBy: {                   
      type: String,
      required: true,
      index: true,                  
    },
   
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ projectId: 1, status: 1 });

taskSchema.index({ assignedTo: 1, status: 1 });

taskSchema.index({ projectId: 1, dueDate: 1 });

taskSchema.index({ assignedTo: 1, dueDate: 1 });
taskSchema.index({ title: "text", description: "text" });

const Task = models?.Task || model("Task", taskSchema);
export default Task;