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

    const { data, error: getUserError } = await supabase.auth.admin.listUsers();

    if (getUserError) {
      return NextResponse.json(
        { success: false, message: 'Failed to process request' },
        { status: 400 }
      );
    }

    const user = data?.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: 'If email exists, password reset link has been sent',
        },
        { status: 200 }
      );
    }

    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
      },
    });

    if (resetError) {
      return NextResponse.json(
        { success: false, message: 'Failed to send password reset email' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If email exists, password reset link has been sent',
        data: {
          email: email.toLowerCase(),
          resetSent: true,
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