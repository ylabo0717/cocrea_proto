"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth/session";
import { Session } from "@/lib/auth/session";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);
  
  return {
    isDeveloper: session?.role === 'developer',
    userId: session?.userId,
    email: session?.email,
    role: session?.role,
    isLoading: session === null,
  };
}