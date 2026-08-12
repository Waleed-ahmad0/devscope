# 🚀 DevScope

![Tests](https://github.com/Waleed-ahmad0/devscope/actions/workflows/test.yml/badge.svg)

A full-stack team collaboration and project management platform built to manage teams, projects, and tasks efficiently — inspired by modern tools like Trello and Jira.

---

## 📸 Preview

![DevScope dashboard](./public/screenshots/dashboard.png)

---

## 📌 Features

### 👥 Team Management
- Create and manage teams
- Add/remove members
- Role-based access (Admin / Member)

### 📁 Project Management
- Create, update, and delete projects
- Restrict project actions to admins
- Link projects to teams

### ✅ Task Management
- Create, update, delete tasks
- Assign tasks to team members
- Task status tracking (Todo, In Progress, Done)
- Due dates with sorting and highlighting

### 🎯 Advanced Task UX
- Drag & Drop task board (Kanban style)
- Filter tasks by status, assignee, and project

### 📊 Dashboard
- Overview of teams, projects, and tasks
- Upcoming (due) tasks
- Recent activities

### 🕒 Activity System
- Logs all important actions:
  - Task updates
  - Project changes
  - Member actions
- Human-readable activity messages
- Persistent history (even if user is deleted)

### 🔐 Permissions & Security
- Role-based authorization, enforced server-side on every route, not just hidden in the UI
- Every API route independently verifies the caller's team/project role before reading or writing data
- Admin-only critical actions (project deletion, member removal, admin transfer)

### 🧹 Data Integrity
- Cascade delete (team → projects → tasks → activities)
- Invalid ID handling
- Edge-case handling

---

## 🛡️ Security

This project went through a deliberate authorization hardening pass after an initial audit found several routes were checking *authentication* (is someone logged in) but not *authorization* (does this specific person have permission to do this specific thing) — allowing, for example, any team member to delete projects meant to be admin-only.

Every API route across projects, teams, tasks, and activity now independently verifies the caller's role before acting, rather than relying on the UI to hide buttons. The fixes are covered by an automated test suite (see below) that specifically encodes the bugs found, so they can't silently regress.

---

## 🧪 Testing

```bash
npx vitest run
```

Tests run automatically on every push via GitHub Actions (badge above). Current coverage focuses on the authorization logic — role checks on project and team routes, and the activity dashboard's handling of user-scoped data.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript
- **Backend:** Next.js API Routes / Node.js
- **Database:** MongoDB (Mongoose)
- **Auth:** NextAuth
- **Styling:** CSS / Tailwind
- **Testing:** Vitest, mongodb-memory-server

---

## ⚙️ Getting Started

1. Clone the repo:
```bash
   git clone https://github.com/Waleed-ahmad0/devscope.git
   cd devscope
```

2. Install dependencies:
```bash
   npm install
```

3. Set up environment variables — copy the example file and fill in your own values:
```bash
   cp .env.example .env.local
```

4. Run the development server:
```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

See `.env.example` for the full list. At minimum, you'll need:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret used to sign session tokens |
| `NEXTAUTH_URL` | Your app's base URL (e.g. `http://localhost:3000` in development) |

---