import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Background from '@/components/ui/Background';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />
      <Background />

      {/* Main Section */}
      <main className="grow flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full">
        {/* Dashboard Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-4">Dashboard</h1>

        <Card className="p-8 grow">
          <div className="space-y-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              Welcome back to TaskFlow!
            </h2>
            <p className="text-gray-600 text-center">
              This is your task management dashboard. You can start managing your tasks here.
            </p>

            {/* Centered Placeholder */}
            <div className="mt-8 p-6 border-2 border-purple-100 rounded-xl bg-purple-50 text-center">
              <p className="font-medium text-purple-700 text-lg">🕒 Task List coming soon...</p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer at bottom always */}
      <Footer />
    </div>
  );
}
