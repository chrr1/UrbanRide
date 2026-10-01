"use client";

import { History, Bus, Train, Clock, ArrowRight, Ticket } from "lucide-react";
import { MOCK_HISTORY } from "@/data/mockData";

interface HistoryViewProps {
  onRebookRoute?: (routeName: string) => void;
  onViewTicketModal?: () => void;
}

export default function HistoryView({ onRebookRoute, onViewTicketModal }: HistoryViewProps) {
  return (
    <div
      className="rounded-2xl p-5 w-full space-y-4 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-black text-emerald-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>
              Recent Trips & History
            </h3>
            <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
              Your past transit journeys & saved tickets
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_HISTORY.map((item) => {
          const formattedFare = `Rp ${item.fare.toLocaleString("id-ID")}`;
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl border transition space-y-2.5"
              style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {item.transportType === "bus" ? (
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center space-x-1">
                      <Bus className="w-3.5 h-3.5" />
                      <span>{item.routeName}</span>
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center space-x-1">
                      <Train className="w-3.5 h-3.5" />
                      <span>{item.routeName}</span>
                    </div>
                  )}
                  <span className="text-[10px] font-bold uppercase" style={{ color: "var(--foreground-muted)" }}>
                    {item.date}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    item.status === "VALID" ? "bg-emerald-500 text-white" : ""
                  }`}
                  style={item.status !== "VALID" ? { background: "var(--surface)", color: "var(--foreground-muted)", border: "1px solid var(--border)" } : {}}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold" style={{ color: "var(--foreground)" }}>
                  {item.destination}
                </h4>
                <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                  From {item.origin}
                </p>
              </div>

              <div
                className="pt-2 border-t flex items-center justify-between text-xs"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center space-x-3 font-medium" style={{ color: "var(--foreground-muted)" }}>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.durationMinutes} min</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold" style={{ color: "var(--foreground)" }}>{formattedFare}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={onViewTicketModal}
                    className="p-1.5 rounded-lg border text-[11px] font-bold flex items-center space-x-1 transition"
                    style={{
                      background: "var(--surface)",
                      borderColor: "var(--border)",
                      color: "var(--foreground-muted)",
                    }}
                  >
                    <Ticket className="w-3 h-3 text-emerald-600" />
                    <span>Ticket</span>
                  </button>
                  <button
                    onClick={() => onRebookRoute && onRebookRoute(item.destination)}
                    className="p-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition text-[11px] font-bold flex items-center space-x-1"
                  >
                    <span>Rebook</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
