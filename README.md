# 🔨 Task Forge

**Hammer away your tasks, one strike at a time**

Task Forge is a modern, interactive todo application built around the concept of "hammering" away at your tasks. Each task has a progress bar that you can incrementally fill by "hammering" it with different amounts of progress until it's complete.

## ✨ Features

### 🎯 Core Functionality
- **Create Tasks**: Add new tasks with titles, descriptions, and priority levels
- **Hammer Progress**: Incrementally complete tasks by "hammering" them with +5%, +10%, or +25% progress
- **Progress Visualization**: Beautiful progress bars show your advancement on each task
- **Priority System**: Four priority levels (Low, Medium, High, Urgent) with color-coded indicators
- **Task Management**: Edit, complete, reopen, and delete tasks

### 📊 Organization & Tracking
- **Smart Sorting**: Sort tasks by priority, creation date, title, or progress level
- **Filtering Options**: View all tasks, active tasks only, or completed tasks
- **Statistics Dashboard**: Track total tasks, completed tasks, active tasks, and average progress
- **Overall Progress**: Visual representation of your complete task completion rate

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with a warm amber/orange color scheme
- **Smooth Animations**: Satisfying progress bar animations and hover effects
- **Toast Notifications**: Immediate feedback for all actions
- **Persistent Storage**: Tasks are saved to localStorage and persist between sessions
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-forge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Vite** - Build tool and development server

## 📱 Usage

### Creating a Task
1. Click the "Forge New Task" button
2. Enter a task title (required)
3. Add an optional description
4. Select a priority level
5. Click "Forge Task" to create

### Hammering Tasks
- Use the hammer buttons (+5%, +10%, +25%) to make progress on active tasks
- Watch the progress bar fill up as you hammer away
- Tasks automatically complete when they reach 100%

### Managing Tasks
- **Edit**: Click the edit button to modify task details
- **Complete/Reopen**: Toggle task completion status
- **Delete**: Remove tasks you no longer need (with confirmation)

### Organization
- **Filter**: View all, active, or completed tasks
- **Sort**: Organize by priority, date created, title, or progress level
- **Stats**: Monitor your productivity with the statistics dashboard

## 🎨 Theme

Task Forge uses a warm, craftsmanship-inspired design:
- **Primary Colors**: Amber and orange tones representing the forge and hammer
- **Typography**: Clean, modern fonts for excellent readability
- **Icons**: Hammer and tool-themed icons throughout the interface
- **Animations**: Smooth transitions and satisfying progress animations

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with branding
│   ├── TaskStats.tsx   # Statistics dashboard
│   ├── FilterSort.tsx  # Filtering and sorting controls
│   ├── TaskForm.tsx    # Task creation form
│   ├── TaskList.tsx    # Task list container
│   └── TaskItem.tsx    # Individual task component
├── types/              # TypeScript type definitions
│   └── index.ts        # Task and app types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and animations
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 🔮 Future Enhancements

- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Task templates
- [ ] Export/import functionality
- [ ] Dark mode theme
- [ ] Keyboard shortcuts
- [ ] Task time tracking
- [ ] Collaboration features

---

**Happy hammering!** 🔨✨
