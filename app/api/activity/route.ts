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
    const teamId = searchParams.get("teamId");

    if (userId && userId !== "undefined" && userId !== "null") {
      const getteams = await Team.find({
        $or: [{ adminId: userId }, { "members.user": userId }],
      });
      const teamIds = getteams.map((t) => t._id);
      //
      const teamNames = getteams
        .slice(0, 2)
        .map(({ _id, name }) => ({ _id, name }));
      const getprojects = await Project.find({
        team: teamIds,
      });
      const getprojectsId = getprojects.map((i) => i._id);
      const gettask = await Task.find({
  $or: [
    { assignedTo: new mongoose.Types.ObjectId(userId) },
    { assignedTo: { $exists: false } },  
  ]
});
      const gettaskforproject = await Task.find({
        projectId: getprojectsId,
      });
      //
      //
      //
      const getactivitys = await activity
        .find({
          teamId: teamIds,
        })
        // .populate("userId", "firstName email")
        .populate("projectId", "name")
        .populate("taskId", "title createdAt")
        .populate("teamId", "name")
        .sort({ createdAt: -1 })
        .limit(3);
      const activeprojects = getprojects.filter((p) => p.status === "Active");
      return NextResponse.json(
        {
          message: "fetched activity",
          getactivitys,
          teamNames,
          totalTeams: getteams.length,
          totalProjects: getprojects,
          activeProjects: activeprojects.length,
          totaltasks: gettask,
          totaltaskforproject: gettaskforproject,
          allTeams: getteams,
        },
        { status: 200 },
      );
    }
    if (projectId && teamId) {
      const getactivity = await activity
        .find({
          $or: [
            { projectId: new mongoose.Types.ObjectId(projectId) },
            { teamId: new mongoose.Types.ObjectId(teamId) },
          ],
        })
        .populate("userId", "firstName email lastName");
      
      return NextResponse.json(
        { message: "fetched activity", getactivity },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "No valid userId or projectId provided",
        getactivitys: [],
        teamNames: [],
        totalTeams: 0,
        totalProjects: [],
        activeProjects: 0,
        totaltasks: [],
        totaltaskforproject: [],
        allTeams: [],
      },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "failed to fetch activity", error },
      { status: 500 },
    );
  }
}
