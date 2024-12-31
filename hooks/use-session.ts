"use client";

import { getSession } from "@/lib/auth/session";

export function useSession() {
  const session = getSession();
  
  return {
    isDeveloper: session?.role === 'developer',
    userId: session?.userId,
    email: session?.email,
    role: session?.role,
  };
}