"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-utils";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}