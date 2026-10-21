"use client";

import { useState } from "react";
import {
  History,
  Bus,
  Train,
  Clock,
  ArrowRight,
  Ticket,
  CheckCircle2,
  Calendar,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Compass,
} from "lucide-react";
import { MOCK_HISTORY, TripHistoryItem } from "@/data/mockData";
import { useTicket } from "@/context/TicketContext";

interface HistoryViewProps {
  onRebookRoute?: (routeName: string) => void;
  onViewTicketModal?: () => void;
}

// Generate a 3-letter station code for boarding pass style display
function getStationCode(name: string): string {
  const clean = name.trim().toUpperCase();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2 && words[0].length >= 2) {
    return (words[0].slice(0, 2) + words[1][0]).toUpperCase();
  }
  return clean.replace(/[^A-Z0-9]/g, "").slice(0, 3) || "STN";
}

// Mock scheduled times for trips to enrich boarding pass realism
const TRIP_TIMES: Record<string, { dep: string; arr: string; platform: string }> = {
  "hist-1": { dep: "08:15", arr: "08:39", platform: "Bay 02" },
  "hist-2": { dep: "14:20", arr: "14:51", platform: "Bay 06" },
  "hist-3": { dep: "18:05", arr: "18:24", platform: "Track 1" },
};

