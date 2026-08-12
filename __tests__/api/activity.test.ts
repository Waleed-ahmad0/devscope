import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { GET } from "@/app/api/activity/route";
import Team from "@/models/teams";
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

describe("GET /api/activity - own dashboard", () => {
  it("ignores a tampered userId and only returns the real caller's teams", async () => {
    const victim = new mongoose.Types.ObjectId();
    const attacker = new mongoose.Types.ObjectId();

    const victimTeam = await Team.create({
      name: "Victim's Team",
      adminId: victim,
      members: [{ user: victim, role: "admin" }],
    });
    const attackerTeam = await Team.create({
      name: "Attacker's Team",
      adminId: attacker,
      members: [{ user: attacker, role: "admin" }],
    });

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: attacker.toString() },
    } as any);

    const req = new Request(`http://localhost/api/activity?userId=${victim.toString()}`);
    const res = await GET(req);
    const body = await res.json();

    const teamIds = body.allTeams.map((t: any) => t._id.toString());

    expect(teamIds).toContain(attackerTeam._id.toString());
    expect(teamIds).not.toContain(victimTeam._id.toString());
  });
});