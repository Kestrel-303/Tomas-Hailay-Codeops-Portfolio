"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatETB, formatETBCompact } from "../../../lib/money";

// Receives the 14-row daily summary only. The orders behind it never reach the browser.
export default function RevenueChart({ days }) {
  return (
    // ResponsiveContainer measures its parent, and a parent with no height measures as 0, so
    // the chart would collapse (or jump when it finally sizes). A fixed-height box reserves the
    // space in the server HTML, before any chart JavaScript runs.
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={days} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-muted)" }} interval="preserveStartEnd" />
          <YAxis
            tickFormatter={formatETBCompact}
            width={72}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            allowDecimals={false}
          />
          <Tooltip formatter={(value) => [formatETB(value), "Revenue"]} cursor={{ fill: "var(--surface-hover)" }} />
          <Bar dataKey="revenue" name="Revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
