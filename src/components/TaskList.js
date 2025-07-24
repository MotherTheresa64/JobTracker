import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TaskItem } from './TaskItem';
export const TaskList = ({ tasks, onUpdateTask, onDeleteTask, onHammerTask, }) => {
    if (tasks.length === 0) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD28" }), _jsx("h3", { className: "text-xl font-semibold text-gray-600 mb-2", children: "No tasks to forge yet!" }), _jsx("p", { className: "text-gray-500", children: "Create your first task and start hammering away." })] }));
    }
    return (_jsx("div", { className: "space-y-4", children: tasks.map((task) => (_jsx(TaskItem, { task: task, onUpdate: onUpdateTask, onDelete: onDeleteTask, onHammer: onHammerTask }, task.id))) }));
};
