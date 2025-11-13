// FILE: src/components/forms/LoginForm.tsx - FINAL FIX
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
// The 'supabase' import is no longer needed here as we rely on middleware for session verification.
import { validateEmail, getErrorMessage } from '@/utils/helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
     if (result.success) {

        router.push('/dashboard');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Login</h2>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-5 h-5" />}
        error={emailError}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-5 h-5" />}
      />
      {error && (
        <p className="text-red-500 text-sm mt-2 pb-2 text-center">{error}</p>
      )}
      <Button type="submit" isLoading={isLoading} className="w-full">
        Login
      </Button>
      <div className="flex justify-between text-sm">
        <a href="/signup" className="text-purple-600 font-semibold hover:text-purple-700">
          Create account
        </a>
        <a href="/forgot-password" className="text-purple-600 font-semibold hover:text-purple-700">
          Forgot password?
        </a>
      </div>
    </form>
  );
}