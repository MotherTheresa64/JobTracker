import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Hammer } from 'lucide-react';
export const TaskForm = ({ onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onSubmit({
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
            });
            setTitle('');
            setDescription('');
            setPriority('medium');
        }
    };
    const priorityColors = {
        low: 'bg-green-100 text-green-800 border-green-300',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        high: 'bg-orange-100 text-orange-800 border-orange-300',
        urgent: 'bg-red-100 text-red-800 border-red-300',
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-md shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Hammer, { className: "h-6 w-6 text-amber-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Forge New Task" })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Task Title *" }), _jsx("input", { type: "text", id: "title", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500", placeholder: "What needs to be hammered out?", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { id: "description", value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500", placeholder: "Additional details..." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority Level" }), _jsxs("select", { id: "priority", value: priority, onChange: (e) => setPriority(e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500", children: [_jsx("option", { value: "low", children: "Low Priority" }), _jsx("option", { value: "medium", children: "Medium Priority" }), _jsx("option", { value: "high", children: "High Priority" }), _jsx("option", { value: "urgent", children: "Urgent" })] }), _jsx("div", { className: "mt-2", children: _jsxs("span", { className: `inline-block px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[priority]}`, children: [priority.charAt(0).toUpperCase() + priority.slice(1), " Priority"] }) })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "submit", className: "flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md font-medium transition-colors", children: "Forge Task" }), _jsx("button", { type: "button", onClick: onClose, className: "flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors", children: "Cancel" })] })] })] }) }));
};
