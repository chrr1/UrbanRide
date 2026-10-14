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
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
          style={{ color: "var(--foreground-muted)" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Perjalanan Selesai • Tiba di Tujuan
            </span>
            <h2 className="text-2xl font-black font-display tracking-tight mt-2" style={{ color: "var(--foreground)" }}>
              Selamat Sampai Tujuan!
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>
              Anda telah tiba dengan aman di <strong className="font-bold" style={{ color: "var(--foreground)" }}>{destName}</strong>
            </p>
          </div>
        </div>

        {/* Trip Summary Card */}
        <div
          className="p-4 rounded-2xl border space-y-3.5 text-xs"
          style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
        >
          {/* Route & Vehicle */}
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 shadow-xs">
                <VehicleIcon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{route.title}</p>
                <p className="text-[11px] text-gray-500">{route.vehicle.name} • {route.vehicle.driverName}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg border bg-white dark:bg-neutral-900" style={{ borderColor: "var(--border)" }}>
              #{route.vehicle.code}
            </span>
          </div>

          {/* Path */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Berangkat</span>
              <p className="font-bold mt-0.5 truncate max-w-[130px]" style={{ color: "var(--foreground)" }}>{originName}</p>
              <p className="text-[11px] text-gray-400">{route.departureTime}</p>
            </div>
            <div className="flex flex-col items-center px-2">
              <ArrowRight className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-bold text-gray-400 mt-0.5">{route.totalDurationMinutes} min</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Tiba</span>
              <p className="font-bold mt-0.5 truncate max-w-[130px]" style={{ color: "var(--foreground)" }}>{destName}</p>
              <p className="text-[11px] text-gray-400">{route.arrivalTime}</p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="p-2.5 rounded-xl border flex items-center space-x-2 bg-white dark:bg-neutral-900" style={{ borderColor: "var(--border)" }}>
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold">Emisi Hemat</p>
                <p className="font-bold text-xs text-emerald-600 dark:text-emerald-400">~1.4 kg CO₂</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl border flex items-center space-x-2 bg-white dark:bg-neutral-900" style={{ borderColor: "var(--border)" }}>
              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold">Status Tiket</p>
                <p className="font-bold text-xs text-indigo-600 dark:text-indigo-400">Selesai (Used)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onViewHistory}
            className="w-full py-3.5 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-xl hover:opacity-90 active:scale-[0.99] transition cursor-pointer flex items-center justify-center space-x-2"
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
