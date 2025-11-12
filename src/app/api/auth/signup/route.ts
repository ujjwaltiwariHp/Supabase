import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      email_confirm: false,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    const userId = data.user?.id;

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: userId,
          email: email.toLowerCase(),
          is_password_set: false,
        },
      ]);

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, message: 'Failed to create user profile' },
        { status: 400 }
      );
    }

    const { error: otpError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase(),
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-otp?email=${encodeURIComponent(email.toLowerCase())}`,
      },
    });

    if (otpError) {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent to your email',
        data: {
          email: email.toLowerCase(),
          userId,
          otpSent: true,
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