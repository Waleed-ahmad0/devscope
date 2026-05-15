import mongoose, { Schema, model, models } from "mongoose";

interface ProjectInterface {
  name: string;
  description: string;
  team: mongoose.Schema.Types.ObjectId;
  userId: string;
  status: string;
}

const projectSchema = new Schema<ProjectInterface>(
  {
    name: {
      type: String,
      required: true,
      index: true,                   
    },
    description: {
      type: String,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Team",
      index: true,                   
    },
    status: {
      type: String,
      required: true,
      default: "Active",
      index: true,                    
    },
    userId: {
      type: String,
      required: true,
      index: true,                    
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ userId: 1, status: 1 });

projectSchema.index({ team: 1, status: 1 });

projectSchema.index({ name: "text", description: "text" });

const Project = models?.Project || model("Project", projectSchema);
export default Project;