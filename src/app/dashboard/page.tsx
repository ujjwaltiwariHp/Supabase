// FILE: src/app/dashboard/page.tsx - UPDATED

import Navbar from '@/components/ui/Navbar'; //
import Footer from '@/components/ui/Footer'; //
import Background from '@/components/ui/Background'; //
import TaskList from '@/components/tasks/TaskList'; // Import the new TaskList component

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar /> {/* */}
      <Background /> {/* */}

      {/* Main Section */}
      <main className="grow flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full">
        {/* Dashboard Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-4">Task Dashboard</h1>

        {/* TaskList component handles all task display, creation, filtering, and editing */}
        <div className="grow w-full">
          <TaskList />
        </div>
      </main>

      {/* Footer at bottom always */}
      <Footer /> {/* */}
    </div>
  );
}