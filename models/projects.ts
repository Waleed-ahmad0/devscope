import mongoose, { Schema, model, models } from "mongoose";
interface projectinterface {
  name: string;
  description: string;
  team: mongoose.Schema.Types.ObjectId;
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
    team: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : "Team",
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

const Project =models?.Project|| model("Project", userschema);
export default Project;
