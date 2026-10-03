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
          <div className="p-2.5 rounded-xl bg-black" style={{ color: "var(--accent-cyber-lime)" }}>
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xl" style={{ color: "var(--foreground)" }}>
              Recent Trips & History
            </h3>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
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
              className="p-6 rounded-2xl border transition space-y-4"
              style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {item.transportType === "bus" ? (
                    <div className="px-2.5 py-1.5 rounded-lg font-medium text-sm flex items-center space-x-1.5 border" style={{ background: "var(--surface-secondary)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                      <Bus className="w-4 h-4" style={{ color: "var(--accent-cyber-lime)" }} />
                      <span>{item.routeName}</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1.5 rounded-lg font-medium text-sm flex items-center space-x-1.5 border" style={{ background: "var(--surface-secondary)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                      <Train className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                      <span>{item.routeName}</span>
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase" style={{ color: "var(--foreground-muted)" }}>
                    {item.date}
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === "VALID" ? "text-black" : ""
                  }`}
                  style={item.status === "VALID" ? { background: "var(--accent-cyber-lime)" } : { background: "var(--surface)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                  {item.destination}
                </h4>
                <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                  From {item.origin}
                </p>
              </div>

              <div
                className="pt-4 border-t flex items-center justify-between text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center space-x-3 font-medium" style={{ color: "var(--foreground-muted)" }}>
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{item.durationMinutes} min</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>{formattedFare}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={onViewTicketModal}
                    className="px-3 py-2 rounded-lg border text-sm font-bold flex items-center space-x-1.5 transition hover:bg-black/5"
                    style={{
                      background: "var(--surface)",
                      borderColor: "var(--border)",
                      color: "var(--foreground-muted)",
                    }}
                  >
                    <Ticket className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                    <span>Ticket</span>
                  </button>
                  <button
                    onClick={() => onRebookRoute && onRebookRoute(item.destination)}
                    className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm font-bold flex items-center space-x-1.5"
                  >
                    <span>Rebook</span>
                    <ArrowRight className="w-4 h-4" style={{ color: "var(--accent-cyber-lime)" }} />
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
