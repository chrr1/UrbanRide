"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Ticket,
  Bus,
  Train,
  CreditCard,
  QrCode,
  Wallet,
  Building2,
  Users,
  Check,
  Lock,
  ChevronRight,
  Sparkles,
  MapPin,
  AlertCircle,
  HelpCircle,
  Share2,
  ExternalLink,
  Loader2,
  Play,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTicket } from "@/context/TicketContext";
import { MOCK_ROUTES, RouteOption } from "@/data/mockData";
import TicketView from "@/components/ticket/TicketView";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId") || "";

  const { isLoggedIn, user } = useAuth();
  const { buyTicket, walletBalance } = useTicket();

  // Find selected route
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(
    MOCK_ROUTES.find((r) => r.id === routeId) || MOCK_ROUTES[0]
  );

  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "qris" | "va" | "transit_card">("wallet");
  const [selectedBank, setSelectedBank] = useState<string>("BCA");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [issuedTicketId, setIssuedTicketId] = useState<string>("");
  const [showBoardingPassModal, setShowBoardingPassModal] = useState<boolean>(false);

  useEffect(() => {
    if (routeId) {
      const found = MOCK_ROUTES.find((r) => r.id === routeId);
      if (found) setSelectedRoute(found);
    }
  }, [routeId]);

  // Auth gate check
  if (!isLoggedIn) {
    const handleRedirectToLogin = () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("urbanride-redirect", `/checkout?routeId=${selectedRoute.id}`);
      }
      router.push("/login");
    };

    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-50/70 dark:bg-black">
        <div
          className="w-full max-w-md p-8 rounded-3xl border shadow-xl text-center space-y-6"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
              Autentikasi Diperlukan
            </span>
            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
              Masuk untuk Membeli Tiket
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Tiket boarding pass UrbanRide diterbitkan resmi atas nama Anda. Silakan masuk ke akun terlebih dahulu untuk melanjutkan pembayaran rute{" "}
              <strong className="text-gray-900 dark:text-white font-semibold">
                #{selectedRoute.vehicle.code} ({selectedRoute.title})
              </strong>.
            </p>
          </div>

          {/* Route Preview Snippet */}
          <div
            className="p-3.5 rounded-2xl border text-left flex items-center space-x-3 text-xs"
            style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
          >
            <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
              {selectedRoute.vehicle.type === "train" ? (
                <Train className="w-5 h-5" />
              ) : (
                <Bus className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {selectedRoute.legs[0]?.fromName || "Stasiun Asal"} →{" "}
                {selectedRoute.stops[selectedRoute.stops.length - 1]?.name || "Stasiun Tujuan"}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Tarif: Rp {selectedRoute.fare.toLocaleString("id-ID")} • {selectedRoute.totalDurationMinutes} min
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleRedirectToLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg hover:opacity-90 active:scale-[0.99] transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
            >
              Kembali ke Pencarian Rute
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pricing
  const subtotal = selectedRoute.fare * passengerCount;
  const serviceFee = 0; // Promo free
  const totalAmount = subtotal + serviceFee;
  const isWalletSufficient = walletBalance >= totalAmount;

  // Handle Complete Payment
  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      let methodLabel = "UrbanRide Wallet";
      if (paymentMethod === "qris") methodLabel = "QRIS Dinamis";
      if (paymentMethod === "va") methodLabel = `Virtual Account (${selectedBank})`;
      if (paymentMethod === "transit_card") methodLabel = "Kartu Transit (JakLingko)";

      const origin = selectedRoute.legs[0]?.fromName || "Sudirman Hub";
      const dest =
        selectedRoute.stops[selectedRoute.stops.length - 1]?.name || "University Station";

      const createdTicket = buyTicket({
        routeId: selectedRoute.id,
        routeTitle: selectedRoute.title,
        vehicleName: selectedRoute.vehicle.name,
        vehicleCode: selectedRoute.vehicle.code,
        vehicleType: selectedRoute.vehicle.type,
        driverName: selectedRoute.vehicle.driverName,
        driverAvatar: selectedRoute.vehicle.driverAvatar,
        plateNumber: selectedRoute.vehicle.plateNumber,
        originName: origin,
        destName: dest,
        departureTime: selectedRoute.departureTime,
        arrivalTime: selectedRoute.arrivalTime,
        fare: totalAmount,
        passengerCount,
        passengerName: user?.name || "Penumpang",
        paymentMethod: methodLabel,
        routeData: selectedRoute,
      });

      setIssuedTicketId(createdTicket.id);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 900);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col font-sans transition-colors"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Top Header Navigation */}
      <header
        className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 border-b backdrop-blur-md flex items-center justify-between"
        style={{ background: "var(--header-bg)", borderColor: "var(--border)" }}
      >
        <button
          onClick={() => {
            sessionStorage.setItem("urbanride-view-route", selectedRoute.id);
            router.push("/");
          }}
          className="flex items-center space-x-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Rute</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
            2
          </div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            Checkout Pembelian Tiket
          </span>
        </div>

        <div className="text-xs font-semibold text-gray-400 hidden sm:flex items-center space-x-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Transaksi Terenkripsi</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!isSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Trip & Payment Configuration */}
            <div className="lg:col-span-7 space-y-5">
              {/* Card 1: Route Summary */}
              <div
                className="p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm">
                      {selectedRoute.vehicle.type === "train" ? (
                        <Train className="w-5 h-5" />
                      ) : (
                        <Bus className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm sm:text-base">
                          {selectedRoute.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/5 dark:bg-white/10 uppercase tracking-wider">
                          #{selectedRoute.vehicle.code}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {selectedRoute.vehicle.name} • Plat {selectedRoute.vehicle.plateNumber}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                    ● {selectedRoute.vehicle.statusText}
                  </span>
                </div>

                {/* Origin to Destination Timeline */}
                <div
                  className="p-4 rounded-2xl border space-y-3"
                  style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                      <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-700 my-1" />
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                    </div>

                    <div className="flex-1 space-y-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between font-bold">
                          <span>{selectedRoute.legs[0]?.fromName || "Sudirman Hub"}</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {selectedRoute.departureTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">Titik Keberangkatan</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between font-bold">
                          <span>
                            {selectedRoute.stops[selectedRoute.stops.length - 1]?.name ||
                              "University Station"}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {selectedRoute.arrivalTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">Stasiun Tujuan</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Estimasi Perjalanan: {selectedRoute.totalDurationMinutes} menit</span>
                    </span>
                    <span>{selectedRoute.stopsCount} Pemberhentian</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Passenger & Contact Info */}
              <div
                className="p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>Data Penumpang & Pemesan</span>
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terverifikasi</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div
                    className="p-3 rounded-xl border"
                    style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
                  >
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Nama Pemesan
                    </span>
                    <p className="font-bold text-sm mt-0.5 truncate">{user?.name || "Mahasiswa"}</p>
                  </div>
                  <div
                    className="p-3 rounded-xl border"
                    style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
                  >
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Email Akun
                    </span>
                    <p className="font-bold text-sm mt-0.5 truncate">{user?.email || "chrs@gmail.com"}</p>
                  </div>
                </div>

                {/* Passenger Quantity Counter */}
                <div className="flex items-center justify-between pt-2 border-t text-xs">
                  <div>
                    <span className="font-bold text-sm block">Jumlah Tiket / Penumpang</span>
                    <span className="text-[11px] text-gray-400">Maksimal 5 tiket per transaksi</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-black/5 dark:bg-white/10 p-1.5 rounded-2xl border">
                    <button
                      onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                      disabled={passengerCount <= 1}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-sm shadow-xs disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{passengerCount}</span>
                    <button
                      onClick={() => setPassengerCount(Math.min(5, passengerCount + 1))}
                      disabled={passengerCount >= 5}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-sm shadow-xs disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Payment Method Selection */}
              <div
                className="p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span>Pilih Metode Pembayaran</span>
                  </h3>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Simulasi Instan
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Option A: UrbanRide Wallet */}
                  <label
                    onClick={() => setPaymentMethod("wallet")}
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "wallet"
                        ? "border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10 shadow-sm"
                        : "border-gray-200 dark:border-neutral-800 hover:border-gray-400"
                    }`}
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm">UrbanRide Transit Wallet</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            1-Klik Instan
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Saldo Dompet:{" "}
                          <strong className="text-gray-900 dark:text-white font-bold">
                            Rp {walletBalance.toLocaleString("id-ID")}
                          </strong>
                        </p>
                        {!isWalletSufficient && (
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center space-x-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Saldo tidak mencukupi untuk {passengerCount} tiket</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${
                        paymentMethod === "wallet"
                          ? "bg-black dark:bg-white text-white dark:text-black border-transparent"
                          : "border-gray-300 dark:border-neutral-700"
                      }`}
                    >
                      {paymentMethod === "wallet" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </label>

                  {/* Option B: QRIS */}
                  <label
                    onClick={() => setPaymentMethod("qris")}
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "qris"
                        ? "border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10 shadow-sm"
                        : "border-gray-200 dark:border-neutral-800 hover:border-gray-400"
                    }`}
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm">QRIS Dinamis</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 dark:bg-neutral-800">
                            BCA • GoPay • OVO • Dana
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Scan barcode langsung dari semua aplikasi mobile banking & e-wallet
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${
                        paymentMethod === "qris"
                          ? "bg-black dark:bg-white text-white dark:text-black border-transparent"
                          : "border-gray-300 dark:border-neutral-700"
                      }`}
                    >
                      {paymentMethod === "qris" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </label>

                  {/* Option C: Virtual Account */}
                  <label
                    onClick={() => setPaymentMethod("va")}
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "va"
                        ? "border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10 shadow-sm"
                        : "border-gray-200 dark:border-neutral-800 hover:border-gray-400"
                    }`}
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block">Virtual Account Bank</span>
                        <div className="flex items-center space-x-2 mt-1.5">
                          {["BCA", "Mandiri", "BNI", "BRI"].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPaymentMethod("va");
                                setSelectedBank(bank);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                                selectedBank === bank && paymentMethod === "va"
                                  ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                                  : "bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-neutral-700"
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${
                        paymentMethod === "va"
                          ? "bg-black dark:bg-white text-white dark:text-black border-transparent"
                          : "border-gray-300 dark:border-neutral-700"
                      }`}
                    >
                      {paymentMethod === "va" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Pay CTA */}
            <div className="lg:col-span-5 sticky top-20 space-y-4">
              <div
                className="p-6 rounded-3xl border shadow-lg space-y-5"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-bold text-base font-display">Ringkasan Pembayaran</h3>
                  <span className="text-xs font-semibold text-gray-400">ID: #{selectedRoute.id}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Tarif Rute ({passengerCount} Penumpang)
                    </span>
                    <span className="font-semibold">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Biaya Layanan Platform</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Gratis (Promo)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Asuransi Perjalanan Transit</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Termasuk
                    </span>
                  </div>

                  <div
                    className="pt-4 border-t flex items-center justify-between"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block">Total Pembayaran</span>
                      <span className="text-2xl font-black font-display tracking-tight text-gray-900 dark:text-white">
                        Rp {totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
                      Lunas Seketika
                    </span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <button
                  onClick={handlePayNow}
                  disabled={isProcessing || (paymentMethod === "wallet" && !isWalletSufficient)}
                  className="w-full py-4 px-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-xl hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Bayar Sekarang • Rp {totalAmount.toLocaleString("id-ID")}</span>
                    </>
                  )}
                </button>

                {/* Trust & Guarantee Badges */}
                <div className="pt-2 border-t text-[11px] text-gray-400 space-y-1.5" style={{ borderColor: "var(--border)" }}>
                  <p className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Tiket QR otomatis aktif & siap tap-in setelah lunas</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Garansi validitas tiket sesuai jadwal rute operasional</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Success State */
          <div className="max-w-xl mx-auto py-6 animate-fadeIn">
            <div
              className="p-8 rounded-3xl border shadow-2xl text-center space-y-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              {/* Success Badge Icon */}
              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Pembayaran Berhasil • Tiket Aktif
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-gray-900 dark:text-white pt-1">
                  Tiket Boarding Pass Terbit!
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Transaksi telah diverifikasi. Tiket digital Anda telah tersimpan dan siap digunakan untuk tap-in di stasiun keberangkatan.
                </p>
              </div>

              {/* Receipt Ticket Snippet */}
              <div
                className="p-5 rounded-2xl border text-left space-y-3.5"
                style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between pb-3 border-b text-xs font-bold" style={{ borderColor: "var(--border)" }}>
                  <span className="text-gray-400">Nomor Tiket:</span>
                  <span className="font-mono text-sm tracking-wide text-indigo-600 dark:text-indigo-400">
                    {issuedTicketId}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Rute Perjalanan</p>
                    <p className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">
                      {selectedRoute.title}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Armada: {selectedRoute.vehicle.name} (#{selectedRoute.vehicle.code})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Total Lunas</p>
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[11px] text-gray-500">{passengerCount} Penumpang</p>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between text-[11px] text-gray-400" style={{ borderColor: "var(--border)" }}>
                  <span>Berlaku s/d: 4 Jam ke depan</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Siap Tap-In
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowBoardingPassModal(true)}
                  className="w-full py-4 px-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-xl hover:opacity-90 active:scale-[0.99] transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Buka QR Boarding Pass (Scan Tap-In)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      sessionStorage.setItem("urbanride-start-journey", selectedRoute.id);
                      router.push("/");
                    }}
                    className="py-3 px-4 rounded-xl border font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Mulai Live Tracking</span>
                  </button>

                  <button
                    onClick={() => {
                      sessionStorage.setItem("urbanride-view-route", selectedRoute.id);
                      router.push("/");
                    }}
                    className="py-3 px-4 rounded-xl border font-bold text-xs hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span>Kembali ke Detail Rute</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    sessionStorage.setItem("urbanride-active-tab", "ticket");
                    router.push("/");
                  }}
                  className="w-full py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer text-center"
                >
                  Lihat Daftar Tiket di Tab &quot;Tiket&quot; →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Holographic Boarding Pass Modal */}
      {showBoardingPassModal && (
        <TicketView
          route={selectedRoute}
          onClose={() => setShowBoardingPassModal(false)}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-black">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-black dark:text-white" />
            <p className="text-xs font-semibold text-gray-500">Memuat halaman checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
