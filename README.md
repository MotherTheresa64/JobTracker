# 🎯 Job Tracker 2025

A modern, mobile-responsive Kanban-style web app for tracking your job applications with smooth drag-and-drop interactions, filterable mobile view, and real-time UI feedback.

## 🚀 Features

- 🧩 **Drag & Drop**: Smooth and animated drag-and-drop interface powered by `@dnd-kit`.
- 📱 **Mobile Optimized**: Mobile users can filter by column to reduce scroll clutter.
- 🧭 **Navbar with Auth**: Responsive, modern navbar showing user login state.
- 🎨 **Modern Design**: Gradient columns, hover animations, icons, and sleek dark theme.
- 💬 **Toast Feedback**: Instant notifications on job actions (add, edit, delete, move).
- 📝 **Inline & Modal Editing**: Update job info from the board itself.
- 🔐 **Authentication**: Firebase Auth handles login/signup/logout.
- ☁️ **Firestore Backend**: Firebase Firestore stores and syncs job data in real time.

## 🧱 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Drag/Drop**: `@dnd-kit/core`
- **Auth & DB**: Firebase (Authentication + Firestore)
- **UI Enhancements**: `lucide-react`, `react-hot-toast`, custom transitions

## 📁 Project Structure

```bash
jobtracker-pro/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── DroppableColumn.tsx
│   │   ├── JobCard.tsx
│   │   ├── DragDropContext.tsx
│   │   ├── DashboardStats.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── JobContext.tsx
│   ├── hooks/
│   │   ├── useAuthContext.ts
│   │   ├── useJobModal.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css / global.css
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
