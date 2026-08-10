import { NextResponse } from "next/server";
import Project from "@/models/projects";
import { dbConnect } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Team from "@/models/teams";
import mongoose from "mongoose";
import activity from "@/models/activity";
import { requireTeamMember, requireTeamAdmin } from "@/lib/authorize";

interface getbody {
  name: string;
  description: string;
  status: string;
  team: string;
}
interface dbdata {
  name: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  status: string;
  team: mongoose.Types.ObjectId;
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

    const teamIds = teams.map((t) => t._id);
    const projects = await Project.find({ team: { $in: teamIds } }).populate("team", "name");

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body: getbody = await req.json();

    const membership = await requireTeamMember(body.team, session.user.id);
    if (!membership.ok) {
      return NextResponse.json(
        { error: membership.status === 404 ? "Team not found" : "Forbidden" },
        { status: membership.status },
      );
    }

    const final_data: dbdata = {
      name: body.name,
      description: body.description,
      userId: new mongoose.Types.ObjectId(session.user.id),
      status: "Active",
      team: new mongoose.Types.ObjectId(body.team),
    };
    const senddata = await Project.create(final_data);

    await activity.create({
      projectId: new mongoose.Types.ObjectId(senddata._id),
      userName: (session.user.name || session.user.firstName)?.trim(),
      userId: new mongoose.Types.ObjectId(session.user.id),
      teamId: new mongoose.Types.ObjectId(body.team),
      action: `Created project :"${body.name?.trim()}"`,
      createdAt: new Date(),
    });

    return NextResponse.json(senddata, { status: 200 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await req.json();
    const project = await Project.findOne({ name: id });
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const check = await requireTeamAdmin(project.team.toString(), session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { error: check.status === 404 ? "Team not found" : "Forbidden" },
        { status: check.status },
      );
    }

    project.updatedAt = new Date();
    await project.save();

    await activity.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      userName: (session.user.name || session.user.firstName)?.trim(),
      teamId: new mongoose.Types.ObjectId(project.team),
      projectId: new mongoose.Types.ObjectId(project._id),
      action: `Updated project :"${project.name?.trim()}"`,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}