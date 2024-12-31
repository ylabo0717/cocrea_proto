"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth/session";
import { Session } from "@/lib/auth/session";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);
    setIsLoading(false);
  }, []);
  
  return {
    isAdmin: session?.role === 'admin',
    isDeveloper: session?.role === 'developer' || session?.role === 'admin',
    userId: session?.userId,
    email: session?.email,
    role: session?.role,
    isLoading,
  };
}