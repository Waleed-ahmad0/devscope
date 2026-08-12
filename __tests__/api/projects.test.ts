import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { DELETE } from "@/app/api/projects/[id]/route";
import Team from "@/models/teams";
import Project from "@/models/projects";
import { getServerSession } from "next-auth/next";

vi.mock("next-auth/next");
vi.mock("@/lib/mongodb", () => ({
  dbConnect: vi.fn().mockResolvedValue(undefined),
}));

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("DELETE /api/projects/[id]", () => {
  it("blocks a member from deleting a project", async () => {
    const memberId = new mongoose.Types.ObjectId();
    const adminId = new mongoose.Types.ObjectId();

    const team = await Team.create({
      name: "Test Team",
      adminId,
      members: [
        { user: adminId, role: "admin" },
        { user: memberId, role: "member" },
      ],
    });
    const project = await Project.create({
      name: "Test Project",
      description: "A project for testing",
      team: team._id,
      userId: adminId,
    });

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: memberId.toString() },
    } as any);

    const req = new Request(`http://localhost/api/projects/${project._id}`, { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: project._id.toString() }) });

    expect(res.status).toBe(403);

    const stillExists = await Project.findById(project._id);
    expect(stillExists).not.toBeNull();
  });

  it("allows an admin to delete a project", async () => {
    const adminId = new mongoose.Types.ObjectId();

    const team = await Team.create({
      name: "Test Team 2",
      adminId,
      members: [{ user: adminId, role: "admin" }],
    });
    const project = await Project.create({
      name: "Test Project",
      description: "A project for testing",
      team: team._id,
      userId: adminId,
    });

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: adminId.toString() },
    } as any);

    const req = new Request(`http://localhost/api/projects/${project._id}`, { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: project._id.toString() }) });

    expect(res.status).toBe(200);

    const stillExists = await Project.findById(project._id);
    expect(stillExists).toBeNull();
  });
});