import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { TaskStats as TaskStatsComponent } from './components/TaskStats';
import { Header } from './components/Header';
import { FilterSort } from './components/FilterSort';
import { v4 as uuidv4 } from 'uuid';
function App() {
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState('priority');
    const [filterBy, setFilterBy] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    // Load tasks from localStorage on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('taskforge-tasks');
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks).map((task) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
            }));
            setTasks(parsedTasks);
        }
    }, []);
    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('taskforge-tasks', JSON.stringify(tasks));
    }, [tasks]);
    const addTask = (taskData) => {
        const newTask = {
            ...taskData,
            id: uuidv4(),
            createdAt: new Date(),
            completed: false,
            hammered: 0,
        };
        setTasks(prev => [...prev, newTask]);
        setIsFormOpen(false);
    };
    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
    };
    const deleteTask = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };
    const hammerTask = (id, amount = 10) => {
        setTasks(prev => prev.map(task => {
            if (task.id === id && !task.completed) {
                const newHammered = Math.min(100, task.hammered + amount);
                const completed = newHammered >= 100;
                return {
                    ...task,
                    hammered: newHammered,
                    completed,
                    completedAt: completed ? new Date() : task.completedAt,
                };
            }
            return task;
        }));
    };
    const getPriorityWeight = (priority) => {
        switch (priority) {
            case 'urgent': return 4;
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 0;
        }
    };
    const sortedAndFilteredTasks = tasks
        .filter(task => {
        switch (filterBy) {
            case 'active': return !task.completed;
            case 'completed': return task.completed;
            default: return true;
        }
    })
        .sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
            case 'createdAt':
                return b.createdAt.getTime() - a.createdAt.getTime();
            case 'title':
                return a.title.localeCompare(b.title);
            case 'hammered':
                return b.hammered - a.hammered;
            default:
                return 0;
        }
    });
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        active: tasks.filter(t => !t.completed).length,
        totalHammered: Math.round(tasks.reduce((sum, task) => sum + task.hammered, 0) / tasks.length) || 0,
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-amber-50 to-orange-100", children: [_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [_jsx(Header, { onAddTask: () => setIsFormOpen(true) }), _jsx(TaskStatsComponent, { stats: stats }), _jsx(FilterSort, { sortBy: sortBy, setSortBy: setSortBy, filterBy: filterBy, setFilterBy: setFilterBy }), _jsx(TaskList, { tasks: sortedAndFilteredTasks, onUpdateTask: updateTask, onDeleteTask: deleteTask, onHammerTask: hammerTask }), isFormOpen && (_jsx(TaskForm, { onSubmit: addTask, onClose: () => setIsFormOpen(false) }))] }), _jsx(Toaster, { position: "top-right", toastOptions: {
                    duration: 3000,
                    style: {
                        background: '#f59e0b',
                        color: '#fff',
                    },
                } })] }));
}
export default App;
