"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth/session";
import { Session } from "@/lib/auth/session";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = () => {
      try {
        const currentSession = getSession();
        setSession(currentSession);
      } catch (error) {
        console.error('Failed to load session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // セッションの変更を監視
    const interval = setInterval(loadSession, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const isDeveloper = session?.role === 'developer' || session?.role === 'admin';
  const isAdmin = session?.role === 'admin';
  const userId = session?.userId;
  const email = session?.email;
  const role = session?.role;

  return {
    isAdmin,
    isDeveloper,
    userId,
    email,
    role,
    isLoading,
  };
}