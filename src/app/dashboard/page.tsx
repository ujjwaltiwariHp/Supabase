// FILE: src/app/page.tsx
import Link from 'next/link';
import Background from '@/components/ui/Background';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <Background />
      <div className="text-center max-w-2xl z-10">
        <h1 className="text-6xl md:text-7xl font-black mb-6 text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text">
          TaskFlow
        </h1>
        <p className="text-xl text-gray-600 mb-12 font-medium">
          Manage your tasks efficiently with our beautiful task management system.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}