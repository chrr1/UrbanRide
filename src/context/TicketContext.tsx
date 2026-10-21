"use client";

// Konteks tiket dan riwayat perjalanan pengguna, termasuk saldo dompet
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { RouteOption, TripHistoryItem, MOCK_HISTORY } from "@/data/mockData";

export interface PurchasedTicket {
  id: string; // e.g. "UBR-984210"
  routeId: string;
  routeTitle: string;
  vehicleName: string;
  vehicleCode: string;
  vehicleType: "bus" | "train";
  driverName: string;
  driverAvatar: string;
  plateNumber: string;
  originName: string;
  destName: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  passengerCount: number;
  passengerName: string;
  paymentMethod: string;
  purchasedAt: string;
  validUntil: string;
  status: "active" | "used" | "expired";
  routeData: RouteOption;
}

interface TicketContextType {
  tickets: PurchasedTicket[];
  activeTicket: PurchasedTicket | null;
  history: TripHistoryItem[];
  walletBalance: number;
  buyTicket: (ticket: Omit<PurchasedTicket, "id" | "purchasedAt" | "validUntil" | "status">) => PurchasedTicket;
  markTicketUsed: (ticketId: string) => void;
  addTripToHistory: (trip: TripHistoryItem) => void;
  clearTickets: () => void;
  topUpWallet: (amount: number) => void;
  hasActiveTicketForRoute: (routeId: string) => boolean;
  getActiveTicketForRoute: (routeId: string) => PurchasedTicket | undefined;
}

const TicketContext = createContext<TicketContextType>({
  tickets: [],
  activeTicket: null,
  history: MOCK_HISTORY,
  walletBalance: 50000,
  buyTicket: () => ({} as PurchasedTicket),
  markTicketUsed: () => {},
  addTripToHistory: () => {},
  clearTickets: () => {},
  topUpWallet: () => {},
  hasActiveTicketForRoute: () => false,
  getActiveTicketForRoute: () => undefined,
});

// Legacy global keys (kept for cleanup only)
const LEGACY_TICKETS_KEY = "urbanride-tickets";
const LEGACY_WALLET_KEY = "urbanride-wallet-balance";
const LEGACY_HISTORY_KEY = "urbanride-history";

// Kunci penyimpanan per-pengguna berdasarkan email
function getTicketsKey(email: string) {
  return `urbanride-tickets_${email.toLowerCase()}`;
}
function getWalletKey(email: string) {
  return `urbanride-wallet_${email.toLowerCase()}`;
}
function getHistoryKey(email: string) {
  return `urbanride-history_${email.toLowerCase()}`;
}

