export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

export type FilterType = 'all' | 'active' | 'completed' | 'overdue';
export type SortType = 'date' | 'priority' | 'title';