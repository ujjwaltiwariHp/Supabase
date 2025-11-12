import Background from '@/components/ui/Background';
import Card from '@/components/ui/Card';
import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Background />
      <div className="w-full max-w-md">
        <Card className="p-8">
          <SignupForm />
        </Card>
      </div>
    </div>
  );
}
