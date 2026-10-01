"use client";

import { Map, Navigation, Bus, Ticket, History } from "lucide-react";

interface BottomNavProps {
  activeTab: "map" | "routes" | "trips" | "ticket" | "history";
  onTabChange: (tab: "map" | "routes" | "trips" | "ticket" | "history") => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavProps) {
  const items = [
    { id: "map", label: "Map", icon: Map },
    { id: "routes", label: "Routes", icon: Navigation },
    { id: "trips", label: "Trips", icon: Bus },
    { id: "ticket", label: "Ticket", icon: Ticket },
    { id: "history", label: "History", icon: History },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
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
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : ""}`} />
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
