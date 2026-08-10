import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Team from "@/models/teams";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    const user = await User.findById((session.user.id)?.trim())
    if (!user) {
      throw new Error("User not found");
    }

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hasPassword: !!user.password, 
      googleId: user.googleId,
      githubId: user.githubId,
      discordId: user.discordId,
      authMethods: user.authMethods,
      profileImage: user.profileImage,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      linkedAccounts: {
        google: !!user.googleId,
        github: !!user.githubId,
        discord: !!user.discordId,
        credentials: user.authMethods.includes("credentials"),
      },
    });
  } catch (error) {
return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id.trim();

    const teams = await Team.find({
      $or: [{ adminId: userId }, { "members.user": userId }],
    });

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await Promise.all(
      teams.map(async (team) => {
        const isSoleAdmin = team.adminId.toString() === userId;
        const remainingMembers = team.members.filter(
          (m: any) => m.user.toString() !== userId,
        );

        if (isSoleAdmin) {
          const nextAdmin =
            remainingMembers.find((m: any) => m.role === "admin") ??
            remainingMembers[0];

          if (!nextAdmin) {
    
            await Team.findByIdAndDelete(team._id);
            return;
          }

          nextAdmin.role = "admin";
          team.adminId = nextAdmin.user;
        }

        team.members = remainingMembers;
        await team.save();
      }),
    );

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}