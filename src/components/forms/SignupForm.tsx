// FILE: src/components/forms/SignupForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup, verifyOtpApi, setPasswordApi } from '@/lib/api';
import { validateEmail, validateOtp, validatePassword, getErrorMessage } from '@/utils/helpers';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Mail, Lock, Code } from 'lucide-react'; // Import icons

type SignupStep = 'email' | 'otp' | 'password' | 'success';

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup(email);
      if (result.success) {
        setStep('otp');
      } else {
        setError(getErrorMessage(result));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateOtp(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtpApi(email, otp);
      if (result.success) {
        setStep('password');
      } else {
        setError(getErrorMessage(result));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      // Concatenate all validation errors into a single string for display
      setError(passwordValidation.errors.join('. '));
      return;
    }

    setIsLoading(true);
    try {
      const result = await setPasswordApi(email, password);
      if (result.success) {
        setStep('success');
        setShowModal(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(getErrorMessage(result));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        title="Account Created!"
        message="Your account has been created successfully. Redirecting to login..."
        type="success"
        onClose={() => {
          setShowModal(false);
          router.push('/login'); // Ensure redirect even if user closes the modal early
        }}
      />

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />} // Added icon
            error={error}
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Send OTP
          </Button>
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-purple-600 font-semibold hover:text-purple-700">
              Login here
            </a>
          </p>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
          <p className="text-gray-600 text-sm">We sent a 6-digit code to {email}</p>
          <Input
            label="OTP"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            icon={<Code className="w-5 h-5" />} // Added icon
            error={error}
            maxLength={6}
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Verify OTP
          </Button>
          <button
            type="button"
            onClick={() => {
              setStep('email');
              setError('');
            }}
            className="w-full text-purple-600 font-semibold hover:text-purple-700"
          >
            Back to Email
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Password</h2>
          <p className="text-gray-600 text-sm">Password must contain uppercase, lowercase, number, and special character</p>
          {/* General error displayed here, contains validation messages or API errors */}
          {error && (
            <p className="text-red-500 text-sm  pb-2">{error}</p>
          )}
          <Input
            label="Password"
            type="password" // Now includes the show/hide toggle from Input.tsx
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />} // Added icon
          />
          <Input
            label="Confirm Password"
            type="password" // Now includes the show/hide toggle from Input.tsx
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />} // Added icon
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Create Account
          </Button>
        </form>
      )}
    </>
  );
}