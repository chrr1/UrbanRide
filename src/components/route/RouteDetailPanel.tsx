"use client";

import { ArrowLeft, Clock, Bus, Train, Footprints, ShieldCheck, Phone, MessageSquare, Play } from "lucide-react";
import { RouteOption } from "@/data/mockData";

interface RouteDetailPanelProps {
  route: RouteOption;
  onBack: () => void;
  onStartJourney: (route: RouteOption) => void;
}

export default function RouteDetailPanel({ route, onBack, onStartJourney }: RouteDetailPanelProps) {
  const formattedFare = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(route.fare);

  return (
    <div
      className="rounded-2xl p-5 w-full space-y-4 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-bold transition-all hover:scale-105"
          style={{ color: "var(--foreground-muted)" }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to routes</span>
        </button>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold shadow-inner border tracking-widest uppercase"
          style={{
            background: "var(--surface-secondary)",
            color: "var(--foreground)",
            borderColor: "var(--border)"
          }}
        >
          ● {route.vehicle.statusText}
        </span>
      </div>

      {/* Overview */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          {route.title}
        </h2>
        <div className="flex items-center space-x-4 mt-2 text-sm font-semibold" style={{ color: "var(--foreground-muted)" }}>
          <span className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4" />
            <span>{route.totalDurationMinutes} min</span>
          </span>
          <span>•</span>
          <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>{formattedFare}</span>
          <span>•</span>
          <span>{route.stopsCount} stops</span>
        </div>
      </div>

      {/* Driver Info */}
      <div
        className="p-4 rounded-2xl border flex items-center justify-between"
        style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center space-x-4">
          <img
            src={route.vehicle.driverAvatar}
            alt={route.vehicle.driverName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                {route.vehicle.driverName}
              </span>
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--foreground)" }} />
            </div>
            <p className="text-xs font-medium mt-0.5" style={{ color: "var(--foreground-muted)" }}>
              Driver • {route.vehicle.plateNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {[MessageSquare, Phone].map((Icon, i) => (
            <button
              key={i}
              className="p-2.5 rounded-full border transition hover:bg-black/5"
              style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-5 pt-3">
        <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
          Step by Step Timeline
        </h4>
        <div className="relative pl-7 space-y-7 ml-4">
          {/* Gradient Line */}
          <div className="absolute top-3 bottom-3 left-[0px] w-[3px] rounded-full" style={{ background: "var(--foreground-muted)", opacity: 0.2 }} />

          {/* Start */}
          <div className="relative">
            <div className="absolute -left-[35.5px] top-0.5 w-4 h-4 rounded-full border-[4px] shadow-lg animate-pulse" style={{ background: "var(--foreground)", borderColor: "var(--surface)" }} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                {route.legs[0]?.fromName || "Start"}
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                {route.departureTime}
              </span>
            </div>
          </div>

          {/* Legs */}
          {route.legs.map((leg) => {
            const isBus = leg.type === "bus";
            const isTrain = leg.type === "train";
            const isWalk = leg.type === "walk";

            return (
              <div key={leg.id} className="relative py-1 group cursor-default">
                {/* Node on line */}
                <div
                  className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border-[3px] z-10 transition-transform duration-300 group-hover:scale-150"
                  style={{ background: "var(--foreground-muted)", borderColor: "var(--surface)" }}
                />

                <div
                  className="p-4 rounded-2xl border space-y-2 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl glass-panel"
                  style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    <div className="flex items-center space-x-2.5">
                      {isBus && <Bus className="w-5 h-5 drop-shadow-sm" style={{ color: "var(--foreground)" }} />}
                      {isTrain && <Train className="w-5 h-5 drop-shadow-sm" style={{ color: "var(--foreground)" }} />}
                      {isWalk && <Footprints className="w-5 h-5 drop-shadow-sm" style={{ color: "var(--foreground-muted)" }} />}
                      <span>{leg.modeName}</span>
                    </div>
                    <span className="font-semibold" style={{ color: "var(--foreground-muted)" }}>
                      {leg.durationMinutes} min
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                    From {leg.fromName} → To {leg.toName}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Destination */}
          <div className="relative">
            <div className="absolute -left-[35.5px] top-0.5 w-4 h-4 rounded-full border-[4px] shadow-lg transition-transform duration-500 hover:scale-125" style={{ background: "var(--foreground)", borderColor: "var(--surface)" }} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Destination</span>
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{route.arrivalTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onStartJourney(route)}
        className="w-full py-4 px-4 text-sm font-bold rounded-full transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-xl border backdrop-blur-md"
        style={{
          background: "var(--foreground)",
          color: "var(--background)",
          borderColor: "rgba(255,255,255,0.1)"
        }}
      >
        <Play className="w-5 h-5" style={{ fill: "var(--background)" }} />
        <span>Start Live Journey</span>
      </button>
    </div>
  );
}
