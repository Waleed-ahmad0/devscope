import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Project from "@/models/projects";
import User from "@/models/users";
import mongoose from "mongoose";
import Task from "@/models/tasks";
import Activity from "@/models/activity";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Members {
  user: mongoose.Types.ObjectId;
  role: string;
  _id: mongoose.Types.ObjectId;
}
interface Team {
  _id: mongoose.Types.ObjectId;
  name: string;
  members: Members[];
}

interface ProjectDetail {
  id?: string;
  name: string;
  description?: string;
  team: Team;
  status: "Active" | "In Progress" | "Done";
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
  createdAt?: string;
}
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id).populate({
      path: "team",
      select: "name ownerId members",
      populate: {
        path: "ownerId",
        select: "firstName lastName",
      },
    });

    // const checking= proj
    //
    const membersWithNames = await Promise.all(
      project.team.members?.map(async (m: Members) => {
        const check = await User.findById(m.user);
        return {
          _id: m._id,
          role: m.role,
          user: m.user,
          userName: check
            ? `${check.firstName} ${check.lastName}`
            : "Unknown User",
        };
      }),
    );

    const finalstuff = {
      ...(project as any).toObject(),
      team: {
        ...(project.team as any).toObject(),
        members: membersWithNames,
      },
    };

    return NextResponse.json({ success: true, data: finalstuff });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const project = await Project.findByIdAndUpdate(id, body, { new: true });
    if (project) {
      await Activity.create({
        userId: new mongoose.Types.ObjectId(session?.user?.id),
        userName: (session?.user?.firstName || session?.user?.name)?.trim(),
        projectId: project._id,
        action: `updated Project "${Object.keys(body).join(", ")}" `,
      });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);
    if (project) {
      const check = await Task.deleteMany({ projectId: project._id });
      const acitivity = await Activity.deleteMany({ projectId: project._id });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
