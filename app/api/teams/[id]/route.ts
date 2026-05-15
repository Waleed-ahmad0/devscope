import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Team from "@/models/teams";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import activity from "@/models/activity";
import Task from "@/models/tasks";
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
    // 

    if (body.newOwner) {
      const oldowner = await Team.findById(id);
      // 
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
        userName: (session?.user?.name || session?.user?.firstName)?.trim(),
        teamId: new mongoose.Types.ObjectId(id),
        projectId: new mongoose.Types.ObjectId(body.projectId),
        action: `Changed owner to ${(user.firstName || user.name)?.trim()}`,
        createdAt: new Date(),
      };
      await activity.create(createactivity);
      return NextResponse.json(team, { status: 200 });
    }

    const membersData = await Promise.all(
  body.members.map(async (member: members) => {
    const user = await User.findOne({ email: member.user });

    if (!user) {
      throw new Error(`User not found: ${member.user}`);
    }

    return {
      user: user._id,
      role: member.role,
      name: user.firstName || user.name,
    };
  }),
);

const members = membersData.map(m => ({ user: m.user, role: m.role }));
const membersname = membersData.map(m => m.name);
    const team = await Team.findByIdAndUpdate(
      id,
      { $push: { members: { $each: members } } },
      { new: true, runValidators: true },
    );
    const createactivity = {
      userName: session?.user?.name || session?.user?.firstName,
      userId: new mongoose.Types.ObjectId(session?.user?.id),
      teamId: new mongoose.Types.ObjectId(id),
      projectId: new mongoose.Types.ObjectId(body.projectId),
      action: `Added member ${membersname.join(", ")}`,
      createdAt: new Date(),
    };
    await activity.create(createactivity);
    // 
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
    // 

    const members = await Promise.all(
      body.selected.map(async (member: selectedmembers) => {
        // 
        const user = await User.findOne({ email: member.user.email });
        // 
        if (!user) {
          throw new Error(`User not found: ${member.user}`);
        }
        return {
          user: user._id,
          role: member.role,
        };
      }),
    );
    // 
    const userIds = members.map(
      (m) => new mongoose.Types.ObjectId(m.user as string),
    );
    // 
    const team = await Team.findByIdAndUpdate(
      id,
      { $pull: { members: { user: { $in: userIds } } } },
      { new: true, runValidators: true },
    );
    // 
    await Task.deleteMany({ assignedTo: { $in: userIds } });
    const createactivity = {
      userName: session?.user?.name || session?.user?.firstName,
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
