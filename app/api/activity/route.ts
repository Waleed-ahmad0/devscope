import activity from "@/models/activity";
import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Team from "@/models/teams";
import Project from "@/models/projects";
import Task from "@/models/tasks";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireTeamMember } from "@/lib/authorize";
import User from "@/models/users";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const teamId = searchParams.get("teamId");
    const wantsOwnDashboard = searchParams.get("userId");

    if (wantsOwnDashboard) {
      const userObjectId = new mongoose.Types.ObjectId(session.user.id);
      const getteams = await Team.find({
        $or: [{ adminId: userObjectId }, { "members.user": userObjectId }],
      });
      const teamIds = getteams.map((t) => t._id);
      const teamNames = getteams.slice(0, 2).map(({ _id, name }) => ({ _id, name }));

      const getprojects = await Project.find({ team: { $in: teamIds } });
      const getprojectsId = getprojects.map((i) => i._id);

      const gettask = await Task.find({ assignedTo: userObjectId });
      const gettaskforproject = await Task.find({ projectId: { $in: getprojectsId } });

      const getactivitys = await activity
        .find({ teamId: { $in: teamIds } })
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
      const check = await requireTeamMember(teamId, session.user.id);
      if (!check.ok) {
        return NextResponse.json(
          { message: check.status === 404 ? "Team not found" : "Forbidden" },
          { status: check.status },
        );
      }

      const getactivity = await activity
        .find({
          $or: [
            { projectId: new mongoose.Types.ObjectId(projectId) },
            { teamId: new mongoose.Types.ObjectId(teamId) },
          ],
        })
        .populate("userId", "firstName email lastName");

      return NextResponse.json({ message: "fetched activity", getactivity }, { status: 200 });
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
      { message: "failed to fetch activity", error: String(error) },
      { status: 500 },
    );
  }
}