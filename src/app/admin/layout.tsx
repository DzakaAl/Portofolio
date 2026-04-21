"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto min-w-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
