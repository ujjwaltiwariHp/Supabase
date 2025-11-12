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
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP token are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token,
      type: 'magiclink',
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const userId = data.user?.id;

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: 'Failed to update user profile' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        data: {
          userId,
          email: email.toLowerCase(),
          session: data.session,
          otpVerified: true,
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