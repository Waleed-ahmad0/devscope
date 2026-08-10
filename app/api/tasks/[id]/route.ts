import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/tasks";
import User from "@/models/users";
import activity from "@/models/activity";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { requireProjectMember } from "@/lib/authorize";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    const check = await requireProjectMember(projectId, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { message: check.status === 404 ? "Project not found" : "Forbidden" },
        { status: check.status },
      );
    }

    await dbConnect();
    const tasks = await Task.find({ projectId });
    const tasksWithNames = await Promise.all(
      tasks.map(async (task) => {
        const user = await User.findById(task.assignedTo);
        return user
          ? { ...task.toObject(), assignedUser: `${user.firstName} ${user.lastName}` }
          : { ...task.toObject() };
      }),
    );

    return NextResponse.json(tasksWithNames);
  } catch (error) {
    return NextResponse.json(
      { message: "failed to fetch tasks", error: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id: taskId } = await params;

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const check = await requireProjectMember(task.projectId.toString(), session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { message: check.status === 404 ? "Project not found" : "Forbidden" },
        { status: check.status },
      );
    }

    await Task.findByIdAndDelete(taskId);
    await activity.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      userName: (session.user.firstName || session.user.name)?.trim(),
      projectId: task.projectId,
      action: `Deleted task :"${task.title}"`,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to delete task", error: String(error) },
      { status: 500 },
    );
  }
}