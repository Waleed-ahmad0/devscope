import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Project from "@/models/projects";
import User from "@/models/users";
import mongoose from "mongoose";

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
  path: 'team',
  select: 'name ownerId members',
  populate: {
    path: 'ownerId',
    select: 'firstName lastName',
  },
});

    // const checking= proj
    // console.log(project, "projectttt");
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
    await dbConnect();
    const { id } = await params;
    const { name,status } = await req.json();
    const project = await Project.findByIdAndUpdate(id, { name,status }, { new: true });
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
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}