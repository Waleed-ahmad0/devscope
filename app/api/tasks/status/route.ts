import { dbConnect } from "@/lib/mongodb";
import activity from "@/models/activity";
import Task from "@/models/tasks";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { taskId, status, teamId, projectId, title } = await req.json();
    const validStatuses = ["pending", "in progress", "completed"];
    if (!taskId || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid taskId or status" },
        { status: 400 },
      );
    }

    await dbConnect();
    const updated = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true },
    );
    const createactivity = {
      userName: (session?.user?.name || session?.user?.firstName)?.trim(),
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      action: `marked task "${title}" as "${status}" `,
      teamId: new mongoose.Types.ObjectId(teamId),
      projectId: new mongoose.Types.ObjectId(projectId),
      createdAt: new Date(),
      taskId: new mongoose.Types.ObjectId(taskId),
    };
    await activity.create(createactivity);
    if (!updated) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update task status:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
