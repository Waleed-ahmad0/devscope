import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Team from "@/models/teams";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/users";
import mongoose from "mongoose";
import activity from "@/models/activity";
import Project from "@/models/projects";
import Task from "@/models/tasks";
import { requireTeamAdmin } from "@/lib/authorize";

interface members {
  user: string;
  role: string;
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const teams = await Team.find({
      $or: [{ adminId: userId }, { "members.user": userId }],
    });

    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const members = await Promise.all(
      (body.members ?? []).map(async (member: members) => {
        const user = await User.findOne({ email: member.user });
        if (!user) {
          throw new Error(`User not found: ${member.user}`);
        }
        return { user: user._id, role: member.role };
      }),
    );

    const objectId = new mongoose.Types.ObjectId(session.user.id);

   
    const alreadyIncluded = members.some(
      (m) => m.user.toString() === objectId.toString(),
    );
    const finalMembers = alreadyIncluded
      ? members
      : [...members, { user: objectId, role: "admin" as const }];

    const teamdata = { ...body, members: finalMembers, adminId: objectId };
    const createdTeam = await Team.create(teamdata);

    await activity.create({
      userName: (session.user.name || session.user.firstName)?.trim(),
      userId: objectId,
      teamId: createdTeam._id,
      projectId: createdTeam.projectId
        ? new mongoose.Types.ObjectId(createdTeam.projectId)
        : undefined,
      action: `Added team :"${createdTeam.name}"`,
      createdAt: new Date(),
    });

    return NextResponse.json(createdTeam, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    const check = await requireTeamAdmin(id, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        {
          success: false,
          message: check.status === 404 ? "Team not found" : "Forbidden",
        },
        { status: check.status },
      );
    }

    const team = await Team.findByIdAndDelete(id);
    if (team) {
      const projectsToDelete = await Project.find({ team: id });
      const projectIds = projectsToDelete.map((project) => project._id);

      await Project.deleteMany({ team: id });
      await activity.deleteMany({ teamId: id });
      await Task.deleteMany({ projectId: { $in: projectIds } }); 
    }

    return NextResponse.json({
      success: true,
      message: "Team and related data deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}