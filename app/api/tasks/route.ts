import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/tasks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  const tasks = await Task.find();
  return NextResponse.json(tasks);
}