"use client";

import { CheckCircle2, Clock, MapPin, Sparkles, History, ArrowRight, ShieldCheck, Bus, Train, X } from "lucide-react";
import { RouteOption } from "@/data/mockData";

interface TripCompletedModalProps {
  isOpen: boolean;
  route: RouteOption;
  onClose: () => void;
  onViewHistory: () => void;
}

export default function TripCompletedModal({
  isOpen,
  route,
  onClose,
  onViewHistory,
}: TripCompletedModalProps) {
  if (!isOpen) return null;

  const originName = route.legs[0]?.fromName || "Sudirman Hub";
  const destName = route.stops[route.stops.length - 1]?.name || "University Station";
  const formattedFare = `Rp ${route.fare.toLocaleString("id-ID")}`;
  const VehicleIcon = route.vehicle.type === "train" ? Train : Bus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-5 animate-scaleUp transition-all"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Top Bar: Transit Code & Close Button */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-xs">
              <VehicleIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold" style={{ color: "var(--foreground)" }}>
                #{route.vehicle.code}
              </span>
              <span className="text-[11px] block" style={{ color: "var(--foreground-muted)" }}>
                {route.vehicle.name}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer hover:opacity-70"
            style={{ background: "var(--surface-secondary)", color: "var(--foreground-muted)" }}
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Arrival Hero (Clean & Direct, No Squircle Slop, No Dot) */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            Perjalanan Selesai Tepat Waktu
          </span>
          <h2 className="text-2xl font-black font-display tracking-tight" style={{ color: "var(--foreground)" }}>
            {destName}
          </h2>
          <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
            Anda telah tiba dengan aman pada pukul <strong>{route.arrivalTime}</strong>.
          </p>
        </div>

        {/* Trip Receipt Card */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
        >
          {/* Timeline */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex-1">
                <span className="text-[10px] font-semibold block" style={{ color: "var(--foreground-muted)" }}>
                  Keberangkatan
                </span>
                <p className="font-bold truncate mt-0.5" style={{ color: "var(--foreground)" }}>
                  {originName}
                </p>
                <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
                  {route.departureTime}
                </p>
              </div>

              <div className="flex flex-col items-center px-3">
                <ArrowRight className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                  {route.totalDurationMinutes} min
                </span>
              </div>

              <div className="flex-1 text-right">
                <span className="text-[10px] font-semibold block" style={{ color: "var(--foreground-muted)" }}>
                  Tujuan Akhir
                </span>
                <p className="font-bold truncate mt-0.5" style={{ color: "var(--foreground)" }}>
                  {destName}
                </p>
                <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
                  {route.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative flex items-center justify-between px-3 py-1">
            <div className="w-3 h-6 -ml-4 rounded-r-full border-r border-y" style={{ background: "var(--surface)", borderColor: "var(--border)" }} />
            <div className="flex-1 border-t border-dashed mx-2" style={{ borderColor: "var(--border)" }} />
            <div className="w-3 h-6 -mr-4 rounded-l-full border-l border-y" style={{ background: "var(--surface)", borderColor: "var(--border)" }} />
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 divide-x p-3 text-center text-xs" style={{ borderColor: "var(--border)" }}>
            <div className="px-2">
              <span className="text-[10px] block" style={{ color: "var(--foreground-muted)" }}>Tarif Lunas</span>
              <p className="font-bold text-sm mt-0.5" style={{ color: "var(--foreground)" }}>{formattedFare}</p>
            </div>
            <div className="px-2">
              <span className="text-[10px] block" style={{ color: "var(--foreground-muted)" }}>Durasi</span>
              <p className="font-bold text-sm mt-0.5" style={{ color: "var(--foreground)" }}>{route.totalDurationMinutes} min</p>
            </div>
            <div className="px-2">
              <span className="text-[10px] block" style={{ color: "var(--foreground-muted)" }}>Hemat Emisi</span>
              <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">~1.4 kg CO₂</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onViewHistory}
            className="w-full py-3.5 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs sm:text-sm shadow-lg hover:opacity-90 active:scale-[0.99] transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <History className="w-4 h-4" />
            <span>Lihat Riwayat Perjalanan</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Kembali ke Beranda Peta
          </button>
        </div>
      </div>
    </div>
  );
}