// Komponen halaman riwayat perjalanan dan arsip boarding pass pengguna
export default function HistoryView({ onRebookRoute, onViewTicketModal }: HistoryViewProps) {
  const { history: contextHistory } = useTicket();
  // Use contextHistory directly — TicketContext already handles per-user scoping and
  // initializes to MOCK_HISTORY when user first logs in (no history yet).
  // We do NOT fall back to MOCK_HISTORY here to avoid cross-account leakage.
  const allHistory = contextHistory ?? [];

  const [activeFilter, setActiveFilter] = useState<"all" | "bus" | "train">("all");

  const filteredHistory = allHistory.filter((item) => {
    if (activeFilter === "all") return true;
    return item.transportType === activeFilter;
  });

  const totalSpent = allHistory.reduce((acc, curr) => acc + curr.fare, 0);
  const activeCount = allHistory.filter((h) => h.status === "VALID").length;
  const busCount = allHistory.filter((h) => h.transportType === "bus").length;
  const trainCount = allHistory.filter((h) => h.transportType === "train").length;

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* === LEFT COLUMN: Overview, Stats & Filters (lg:col-span-4) === */}
        <aside className="lg:col-span-4 space-y-4 shrink-0">
          {/* Header Card */}
          <div
            className="p-5 rounded-2xl border shadow-sm sm:shadow-md space-y-4"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-black text-white shadow-xs">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-display" style={{ color: "var(--foreground)" }}>
                  Recent Trips
                </h3>
                <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                  Saved passes & transit history
                </p>
              </div>
            </div>

            {/* Kartu statistik ringkasan total perjalanan dan pengeluaran ongkos */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div
                className="p-3 rounded-xl border shadow-2xs text-left"
                style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
                  Total Journeys
                </p>
                <p className="text-xl font-black mt-0.5" style={{ color: "var(--foreground)" }}>
                  {allHistory.length}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                  {busCount} Bus · {trainCount} Metro
                </p>
              </div>

              <div
                className="p-3 rounded-xl border shadow-2xs text-left"
                style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
                  Total Spent
                </p>
                <p className="text-xl font-black mt-0.5" style={{ color: "var(--foreground)" }}>
                  Rp {totalSpent.toLocaleString("id-ID")}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                  {allHistory.length > 0 ? `Avg. Rp ${Math.round(totalSpent / allHistory.length).toLocaleString("id-ID")}/trip` : "No trips yet"}
                </p>
              </div>
            </div>

            {/* Informasi tiket aktif yang siap digunakan untuk tap-in */}
            <div
              className="p-3.5 rounded-xl border shadow-2xs flex items-center justify-between text-xs"
              style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="font-bold" style={{ color: "var(--foreground)" }}>
                    {activeCount} Active Ticket
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
                    Ready for contactless boarding
                  </p>
                </div>
              </div>
              <button
                onClick={onViewTicketModal}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold border hover:bg-black/5 dark:hover:bg-white/5 transition"
                style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Open Pass
              </button>
            </div>

            {/* Tombol filter riwayat perjalanan (Semua, Bus, Kereta) */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
                Filter by Category
              </p>
              <div
                className="grid grid-cols-3 gap-1 p-1 rounded-xl border text-xs font-semibold"
                style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
              >
                {(
                  [
                    { id: "all", label: "All", count: allHistory.length },
                    { id: "bus", label: "Bus", count: busCount },
                    { id: "train", label: "Metro", count: trainCount },
                  ] as const
                ).map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer`}
                      style={isActive
                        ? { background: "var(--foreground)", color: "var(--background)" }
                        : { color: "var(--foreground-muted)" }
                      }
                    >
                      <span>{tab.label}</span>
                      <span className="ml-1 opacity-70">({tab.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Helpful Hint */}
            <div
              className="p-3 rounded-xl border text-xs space-y-1"
              style={{ background: "var(--surface-secondary)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
            >
              <div className="flex items-center space-x-1.5 font-bold" style={{ color: "var(--foreground)" }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Transit Pass</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Tickets are digitally signed and accepted at all NFC gates and bus tap-terminals.
              </p>
            </div>
          </div>
        </aside>

        {/* Daftar kartu tiket riwayat perjalanan digital */}
        <main className="lg:col-span-8 space-y-4 lg:h-full lg:overflow-y-auto lg:pr-2 min-h-0 pb-6">
          {filteredHistory.map((item: TripHistoryItem) => {
            const formattedFare = `Rp ${item.fare.toLocaleString("id-ID")}`;
            const isBus = item.transportType === "bus";
            const TransportIcon = isBus ? Bus : Train;
            const originCode = getStationCode(item.origin);
            const destCode = getStationCode(item.destination);
            const timeInfo = TRIP_TIMES[item.id] || { dep: "08:00", arr: "08:30", platform: "Bay 01" };

            return (
              <div
                key={item.id}
                className="relative rounded-2xl border transition-all duration-200 shadow-sm sm:shadow-md hover:shadow-lg group overflow-hidden"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Clean Top Bar (NO green accent line, clean monochrome) */}
                <div className="p-4 sm:p-5 pb-3">
                  {/* Top Metadata Row */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 border"
                        style={{
                          background: "var(--surface-secondary)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      >
                        <TransportIcon className="w-3.5 h-3.5" />
                        <span>{item.routeName}</span>
                      </div>

                      <div
                        className="flex items-center space-x-1 text-xs font-medium"
                        style={{ color: "var(--foreground-muted)" }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Monospace Ticket Reference Stub */}
                      <span
                        className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border tracking-wider"
                        style={{
                          background: "var(--surface-secondary)",
                          borderColor: "var(--border)",
                          color: "var(--foreground-muted)",
                        }}
                      >
                        {item.ticketCode}
                      </span>

                      {/* Status Pill — Clean Monochrome / Subtle Dot */}
                      {item.status === "VALID" ? (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1.5 tracking-wider uppercase border"
                          style={{
                            background: "var(--surface-secondary)",
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ACTIVE PASS</span>
                        </span>
                      ) : (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 tracking-wider uppercase border"
                          style={{
                            background: "var(--surface-secondary)",
                            borderColor: "var(--border)",
                            color: "var(--foreground-muted)",
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" style={{ color: "var(--foreground-muted)" }} />
                          <span>COMPLETED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* === JOURNEY VISUAL (Origin ➔ Duration ➔ Destination) === */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 py-4">
                    {/* Origin Column */}
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider block"
                          style={{ color: "var(--foreground-muted)" }}
                        >
                          Origin
                        </span>
                        <span className="text-[10px] font-medium" style={{ color: "var(--foreground-muted)" }}>
                          • {timeInfo.dep}
                        </span>
                      </div>
                      <p
                        className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-tight mt-0.5"
                        style={{ color: "var(--foreground)" }}
                      >
                        {originCode}
                      </p>
                      <p
                        className="text-xs sm:text-sm font-semibold truncate mt-0.5"
                        style={{ color: "var(--foreground)" }}
                        title={item.origin}
                      >
                        {item.origin}
                      </p>
                    </div>

                    {/* Transit Connector in Middle */}
                    <div className="flex flex-col items-center justify-center px-1 sm:px-3">
                      <div
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-full border text-[11px] font-bold shadow-2xs mb-1"
                        style={{
                          background: "var(--surface-secondary)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      >
                        <Clock className="w-3 h-3" style={{ color: "var(--foreground-muted)" }} />
                        <span>{item.durationMinutes} min</span>
                      </div>

                      <div className="flex items-center space-x-1 text-xs" style={{ color: "var(--foreground-muted)" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--foreground-muted)" }} />
                        <div className="w-12 sm:w-24 border-t-2 border-dashed" style={{ borderColor: "var(--border)" }} />
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--foreground)" }} />
                      </div>
                    </div>

                    {/* Destination Column */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <span className="text-[10px] font-medium" style={{ color: "var(--foreground-muted)" }}>
                          {timeInfo.arr} •
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider block"
                          style={{ color: "var(--foreground-muted)" }}
                        >
                          Destination
                        </span>
                      </div>
                      <p
                        className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-tight mt-0.5"
                        style={{ color: "var(--foreground)" }}
                      >
                        {destCode}
                      </p>
                      <p
                        className="text-xs sm:text-sm font-semibold truncate mt-0.5"
                        style={{ color: "var(--foreground)" }}
                        title={item.destination}
                      >
                        {item.destination}
                      </p>
                    </div>
                  </div>

                  {/* Badges Row (Platform / Transit Type / Class) */}
                  <div className="flex items-center space-x-2 pt-1">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                      style={{ background: "var(--surface-secondary)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
                    >
                      {timeInfo.platform}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                      style={{ background: "var(--surface-secondary)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
                    >
                      Direct Route
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border hidden sm:inline-block"
                      style={{ background: "var(--surface-secondary)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
                    >
                      Standard Class
                    </span>
                  </div>
                </div>

                {/* === PERFORATED DIVIDER WITH PUNCH NOTCHES === */}
                <div className="relative flex items-center my-0">
                  {/* Left Notch */}
                  <div
                    className="w-3.5 h-6 rounded-r-full border-r border-y shrink-0 -ml-px"
                    style={{ background: "var(--background)", borderColor: "var(--border)" }}
                  />
                  {/* Dashed Line */}
                  <div
                    className="flex-1 border-t-2 border-dashed mx-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                  {/* Right Notch */}
                  <div
                    className="w-3.5 h-6 rounded-l-full border-l border-y shrink-0 -mr-px"
                    style={{ background: "var(--background)", borderColor: "var(--border)" }}
                  />
                </div>

                {/* === STUB FOOTER: FARE & ACTIONS === */}
                <div
                  className="p-4 sm:p-5 pt-3 flex flex-wrap items-center justify-between gap-3"
                  style={{ background: "var(--surface-secondary)" }}
                >
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      Fare Paid
                    </span>
                    <p
                      className="text-base sm:text-lg font-black leading-tight mt-0.5"
                      style={{ color: "var(--foreground)" }}
                    >
                      {formattedFare}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-auto">
                    {/* View Digital Pass */}
                    <button
                      onClick={onViewTicketModal}
                      className="px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 cursor-pointer"
                      style={{
                        background: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      <Ticket className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                      <span>View Pass</span>
                    </button>

                    {/* Rebook CTA */}
                    <button
                      onClick={() => onRebookRoute && onRebookRoute(item.destination)}
                      className="px-3.5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-all text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs active:scale-95 group/btn cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-gray-400 group-hover/btn:-rotate-45 transition-transform" />
                      <span>Rebook</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredHistory.length === 0 && (
            <div
              className="p-8 text-center rounded-2xl border space-y-2"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>
                No trips found for {activeFilter}.
              </p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
