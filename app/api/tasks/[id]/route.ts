import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import activity from "@/models/activity";
import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/tasks";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await dbConnect();
  const tasks = await Task.find({ projectId: id });
  const check = await Promise.all(
    tasks.map(async (task) => {
      const user = await User.findById(task.assignedTo);
      if (user) {
        return {
          ...task.toObject(),
          assignedUser: user.firstName + " " + user.lastName,
        };
      } else {
        return {
          ...task.toObject(),
        };
      }
    }),
  );

  return NextResponse.json(check);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const body = await req.json();
    // 
    const sendingtask = {
      ...body,
      projectId: new mongoose.Types.ObjectId(body.projectId),
      createdby: session?.user?.name?.trim() || session?.user?.firstName.trim()
    };
    dbConnect();
    const task = await Task.create(sendingtask);
    const createactivity = {
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      teamId: new mongoose.Types.ObjectId(body.team),
      projectId: new mongoose.Types.ObjectId(body.projectId),
      action: `Created task ${body.title}`,
      createdAt: new Date(),
    };
    await activity.create(createactivity);
    return NextResponse.json({ message: "POST" });
  } catch (error) {
    return NextResponse.json({ message: "failed to create task", error });
  }
}
