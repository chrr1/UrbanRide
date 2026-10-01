"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { RouteOption } from "@/data/mockData";
import RouteCard from "./RouteCard";

interface RouteListProps {
  routes: RouteOption[];
  selectedRouteId?: string;
  onSelectRoute: (route: RouteOption) => void;
  destinationName: string;
  onBackToSearch?: () => void;
}

export default function RouteList({
  routes,
  selectedRouteId,
  onSelectRoute,
  destinationName,
  onBackToSearch,
}: RouteListProps) {
  const [activeSort, setActiveSort] = useState<"ALL" | "RECOMMENDED" | "FASTEST" | "CHEAPEST">("ALL");

  const filteredRoutes = routes.filter((r) => {
    if (activeSort === "ALL") return true;
    return r.badge === activeSort;
  });

  const sortTabs = [
    { id: "ALL",         label: "All Routes",    activeClass: "bg-gray-900 text-white" },
    { id: "RECOMMENDED", label: "Recommended",   activeClass: "bg-emerald-600 text-white" },
    { id: "FASTEST",     label: "Fastest",       activeClass: "bg-gray-900 text-white" },
    { id: "CHEAPEST",    label: "Cheapest",      activeClass: "bg-amber-600 text-white" },
  ] as const;

  return (
    <div className="space-y-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center space-x-2">
          {onBackToSearch && (
            <button
              onClick={onBackToSearch}
              className="p-1.5 rounded-full transition"
              style={{ color: "var(--foreground-muted)" }}
              title="Back to search"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>
              Routes to {destinationName}
            </h3>
            <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
              {routes.length} options available
            </p>
          </div>
        </div>
      </div>

      {/* Sort Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {sortTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSort(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeSort === tab.id ? tab.activeClass : ""
            }`}
            style={
              activeSort !== tab.id
                ? { background: "var(--surface-secondary)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }
                : {}
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Route Cards */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredRoutes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            isSelected={route.id === selectedRouteId}
            onSelect={onSelectRoute}
          />
        ))}
      </div>
    </div>
  );
}
