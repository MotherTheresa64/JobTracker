import React from 'react';
import { Hammer, Plus } from 'lucide-react';

interface HeaderProps {
  onAddTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-amber-500 rounded-full shadow-lg">
          <Hammer className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-amber-800">Task Forge</h1>
      </div>
      
      <p className="text-amber-700 text-lg mb-6">
        Hammer away your tasks, one strike at a time
      </p>
      
      <button
        onClick={onAddTask}
        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <Plus className="h-5 w-5" />
        Forge New Task
      </button>
    </header>
  );
};