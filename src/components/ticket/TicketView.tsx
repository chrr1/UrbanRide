"use client";

import { useState } from "react";
import { QrCode, CheckCircle, Download, X, Bus, Train, Printer, Share2, ChevronDown } from "lucide-react";
import { RouteOption } from "@/data/mockData";

interface TicketViewProps {
  route?: RouteOption | null;
  onClose?: () => void;
}

export default function TicketView({ route, onClose }: TicketViewProps) {
  const [isHolographic, setIsHolographic] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const ticketRouteName = route?.title || "Bus 12 Express Line";
  const originName = route?.legs[0]?.fromName || "Sudirman Hub";
  const originCode = originName.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
  const destName = route?.stops[route.stops.length - 1]?.name || "University Station";
  const destCode = destName.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
  const fareFormatted = route ? `Rp ${route.fare.toLocaleString("id-ID")}` : "Rp 5.000";
  const ticketCode = route ? `UBR-${route.id.slice(0, 6).toUpperCase()}` : "UBR-984210";
  const durationMin = route?.totalDurationMinutes || 42;
  const duration = `${durationMin} min`;
  const VehicleIcon = route?.vehicle.type === "train" ? Train : Bus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      {/* Close Button — fixed to top-right of backdrop so it's never clipped */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex items-center space-x-2 text-white/70 hover:text-white text-xs font-bold transition z-10 px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      )}

      <div
        className="relative w-full max-w-sm animate-fadeIn"
        style={{ perspective: "1000px" }}
      >
        {/* === BOARDING PASS CARD === */}
        <div
          className={`relative rounded-[28px] overflow-hidden shadow-[0_32px_80px_-10px_rgba(0,0,0,0.5)] transition-all duration-700 cursor-pointer ${
            isHolographic ? "scale-[1.02] rotate-y-3" : ""
          }`}
          style={{
            background: isHolographic
              ? "linear-gradient(135deg, #0a0a0a 0%, #111827 25%, #064e3b 50%, #0a0a0a 75%, #111827 100%)"
              : "linear-gradient(160deg, #111111 0%, #1a1a1a 60%, #0d1f14 100%)",
            backgroundSize: isHolographic ? "400% 400%" : "100% 100%",
          }}
          onClick={() => setIsHolographic(!isHolographic)}
        >
          {/* Holographic Shimmer Overlay */}
          {isHolographic && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(16,185,129,0.15) 50%, rgba(139,92,246,0.1) 55%, transparent 60%)",
                animation: "holographic-sweep 2s linear infinite",
              }}
            />
          )}

          {/* === TOP SECTION — Airline style header === */}
          <div className="relative z-10 p-6 pb-4">
            {/* Brand Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(204,255,0,0.1)", border: "1px solid rgba(204,255,0,0.25)" }}>
                  <VehicleIcon className="w-5 h-5" style={{ color: "var(--accent-cyber-lime)" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent-cyber-lime)" }}>UrbanRide Transit</p>
                  <p className="text-sm font-bold text-white">Digital Boarding Pass</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Status</p>
                <div className="flex items-center space-x-1.5 mt-0.5 justify-end">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent-cyber-lime)" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--accent-cyber-lime)" }}>VALID</span>
                </div>
              </div>
            </div>

            {/* === ROUTE VISUALIZATION — Airport boarding pass style === */}
            <div className="flex items-center justify-between mb-6">
              {/* Origin */}
              <div className="text-center">
                <p className="text-5xl font-black text-white tracking-tighter leading-none font-display">{originCode}</p>
                <p className="text-xs text-white/50 mt-2 max-w-[90px] leading-tight">{originName.split("(")[0].trim()}</p>
              </div>

              {/* Journey Path */}
              <div className="flex-1 mx-3 flex flex-col items-center space-y-1.5">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{duration}</p>
                <div className="w-full flex items-center">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-white/40 shrink-0" />
                  <div className="flex-1 border-t border-dashed border-white/20 relative">
                    <div
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(204,255,0,0.15)", border: "1px solid rgba(204,255,0,0.35)" }}
                    >
                      <VehicleIcon className="w-3.5 h-3.5" style={{ color: "var(--accent-cyber-lime)" }} />
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "var(--accent-cyber-lime)" }} />
                </div>
                <p className="text-[10px] font-bold" style={{ color: "var(--accent-cyber-lime)" }}>{ticketRouteName}</p>
              </div>

              {/* Destination */}
              <div className="text-center">
                <p className="text-5xl font-black text-white tracking-tighter leading-none font-display">{destCode}</p>
                <p className="text-xs text-white/50 mt-2 max-w-[90px] leading-tight">{destName.split("(")[0].trim()}</p>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Date</p>
                <p className="text-sm font-bold text-white mt-1">
                  {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                </p>
              </div>
              <div className="text-center border-x" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Fare</p>
                <p className="text-sm font-bold mt-1" style={{ color: "var(--accent-cyber-lime)" }}>{fareFormatted}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Class</p>
                <p className="text-sm font-bold text-white mt-1">Student</p>
              </div>
            </div>
          </div>

          {/* === TEAR LINE PERFORATION === */}
          <div className="relative flex items-center justify-between h-6" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="w-4 h-8 rounded-full bg-black/70 -ml-4 shrink-0" />
            <div className="flex-1 border-t-2 border-dashed mx-1" style={{ borderColor: "rgba(255,255,255,0.12)" }} />
            <div className="w-4 h-8 rounded-full bg-black/70 -mr-4 shrink-0" />
          </div>

          {/* === BOTTOM STUB — QR Code Section === */}
          <div className="relative z-10 p-6 pt-5">
            <div className="flex items-center justify-between">
              {/* Ticket Code & Barcode info */}
              <div className="space-y-2.5">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Ticket Code</p>
                  <p className="text-lg font-black text-white tracking-widest font-mono mt-0.5">{ticketCode}</p>
                </div>
                <p className="text-xs text-white/30 leading-tight max-w-[140px]">Scan at station gate reader or show to conductor</p>
              </div>

              {/* QR Code */}
              <div
                className="p-3.5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="relative">
                  <QrCode className="w-20 h-20 text-white" />
                  {/* Holographic QR overlay */}
                  {isHolographic && (
                    <div className="absolute inset-0 rounded-lg" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(139,92,246,0.2))", mixBlendMode: "overlay" }} />
                  )}
                </div>
              </div>
            </div>

            {/* Expand button for details */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="w-full mt-4 flex items-center justify-center space-x-1.5 text-white/40 hover:text-white/70 transition text-xs font-bold uppercase tracking-wider"
            >
              <span>{isExpanded ? "Hide" : "Show"} Journey Details</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>

            {/* Expanded Journey Detail */}
            {isExpanded && route && (
              <div className="mt-3 space-y-2 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {route.stops.slice(0, 4).map((stop, i) => (
                  <div key={i} className="flex items-center space-x-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: i === 0 ? "var(--accent-cyber-lime)" : i === route.stops.length - 1 ? "#a78bfa" : "rgba(255,255,255,0.3)" }} />
                    <p className="text-xs text-white/60 truncate">{stop.name}</p>
                    {stop.time && <p className="text-xs text-white/30 ml-auto shrink-0">{stop.time}</p>}
                  </div>
                ))}
                {route.stops.length > 4 && (
                  <p className="text-xs text-white/30 pl-4">+{route.stops.length - 4} more stops...</p>
                )}
              </div>
            )}
          </div>

          {/* Eco Badge Bottom */}
          <div className="px-6 pb-5 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(204,255,0,0.08)", border: "1px solid rgba(204,255,0,0.18)" }}>
              <span className="text-xs font-bold" style={{ color: "var(--accent-cyber-lime)" }}>🌿</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-cyber-lime)" }}>CO₂ Saved: ~1.2 kg</span>
            </div>
            <p className="text-[10px] text-white/20 font-mono">v{new Date().getFullYear()}</p>
          </div>

          {/* Click to toggle hint */}
          <p className="text-center text-[9px] text-white/20 pb-4 tracking-wider">
            {isHolographic ? "✦ Holographic Mode Active" : "TAP CARD TO ACTIVATE HOLOGRAPHIC"}
          </p>
        </div>

        {/* === ACTION BUTTONS below card === */}
        <div className="flex items-center space-x-3 mt-5">
          <button
            onClick={() => alert("Ticket saved to gallery!")}
            className="flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            <Download className="w-4.5 h-4.5" style={{ color: "var(--accent-cyber-lime)" }} />
            <span>Save Ticket</span>
          </button>

          <button
            onClick={() => alert("Print ticket...")}
            className="py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            <Printer className="w-4 h-4 text-white/60" />
          </button>

          <button
            onClick={() => alert("Share ticket link...")}
            className="py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            <Share2 className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <p className="text-center text-white/30 text-[10px] mt-3 font-medium">
          Powered by UrbanRide Smart Transit System
        </p>
      </div>
    </div>
  );
}
