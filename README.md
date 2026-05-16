# 🚀 DevScope

A full-stack team collaboration and project management platform built to manage teams, projects, and tasks efficiently — inspired by modern tools like Trello and Jira.

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
- Real-time status updates

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
- Role-based authorization
- Protected API routes
- Admin-only critical actions

### 🧹 Data Integrity
- Cascade delete (team → projects → tasks → activities)
- Invalid ID handling
- Edge-case handling

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript
- **Backend:** Next.js API Routes / Node.js
- **Database:** MongoDB (Mongoose)
- **Styling:** CSS / Tailwind

---
