"use client";

import { useState } from "react";
import { Search, MapPin, ArrowUpDown, Clock, SlidersHorizontal, Sparkles, GraduationCap, ShoppingBag, Building2, TrainFront, X } from "lucide-react";
import { LocationItem, LOCATIONS } from "@/data/mockData";

interface SearchPanelProps {
  onSearch: (from: LocationItem, to: LocationItem, preference: string) => void;
  selectedFrom?: LocationItem | null;
  selectedTo?: LocationItem | null;
  isLoading?: boolean;
}

export default function SearchPanel({
  onSearch,
  selectedFrom,
  selectedTo,
  isLoading = false,
}: SearchPanelProps) {
  const [fromLocation, setFromLocation] = useState<LocationItem>(
    selectedFrom || LOCATIONS[0]
  );
  const [toLocation, setToLocation] = useState<LocationItem | null>(
    selectedTo || LOCATIONS[2]
  );

  const [toSearchInput, setToSearchInput] = useState(toLocation?.name || "");
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [preference, setPreference] = useState("Recommended");
  const [departureTime, setDepartureTime] = useState("Now");

  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(toSearchInput.toLowerCase()) ||
      loc.category.toLowerCase().includes(toSearchInput.toLowerCase())
  );

  const handleSwap = () => {
    if (toLocation) {
      const temp = fromLocation;
      setFromLocation(toLocation);
      setToLocation(temp);
      setToSearchInput(temp.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (toLocation) {
      onSearch(fromLocation, toLocation, preference);
    }
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-4.5 w-full border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Where do you want to go?
          </h2>
          <p className="text-xs font-medium mt-0.5" style={{ color: "var(--foreground-muted)" }}>
            Find the best routes & live transit options
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
        {/* From Input */}
        <div className="relative">
          <label
            className="block text-[11px] font-bold uppercase tracking-wider mb-1"
            style={{ color: "var(--foreground-muted)" }}
          >
            From
          </label>
          <div
            className="flex items-center space-x-2.5 p-2.5 sm:p-3 rounded-xl border"
            style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--accent-cyber-lime)", boxShadow: "0 0 6px var(--accent-cyber-lime)" }} />
            <input
              type="text"
              readOnly
              value={fromLocation.name}
              className="w-full bg-transparent text-sm font-medium outline-hidden cursor-default"
              style={{ color: "var(--foreground)" }}
            />
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold border" style={{ background: "var(--surface-secondary)", color: "var(--foreground-muted)", borderColor: "var(--border)" }}>
              Current
            </span>
          </div>
        </div>

        {/* Swap Button */}
        <div className="relative flex justify-center -my-2 z-10">
          <button
            type="button"
            onClick={handleSwap}
            className="p-1.5 rounded-full border shadow-2xs transition-transform active:scale-95"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground-muted)",
            }}
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Input & Autocomplete */}
        <div className="relative">
          <label
            className="block text-[11px] font-bold uppercase tracking-wider mb-1"
            style={{ color: "var(--foreground-muted)" }}
          >
            To (Destination)
          </label>
          <div
            className="flex items-center space-x-2.5 p-2.5 sm:p-3 rounded-xl border transition"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "var(--foreground)" }} />
            <input
              type="text"
              placeholder="Search destination..."
              value={toSearchInput}
              onChange={(e) => {
                setToSearchInput(e.target.value);
                setShowToDropdown(true);
              }}
              onFocus={() => setShowToDropdown(true)}
              className="w-full bg-transparent text-sm font-medium outline-hidden"
              style={{
                color: "var(--foreground)",
              }}
            />
            {toSearchInput && (
              <button
                type="button"
                onClick={() => {
                  setToSearchInput("");
                  setToLocation(null);
                }}
                style={{ color: "var(--foreground-muted)" }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showToDropdown && filteredLocations.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl shadow-xl max-h-60 overflow-y-auto p-2 border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => {
                    setToLocation(loc);
                    setToSearchInput(loc.name);
                    setShowToDropdown(false);
                  }}
                  className="p-3 rounded-lg cursor-pointer transition flex items-center justify-between"
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: "var(--surface-secondary)" }}
                    >
                      <MapPin className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        {loc.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                        {loc.address}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold uppercase px-2.5 py-0.5 rounded"
                    style={{ background: "var(--surface-secondary)", color: "var(--foreground-muted)" }}
                  >
                    {loc.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Favorite Location Chips */}
        <div className="space-y-1.5 pt-1">
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground-muted)" }}
          >
            Quick Destination
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {[
              { loc: LOCATIONS[2], label: "Campus", Icon: GraduationCap },
              { loc: LOCATIONS[4], label: "Mall", Icon: ShoppingBag },
              { loc: LOCATIONS[5], label: "Tech Park", Icon: Building2 },
              { loc: LOCATIONS[1], label: "Station", Icon: TrainFront },
            ].map(({ loc, label, Icon }) => {
              const isSelected = toLocation?.id === loc.id;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setToLocation(loc);
                    setToSearchInput(loc.name);
                  }}
                  className="px-3 py-1.5 rounded-full border text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all active:scale-95"
                  style={
                    isSelected
                      ? {
                        background: "var(--foreground)",
                        color: "var(--surface)",
                        borderColor: "var(--foreground)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }
                      : {
                        background: "var(--surface-secondary)",
                        color: "var(--foreground-muted)",
                        borderColor: "var(--border)",
                      }
                  }
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? "var(--surface)" : "var(--foreground-muted)" }} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferences & Time */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div>
            <label
              className="flex items-center space-x-1 text-[11px] font-bold mb-1"
              style={{ color: "var(--foreground-muted)" }}
            >
              <Clock className="w-3 h-3" />
              <span>Departure</span>
            </label>
            <select
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg text-xs font-semibold outline-hidden border"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              <option value="Now">Now (Immediate)</option>
              <option value="In 15 min">In 15 mins</option>
              <option value="In 30 min">In 30 mins</option>
            </select>
          </div>

          <div>
            <label
              className="flex items-center space-x-1 text-[11px] font-bold mb-1"
              style={{ color: "var(--foreground-muted)" }}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Preference</span>
            </label>
            <select
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg text-xs font-semibold outline-hidden border"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              <option value="Recommended">Recommended</option>
              <option value="Fastest">Fastest Time</option>
              <option value="Cheapest">Cheapest Fare</option>
            </select>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={!toLocation || isLoading}
          className="w-full mt-2 py-2.5 sm:py-3 px-4 bg-black text-white text-sm font-bold rounded-full shadow-lg hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Find Route</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
