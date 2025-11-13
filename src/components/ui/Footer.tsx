export default function Footer() {
  return (
    <footer className="bg-white border-t border-purple-100 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 TaskFlow. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="text-purple-500 hover:text-purple-600">Privacy</a>
            <a href="#" className="text-purple-500 hover:text-purple-600">Terms</a>
            <a href="#" className="text-purple-500 hover:text-purple-600">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
