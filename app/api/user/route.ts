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
      hasPassword: !!user.password, // Check if password exists without exposing it
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

      // ✅ Formatted linked accounts
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
      $or: [{ ownerId: userId }, { "members.user": userId }],
    });
    const teamIds = teams.map((team) => team._id);
    const user = await User.findByIdAndDelete(userId)
    
    if (!user) {
      throw new Error("User not found");
    }

    // const team = await Team.deleteMany({_id:{$in:teamIds}})
  const team =  await Promise.all(
    teams.map(async (team) => {
      await Team.findByIdAndUpdate(
        team._id,
        { $pull: { members: { user: { $in: (session?.user?.id)?.trim() } } } },
        { new: true, runValidators: true },
      );

      
    }))


  
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
