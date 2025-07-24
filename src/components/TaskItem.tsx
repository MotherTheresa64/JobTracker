import React, { useState } from 'react';
import { Task } from '../types';
import { Hammer, Trash2, Edit3, Check, X, Calendar, Flag } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onHammer: (id: string, amount?: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdate,
  onDelete,
  onHammer,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    urgent: 'bg-red-100 text-red-800 border-red-300',
  };

  const priorityBorders = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-orange-500',
    urgent: 'border-l-red-500',
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
      });
      setIsEditing(false);
      toast.success('Task updated!');
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handleHammer = (amount: number) => {
    if (!task.completed) {
      onHammer(task.id, amount);
      toast.success(`Hammered ${amount}% progress!`, {
        icon: '🔨',
      });
    }
  };

  const handleToggleComplete = () => {
    const newCompleted = !task.completed;
    onUpdate(task.id, {
      completed: newCompleted,
      completedAt: newCompleted ? new Date() : undefined,
      hammered: newCompleted ? 100 : task.hammered,
    });
    toast.success(newCompleted ? 'Task completed!' : 'Task reopened!');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-md border-l-4 ${priorityBorders[task.priority]} ${task.completed ? 'opacity-75' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-lg font-semibold border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Description..."
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
            >
              <Check className="h-4 w-4" />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                <Flag className="h-3 w-3 inline mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{task.hammered}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ease-out ${
                  task.completed
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-amber-400 to-amber-600'
                }`}
                style={{ width: `${task.hammered}%` }}
              />
            </div>
          </div>

          {/* Hammer Buttons */}
          {!task.completed && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleHammer(5)}
                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                <Hammer className="h-4 w-4" />
                +5%
              </button>
              <button
                onClick={() => handleHammer(10)}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                <Hammer className="h-4 w-4" />
                +10%
              </button>
              <button
                onClick={() => handleHammer(25)}
                className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                <Hammer className="h-4 w-4" />
                +25%
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {formatDate(task.createdAt)}
              </div>
              {task.completedAt && (
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Completed {formatDate(task.completedAt)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  task.completed
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Check className="h-4 w-4" />
                {task.completed ? 'Reopen' : 'Complete'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    toast.success('Task deleted!');
                  }
                }}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};