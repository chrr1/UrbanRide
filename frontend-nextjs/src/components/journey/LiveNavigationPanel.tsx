"use client";

import { useState, useEffect } from "react";
import { Bus, MapPin, Ticket as TicketIcon, CheckCircle2, Play, Pause, AlertCircle, ArrowRight } from "lucide-react";
import { RouteOption } from "@/data/mockData";

interface LiveNavigationPanelProps {
  route: RouteOption;
  onEndJourney: () => void;
  onViewTicket: () => void;
  onStopIndexChange: (index: number) => void;
}

// Komponen panel kontrol navigasi dan pelacakan live armada perjalanan
export default function LiveNavigationPanel({
  route,
  onEndJourney,
  onViewTicket,
  onStopIndexChange,
}: LiveNavigationPanelProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(1);
  const [isSimulating, setIsSimulating] = useState(true);

  const stops = route.stops;
  const currentStop = stops[currentStopIndex] || stops[stops.length - 1];
  const nextStop = stops[currentStopIndex + 1] || stops[stops.length - 1];

  const remainingStops = Math.max(0, stops.length - 1 - currentStopIndex);
  const isCompleted = currentStopIndex >= stops.length - 1;

  // Simulasi interval pergerakan bus ke halte berikutnya secara realtime
  useEffect(() => {
    if (!isSimulating || isCompleted) return;

    const timer = setInterval(() => {
      // NOTE: We MUST NOT call onStopIndexChange inside setCurrentStopIndex's
      // functional updater — doing so triggers a parent setState during render.
      // Instead, read current value, compute next, then call both separately.
      setCurrentStopIndex((prev) => {
        const next = Math.min(prev + 1, stops.length - 1);
        // Schedule the parent callback outside the updater via a microtask
        // so it runs after React finishes this render cycle.
        Promise.resolve().then(() => {
          onStopIndexChange(next);
          if (next >= stops.length - 1) {
            setIsSimulating(false);
          }
        });
        return next;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isSimulating, isCompleted, stops.length, onStopIndexChange]);

  const handleNextStepManual = () => {
    if (currentStopIndex < stops.length - 1) {
      const next = currentStopIndex + 1;
      setCurrentStopIndex(next);
      onStopIndexChange(next);
    }
  };

  return (
    <div className="floating-card p-5 w-full space-y-4 shadow-2xl glass-panel relative">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 blur-[60px] rounded-full pointer-events-none overflow-hidden" />

      {/* Banner status live tracking dan tombol jeda/lanjutkan simulasi */}
      <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ background: "var(--accent-cyber-lime)", boxShadow: "0 0 8px var(--accent-cyber-lime)" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
            style={{
              background: "var(--surface-secondary)",
              color: "var(--foreground)",
              borderColor: "var(--border)"
            }}
          >
            LIVE TRACKING ACTIVE
          </span>
        </div>

        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="p-1.5 rounded-full text-xs font-bold flex items-center space-x-1 transition-all hover:scale-105 border shadow-sm"
          title={isSimulating ? "Pause Simulation" : "Play Simulation"}
          style={{
            background: "var(--surface-secondary)",
            color: "var(--foreground)",
            borderColor: "var(--border)"
          }}
        >
          {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span className="text-[10px] hidden sm:inline tracking-wider uppercase font-bold">{isSimulating ? "Simulating" : "Paused"}</span>
        </button>
      </div>

      {/* Informasi armada bus/kereta, nama pengemudi, dan tombol lihat tiket */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>{route.vehicle.name}</h3>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-md border"
              style={{ background: "var(--surface-secondary)", color: "var(--foreground-muted)", borderColor: "var(--border)" }}
            >
              {route.vehicle.code}
            </span>
          </div>
          <p className="text-sm mt-0.5 font-semibold" style={{ color: "var(--foreground-muted)" }}>Driver: {route.vehicle.driverName}</p>
        </div>

        <button
          onClick={onViewTicket}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-md border"
          style={{
            background: "var(--foreground)",
            color: "var(--background)",
            borderColor: "rgba(255,255,255,0.1)"
          }}
        >
          <TicketIcon className="w-3.5 h-3.5" />
          <span>My Ticket</span>
        </button>
      </div>

      {/* Indikator progress bar perjalanan dan posisi stasiun saat ini */}
      <div className="py-1">
        <div className="flex items-center justify-between mb-1.5 text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
          <span>{stops[0]?.name}</span>
          <span>{stops[stops.length - 1]?.name}</span>
        </div>

        <div className="relative w-full h-2.5 rounded-full flex items-center p-0.5 shadow-inner border" style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}>
          <div
            className="relative h-full rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${(currentStopIndex / (stops.length - 1)) * 100}%`, background: "var(--accent-cyber-lime)", boxShadow: "0 0 8px rgba(204,255,0,0.5)" }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 shadow-md border-[2px]"
              style={{ background: "var(--background)", borderColor: "var(--accent-cyber-lime)" }}
            >
              <Bus className="w-3 h-3 animate-pulse" style={{ color: "var(--foreground)" }} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2 relative px-1">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 -z-10" style={{ background: "var(--border)" }} />
          {stops.map((st, idx) => {
            const isPassed = idx <= currentStopIndex;
            const isCurrent = idx === currentStopIndex;
            return (
              <div key={st.id} className="flex flex-col items-center relative z-10 px-1" style={{ background: "var(--card-bg)" }}>
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${isCurrent ? "scale-150" : ""}`}
                  style={{
                    background: isPassed ? "var(--foreground)" : "var(--surface)",
                    borderColor: isCurrent ? "var(--accent-cyber-lime)" : "var(--border)",
                    boxShadow: isCurrent ? "0 0 8px var(--accent-cyber-lime)" : "none"
                  }}
                />
                <span
                  className="text-[9px] font-bold mt-1.5 max-w-[52px] truncate text-center uppercase tracking-wide"
                  style={{ color: isCurrent ? "var(--foreground)" : "var(--foreground-muted)" }}
                >
                  {st.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Stop Card */}
      <div
        className="p-4 rounded-xl space-y-3 border"
        style={{
          background: "var(--surface-secondary)",
          borderColor: "var(--border)"
        }}
      >
        <div className="flex items-center justify-between text-[15px] font-extrabold uppercase tracking-widest">
          <span style={{ color: "var(--accent-cyber-lime)" }}>Next Stop</span>
          <span style={{ color: "var(--foreground-muted)" }}>{remainingStops} stops remaining</span>
        </div>

        <div className="flex items-baseline justify-between">
          <h4 className="font-display text-xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>{nextStop?.name}</h4>
          <span className="text-base font-extrabold" style={{ color: "var(--accent-cyber-lime)", textShadow: "0 0 12px rgba(204,255,0,0.4)" }}>
            {isCompleted ? "Arrived" : "4 min away"}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm pt-2.5 border-t" style={{ color: "var(--foreground-muted)", borderColor: "var(--border)" }}>
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">Current: <b className="font-bold" style={{ color: "var(--foreground)" }}>{currentStop?.name}</b></span>
        </div>
      </div>

      {/* Tombol simulasi manual perhentian dan tombol selesaikan perjalanan */}
      <div className="flex items-center space-x-2">
        {!isCompleted && (
          <button
            onClick={handleNextStepManual}
            className="flex-1 py-2.5 px-3 text-sm font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 border"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              borderColor: "var(--border)"
            }}
          >
            <span>Simulate Stop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={onEndJourney}
          className="flex-1 py-2.5 px-3 text-sm font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center border"
          style={{
            background: "var(--foreground)",
            color: "var(--background)",
            borderColor: "rgba(255,255,255,0.1)"
          }}
        >
          <span>End Journey</span>
        </button>
      </div>
    </div>
  );
}
