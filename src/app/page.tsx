import Link from 'next/link';
import Background from '@/components/ui/Background';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Background />
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your tasks efficiently with our beautiful task management system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}