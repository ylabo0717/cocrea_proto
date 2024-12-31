"use client";

import { XAxis, YAxis } from "recharts";

export function ChartXAxis() {
  return (
    <XAxis
      dataKey="name"
      stroke="#888888"
      fontSize={12}
      tickLine={false}
      axisLine={false}
    />
  );
}

export function ChartYAxis() {
  return (
    <YAxis
      stroke="#888888"
      fontSize={12}
      tickLine={false}
      axisLine={false}
      tickFormatter={(value) => `${value}`}
    />
  );
}