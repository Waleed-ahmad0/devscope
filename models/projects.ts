import mongoose, { Schema, model, models } from "mongoose";
interface projectinterface {
  name: string;
  description: string;
  userId: string;
  status: string;
}
const userschema = new Schema<projectinterface>(
  {
    name: {
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
      default: "Active",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
// Delete cached model to ensure schema changes are picked up during dev hot-reloads
if (models?.Project) {
  mongoose.deleteModel("Project");
}
const Project = model("Project", userschema);
export default Project;
