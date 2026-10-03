"use client";

import { Route, MapPin, Bus, GitBranch } from "lucide-react";

export default function QuickStatsBar() {
  const stats = [
    { label: "Routes Active", value: "12+", icon: Route, accentColor: "var(--accent-cyber-lime)" },
    { label: "Stations & Hubs", value: "38", icon: MapPin, accentColor: "var(--foreground-muted)" },
    { label: "Live Vehicles", value: "24", icon: Bus, accentColor: "var(--foreground-muted)" },
    { label: "Transit Lines", value: "8", icon: GitBranch, accentColor: "var(--foreground-muted)" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full mb-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-2xl border shadow-xs transition-all"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="p-2.5 rounded-xl border shrink-0"
              style={{
                background: "var(--surface-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: item.accentColor }} />
            </div>
            <div className="truncate">
              <span
                className="text-xl sm:text-2xl font-bold tracking-tight block leading-none"
                style={{ color: "var(--foreground)" }}
              >
                {item.value}
              </span>
              <span
                className="text-xs font-bold mt-1 block truncate"
                style={{ color: "var(--foreground-muted)" }}
              >
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
