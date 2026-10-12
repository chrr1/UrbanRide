"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { RouteOption, MOCK_ROUTES } from "@/data/mockData";

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
  walletBalance: number;
  buyTicket: (ticket: Omit<PurchasedTicket, "id" | "purchasedAt" | "validUntil" | "status">) => PurchasedTicket;
  markTicketUsed: (ticketId: string) => void;
  clearTickets: () => void;
  topUpWallet: (amount: number) => void;
  hasActiveTicketForRoute: (routeId: string) => boolean;
  getActiveTicketForRoute: (routeId: string) => PurchasedTicket | undefined;
}

const TicketContext = createContext<TicketContextType>({
  tickets: [],
  activeTicket: null,
  walletBalance: 50000,
  buyTicket: () => ({} as PurchasedTicket),
  markTicketUsed: () => {},
  clearTickets: () => {},
  topUpWallet: () => {},
  hasActiveTicketForRoute: () => false,
  getActiveTicketForRoute: () => undefined,
});

const STORAGE_TICKETS_KEY = "urbanride-tickets";
const STORAGE_WALLET_KEY = "urbanride-wallet-balance";

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<PurchasedTicket[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(50000);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Load persisted tickets and wallet
    try {
      const savedTickets = localStorage.getItem(STORAGE_TICKETS_KEY);
      if (savedTickets) {
        const parsed = JSON.parse(savedTickets);
        if (Array.isArray(parsed)) {
          setTickets(parsed);
        }
      }

      const savedWallet = localStorage.getItem(STORAGE_WALLET_KEY);
      if (savedWallet) {
        const num = parseInt(savedWallet, 10);
        if (!isNaN(num)) setWalletBalance(num);
      }
    } catch (e) {
      console.error("Failed to load tickets/wallet from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save tickets to localStorage
  const saveTickets = (newTickets: PurchasedTicket[]) => {
    setTickets(newTickets);
    try {
      localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(newTickets));
    } catch (e) {
      console.error("Failed to save tickets to storage", e);
    }
  };

  // Save wallet balance
  const updateWallet = (newBalance: number) => {
    const val = Math.max(0, newBalance);
    setWalletBalance(val);
    try {
      localStorage.setItem(STORAGE_WALLET_KEY, val.toString());
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

    // If paid using UrbanRide Wallet, deduct balance
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
    updateWallet(50000);
  };

  const topUpWallet = (amount: number) => {
    updateWallet(walletBalance + amount);
  };

  const hasActiveTicketForRoute = (routeId: string) => {
    return tickets.some((t) => t.routeId === routeId && t.status === "active");
  };

  const getActiveTicketForRoute = (routeId: string) => {
    return tickets.find((t) => t.routeId === routeId && t.status === "active");
  };

  // The active ticket is the most recent ticket with "active" status
  const activeTicket = tickets.find((t) => t.status === "active") || null;

  return (
    <TicketContext.Provider
      value={{
        tickets,
        activeTicket,
        walletBalance,
        buyTicket,
        markTicketUsed,
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
