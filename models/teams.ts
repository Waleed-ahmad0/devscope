import mongoose, { model, models,Schema } from "mongoose";

const teamsSchema = new Schema({
name: {
    type: String,
    required: true
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },

  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" //user id of the members
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
      }
    }
  ]
}, { timestamps: true })

const Team =models?.Team || model("Team", teamsSchema);
export default Team;
