"use client";

import { Map, Ticket, History } from "lucide-react";

interface BottomNavProps {
  activeTab: "map" | "ticket" | "history";
  onTabChange: (tab: "map" | "ticket" | "history") => void;
}

// Komponen bilah navigasi bawah untuk tampilan layar mobile
export default function BottomNavigation({ activeTab, onTabChange }: BottomNavProps) {
  const items = [
    { id: "map", label: "Map", icon: Map },
    { id: "ticket", label: "Ticket", icon: Ticket },
    { id: "history", label: "History", icon: History },
  ] as const;

  // Kontainer bilah navigasi melayang di bawah layar mobile
  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div
        className="flex items-center justify-around py-2.5 px-3 rounded-2xl shadow-2xl backdrop-blur-md border"
        style={{
          background: "var(--panel-bg)",
          borderColor: "var(--border)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            // Tombol tab navigasi (Peta, Tiket, Riwayat)
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? "scale-105" : ""
              }`}
              style={{ color: isActive ? "var(--foreground)" : "var(--foreground-muted)" }}
            >
              <div
                className={`p-1.5 rounded-full ${isActive ? "bg-black" : "bg-transparent"}`}
              >
                <Icon className="w-5 h-5" style={isActive ? { color: "var(--accent-cyber-lime)" } : {}} />
              </div>
              <span
                className={`text-[10px] tracking-tight ${isActive ? "font-bold" : "font-medium"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
