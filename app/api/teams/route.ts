import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Team from "@/models/teams";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import User from "@/models/users";
import mongoose from "mongoose";
import activity from "@/models/activity";
import Project from "@/models/projects";
import Task from "@/models/tasks";
interface members {
  user: string;
  role: string;
}
export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const teams = await Team.find({
      $or: [{ ownerId: userId }, { "members.user": userId }],
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // 

    // Convert email addresses to user IDs
    const members = await Promise.all(
      body.members.map(async (member: members) => {
        const user = await User.findOne({ email: member.user });

        if (!user) {
          throw new Error(`User not found: ${member.user}`);
        }

        return {
          user: user._id,
          role: member.role,
        };
      }),
    );
    const objectId = new mongoose.Types.ObjectId(session.user.id);
    const teamdata = {
      ...body,
      members,
      ownerId: objectId,
    };

    // 

    const createdTeam = await Team.create(teamdata);

    const createactivity = {
      userName: (session?.user?.name || session?.user?.firstName)?.trim(),
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      teamId: new mongoose.Types.ObjectId(createdTeam._id),
      projectId: new mongoose.Types.ObjectId(createdTeam.projectId),
      action: `Added team :"${createdTeam.name}"`,
      createdAt: new Date(),
    };
    await activity.create(createactivity);
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
    const { id } = await req.json();
    const team = await Team.findByIdAndDelete(id);
    if (team) {
      const projectsToDelete = await Project.find({ team: id });

      const projectIds = projectsToDelete.map((project) => project._id);
      await Project.deleteMany({ team: id });
      await activity.deleteMany({ teamId: id });
      await Task.deleteMany({ projectId: projectIds });
    }
    return NextResponse.json({ success: true, message: "Team and related data deleted successfully" ,status:200});
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
