import { supabase } from './supabaseClient';

interface SignupResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

interface OtpVerifyResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

interface SetPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: { session: any };
  error?: string;
}

export const signupWithEmail = async (email: string): Promise<SignupResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, message: 'Failed to send OTP', error: error.message };
    }

    return { success: true, message: 'OTP sent to your email', data };
  } catch (err: any) {
    return { success: false, message: 'Error during signup', error: err.message };
  }
};

export const verifyOtp = async (email: string, token: string): Promise<OtpVerifyResponse> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { success: false, message: 'Invalid or expired OTP', error: error.message };
    }

    return { success: true, message: 'OTP verified successfully', data };
  } catch (err: any) {
    return { success: false, message: 'Error verifying OTP', error: err.message };
  }
};

export const setPassword = async (email: string, password: string): Promise<SetPasswordResponse> => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, message: 'Failed to set password', error: error.message };
    }

    return { success: true, message: 'Password set successfully', data };
  } catch (err: any) {
    return { success: false, message: 'Error setting password', error: err.message };
  }
};

export const loginWithEmailPassword = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: 'Invalid email or password', error: error.message };
    }

    return { success: true, message: 'Logged in successfully', data: { session: data.session } };
  } catch (err: any) {
    return { success: false, message: 'Error during login', error: err.message };
  }
};

export const forgotPassword = async (email: string): Promise<SignupResponse> => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { success: false, message: 'Failed to send reset email', error: error.message };
    }

    return { success: true, message: 'Password reset email sent', data };
  } catch (err: any) {
    return { success: false, message: 'Error during password reset', error: err.message };
  }
};

export const resetPassword = async (password: string): Promise<SetPasswordResponse> => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, message: 'Failed to reset password', error: error.message };
    }

    return { success: true, message: 'Password reset successfully', data };
  } catch (err: any) {
    return { success: false, message: 'Error resetting password', error: err.message };
  }
};

export const logout = async (): Promise<SignupResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: 'Failed to logout', error: error.message };
    }

    return { success: true, message: 'Logged out successfully' };
  } catch (err: any) {
    return { success: false, message: 'Error during logout', error: err.message };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return { success: false, session: null, error: error.message };
    }

    return { success: true, session };
  } catch (err: any) {
    return { success: false, session: null, error: err.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { success: false, user: null, error: error.message };
    }

    return { success: true, user };
  } catch (err: any) {
    return { success: false, user: null, error: err.message };
  }
};