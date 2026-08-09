import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Project from "@/models/projects";
import User from "@/models/users";
import mongoose from "mongoose";
import Task from "@/models/tasks";
import Activity from "@/models/activity";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireProjectAdmin, requireProjectMember } from "@/lib/authorize";

interface Members {
  user: mongoose.Types.ObjectId;
  role: string;
  _id: mongoose.Types.ObjectId;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const check = await requireProjectMember(id, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { success: false, message: check.status === 404 ? "Not found" : "Forbidden" },
        { status: check.status },
      );
    }

    const project = await Project.findById(id).populate({
      path: "team",
      select: "name adminId members",
      populate: { path: "adminId", select: "firstName lastName" },
    });

    const membersWithNames = await Promise.all(
      project.team.members?.map(async (m: Members) => {
        const check = await User.findById(m.user);
        return {
          _id: m._id,
          role: m.role,
          user: m.user,
          userName: check ? `${check.firstName} ${check.lastName}` : "Unknown User",
        };
      }),
    );

    const finalstuff = {
      ...(project as any).toObject(),
      team: { ...(project.team as any).toObject(), members: membersWithNames },
    };

    return NextResponse.json({ success: true, data: finalstuff });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const check = await requireProjectAdmin(id, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { success: false, message: check.status === 404 ? "Not found" : "Forbidden" },
        { status: check.status },
      );
    }

    const project = await Project.findByIdAndUpdate(id, body, { new: true });
    if (project) {
      await Activity.create({
        userId: new mongoose.Types.ObjectId(session.user.id),
        userName: (session.user.firstName || session.user.name)?.trim(),
        projectId: project._id,
        action: `updated Project "${Object.keys(body).join(", ")}" `,
      });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const check = await requireProjectAdmin(id, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { success: false, message: check.status === 404 ? "Not found" : "Forbidden" },
        { status: check.status },
      );
    }

    const project = await Project.findByIdAndDelete(id);
    if (project) {
      await Task.deleteMany({ projectId: project._id });
      await Activity.deleteMany({ projectId: project._id });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}