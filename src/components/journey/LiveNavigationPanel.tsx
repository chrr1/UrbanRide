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

  // Real-time interval simulation
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
    <div className="floating-card p-5 w-full bg-white space-y-4 shadow-2xl border-2 border-black/10">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            ● LIVE TRACKING ACTIVE
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold flex items-center space-x-1"
            title={isSimulating ? "Pause Simulation" : "Play Simulation"}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="text-[10px] hidden sm:inline">{isSimulating ? "Simulating" : "Paused"}</span>
          </button>
        </div>
      </div>

      {/* Vehicle Info Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-extrabold text-gray-900">{route.vehicle.name}</h3>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {route.vehicle.code}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Driver: {route.vehicle.driverName}</p>
        </div>

        <button
          onClick={onViewTicket}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-black transition shadow-xs"
        >
          <TicketIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>My Ticket</span>
        </button>
      </div>

      {/* Journey Progress Timeline Indicator (Matching PRD Section 15) */}
      <div className="py-2">
        <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold text-gray-700">
          <span>{stops[0]?.name}</span>
          <span>{stops[stops.length - 1]?.name}</span>
        </div>

        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex items-center p-0.5">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${(currentStopIndex / (stops.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          {stops.map((st, idx) => {
            const isPassed = idx <= currentStopIndex;
            const isCurrent = idx === currentStopIndex;
            return (
              <div key={st.id} className="flex flex-col items-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isCurrent
                      ? "bg-emerald-500 border-black ring-4 ring-emerald-200 scale-125"
                      : isPassed
                      ? "bg-emerald-500 border-white"
                      : "bg-gray-200 border-white"
                  }`}
                />
                <span className="text-[9px] font-bold text-gray-500 mt-1 max-w-[60px] truncate text-center">
                  {st.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Stop Main Card */}
      <div className="p-4 rounded-2xl bg-gray-900 text-white space-y-2 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
          <span>Next Stop</span>
          <span>{remainingStops} stops remaining</span>
        </div>

        <div className="flex items-baseline justify-between">
          <h4 className="text-lg font-extrabold tracking-tight">{nextStop?.name}</h4>
          <span className="text-sm font-bold text-emerald-400">
            {isCompleted ? "Arrived" : "4 min away"}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-300 pt-1 border-t border-gray-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Current Location: <b>{currentStop?.name}</b></span>
        </div>
      </div>

      {/* Manual Step Forward & End Journey Actions */}
      <div className="flex items-center space-x-2 pt-1">
        {!isCompleted && (
          <button
            onClick={handleNextStepManual}
            className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1"
          >
            <span>Simulate Next Stop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={onEndJourney}
          className="flex-1 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1"
        >
          <span>End Journey</span>
        </button>
      </div>
    </div>
  );
}
