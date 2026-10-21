"use client";

import { useEffect, useRef, useState } from "react";
import { Bus, Map, Ticket, History, User, Bell, Sun, Moon, LogIn, LogOut, MapPin, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  activeTab: "map" | "ticket" | "history";
  onTabChange: (tab: "map" | "ticket" | "history") => void;
}

// Contoh 1 notifikasi demo untuk tampilan
const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    icon: MapPin,
    iconColor: "#a3e635",
    title: "Bus 12A Hampir Tiba",
    body: "Bus 12A menuju Stasiun Kota akan tiba dalam ±3 menit di Halte Bundaran HI.",
    time: "Baru saja",
    read: false,
  },
];

// Komponen header navigasi atas aplikasi
export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const isDark = theme === "dark";

  // State dropdown notifikasi
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Tutup dropdown jika klik di luar area notifikasi
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "map", label: "Map Dashboard", icon: Map },
    { id: "ticket", label: "Ticket", icon: Ticket },
    { id: "history", label: "History", icon: History },
  ] as const;

  const handleLogout = () => {
    logout();
    if (activeTab === "ticket" || activeTab === "history") {
      onTabChange("map");
    }
  };

  return (
    <header
      className="sticky top-0 z-40 w-full px-3 sm:px-4 py-3 border-b shadow-xs backdrop-blur-md transition-colors"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-[1080px] mx-auto flex items-center justify-between px-1 sm:px-2 w-full">

        {/* Logo dan judul platform UrbanRide */}
        <div
          onClick={() => onTabChange("map")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <Bus className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight" style={{ color: "var(--foreground)" }}>
                UrbanRide
              </span>
            </div>
            <p className="text-[10px] font-medium hidden sm:block leading-tight" style={{ color: "var(--foreground-muted)" }}>
              Smart City Transit Platform
            </p>
          </div>
        </div>

        {/* Menu navigasi tab desktop (Dashboard Peta, Tiket, Riwayat) */}
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-black text-white shadow-xs"
                    : ""
                }`}
                style={!isActive ? { color: "var(--foreground-muted)" } : {}}
              >
                <Icon className="w-4 h-4" style={isActive ? { color: "var(--accent-cyber-lime)" } : {}} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bagian aksi kanan (ganti tema, notifikasi, bantuan, dan profil) */}
        <div className="flex items-center space-x-2">
          {/* Tombol toggle beralih antara mode terang dan mode gelap */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 border shadow-2xs cursor-pointer"
            style={{
              background: "var(--surface-secondary)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5" style={{ color: "var(--foreground-muted)" }} />
            )}
          </button>

          {/* Tombol notifikasi dengan dropdown panel */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              title="Notifikasi"
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all border active:scale-90 cursor-pointer"
              style={{
                background: notifOpen ? "var(--foreground)" : "var(--surface-secondary)",
                borderColor: "var(--border)",
                color: notifOpen ? "var(--background)" : "var(--foreground-muted)",
              }}
            >
              <Bell className="w-4.5 h-4.5" />
              {/* Badge unread count */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Panel dropdown notifikasi */}
            {notifOpen && (
              <div
                className="absolute right-0 top-11 w-80 sm:w-96 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                {/* Header panel notifikasi */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Notifikasi</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                      className="flex items-center space-x-1 text-[11px] font-semibold transition hover:opacity-75 cursor-pointer"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Tandai sudah dibaca</span>
                    </button>
                  )}
                </div>

                {/* Daftar notifikasi */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                          );
                        }}
                        className="w-full flex items-start space-x-3 px-4 py-3.5 text-left transition-colors hover:opacity-80 cursor-pointer border-b last:border-b-0"
                        style={{
                          background: notif.read ? "transparent" : "var(--surface-secondary)",
                          borderColor: "var(--border)",
                        }}
                      >
                        {/* Ikon notifikasi */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                        >
                          <Icon className="w-4 h-4" style={{ color: notif.iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold truncate" style={{ color: "var(--foreground)" }}>
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                            {notif.body}
                          </p>
                          <span className="text-[10px] font-semibold mt-1 block" style={{ color: "var(--foreground-muted)" }}>
                            {notif.time}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer panel */}
                <div
                  className="px-4 py-2.5 border-t text-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>Hanya menampilkan notifikasi terbaru</span>
                </div>
              </div>
            )}
          </div>



          {/* Status profil pengguna dan tombol login/logout */}
          {isLoggedIn ? (
            <div
              className="flex items-center space-x-2 pl-3 border-l"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-gray-100/50">
                <User className="w-4 h-4" />
              </div>
              <span
                className="text-sm font-semibold hidden lg:inline-block max-w-[110px] truncate"
                style={{ color: "var(--foreground)" }}
              >
                {user?.name || "Mahasiswa"}
              </span>
              <button
                onClick={handleLogout}
                title="Keluar / Logout"
                className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="pl-2.5 border-l" style={{ borderColor: "var(--border)" }}>
              <Link
                href="/login"
                title="Masuk / Daftar Akun"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                style={{
                  background: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
