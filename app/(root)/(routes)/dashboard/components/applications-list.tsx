"use client";

import { Application } from "@/lib/types";
import { ProjectCard } from "./project-card";

interface ApplicationsListProps {
  applications: Application[];
  isLoading: boolean;
}

export function ApplicationsList({ applications, isLoading }: ApplicationsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[200px] bg-card animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((app) => (
        <ProjectCard key={app.id} project={app} />
      ))}
    </div>
  );
}