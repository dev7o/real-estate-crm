"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { LEAD_SOURCE_LABELS } from "@/lib/constants";
import type { LeadSource } from "@prisma/client";

const COLORS = ["#334155", "#64748B", "#94A3B8", "#B8934A", "#A85327", "#2F7D6E"];

export function SourceChart({ data }: { data: { source: string; total: number }[] }) {
  const chartData = data.map((d) => ({
    name: LEAD_SOURCE_LABELS[d.source as LeadSource] ?? d.source,
    value: d.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #D3DBE6", fontSize: 12, direction: "rtl" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
