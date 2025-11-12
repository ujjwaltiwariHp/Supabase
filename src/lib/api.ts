interface FetchOptions extends RequestInit {
  body?: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

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
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error.message || 'API call failed');
  }
};

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

export const fetchTasks = async () => {
  return apiCall('/api/tasks', 'GET');
};

export const createTask = async (title: string, description?: string) => {
  return apiCall('/api/tasks', 'POST', { title, description });
};

export const updateTask = async (id: string, title?: string, description?: string, isCompleted?: boolean) => {
  return apiCall(`/api/tasks/${id}`, 'PUT', { title, description, isCompleted });
};

export const deleteTask = async (id: string) => {
  return apiCall(`/api/tasks/${id}`, 'DELETE');
};