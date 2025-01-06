"use client";

import { useState } from "react";
import { ApplicationsList } from "./applications-list";
import { CreateApplicationDialog } from "@/components/applications/create-application-dialog";
import { useSession } from "@/hooks/use-session";
import { Application, Content } from "@/lib/types";
import { fetchApplications, fetchRecentContents } from "../actions";

interface ApplicationsListClientProps {
  initialApplications: Application[];
  initialContents: Content[];
}

export function ApplicationsListClient({ 
  initialApplications,
  initialContents 
}: ApplicationsListClientProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [isLoading, setIsLoading] = useState(false);
  const { isDeveloper, isLoading: isLoadingSession } = useSession();

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [apps, contents] = await Promise.all([
        fetchApplications(),
        fetchRecentContents()
      ]);
      setApplications(apps);
    } catch (error) {
      console.error('Failed to refresh applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isLoadingSession && isDeveloper && (
        <div className="flex justify-end mb-4">
          <CreateApplicationDialog onSuccess={handleRefresh} />
        </div>
      )}

      <ApplicationsList 
        applications={applications}
        isLoading={isLoading}
        onUpdate={handleRefresh}
      />
    </div>
  );
}