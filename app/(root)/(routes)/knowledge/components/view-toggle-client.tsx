"use client";

import { useState } from "react";
import { ViewToggle } from "@/components/view-toggle";

export function ViewToggleClient() {
  const [view, setView] = useState<"grid" | "table">("grid");

  return (
    <ViewToggle view={view} onViewChange={setView} />
  );
}