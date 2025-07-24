export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  hammered: number; // Progress percentage (0-100)
}

export type SortBy = 'priority' | 'createdAt' | 'title' | 'hammered';
export type FilterBy = 'all' | 'active' | 'completed';

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  totalHammered: number;
}