import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/tasks";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, {params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  console.log(id)
  await dbConnect();
  const tasks = await Task.find({project: id});
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const sendingtask= {...body, createdby: session?.user?.name};
  console.log("sendingtask",sendingtask);
  dbConnect();
  const task = await Task.create(sendingtask);
  return NextResponse.json({ message: "POST" });
}
