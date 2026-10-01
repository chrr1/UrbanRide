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
          className="flex items-center space-x-1.5 text-xs font-bold transition"
          style={{ color: "var(--foreground-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to routes</span>
        </button>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
          ● {route.vehicle.statusText}
        </span>
      </div>

      {/* Overview */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
          {route.title}
        </h2>
        <div className="flex items-center space-x-3 mt-1 text-xs font-semibold" style={{ color: "var(--foreground-muted)" }}>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{route.totalDurationMinutes} min</span>
          </span>
          <span>•</span>
          <span className="font-extrabold" style={{ color: "var(--foreground)" }}>{formattedFare}</span>
          <span>•</span>
          <span>{route.stopsCount} stops</span>
        </div>
      </div>

      {/* Driver Info */}
      <div
        className="p-3.5 rounded-2xl border flex items-center justify-between"
        style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center space-x-3">
          <img
            src={route.vehicle.driverAvatar}
            alt={route.vehicle.driverName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                {route.vehicle.driverName}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[11px] font-medium" style={{ color: "var(--foreground-muted)" }}>
              Driver • {route.vehicle.plateNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          {[MessageSquare, Phone].map((Icon, i) => (
            <button
              key={i}
              className="p-2 rounded-full border transition"
              style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
          Step by Step Timeline
        </h4>
        <div className="relative pl-6 space-y-6 ml-3 border-l-2" style={{ borderColor: "var(--border)" }}>
          {/* Start */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100/30" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                {route.legs[0]?.fromName || "Start"}
              </span>
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                {route.departureTime}
              </span>
            </div>
          </div>

          {/* Legs */}
          {route.legs.map((leg) => (
            <div key={leg.id} className="relative py-1">
              <div
                className="p-3 rounded-xl border space-y-1.5"
                style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: "var(--foreground)" }}>
                  <div className="flex items-center space-x-2">
                    {leg.type === "bus" && <Bus className="w-4 h-4 text-emerald-600" />}
                    {leg.type === "train" && <Train className="w-4 h-4 text-blue-600" />}
                    {leg.type === "walk" && <Footprints className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />}
                    <span>{leg.modeName}</span>
                  </div>
                  <span className="font-semibold" style={{ color: "var(--foreground-muted)" }}>
                    {leg.durationMinutes} min
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
                  From {leg.fromName} → To {leg.toName}
                </p>
              </div>
            </div>
          ))}

          {/* Destination */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-black ring-4 ring-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Destination</span>
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{route.arrivalTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onStartJourney(route)}
        className="w-full py-3.5 px-4 bg-black text-white text-xs font-bold rounded-full shadow-xl hover:bg-gray-800 transition flex items-center justify-center space-x-2"
      >
        <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
        <span>Start Live Journey</span>
      </button>
    </div>
  );
}
