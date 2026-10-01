"use client";

import { Bus, Map, Navigation, Ticket, History, User, HelpCircle, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  activeTab: "map" | "routes" | "trips" | "ticket" | "history";
  onTabChange: (tab: "map" | "routes" | "trips" | "ticket" | "history") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: "map", label: "Map Dashboard", icon: Map },
    { id: "routes", label: "Routes", icon: Navigation },
    { id: "trips", label: "Active Trips", icon: Bus },
    { id: "ticket", label: "Ticket", icon: Ticket },
    { id: "history", label: "History", icon: History },
  ] as const;

  const isDark = theme === "dark";

  return (
    <header
      className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 border-b shadow-xs"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand Logo */}
        <div
          onClick={() => onTabChange("map")}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <Bus className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span
                className="font-extrabold text-xl tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                UrbanRide
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-black text-white">
                v2.0
              </span>
            </div>
            <p
              className="text-[11px] font-medium hidden sm:block"
              style={{ color: "var(--foreground-muted)" }}
            >
              Smart City Transit Platform
            </p>
          </div>
        </div>

        {/* Navigation Bar (Desktop) */}
        <nav
          className="hidden md:flex items-center space-x-1 p-1.5 rounded-full border"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", borderColor: "var(--border)" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : ""
                }`}
                style={
                  !isActive
                    ? { color: "var(--foreground-muted)" }
                    : {}
                }
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
         

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 group overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
              border: `1px solid var(--border)`,
            }}
          >
            <span
              className="absolute inset-0 rounded-full transition-opacity duration-300"
              style={{
                background: isDark
                  ? "radial-gradient(circle at 60% 40%, rgba(250,204,21,0.15), transparent 70%)"
                  : "radial-gradient(circle at 40% 60%, rgba(100,116,139,0.12), transparent 70%)",
                opacity: 1,
              }}
            />
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 relative z-10 transition-transform group-hover:rotate-12" />
            ) : (
              <Moon className="w-4 h-4 relative z-10 transition-transform group-hover:-rotate-12" style={{ color: "var(--foreground-muted)" }} />
            )}
          </button>

          {/* Bell */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ color: "var(--foreground-muted)" }}
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Help - Desktop */}
          <button
            className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center transition-all"
            style={{ color: "var(--foreground-muted)" }}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Avatar */}
          <div
            className="flex items-center space-x-2 pl-2 border-l"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-gray-100">
              <User className="w-4 h-4" />
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
