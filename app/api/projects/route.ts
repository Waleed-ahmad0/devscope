import { NextResponse } from "next/server";
import Project from "@/models/projects";
import { dbConnect } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface getbody {
  name: string;
  description: string;
  status: string;
}
interface dbdata {
  name: string;
  description: string;
  userId?: string;
  status: string;
}
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({});

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body: getbody = await req.json();
    const session = await getServerSession(authOptions);
    const final_data: dbdata = {
      name: body.name,
      description: body.description,
      userId: session?.user?.id,
        status: "Active"
    }
    const senddata = await Project.create(final_data)
    console.log('sendata',senddata)


    return NextResponse.json(senddata, { status: 200 })

  } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}