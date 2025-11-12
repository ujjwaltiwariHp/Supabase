// FILE: src/app/api/auth/verify-otp/route.ts - COMPLETE FIX
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

    // Verify the 6-digit OTP code
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email: email.toLowerCase(),
      token: token,
      type: 'email', // Changed from 'magiclink' to 'email'
    });

    if (error) {
      console.error('OTP verification error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const userId = data.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Create or update user profile
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id: userId,
        email: email.toLowerCase(),
        is_password_set: false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Profile error:', profileError);
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
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}