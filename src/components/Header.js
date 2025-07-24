import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Hammer, Plus } from 'lucide-react';
export const Header = ({ onAddTask }) => {
    return (_jsxs("header", { className: "text-center mb-8", children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-amber-500 rounded-full shadow-lg", children: _jsx(Hammer, { className: "h-8 w-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold text-amber-800", children: "Task Forge" })] }), _jsx("p", { className: "text-amber-700 text-lg mb-6", children: "Hammer away your tasks, one strike at a time" }), _jsxs("button", { onClick: onAddTask, className: "inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200", children: [_jsx(Plus, { className: "h-5 w-5" }), "Forge New Task"] })] }));
};
