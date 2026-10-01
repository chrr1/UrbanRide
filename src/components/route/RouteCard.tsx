"use client";

import { Clock, Bus, Train, Footprints, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { RouteOption } from "@/data/mockData";

interface RouteCardProps {
  route: RouteOption;
  isSelected?: boolean;
  onSelect: (route: RouteOption) => void;
}

export default function RouteCard({ route, isSelected = false, onSelect }: RouteCardProps) {
  const getBadgeStyle = (badge: RouteOption["badge"]) => {
    switch (badge) {
      case "FASTEST":    return "bg-black text-white";
      case "RECOMMENDED": return "bg-emerald-500 text-white";
      case "CHEAPEST":   return "bg-amber-500 text-white";
      default:           return "bg-gray-800 text-white";
    }
  };

  const formattedFare = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(route.fare);

  return (
    <div
      onClick={() => onSelect(route)}
      className={`rounded-2xl p-4 cursor-pointer transition-all border ${
        isSelected ? "ring-2 ring-emerald-500" : ""
      }`}
      style={{
        background: "var(--card-bg)",
        borderColor: isSelected ? "transparent" : "var(--border)",
        boxShadow: isSelected
          ? "0 0 0 2px #10b981"
          : "0 4px 14px -3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top Header: Badge & Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getBadgeStyle(route.badge)}`}>
          {route.badge}
        </span>

        <div className="flex items-center space-x-1.5 text-[11px] font-semibold">
          {route.vehicle.status === "on-time" ? (
            <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{route.vehicle.statusText}</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>{route.vehicle.statusText}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Info: Duration & Fare */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {route.totalDurationMinutes} min
          </span>
        </div>
        <span className="text-base font-extrabold" style={{ color: "var(--foreground)" }}>
          {formattedFare}
        </span>
      </div>

      {/* Transport Mode Pills */}
      <div className="flex items-center space-x-1.5 mb-3 flex-wrap gap-y-1">
        {route.legs.map((leg, i) => (
          <div key={leg.id} className="flex items-center space-x-1">
            <div
              className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold border"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              {leg.type === "bus" && <Bus className="w-3.5 h-3.5 text-emerald-600" />}
              {leg.type === "train" && <Train className="w-3.5 h-3.5 text-blue-600" />}
              {leg.type === "walk" && <Footprints className="w-3.5 h-3.5" style={{ color: "var(--foreground-muted)" }} />}
              <span>{leg.modeName}</span>
            </div>
            {i < route.legs.length - 1 && (
              <span className="text-xs font-bold" style={{ color: "var(--foreground-muted)" }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Timeline bar */}
      <div
        className="pt-2.5 border-t flex items-center justify-between text-xs font-medium"
        style={{ borderColor: "var(--border)", color: "var(--foreground-muted)" }}
      >
        <div className="flex items-center space-x-2">
          <span className="font-bold" style={{ color: "var(--foreground)" }}>
            {route.departureTime}
          </span>
          <div
            className="w-16 sm:w-24 h-1 rounded-full relative overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div className="absolute left-0 top-0 bottom-0 bg-black w-2/3 rounded-full" />
          </div>
          <span className="font-bold" style={{ color: "var(--foreground)" }}>
            {route.arrivalTime}
          </span>
        </div>

        <div className="flex items-center space-x-1 font-semibold text-[11px]">
          <span>{route.stopsCount} stops</span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--foreground-muted)" }} />
        </div>
      </div>
    </div>
  );
}