export function TicketProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user } = useAuth();

  const [tickets, setTickets] = useState<PurchasedTicket[]>([]);
  const [history, setHistory] = useState<TripHistoryItem[]>(MOCK_HISTORY);
  const [walletBalance, setWalletBalance] = useState<number>(50000);

  // Muat atau hapus data pengguna setiap kali status login berubah
  useEffect(() => {
    if (!isLoggedIn || !user?.email) {
      // Guest: clear all in-memory state immediately
      setTickets([]);
      setHistory(MOCK_HISTORY);
      setWalletBalance(50000);
      return;
    }

    const email = user.email;

    // Load user-scoped tickets
    try {
      const savedTickets = localStorage.getItem(getTicketsKey(email));
      if (savedTickets) {
        const parsed = JSON.parse(savedTickets);
        if (Array.isArray(parsed)) {
          setTickets(parsed);
        } else {
          setTickets([]);
        }
      } else {
        setTickets([]);
      }
    } catch {
      setTickets([]);
    }

    // Load user-scoped history
    try {
      const savedHistory = localStorage.getItem(getHistoryKey(email));
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        } else {
          setHistory(MOCK_HISTORY);
        }
      } else {
        setHistory(MOCK_HISTORY);
      }
    } catch {
      setHistory(MOCK_HISTORY);
    }

    // Load user-scoped wallet balance
    try {
      const savedWallet = localStorage.getItem(getWalletKey(email));
      if (savedWallet) {
        const num = parseInt(savedWallet, 10);
        setWalletBalance(!isNaN(num) ? num : 50000);
      } else {
        setWalletBalance(50000);
      }
    } catch {
      setWalletBalance(50000);
    }

    // Clean up any legacy global keys to avoid confusion
    try {
      localStorage.removeItem(LEGACY_TICKETS_KEY);
      localStorage.removeItem(LEGACY_WALLET_KEY);
      localStorage.removeItem(LEGACY_HISTORY_KEY);
    } catch {
      // ignore
    }
  }, [isLoggedIn, user?.email]);

  // Simpan daftar tiket ke localStorage sesuai akun pengguna
  const saveTickets = (newTickets: PurchasedTicket[]) => {
    setTickets(newTickets);
    if (!isLoggedIn || !user?.email) return;
    try {
      localStorage.setItem(getTicketsKey(user.email), JSON.stringify(newTickets));
    } catch (e) {
      console.error("Failed to save tickets to storage", e);
    }
  };

  const addTripToHistory = (trip: TripHistoryItem) => {
    const updated = [trip, ...history];
    setHistory(updated);
    if (!isLoggedIn || !user?.email) return;
    try {
      localStorage.setItem(getHistoryKey(user.email), JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  // Simpan saldo dompet ke localStorage sesuai akun pengguna
  const updateWallet = (newBalance: number) => {
    const val = Math.max(0, newBalance);
    setWalletBalance(val);
    if (!isLoggedIn || !user?.email) return;
    try {
      localStorage.setItem(getWalletKey(user.email), val.toString());
    } catch (e) {
      console.error("Failed to save wallet balance", e);
    }
  };

  const buyTicket = (
    data: Omit<PurchasedTicket, "id" | "purchasedAt" | "validUntil" | "status">
  ): PurchasedTicket => {
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const validUntilDate = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours validity

    const newTicket: PurchasedTicket = {
      ...data,
      id: `UBR-${randomHex}`,
      purchasedAt: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      validUntil: validUntilDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: "active",
    };

    // Kurangi saldo dompet jika pembayaran menggunakan UrbanRide Wallet
    if (data.paymentMethod.toLowerCase().includes("wallet")) {
      updateWallet(walletBalance - data.fare);
    }

    const updated = [newTicket, ...tickets];
    saveTickets(updated);
    return newTicket;
  };

  const markTicketUsed = (ticketId: string) => {
    const updated = tickets.map((t) =>
      t.id === ticketId ? { ...t, status: "used" as const } : t
    );
    saveTickets(updated);
  };

  const clearTickets = () => {
    saveTickets([]);
    setHistory(MOCK_HISTORY);
    if (user?.email) {
      try {
        localStorage.removeItem(getHistoryKey(user.email));
      } catch {}
    }
    updateWallet(50000);
  };

  const topUpWallet = (amount: number) => {
    updateWallet(walletBalance + amount);
  };

  // These always return false/undefined if not logged in (guest safety)
  const hasActiveTicketForRoute = (routeId: string): boolean => {
    if (!isLoggedIn) return false;
    return tickets.some((t) => t.routeId === routeId && t.status === "active");
  };

  const getActiveTicketForRoute = (routeId: string): PurchasedTicket | undefined => {
    if (!isLoggedIn) return undefined;
    return tickets.find((t) => t.routeId === routeId && t.status === "active");
  };

  // The active ticket is the most recent ticket with "active" status (only if logged in)
  const activeTicket = isLoggedIn
    ? tickets.find((t) => t.status === "active") || null
    : null;

  return (
    <TicketContext.Provider
      value={{
        tickets,
        activeTicket,
        history,
        walletBalance,
        buyTicket,
        markTicketUsed,
        addTripToHistory,
        clearTickets,
        topUpWallet,
        hasActiveTicketForRoute,
        getActiveTicketForRoute,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicket() {
  return useContext(TicketContext);
}
