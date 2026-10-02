"use client";

import { Bus, Map, Navigation, Ticket, History, User, HelpCircle, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  activeTab: "map" | "routes" | "trips" | "ticket" | "history";
  onTabChange: (tab: "map" | "routes" | "trips" | "ticket" | "history") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const navItems = [
    { id: "map", label: "Map Dashboard", icon: Map },
    { id: "routes", label: "Routes", icon: Navigation },
    { id: "trips", label: "Active Trips", icon: Bus },
    { id: "ticket", label: "Ticket", icon: Ticket },
    { id: "history", label: "History", icon: History },
  ] as const;

  return (
    <header
      className="sticky top-0 z-40 w-full px-4 sm:px-6 py-4  border-b shadow-xs backdrop-blur-md transition-colors"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-[1340px] mx-auto flex items-center justify-between px-2 sm:px-4">

        {/* Brand Logo */}
        <div
          onClick={() => onTabChange("map")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8.5 h-8.5 rounded-xl bg-black text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <Bus className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight" style={{ color: "var(--foreground)" }}>
                UrbanRide
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-black text-white">
                v2.0
              </span>
            </div>
            <p className="text-[10px] font-medium hidden sm:block leading-tight" style={{ color: "var(--foreground-muted)" }}>
              Smart City Transit Platform
            </p>
          </div>
        </div>

        {/* Navigation Bar (Desktop) */}
        <nav
          className="hidden md:flex items-center space-x-1 p-1 rounded-full border transition-colors"
          style={{
            background: "var(--surface-secondary)",
            borderColor: "var(--border)",
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-black text-white shadow-xs"
                    : ""
                }`}
                style={!isActive ? { color: "var(--foreground-muted)" } : {}}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions / Profile */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 border shadow-2xs cursor-pointer"
            style={{
              background: "var(--surface-secondary)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
            )}
          </button>

          {/* Bell */}
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
            style={{
              background: "var(--surface-secondary)",
              borderColor: "var(--border)",
              color: "var(--foreground-muted)",
            }}
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Help */}
          <button
            className="w-8 h-8 rounded-full hidden sm:flex items-center justify-center transition-all border"
            style={{
              background: "var(--surface-secondary)",
              borderColor: "var(--border)",
              color: "var(--foreground-muted)",
            }}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile */}
          <div
            className="flex items-center space-x-2 pl-2 border-l"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="w-7.5 h-7.5 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-gray-100/50">
              <User className="w-3.5 h-3.5" />
            </div>
            <span
              className="text-xs font-semibold hidden lg:inline-block"
              style={{ color: "var(--foreground)" }}
            >
              Mahasiswa
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
