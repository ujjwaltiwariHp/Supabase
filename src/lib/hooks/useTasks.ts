// FILE: src/lib/hooks/useTasks.ts - CORRECTED
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from '@/lib/api';
import { getErrorMessage } from '@/utils/helpers';

// --- Types (Should be moved to src/types/task.ts later) ---
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskFilter = 'all' | 'completed' | 'pending';
export type PriorityFilter = 'all' | TaskPriority;
export type TaskSort = 'created_at_desc' | 'created_at_asc' | 'deadline_asc' | 'priority_desc';

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

interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  deadline?: string | null;
}

interface UpdateTaskData {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
  priority?: TaskPriority;
  deadline?: string | null;
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
};
// -----------------------------------------------------------

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and Sort State
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sort, setSort] = useState<TaskSort>('created_at_desc');

  const fetchTasksData = useCallback(async () => {
    // FIX: Add a small delay to allow the Supabase client to process cookies
    // set during login on the server and load the session before the API call.
    await new Promise(resolve => setTimeout(resolve, 50)); //

    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchTasks();
      // Ensure the fetched tasks match the structure, defaulting fields if necessary
      const fetchedTasks: Task[] = result.tasks.map((t: any) => ({
        ...t,
        priority: t.priority || 'low',
        deadline: t.deadline || null,
      }));
      setTasks(fetchedTasks);
    } catch (err) {
      setError(getErrorMessage(err));
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);


  // --- CRUD Operations ---

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      const result = await createTask(data.title, data.description, data.priority, data.deadline);
      const newTask = result.task as Task;
      setTasks(prev => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (err) {
      setError(getErrorMessage(err));
      return { success: false, error: getErrorMessage(err) };
    }
  };

  const handleUpdateTask = async (taskId: string, updates: UpdateTaskData) => {
    try {
      const result = await updateTask(taskId, updates);
      const updatedTask = result.task as Task;
      setTasks(prev => prev.map(t => (t.id === taskId ? updatedTask : t)));
      return { success: true, task: updatedTask };
    } catch (err) {
      setError(getErrorMessage(err));
      return { success: false, error: getErrorMessage(err) };
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      return { success: true };
    } catch (err) {
      setError(getErrorMessage(err));
      return { success: false, error: getErrorMessage(err) };
    }
  };

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    // Optimistic update
    setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, is_completed: isCompleted } : t))
    );
    try {
      await toggleTaskComplete(taskId, isCompleted);
    } catch (err) {
      // Rollback on failure
      setTasks(prev =>
          prev.map(t => (t.id === taskId ? { ...t, is_completed: !isCompleted } : t))
      );
      setError(getErrorMessage(err));
      return { success: false, error: getErrorMessage(err) };
    }
    return { success: true };
  };

  // --- Filtering and Sorting Logic ---

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    // 1. Filtering by Completion Status
    if (filter === 'completed') {
      result = result.filter(t => t.is_completed);
    } else if (filter === 'pending') {
      result = result.filter(t => !t.is_completed);
    }

    // 2. Filtering by Priority
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'deadline_asc':
          const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          // Put tasks without deadline at the end
          if (dateA === Infinity && dateB === Infinity) return 0;
          if (dateA === Infinity) return 1;
          if (dateB === Infinity) return -1;
          return dateA - dateB;
        case 'priority_desc':
          return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        case 'created_at_desc': // Default case
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [tasks, filter, priorityFilter, sort]);

  return {
    tasks: filteredAndSortedTasks,
    rawTasks: tasks,
    isLoading,
    error,
    refetchTasks: fetchTasksData,
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    sort,
    setSort,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleComplete,
  };
};