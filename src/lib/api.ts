import { supabase } from './supabaseClient';

interface FetchOptions extends RequestInit {
  body?: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const getAuthToken = async (): Promise<string | null> => {
  let { data: { session } } = await supabase.auth.getSession();

  // If no session is immediately available (due to client-side race condition),
  // force a refresh to ensure the latest token from cookies is loaded.
  if (!session?.access_token) {
    const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
    session = refreshedSession;
  }

  return session?.access_token || null;
};

export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  options?: Omit<FetchOptions, 'method' | 'body'>,
  requiresAuth: boolean = false
): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (requiresAuth) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: FetchOptions = {
      method,
      headers,
      ...options,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error.message || 'API call failed');
  }
};

// Authentication API calls

export const signup = async (email: string) => {
  return apiCall('/api/auth/signup', 'POST', { email });
};

export const verifyOtpApi = async (email: string, token: string) => {
  return apiCall('/api/auth/verify-otp', 'POST', { email, token });
};

export const setPasswordApi = async (email: string, password: string) => {
  return apiCall('/api/auth/set-password', 'POST', { email, password });
};

export const login = async (email: string, password: string) => {
  return apiCall('/api/auth/login', 'POST', { email, password });
};

export const forgotPasswordApi = async (email: string) => {
  return apiCall('/api/auth/forgot-password', 'POST', { email });
};

export const resetPasswordApi = async (password: string) => {
  return apiCall('/api/auth/reset-password', 'POST', { password });
};

export const logoutApi = async () => {
  return apiCall('/api/auth/logout', 'POST');
};

//tasks api calls

export const fetchTasks = async () => {
  return apiCall('/api/tasks', 'GET', undefined, undefined, true);
};

export const fetchTaskById = async (id: string) => {
  return apiCall(`/api/tasks/${id}`, 'GET', undefined, undefined, true);
};

export const createTask = async (
  title: string,
  description?: string,
  priority: 'low' | 'medium' | 'high' = 'low',
  deadline?: string | null
) => {
  return apiCall('/api/tasks', 'POST', { title, description, priority, deadline }, undefined, true);
};

export const updateTask = async (
  id: string,
  updates: {
    title?: string;
    description?: string | null;
    is_completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    deadline?: string | null;
  }
) => {
  return apiCall(`/api/tasks/${id}`, 'PUT', updates, undefined, true);
};


export const deleteTask = async (id: string) => {
  return apiCall(`/api/tasks/${id}`, 'DELETE', undefined, undefined, true);
};

export const toggleTaskComplete = async (id: string, isCompleted: boolean) => {
  return apiCall(`/api/tasks/${id}`, 'PUT', { is_completed: isCompleted }, undefined, true);
};