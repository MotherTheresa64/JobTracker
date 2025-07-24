import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onHammerTask: (id: string, amount?: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onHammerTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔨</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks to forge yet!</h3>
        <p className="text-gray-500">Create your first task and start hammering away.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          onHammer={onHammerTask}
        />
      ))}
    </div>
  );
};