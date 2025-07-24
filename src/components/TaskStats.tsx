import React from 'react';
import { TaskStats as TaskStatsType } from '../types';
import { Target, CheckCircle, Clock, Zap } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <Target className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
          </div>
          <Clock className="h-8 w-8 text-orange-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Avg. Hammered</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalHammered}%</p>
          </div>
          <Zap className="h-8 w-8 text-amber-500" />
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="col-span-1 md:col-span-4 bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
          <span className="text-sm text-gray-600">{completionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};