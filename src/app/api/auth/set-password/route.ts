import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey!);

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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
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

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();

    if (userError) {
      return NextResponse.json(
        { success: false, message: 'Failed to find user' },
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

    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateUserError) {
      return NextResponse.json(
        { success: false, message: 'Failed to set password' },
        { status: 400 }
      );
    }

    const { error: updateProfileError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        is_password_set: true,
        password_created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateProfileError) {
      return NextResponse.json(
        { success: false, message: 'Failed to update user profile' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password set successfully',
        data: {
          userId: user.id,
          email: email.toLowerCase(),
          passwordSet: true,
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