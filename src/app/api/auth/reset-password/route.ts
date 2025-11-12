import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain special character' };
  }
  return { valid: true };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, token, email } = body;

    if (!password || (!token && !email)) {
      return NextResponse.json(
        { success: false, message: 'Password and token/email are required' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.error },
        { status: 400 }
      );
    }

    let userId: string | undefined;

    if (email) {
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

      if (userError) {
        return NextResponse.json(
          { success: false, message: 'Failed to process request' },
          { status: 400 }
        );
      }

      const user = userData?.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      userId = user.id;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unable to identify user' },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (updateError) {
      return NextResponse.json(
        { success: false, message: 'Failed to reset password' },
        { status: 400 }
      );
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        password_created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      return NextResponse.json(
        { success: false, message: 'Failed to update user profile' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully',
        data: {
          userId,
          passwordReset: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}