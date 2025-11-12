import Background from '@/components/ui/Background';
import Card from '@/components/ui/Card';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Background />
      <div className="w-full max-w-md">
        <Card className="p-8">
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}