// FILE: src/app/layout.tsx
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow - Task Management',
  description: 'Manage your tasks efficiently with TaskFlow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        {children}
      </body>
    </html>
  );
}