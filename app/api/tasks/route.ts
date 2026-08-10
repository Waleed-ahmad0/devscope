import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/tasks";
import Team from "@/models/teams";
import Project from "@/models/projects";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const teams = await Team.find({
      $or: [{ adminId: userId }, { "members.user": userId }],
    });
    const teamIds = teams.map((t) => t._id);
    const projects = await Project.find({ team: { $in: teamIds } });
    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({ projectId: { $in: projectIds } });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks", details: String(error) },
      { status: 500 },
    );
  }
}