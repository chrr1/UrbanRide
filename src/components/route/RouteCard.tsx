"use client";

import { Clock, Bus, Train, Footprints, ChevronRight, AlertTriangle, ArrowRight, Check } from "lucide-react";
import { RouteOption } from "@/data/mockData";

interface RouteCardProps {
  route: RouteOption;
  isSelected?: boolean;
  onSelect: (route: RouteOption) => void;
}

export default function RouteCard({
  route,
  isSelected = false,
  onSelect,
}: RouteCardProps) {
  const getBadgeStyle = (badge: RouteOption["badge"]) => {
    switch (badge) {
      case "FASTEST":
        return "bg-black text-white dark:bg-white dark:text-black";
      case "RECOMMENDED":
        return "";
      case "CHEAPEST":
        return "bg-amber-500 text-white";
      default:
        return "bg-neutral-800 text-white";
    }
  };

  const getBadgeInlineStyle = (badge: RouteOption["badge"]) => {
    if (badge === "RECOMMENDED") {
      return { background: "var(--accent-cyber-lime)", color: "#fff" };
    }
    return {};
  };

  const getVehicleIcon = (type: string, className = "w-4 h-4") => {
    if (type === "train") {
      return <Train className={`${className} text-sky-500`} />;
    }
    if (type === "walk") {
      return <Footprints className={`${className}`} style={{ color: "var(--foreground-muted)" }} />;
    }
    return <Bus className={`${className}`} style={{ color: "var(--accent-cyber-lime)" }} />;
  };

  // Helper to shorten transfer leg names to 1-2 words as requested by user
  const getShortLegName = (leg: RouteOption["legs"][0]) => {
    if (leg.type === "walk") return "Walk";
    return leg.modeName
      .replace(/Line/i, "")
      .replace(/Bus\s+/i, "Bus ")
      .replace(/Feeder Bus\s+/i, "Feeder ")
      .replace(/Walk to.*/i, "Walk")
      .trim();
  };

  const formattedFare = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(route.fare);

  const originName = route.legs[0]?.fromName || "Start";
  const destinationName = route.legs[route.legs.length - 1]?.toName || "Destination";

  return (
    <div
      onClick={() => onSelect(route)}
      className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border-2 hover:-translate-y-0.5 overflow-hidden ${
        isSelected ? "shadow-lg" : "shadow-xs opacity-90 hover:opacity-100"
      }`}
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--foreground)",
      }}
    >

      {/* 1. Header: Icon Squircle + Route Code & Badge (Left) | Status Pill (Right) */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105"
            style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
          >
            {getVehicleIcon(route.vehicle.type, "w-4 h-4")}
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--foreground)" }}>
              #{route.vehicle.code}
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getBadgeStyle(route.badge)}`}
              style={getBadgeInlineStyle(route.badge)}
            >
              {route.badge}
            </span>
          </div>
        </div>

        {/* Status Text (Clean Typography, No Pill, No Dot) */}
        <div>
          {route.vehicle.status === "on-time" ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {route.vehicle.statusText}
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {route.vehicle.statusText}
            </span>
          )}
        </div>
      </div>

      {/* 2. Key Metrics Row: Duration + Stops (Left) | Fare (Right) */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline space-x-2">
          <Clock className="w-4 h-4 self-center" style={{ color: "var(--foreground-muted)" }} />
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            {route.totalDurationMinutes} min
          </span>
          <span className="text-xs sm:text-sm font-semibold" style={{ color: "var(--foreground-muted)" }}>
            • {route.stopsCount} stops
          </span>
        </div>

        <span className="font-display text-lg sm:text-xl font-bold" style={{ color: "var(--foreground)" }}>
          {formattedFare}
        </span>
      </div>

      {/* 3. Shortened 1-2 words Transit Mode Chips (Walk → Metro M1 → Walk) */}
      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5 mb-3.5">
        {route.legs.map((leg, i) => (
          <div key={leg.id} className="flex items-center space-x-1.5">
            <span
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-2xs"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              {getVehicleIcon(leg.type, "w-3.5 h-3.5")}
              <span>{getShortLegName(leg)}</span>
            </span>
            {i < route.legs.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--foreground-muted)", opacity: 0.6 }} />
            )}
          </div>
        ))}
      </div>

      {/* 4. Visual Timeline Track */}
      <div className="my-3 px-1">
        <div className="flex items-center">
          {/* Origin Dot */}
          <div className="relative flex items-center justify-center shrink-0">
            <span
              className="w-3 h-3 rounded-full ring-4"
              style={{
                background: "var(--accent-cyber-lime)",
                boxShadow: "0 0 10px var(--accent-cyber-lime)",
              }}
            />
          </div>

          {/* Solid Active Line */}
          <div
            className="flex-1 h-0.5 mx-2"
            style={{ background: "var(--accent-cyber-lime)" }}
          />

          {/* Centered Transit Mode Chip */}
          <div
            className="px-2.5 py-1 rounded-full border shadow-2xs flex items-center space-x-1.5 text-xs font-bold shrink-0"
            style={{
              background: "var(--surface-secondary)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            {getVehicleIcon(route.vehicle.type, "w-3.5 h-3.5")}
            <span>{route.vehicle.name}</span>
          </div>

          {/* Dashed Line to Destination */}
          <div
            className="flex-1 h-0.5 mx-2 border-b-2 border-dashed"
            style={{ borderColor: "var(--foreground-muted)", opacity: 0.4 }}
          />

          {/* Destination Dot */}
          <div className="relative flex items-center justify-center shrink-0">
            <span
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: "var(--foreground-muted)", background: "var(--card-bg)" }}
            />
          </div>
        </div>

        {/* Departure & Arrival Time + Station Names */}
        <div className="flex items-start justify-between mt-2 text-xs">
          <div className="max-w-[48%]">
            <div className="font-bold text-sm sm:text-base leading-tight" style={{ color: "var(--foreground)" }}>
              {route.departureTime}
            </div>
            <div className="truncate text-xs font-medium mt-0.5" style={{ color: "var(--foreground-muted)" }} title={originName}>
              {originName}
            </div>
          </div>

          <div className="max-w-[48%] text-right">
            <div className="font-bold text-sm sm:text-base leading-tight" style={{ color: "var(--foreground)" }}>
              {route.arrivalTime}
            </div>
            <div className="truncate text-xs font-medium mt-0.5" style={{ color: "var(--foreground-muted)" }} title={destinationName}>
              {destinationName}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Footer: Driver & Operator Info | Action Button */}
      <div
        className="pt-3 mt-1 border-t flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center space-x-2.5">
          <img
            src={route.vehicle.driverAvatar}
            alt={route.vehicle.driverName}
            className="w-8 h-8 rounded-full object-cover border"
            style={{ borderColor: "var(--border)" }}
          />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
              {route.vehicle.driverName}
            </span>
            <span className="text-xs leading-tight mt-0.5" style={{ color: "var(--foreground-muted)" }}>
              {route.vehicle.plateNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            style={{
              background: isSelected ? "var(--foreground)" : "var(--surface-secondary)",
              color: isSelected ? "var(--background)" : "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Terpilih</span>
              </>
            ) : (
              <>
                <span>Pilih Rute</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
