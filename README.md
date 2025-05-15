# 🌀 Taskloop Documentation

## Overview

**Taskloop** is a modern, full-stack task management web application designed to help users efficiently organize, track, and collaborate on tasks in real time. Built with TypeScript, React, and Supabase, Taskloop emphasizes:

- **Performance**: Powered by Vite for near-instant hot reloads and optimized builds.  
- **Type Safety**: End-to-end TypeScript across frontend and backend migrations.  
- **Real-Time**: Supabase’s real-time subscriptions keep task lists and notifications synchronized.  
- **Accessibility & Design**: Tailwind CSS + Shadcn UI for a responsive, accessible UI.

## Features

### 🔐 Authentication & Authorization
- **Sign Up / Sign In** via email & password (Supabase Auth).  
- **Session Persistence** across browser reloads.  
- **Role-Based Access** (e.g. “admin” vs. “user”) via Supabase policies.  
- **Magic Link** login support (optional).

### 🧾 Task CRUD Operations
- **Create** new tasks with title, description, due date, priority.  
- **Read** your task list, filter by status or due date, search by keywords.  
- **Update** task details inline or via a modal form.  
- **Delete** tasks with confirmation prompts.  
- **Bulk Actions**: mark multiple tasks complete / delete at once.

### 🌐 Real-Time Collaboration
- **Live Updates**: any change by one user appears instantly for all collaborators.  
- **Notifications**: in-app toasts when tasks are created, updated, or assigned to you.  
- **Comments & Attachments**: discuss tasks thread-style and attach files.

### 🎨 UI & Theming
- **Responsive Layout**: mobile-first design adapts across devices.  
- **Light & Dark Mode** toggle.  
- **Accessible Components**: built with Shadcn UI and following WAI-ARIA best practices.  
- **Iconography** via Lucide React.

### ⚙️ State & Data Management
- **React Context** for global auth state.  
- **Custom Hooks** (`useTasks`, `useAuth`) encapsulate Supabase logic.  
- **React Hook Form** + **Zod** for form state management and validation.

### 🛠️ Tooling & Quality
- **Vite**: lightning-fast dev server & build tool.  
- **ESLint** + **Prettier**: consistent code styling.  
- **Pre-commit Hooks** (Husky) to enforce linting/tests before commits.  
- **Vitest** (or Jest) ready for unit/integration tests.  

## Architecture

1. **Frontend (React + Vite)**  
   - Pages: Login, Signup, Dashboard, Task Detail, Profile, Leaderboard.  
   - Components: Navbar, TaskList, TaskCard, Modal, FormInputs, Avatar.  
   - State: Local component state + Context + Supabase subscriptions.

2. **Backend (Supabase)**  
   - **Database Tables**: `users`, `tasks`, `comments`, `ratings`, `attachments`.  
   - **Migrations**: SQL files in `supabase/migrations/` (timestamps like `20240516000000_create_ratings_table.sql`).  
   - **Storage Policies**: Supabase Storage for file attachments with Row-Level Security.  
   - **Realtime**: `ENABLE_REPLICATION` and `REALTIME` policies to broadcast changes.

3. **API Layer**  
   - Direct Supabase client calls—no separate REST server.  
   - Queries and mutations wrapped in custom hooks for reuse.

## Database Schema (Excerpt)

| Table       | Columns                                                | Notes                              |
|-------------|--------------------------------------------------------|------------------------------------|
| `users`     | id, email, created_at, profile_fields…                 | Supabase Auth integrated           |
| `tasks`     | id, title, description, status, priority, due_date     | RLS policies restrict by owner     |
| `comments`  | id, task_id, user_id, body, created_at                 | Foreign keys with cascading delete |
| `ratings`   | id, target_type, target_id, user_id, score, created_at | Polymorphic rating system          |
| `attachments`| id, message_id, url, uploaded_at                       | Stored in Supabase Storage         |

## API / Client Usage Example

```ts
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// src/hooks/useTasks.ts
import { supabase } from '../lib/supabaseClient';
export function useTasks() {
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });
    return { tasks: data, error };
  };
  // subscribe to real-time updates...
  return { fetchTasks, /* ... */ };
}

Environment Setup
Clone & Install

bash
Copy
Edit
git clone https://github.com/your-org/taskloop.git
cd taskloop
npm install
Configure Environment Variables
Create .env in project root:

ini
Copy
Edit
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
Initialize Supabase

In your Supabase dashboard, run each migration SQL from supabase/migrations/.

Configure Storage bucket and RLS policies as shown in supabase_storage_policies.sql.

Start Development

bash
Copy
Edit
npm run dev
Build for Production

bash
Copy
Edit
npm run build
Deployment
Vercel / Netlify / Cloudflare Pages supported via standard Vite settings.

Set the same VITE_SUPABASE_* env vars in your hosting dashboard.

Enable automatic deployments from your Git branch.

Testing
Ready to integrate tests with Vitest and React Testing Library.

Unit Tests: for utilities and hooks

Component Tests: for critical UI flows (login, task CRUD)

End-to-End: consider Cypress for user-flow validation

Contribution Guidelines
Fork the repo.

Branch: git checkout -b feature/your-feature.

Commit: follow Conventional Commits (e.g. feat: add dark mode toggle).

Push: git push origin feature/your-feature.

PR: open a Pull Request and request review.

Please run npm run lint and npm run test before submitting.

Roadmap
 Mobile-optimized PWA support

 Recurring tasks & reminders

 Collaborative boards & Kanban view

 Calendar integration (Google Calendar sync)

 Analytics & usage dashboard

Acknowledgements
Supabase — Auth, Database, Realtime

Vite — Development tooling

Tailwind CSS — Utility-first styling

Shadcn UI — Accessible React components

Zod — Type-safe validation

React Hook Form — Flexible form handling

Lucide Icons — Open-source icon library

