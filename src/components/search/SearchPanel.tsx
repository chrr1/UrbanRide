"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Navigation, ArrowUpDown, Clock, SlidersHorizontal, Sparkles, GraduationCap, ShoppingBag, Building2, TrainFront, X } from "lucide-react";
import { LocationItem, LOCATIONS } from "@/data/mockData";

interface SearchPanelProps {
  onSearch: (from: LocationItem, to: LocationItem, preference: string) => void;
  selectedFrom?: LocationItem | null;
  selectedTo?: LocationItem | null;
  isLoading?: boolean;
}

// Komponen panel formulir pencarian rute perjalanan
export default function SearchPanel({
  onSearch,
  selectedFrom,
  selectedTo,
  isLoading = false,
}: SearchPanelProps) {
  const [fromLocation, setFromLocation] = useState<LocationItem>(
    selectedFrom || LOCATIONS[0]
  );
  const [fromSearchInput, setFromSearchInput] = useState(
    selectedFrom?.name || LOCATIONS[0].name
  );
  const [showFromDropdown, setShowFromDropdown] = useState(false);

  const [toLocation, setToLocation] = useState<LocationItem | null>(
    selectedTo || LOCATIONS[2]
  );
  const [toSearchInput, setToSearchInput] = useState(toLocation?.name || "");
  const [showToDropdown, setShowToDropdown] = useState(false);

  const [preference, setPreference] = useState("Recommended");
  const [departureTime, setDepartureTime] = useState("Now");

  // Sync external prop updates
  useEffect(() => {
    if (selectedFrom) {
      setFromLocation(selectedFrom);
      setFromSearchInput(selectedFrom.name);
    }
  }, [selectedFrom]);

  useEffect(() => {
    if (selectedTo) {
      setToLocation(selectedTo);
      setToSearchInput(selectedTo.name);
    }
  }, [selectedTo]);

  const filteredFromLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(fromSearchInput.toLowerCase()) ||
      loc.category.toLowerCase().includes(fromSearchInput.toLowerCase()) ||
      loc.address.toLowerCase().includes(fromSearchInput.toLowerCase())
  );

  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(toSearchInput.toLowerCase()) ||
      loc.category.toLowerCase().includes(toSearchInput.toLowerCase()) ||
      loc.address.toLowerCase().includes(toSearchInput.toLowerCase())
  );

  // Fungsi menukar posisi stasiun asal dan stasiun tujuan
  const handleSwap = () => {
    if (toLocation) {
      const prevFrom = fromLocation;
      const prevFromInput = fromSearchInput;
      const prevTo = toLocation;
      const prevToInput = toSearchInput;

      setFromLocation(prevTo);
      setFromSearchInput(prevTo.name);

      setToLocation(prevFrom);
      setToSearchInput(prevFrom.name);
    }
  };

  // Fungsi submit untuk memproses dan mencari rute
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toLocation) return;

    // Resolve fromLocation if typed without clicking item
    let actualFrom = fromLocation;
    if (fromSearchInput && (!actualFrom || actualFrom.name.toLowerCase() !== fromSearchInput.toLowerCase())) {
      const matched = LOCATIONS.find(
        (loc) => loc.name.toLowerCase() === fromSearchInput.toLowerCase()
      );
      if (matched) actualFrom = matched;
    }

    let actualTo = toLocation;
    if (toSearchInput && (!actualTo || actualTo.name.toLowerCase() !== toSearchInput.toLowerCase())) {
      const matched = LOCATIONS.find(
        (loc) => loc.name.toLowerCase() === toSearchInput.toLowerCase()
      );
      if (matched) actualTo = matched;
    }

    if (actualFrom && actualTo) {
      onSearch(actualFrom, actualTo, preference);
    }
  };

  return (
    <div
      className="relative rounded-2xl p-4 sm:p-4.5 w-full border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Click-outside backdrop for dropdowns */}
      {(showFromDropdown || showToDropdown) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowFromDropdown(false);
            setShowToDropdown(false);
          }}
        />
      )}

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
        {/* Input pilihan stasiun asal keberangkatan */}
        <div className={`relative ${showFromDropdown ? "z-40" : "z-20"}`}>
          <div className="flex items-center justify-between mb-1">
            <label
              className="block text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--foreground-muted)" }}
            >
              From (Titik Awal)
            </label>
            {fromLocation.id !== LOCATIONS[0].id && (
              <button
                type="button"
                onClick={() => {
                  setFromLocation(LOCATIONS[0]);
                  setFromSearchInput(LOCATIONS[0].name);
                  setShowFromDropdown(false);
                }}
                className="text-[11px] font-medium transition hover:underline flex items-center space-x-1"
                style={{ color: "var(--foreground-muted)" }}
              >
                <Navigation className="w-3 h-3" />
                <span>Gunakan Lokasi Saat Ini</span>
              </button>
            )}
          </div>
          <div
            className="flex items-center space-x-2.5 p-2.5 sm:p-3 rounded-xl border transition"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <Navigation className="w-4 h-4 flex-shrink-0" style={{ color: "var(--foreground)" }} />
            <input
              type="text"
              placeholder="Cari titik keberangkatan..."
              value={fromSearchInput}
              onChange={(e) => {
                setFromSearchInput(e.target.value);
                setShowFromDropdown(true);
              }}
              onFocus={() => {
                setShowFromDropdown(true);
                setShowToDropdown(false);
              }}
              className="w-full bg-transparent text-sm font-medium outline-hidden"
              style={{ color: "var(--foreground)" }}
            />
            {fromLocation.id === LOCATIONS[0].id && !showFromDropdown && (
              <span
                className="px-2 py-0.5 rounded text-[11px] font-semibold border shrink-0"
                style={{
                  background: "var(--surface-secondary)",
                  color: "var(--foreground-muted)",
                  borderColor: "var(--border)",
                }}
              >
                Current
              </span>
            )}
            {fromSearchInput && (
              <button
                type="button"
                onClick={() => {
                  setFromSearchInput("");
                  setShowFromDropdown(true);
                }}
                className="p-0.5 hover:opacity-80 transition"
                style={{ color: "var(--foreground-muted)" }}
                title="Hapus teks"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown for Origin */}
          {showFromDropdown && (
            <div
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl max-h-60 overflow-y-auto p-1.5 border"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
              }}
            >
              {/* Reset to Current Location shortcut */}
              <div
                onClick={() => {
                  setFromLocation(LOCATIONS[0]);
                  setFromSearchInput(LOCATIONS[0].name);
                  setShowFromDropdown(false);
                }}
                className="p-2.5 rounded-lg cursor-pointer transition flex items-center justify-between border-b mb-1"
                style={{ color: "var(--foreground)", borderColor: "var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <Navigation className="w-4 h-4" style={{ color: "var(--foreground)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      Lokasi Saat Ini
                    </p>
                    <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                      {LOCATIONS[0].name}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded border"
                  style={{ background: "var(--surface-secondary)", color: "var(--foreground-muted)", borderColor: "var(--border)" }}
                >
                  GPS
                </span>
              </div>

              {filteredFromLocations
                .filter((loc) => loc.id !== LOCATIONS[0].id)
                .map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setFromLocation(loc);
                      setFromSearchInput(loc.name);
                      setShowFromDropdown(false);
                    }}
                    className="p-2.5 rounded-lg cursor-pointer transition flex items-center justify-between"
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
                        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                          {loc.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                          {loc.address}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-medium uppercase px-2 py-0.5 rounded border"
                      style={{ background: "var(--surface-secondary)", color: "var(--foreground-muted)", borderColor: "var(--border)" }}
                    >
                      {loc.category}
                    </span>
                  </div>
                ))}
              {filteredFromLocations.filter((loc) => loc.id !== LOCATIONS[0].id).length === 0 && (
                <div className="p-3 text-center text-xs" style={{ color: "var(--foreground-muted)" }}>
                  Tidak ada lokasi yang cocok
                </div>
              )}
            </div>
          )}
        </div>

        {/* Swap Button */}
        {/* Tombol cepat menukar posisi asal dan tujuan */}
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

        {/* Input pilihan stasiun tujuan kedatangan */}
        <div className={`relative ${showToDropdown ? "z-40" : "z-20"}`}>
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
              onFocus={() => {
                setShowToDropdown(true);
                setShowFromDropdown(false);
              }}
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
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl max-h-60 overflow-y-auto p-2 border"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
              }}
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

        {/* Tombol pintasan cepat memilih lokasi tujuan populer (Kampus, Mall, Stasiun) */}
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

        {/* Pilihan waktu keberangkatan dan preferensi rute (Rekomendasi, Tercepat, Termurah) */}
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

        {/* Tombol utama untuk mencari rute perjalanan */}
        <button
          type="submit"
          disabled={!toLocation || isLoading}
          className="w-full mt-2 py-2.5 sm:py-3 px-4 text-sm font-bold rounded-full shadow-lg active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center space-x-2"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
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
