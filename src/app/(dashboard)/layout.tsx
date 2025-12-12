'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gray-50 w-full md:w-auto">
            {children}
          </main>
        </div>
        <Toaster />
      </AuthGuard>
    </AuthProvider>
  );
}
