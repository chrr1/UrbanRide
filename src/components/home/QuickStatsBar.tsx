"use client";

// Baris statistik cepat yang menampilkan data ringkasan jaringan transportasi
import { Route, MapPin, Bus, GitBranch } from "lucide-react";

export default function QuickStatsBar() {
  // Data statistik: jumlah rute, stasiun, kendaraan, dan jalur transit
  const stats = [
    { label: "Routes Active",  value: "12+", icon: Route,     accentColor: "var(--accent-cyber-lime)" },
    { label: "Stations & Hubs", value: "38", icon: MapPin,    accentColor: "var(--accent-cyber-cyan)" },
    { label: "Live Vehicles",  value: "24",  icon: Bus,        accentColor: "#f59e0b" },
    { label: "Transit Lines",  value: "8",   icon: GitBranch,  accentColor: "#a78bfa" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full mb-2.5 sm:mb-3">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center space-x-3 p-2.5 sm:p-3 rounded-2xl border shadow-2xs transition-all"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="p-2 rounded-xl border shrink-0"
              style={{
                background: "var(--surface-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <Icon className="w-4 h-4" style={{ color: item.accentColor }} />
            </div>
            <div className="truncate">
              <span
                className="font-display text-lg sm:text-xl font-bold tracking-tight block leading-none"
                style={{ color: "var(--foreground)" }}
              >
                {item.value}
              </span>
              <span
                className="text-[11px] font-bold mt-0.5 block truncate"
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
