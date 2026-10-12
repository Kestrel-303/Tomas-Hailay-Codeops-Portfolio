"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Same summary as the revenue chart, plotting the order count instead.
export default function OrdersChart({ days }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={days} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-muted)" }} interval="preserveStartEnd" />
          {/* Whole orders only: a tick at 2.5 orders would be meaningless. */}
          <YAxis allowDecimals={false} width={40} tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
          <Tooltip formatter={(value) => [`${value} ${value === 1 ? "order" : "orders"}`, "Orders"]} />
          <Line type="monotone" dataKey="orders" name="Orders" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
