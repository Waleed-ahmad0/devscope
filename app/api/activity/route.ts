import activity from "@/models/activity";
import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Team from "@/models/teams";
import Project from "@/models/projects";
import Task from "@/models/tasks";
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const userId = searchParams.get("userId");

    if (userId) {
      const getteams = await Team.find({
        $or: [{ ownerId: userId }, { "members.user": userId }],
      });
      const teamIds = getteams.map((t) => t._id);
      // console.log(getteams)
      const teamNames = getteams
        .slice(0, 2)
        .map(({ _id, name }) => ({ _id, name }));
      const getprojects = await Project.find({
        team: teamIds,
      });
      const getprojectsId = getprojects.map((i) => i._id);
      const gettask = await Task.find({
        assignedTo: new mongoose.Types.ObjectId(userId),
      });
      const gettaskforproject = await Task.find({
        projectId: getprojectsId,
      });
      // console.log("tasks", gettask);
      // console.log("getprojects",getprojects)
      // console.log("teamnames", teamNames);
      const getactivitys = await activity
        .find({
          teamId: teamIds,
        })
        .populate("userId", "firstName lastName")
        .populate("projectId", "name")
        .populate("taskId", "title createdAt")
        .populate("teamId", "name")
        .sort({ createdAt: -1 })
        .limit(3);

      // console.log("getactivitys1:",getactivitys);
      return NextResponse.json(
        {
          message: "fetched activity",
          getactivitys,
          teamNames,
          totalTeams: getteams.length,
          totalProjects: getprojects,
          totaltasks: gettask,
          totaltaskforproject: gettaskforproject,
          allTeams: getteams
        },
        { status: 200 },
      );
    }
    if (projectId) {
      const getactivity = await activity
        .find({
          projectId: new mongoose.Types.ObjectId(projectId),
        })
        .populate("userId", "firstName email lastName");

      return NextResponse.json(
        { message: "fetched activity", getactivity },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "failed to fetch activity", error },
      { status: 500 },
    );
  }
}
