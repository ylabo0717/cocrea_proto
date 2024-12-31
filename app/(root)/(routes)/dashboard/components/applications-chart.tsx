"use client";

import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { Application } from "@/lib/types";
import { ChartXAxis, ChartYAxis } from "./chart-axes";

interface ApplicationsChartProps {
  applications: Application[];
}

export function ApplicationsChart({ applications }: ApplicationsChartProps) {
  const data = applications.map((app) => ({
    name: app.name,
    users: app.user_count,
  }));

  return (
    <Card className="p-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <ChartXAxis />
            <ChartYAxis />
            <Bar
              dataKey="users"
              fill="currentColor"
              className="fill-primary"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}