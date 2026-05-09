import { NextResponse } from "next/server";
import Project from "@/models/projects";
import { dbConnect } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Team from "@/models/teams";
import mongoose from "mongoose";
import activity from "@/models/activity";
interface getbody {
  name: string;
  description: string;
  status: string;
  team: string;
}
interface dbdata {
  name: string;
  description: string;
  userId?: string;
  status: string;
  team: string;
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const userId = new mongoose.Types.ObjectId(session?.user?.id);
    const teams = await Team.find({
      $or: [{ ownerId: userId }, { "members.user": userId }],
    });

    const teamIds = teams.map((t) => t._id);

    const projects = await Project.find({ team: { $in: teamIds } }).populate(
      "team",
      "name",
    );
    console.log(projects);

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    await dbConnect();
    const body: getbody = await req.json();
    const final_data: dbdata = {
      name: body.name,
      description: body.description,
      userId: session?.user?.id,
      status: "Active",
      team: body.team,
    };
    const senddata = await Project.create(final_data);
    // console.log("sendata", senddata);
    const createactivity = {
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      team: new mongoose.Types.ObjectId(body.team),
      action: `Created project ${body.name}`,
      createdAt: new Date(),
    };
    // console.log(createactivity);
    await activity.create(createactivity);
    return NextResponse.json(senddata, { status: 200 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const { id } = await req.json();
  console.log("body", id);
  await dbConnect();
  const project = await Project.findOne({ name: id });
  if (project) {
    project.updatedAt = new Date();
    await project.save();
    const createactivity = {
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      teamId: new mongoose.Types.ObjectId(project.team),
      projectId: new mongoose.Types.ObjectId(project._id),
      action: `Updated project ${project.name}`,
      createdAt: new Date(),
    };
    // console.log(createactivity);
    await activity.create(createactivity);
  }
  return NextResponse.json({ message: "success" });
}
