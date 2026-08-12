import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Team from "@/models/teams";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import activity from "@/models/activity";
import Task from "@/models/tasks";
import { requireTeamAdmin, requireTeamMember } from "@/lib/authorize";

interface members {
  user: string;
  role: string;
}
interface Userdata {
  firstName: string;
  lastName?: string;
  _id: string;
  email: string;
}
interface selectedmembers {
  user: Userdata;
  role: string;
  _id: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const check = await requireTeamMember(id, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { error: check.status === 404 ? "Team not found" : "Forbidden" },
        { status: check.status },
      );
    }

    const team = await Team.findById(id)
      .populate("adminId", "firstName lastName email")
      .populate("members.user", "firstName lastName email");

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const check = await requireTeamAdmin(id, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { error: check.status === 404 ? "Team not found" : "Forbidden" },
        { status: check.status },
      );
    }

    const body = await req.json();

    if (body.newadmin) {
      const team = await Team.findById(id);
      if (!team) throw new Error("Team not found");

      const user = await User.findOne({ email: body.newadmin });
      if (!user) throw new Error("user not found");

      const oldAdminId = team.adminId.toString();
      const newAdminId = user._id.toString();


      team.members = team.members.filter(
        (m: any) => ![oldAdminId, newAdminId].includes(m.user.toString()),
      );
      team.members.push({ user: oldAdminId, role: "member" } as any);
      team.members.push({ user: newAdminId, role: "admin" } as any);
      team.adminId = user._id;
      await team.save();

      await activity.create({
        userId: new mongoose.Types.ObjectId(session.user.id),
        userName: (session.user.name || session.user.firstName)?.trim(),
        teamId: new mongoose.Types.ObjectId(id),
        projectId: body.projectId
          ? new mongoose.Types.ObjectId(body.projectId)
          : undefined,
        action: `Changed admin to :"${(user.firstName || user.name)?.trim()}"`,
        createdAt: new Date(),
      });

      return NextResponse.json(team, { status: 200 });
    }

    const membersData = await Promise.all(
      body.members.map(async (member: members) => {
        const user = await User.findOne({ email: member.user });
        if (!user) throw new Error(`user ${member.user} is not on devscope `);
        return { user: user._id, role: member.role, name: user.firstName || user.name };
      }),
    );
    const members = membersData.map((m) => ({ user: m.user, role: m.role }));
    const membersname = membersData.map((m) => m.name);

    const team = await Team.findByIdAndUpdate(
      id,
      { $push: { members: { $each: members } } },
      { new: true, runValidators: true },
    );

    await activity.create({
      userName: session.user.name || session.user.firstName,
      userId: new mongoose.Types.ObjectId(session.user.id),
      teamId: new mongoose.Types.ObjectId(id),
      projectId: body.projectId ? new mongoose.Types.ObjectId(body.projectId) : undefined,
      action: `Added member :"${membersname.join(", ")}"`,
      createdAt: new Date(),
    });

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Server error" },
    { status: 500 },
  );
}
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();


    if (body.message === "exit") {
      const membership = await requireTeamMember(id, session.user.id);
      if (!membership.ok) {
        return NextResponse.json(
          { error: membership.status === 404 ? "Team not found" : "Forbidden" },
          { status: membership.status },
        );
      }

      const team = await Team.findByIdAndUpdate(
        id,
        { $pull: { members: { user: session.user.id } } },
        { new: true, runValidators: true },
      );
      return NextResponse.json(team, { status: 200 });
    }

    const check = await requireTeamAdmin(id, session.user.id);
    if (!check.ok) {
      return NextResponse.json(
        { error: check.status === 404 ? "Team not found" : "Forbidden" },
        { status: check.status },
      );
    }

    const members = await Promise.all(
      body.selected.map(async (member: selectedmembers) => {
        const user = await User.findOne({ email: member.user.email });
        if (!user) throw new Error(`User not found: ${member.user}`);
        return { user: user._id, role: member.role, name: user.firstName || user.name };
      }),
    );
    const userIds = members.map((m) => new mongoose.Types.ObjectId(m.user as string));
    const membersname = members.map((m) => m.name);

    const team = await Team.findByIdAndUpdate(
      id,
      { $pull: { members: { user: { $in: userIds } } } },
      { new: true, runValidators: true },
    );

    await Task.deleteMany({ assignedTo: { $in: userIds } });
    await activity.create({
      userName: session.user.name || session.user.firstName,
      userId: new mongoose.Types.ObjectId(session.user.id),
      teamId: new mongoose.Types.ObjectId(id),
      projectId: body.projectId ? new mongoose.Types.ObjectId(body.projectId) : undefined,
      action: `Removed member: "${membersname.join(", ")}"`,
      createdAt: new Date(),
    });
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error, message: "Failed to delete member" },
      { status: 500 },
    );
  }
}
