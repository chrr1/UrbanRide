"use client";

import { useEffect } from "react";
import { X, LogIn, ArrowRight, Bus, Train } from "lucide-react";
import { RouteOption } from "@/data/mockData";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingRoute?: RouteOption | null;
  onQuickLogin: (route: RouteOption) => void;
  onGoToLogin: (route: RouteOption) => void;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  pendingRoute,
  onQuickLogin,
  onGoToLogin,
}: AuthPromptModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !pendingRoute) return null;

  const getVehicleIcon = (type: string) => {
    if (type === "train") {
      return <Train className="w-4 h-4 text-sky-500" />;
    }
    return <Bus className="w-4 h-4 text-emerald-500" />;
  };

  const getBadgeStyle = (badge: RouteOption["badge"]) => {
    switch (badge) {
      case "FASTEST":
        return "bg-black text-white dark:bg-white dark:text-black";
      case "RECOMMENDED":
        return "bg-[#ccff00] text-black";
      case "CHEAPEST":
        return "bg-amber-500 text-white";
      default:
        return "bg-neutral-800 text-white";
    }
  };

  const destinationName =
    pendingRoute.legs[pendingRoute.legs.length - 1]?.toName || "Tujuan";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-3xl p-6 shadow-2xl border transition-all animate-in zoom-in-95 duration-200"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer hover:opacity-75"
          style={{
            background: "var(--surface-secondary)",
            color: "var(--foreground-muted)",
          }}
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Title (Clean Monochromatic, No AI Slop / No Sparkles) */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
            <LogIn className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display tracking-tight leading-tight" style={{ color: "var(--foreground)" }}>
              Masuk untuk Memilih Rute
            </h3>
            <p className="text-xs mt-0.5 leading-normal" style={{ color: "var(--foreground-muted)" }}>
              Akses panduan navigasi & tiket digital
            </p>
          </div>
        </div>

        {/* Selected Route Preview Card */}
        <div
          className="p-3.5 rounded-2xl border mb-5 space-y-2.5 transition-colors"
          style={{
            background: "var(--surface-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center border"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {getVehicleIcon(pendingRoute.vehicle.type)}
              </div>
              <span className="font-bold text-xs" style={{ color: "var(--foreground)" }}>
                #{pendingRoute.vehicle.code}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(
                  pendingRoute.badge
                )}`}
              >
                {pendingRoute.badge}
              </span>
            </div>
            <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
              Rp {pendingRoute.fare.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="truncate max-w-[200px]" style={{ color: "var(--foreground-muted)" }}>
              Ke {destinationName}
            </span>
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
              {pendingRoute.totalDurationMinutes} min · {pendingRoute.stopsCount} stops
            </span>
          </div>
        </div>

        {/* Actions (Native UrbanRide styling, high-contrast, zero AI purple) */}
        <div className="space-y-2">
          {/* Primary CTA: Solid black/white button */}
          <button
            onClick={() => onGoToLogin(pendingRoute)}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
          >
            <span>Masuk ke Akun</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs font-medium transition cursor-pointer hover:underline"
            style={{ color: "var(--foreground-muted)" }}
          >
            Batal & Tetap Lihat Rute
          </button>
        </div>
      </div>
    </div>
  );
}
