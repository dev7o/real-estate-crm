"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ProjectRow {
  name: string;
  sold: number;
  reserved: number;
  available: number;
}

export function OccupancyChart({ data }: { data: ProjectRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barSize={22}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5B6472" }} axisLine={{ stroke: "#D3DBE6" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#5B6472" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #D3DBE6", fontSize: 12, direction: "rtl" }}
          cursor={{ fill: "#FAF9F6" }}
        />
        <Bar dataKey="sold" stackId="a" name="مباعة" fill="#8B93A0" radius={[0, 0, 0, 0]} />
        <Bar dataKey="reserved" stackId="a" name="محجوزة" fill="#B8802E" radius={[0, 0, 0, 0]} />
        <Bar dataKey="available" stackId="a" name="متاحة" fill="#2F7D4F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
