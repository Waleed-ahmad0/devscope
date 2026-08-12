import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { PATCH } from "@/app/api/teams/[id]/route";
import Team from "@/models/teams";
import User from "@/models/users";
import { getServerSession } from "next-auth";

vi.mock("next-auth");
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

describe("PATCH /api/teams/[id] - admin transfer", () => {
  it("moves the old admin to member and the new admin to admin", async () => {
    const oldAdmin = await User.create({
      firstName: "Old",
      lastName: "Admin",
      email: "old-admin@test.com",
    });
    const newAdmin = await User.create({
      firstName: "New",
      lastName: "Admin",
      email: "new-admin@test.com",
    });

    const team = await Team.create({
      name: "Transfer Test Team",
      adminId: oldAdmin._id,
      members: [{ user: oldAdmin._id, role: "admin" }],
    });

   vi.mocked(getServerSession).mockResolvedValue({
  user: { id: oldAdmin._id.toString(), name: "Old Admin" },
} as any);

    const req = new Request(`http://localhost/api/teams/${team._id}`, {
      method: "PATCH",
      body: JSON.stringify({ newadmin: "new-admin@test.com" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: team._id.toString() }) });

    expect(res.status).toBe(200);

    const updated = await Team.findById(team._id);
    expect(updated!.adminId.toString()).toBe(newAdmin._id.toString());

    const oldEntry = updated!.members.find((m: any) => m.user.toString() === oldAdmin._id.toString());
    const newEntry = updated!.members.find((m: any) => m.user.toString() === newAdmin._id.toString());

    expect(oldEntry?.role).toBe("member");
    expect(newEntry?.role).toBe("admin");
  });
});