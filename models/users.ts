import mongoose, { Schema, model, models } from "mongoose";

interface UserInterface {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  discordId?: string;
  authMethods: ("credentials" | "google" | "github" | "discord")[];
  profileImage?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date | null;
}

const userSchema = new Schema<UserInterface>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,                  
    },
    password: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
      index: true,                  
    },
    githubId: {
      type: String,
      sparse: true,
      unique: true,
      index: true,                 
    },
    discordId: {
      type: String,
      sparse: true,
      unique: true,
      index: true,                  
    },
    authMethods: {
      type: [String],
      enum: ["credentials", "google", "github", "discord"],
      default: [],
      index: true,                
    },
    profileImage: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,                  
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,             
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);


userSchema.index({ isActive: 1, isEmailVerified: 1 });

userSchema.index({ isActive: 1, isEmailVerified: 1, createdAt: -1 });

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.index({ isActive: 1, lastLogin: -1 });

userSchema.index({ isActive: 1, createdAt: -1 });


userSchema.index({ createdAt: -1 });

userSchema.index({ lastLogin: -1 });

userSchema.index({ firstName: "text", lastName: "text", email: "text" });

const User = models?.User || model("User", userSchema);
export default User;