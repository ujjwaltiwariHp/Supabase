export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: TaskPriority;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskFilter = 'all' | 'completed' | 'pending';
export type PriorityFilter = 'all' | TaskPriority;