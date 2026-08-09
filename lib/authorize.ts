import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Team from "@/models/teams";
import Project from "@/models/projects";

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function getTeamRole(teamId: string, userId: string) {
  const team = await Team.findById(teamId);
  if (!team) return { team: null, role: null as "admin" | "member" | null };

  const membership = team.members?.find(
    (m: any) => m.user.toString() === userId,
  );
  return { team, role: membership?.role ?? null };
}

export async function requireTeamAdmin(teamId: string, userId: string) {
  const { team, role } = await getTeamRole(teamId, userId);
  if (!team) return { ok: false as const, status: 404 as const };
  if (role !== "admin") return { ok: false as const, status: 403 as const };
  return { ok: true as const, status: 200 as const, team };
}

export async function requireTeamMember(teamId: string, userId: string) {
  const { team, role } = await getTeamRole(teamId, userId);
  if (!team) return { ok: false as const, status: 404 as const };
  if (!role) return { ok: false as const, status: 403 as const };
  return { ok: true as const, status: 200 as const, team };
}

export async function requireProjectAdmin(projectId: string, userId: string) {
  const project = await Project.findById(projectId);
  if (!project) return { ok: false as const, status: 404 as const };
  const check = await requireTeamAdmin(project.team.toString(), userId);
  if (!check.ok) return check;
  return { ok: true as const, status: 200 as const, project };
}

export async function requireProjectMember(projectId: string, userId: string) {
  const project = await Project.findById(projectId);
  if (!project) return { ok: false as const, status: 404 as const };
  const check = await requireTeamMember(project.team.toString(), userId);
  if (!check.ok) return check;
  return { ok: true as const, status: 200 as const, project };
}