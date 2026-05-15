import mongoose, { model, models, Schema } from "mongoose";

interface TeamMember {
  user: mongoose.Schema.Types.ObjectId;
  role: "admin" | "member";
}

interface TeamInterface {
  name: string;
  ownerId: mongoose.Schema.Types.ObjectId;
  members: TeamMember[];
}

const teamsSchema = new Schema<TeamInterface>(
  {
    name: {
      type: String,
      required: true,
      index: true,                
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,                  
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          index: true,             
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
  },
  { timestamps: true },
);

teamsSchema.index({ "members.user": 1, "members.role": 1 });

teamsSchema.index({ ownerId: 1, name: 1 });
teamsSchema.index({ name: "text" });

const Team = models?.Team || model("Team", teamsSchema);
export default Team;