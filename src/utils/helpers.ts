export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const formatError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.error) {
    return error.error;
  }

  return 'An unexpected error occurred';
};

export const getErrorMessage = (error: any): string => {
  const message = formatError(error);

  if (message.includes('Invalid email')) {
    return 'Please enter a valid email address';
  }

  if (message.includes('already registered')) {
    return 'This email is already registered';
  }

  if (message.includes('Invalid or expired OTP')) {
    return 'The OTP you entered is invalid or has expired';
  }

  if (message.includes('Invalid email or password')) {
    return 'Invalid email or password';
  }

  if (message.includes('weak')) {
    return 'Password is too weak. Use uppercase, lowercase, numbers, and special characters';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection';
  }

  return message;
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;

  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  return formatDate(past);
};

export const trimAndLower = (str: string): string => {
  return str.trim().toLowerCase();
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};