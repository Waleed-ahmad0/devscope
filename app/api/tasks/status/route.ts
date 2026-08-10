import { dbConnect } from "@/lib/mongodb";
import activity from "@/models/activity";
import Task from "@/models/tasks";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { requireProjectMember } from "@/lib/authorize";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, status, title } = await req.json();
    const validStatuses = ["pending", "in progress", "completed"];
    if (!taskId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid taskId or status" }, { status: 400 });
    }

    await dbConnect();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const check = await requireProjectMember(task.projectId.toString(), session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { error: check.status === 404 ? "Project not found" : "Forbidden" },
        { status: check.status },
      );
    }

    const updated = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

    await activity.create({
      userName: (session.user.name || session.user.firstName)?.trim(),
      userId: new mongoose.Types.ObjectId(session.user.id),
      action: `marked task "${title}" as "${status}" `,
      projectId: task.projectId,
      createdAt: new Date(),
      taskId: new mongoose.Types.ObjectId(taskId),
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update task status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}