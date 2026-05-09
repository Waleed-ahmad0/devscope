import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Team from "@/models/teams";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import activity from "@/models/activity";
import Task from "@/models/tasks";
import Project from "@/models/projects";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const team = await Team.findById(id)
      .populate("ownerId", "firstName lastName email")
      .populate("members.user", "firstName lastName email");
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
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
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
const session = await getServerSession(authOptions);

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    console.log(body);

    if (body.newOwner) {
      const oldowner = await Team.findById(id);
      console.log("oldowner", oldowner.ownerId);
      const user = await User.findOne({ email: body.newOwner });
      if (!user) {
        throw new Error("user not found");
      }
      await Team.findByIdAndUpdate(
        id,
        { $pull: { members: { user: { $in: user._id } } } },
        { new: true, runValidators: true },
      );
      await Team.findByIdAndUpdate(
        id,
        { $push: { members: { user: oldowner.ownerId, role: "member" } } },
        { new: true, runValidators: true },
      );
      const team = await Team.findByIdAndUpdate(
        id,
        { $set: { ownerId: user._id } },
        { new: true, runValidators: true },
      );
      const createactivity = {
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      teamId: new mongoose.Types.ObjectId(id),
      projectId: new mongoose.Types.ObjectId(body.projectId),
      action: `Changed owner to ${oldowner.ownerId} ${body.newOwner}`,
      createdAt: new Date(),
    };
    await activity.create(createactivity);
      return NextResponse.json(team, { status: 200 });
    }

    const members = await Promise.all(
      body.members.map(async (member: members) => {
        const user = await User.findOne({ email: member.user });

        if (!user) {
          // return NextResponse.json({ error: "User not found" }, { status: 404 });
          throw new Error(`User not found: ${member.user}`);
        }

        return {
          user: user._id,
          role: member.role,
        };
      }),
    );
    const team = await Team.findByIdAndUpdate(
      id,
      { $push: { members: { $each: members } } },
      { new: true, runValidators: true },
    );
     const createactivity = {
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      teamId: new mongoose.Types.ObjectId(id),
      projectId: new mongoose.Types.ObjectId(body.projectId),
      action: `Added member ${body.members}`,
      createdAt: new Date(),
    };
    await activity.create(createactivity);
    // console.log('team',team);
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
const session = await getServerSession(authOptions);

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    // console.log("body", body);

    const members = await Promise.all(
      body.selected.map(async (member: selectedmembers) => {
        // console.log("email", member.user.email);
        const user = await User.findOne({ email: member.user.email });
        // console.log(user);
        if (!user) {
          throw new Error(`User not found: ${member.user}`);
        }
        return {
          user: user._id,
          role: member.role,
        };
      }),
    );
    // console.log("members", members);
    const userIds = members.map(
      (m) => new mongoose.Types.ObjectId(m.user as string),
    );
    console.log("userIds", userIds);
    const team = await Team.findByIdAndUpdate(
      id,
      { $pull: { members: { user: { $in: userIds } } } },
      { new: true, runValidators: true },
    );
    // console.log(team);
await Task.deleteMany({ assignedTo: { $in: userIds } });
    const createactivity = {
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      teamId: new mongoose.Types.ObjectId(id),
      projectId: new mongoose.Types.ObjectId(body.projectId),
      action: `Removed member ${body.selected}`,
      createdAt: new Date(),
    };
    await activity.create(createactivity);
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error, message: "Failed to delete member" },
      { status: 500 },
    );
  }
}
