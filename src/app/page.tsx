"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import SearchPanel from "@/components/search/SearchPanel";
import RouteList from "@/components/route/RouteList";
import RouteDetailPanel from "@/components/route/RouteDetailPanel";
import LiveNavigationPanel from "@/components/journey/LiveNavigationPanel";
import TicketView from "@/components/ticket/TicketView";
import HistoryView from "@/components/history/HistoryView";
import QuickStatsBar from "@/components/home/QuickStatsBar";
import { SuccessToast } from "@/components/feedback/FeedbackStates";
import { LOCATIONS, MOCK_ROUTES, LocationItem, RouteOption } from "@/data/mockData";
import { Bus, Train, MapPin, Sparkles, Navigation, Layers, X, Search, ArrowLeft, Ticket, History, CheckCircle2, QrCode, Play, AlertCircle, ShoppingBag, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTicket } from "@/context/TicketContext";
import AuthPromptModal from "@/components/auth/AuthPromptModal";
import TripCompletedModal from "@/components/journey/TripCompletedModal";

// Dynamic Import MapView with SSR disabled for Leaflet compatibility
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center space-y-2 text-gray-500 animate-pulse">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold">Loading Interactive Map...</span>
    </div>
  ),
});

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();
  const { activeTicket, hasActiveTicketForRoute, getActiveTicketForRoute, clearTickets, markTicketUsed, addTripToHistory } = useTicket();

  const [activeTab, setActiveTab] = useState<"map" | "ticket" | "history">("map");
  const [viewMode, setViewMode] = useState<"search" | "results" | "detail" | "journey">("search");

  const [origin, setOrigin] = useState<LocationItem>(LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationItem>(LOCATIONS[2]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(MOCK_ROUTES[0]);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(1);

  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [showCompletedModal, setShowCompletedModal] = useState<boolean>(false);
  const [completedRoute, setCompletedRoute] = useState<RouteOption | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  // Auth prompt modal state when a guest attempts to select a route
  const [pendingRoute, setPendingRoute] = useState<RouteOption | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Uber / Grab Style Floating Search Bar & Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Restore pending route or checkout actions
  useEffect(() => {
    // Check if returning from checkout with request to view a specific route detail
    const viewRouteId = sessionStorage.getItem("urbanride-view-route");
    if (viewRouteId) {
      sessionStorage.removeItem("urbanride-view-route");
      const found = MOCK_ROUTES.find((r) => r.id === viewRouteId);
      if (found) {
        setSelectedRoute(found);
        setViewMode("detail");
        setActiveTab("map");
      }
    }

    // Check if redirected from checkout with immediate journey start
    const startJourneyRouteId = sessionStorage.getItem("urbanride-start-journey");
    if (startJourneyRouteId) {
      sessionStorage.removeItem("urbanride-start-journey");
      const found = MOCK_ROUTES.find((r) => r.id === startJourneyRouteId);
      if (found) {
        setSelectedRoute(found);
        setViewMode("journey");
        setActiveTab("map");
        setActiveStopIndex(1);
        setToastMsg(`Tiket aktif! Memulai navigasi ${found.vehicle.name}`);
      }
    }

    // Check if requested to view ticket tab
    const pendingTab = sessionStorage.getItem("urbanride-active-tab");
    if (pendingTab === "ticket") {
      sessionStorage.removeItem("urbanride-active-tab");
      setActiveTab("ticket");
    }

    if (isLoggedIn) {
      const pendingRouteId = sessionStorage.getItem("urbanride-pending-route");
      if (pendingRouteId) {
        sessionStorage.removeItem("urbanride-pending-route");
        const found = MOCK_ROUTES.find((r) => r.id === pendingRouteId);
        if (found) {
          setSelectedRoute(found);
          setViewMode("detail");
          setToastMsg(`Selamat datang kembali! Rute #${found.vehicle.code} berhasil dipilih.`);
        }
      }
    }
  }, [isLoggedIn]);

  const handleTabChange = (tab: "map" | "ticket" | "history") => {
    setActiveTab(tab);
    if (tab === "map" && viewMode === "results") setViewMode("search");
  };

  const handleViewTicket = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setShowTicketModal(true);
  };

  const handleBuyTicket = (route: RouteOption) => {
    if (!isLoggedIn) {
      setPendingRoute(route);
      setShowAuthModal(true);
      return;
    }
    router.push(`/checkout?routeId=${route.id}`);
  };

  // Handle Search submit
  const handleSearch = (fromLoc: LocationItem, toLoc: LocationItem, preference: string) => {
    setIsLoadingSearch(true);
    setOrigin(fromLoc);
    setDestination(toLoc);

    setTimeout(() => {
      setIsLoadingSearch(false);
      setViewMode("results");
      setToastMsg(`Found 3 routes to ${toLoc.name}`);
    }, 600);
  };

  // Handle selecting a route card (Free exploration for all users)
  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
    setViewMode("detail");
  };

  // Quick 1-click login handler directly inside modal
  const handleQuickLogin = (route: RouteOption) => {
    login("demo.rider@urbanride.id", "Demo Rider");
    setSelectedRoute(route);
    setViewMode("detail");
    setShowAuthModal(false);
    setToastMsg(`Login berhasil! Rute #${route.vehicle.code} terpilih.`);
  };

  // Navigate to full login page with route saved in sessionStorage
  const handleGoToLogin = (route: RouteOption) => {
    sessionStorage.setItem("urbanride-pending-route", route.id);
    setShowAuthModal(false);
    router.push("/login");
  };

  // Handle Start Journey
  const handleStartJourney = (route: RouteOption) => {
    setSelectedRoute(route);
    setViewMode("journey");
    setActiveStopIndex(1);
    setIsSearchModalOpen(false);
    setToastMsg(`Journey Started! Tracking ${route.vehicle.name}`);
  };

  // Handle End Journey
  const handleEndJourney = () => {
    // 1. Mark ticket as used if active ticket exists
    const currentTicket = getActiveTicketForRoute(selectedRoute.id) || activeTicket;
    if (currentTicket) {
      markTicketUsed(currentTicket.id);
    }

    // 2. Add completed trip to user history
    const now = new Date();
    addTripToHistory({
      id: `hist-${Date.now()}`,
      destination: destination.name,
      origin: origin.name,
      routeName: selectedRoute.title,
      date: "Hari ini, " + now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      durationMinutes: selectedRoute.totalDurationMinutes,
      fare: selectedRoute.fare,
      transportType: selectedRoute.vehicle.type,
      ticketCode: currentTicket ? currentTicket.id : `UBR-${selectedRoute.id.slice(0, 6).toUpperCase()}`,
      status: "COMPLETED",
    });

    // 3. Trigger arrival completion modal
    setCompletedRoute(selectedRoute);
    setShowCompletedModal(true);
    setViewMode("search");
    setActiveStopIndex(0);
    setToastMsg(`Perjalanan selesai! Selamat tiba di ${destination.name}`);
  };

  return (
    <div
      className="h-screen flex flex-col font-sans pb-20 md:pb-0 overflow-hidden transition-colors"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Success Feedback Toast */}
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 min-h-0 max-w-[1540px] w-full mx-auto px-4 sm:px-8 py-1.5 sm:py-2 space-y-2.5 overflow-hidden flex flex-col">

        {/* Quick System Stats Cards Top Placement */}
        {activeTab === "map" && (
          <QuickStatsBar />
        )}

        {/* Hero Section & Map Dashboard */}
        {activeTab === "map" && (
          <div
            className="relative w-full flex-1 min-h-0 rounded-3xl overflow-hidden shadow-sm border flex flex-col md:flex-row"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >

            {/* Left Sidebar Control Panel (DESKTOP ONLY - Always Visible Side-by-Side) */}
            <div
              className="hidden md:flex md:w-[400px] lg:w-[440px] p-5 z-20 overflow-y-auto overflow-x-hidden max-h-full backdrop-blur-md border-r flex-col space-y-4 shrink-0"
              style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
            >
              {/* Tab navigation indicators inside panel */}
              <div
                className="flex items-center justify-between text-xs font-bold pb-2 border-b"
                style={{ color: "var(--foreground-muted)", borderColor: "var(--border)" }}
              >
                <span className="flex items-center space-x-1.5" style={{ color: "var(--foreground)" }}>
                  <Navigation className="w-4 h-4" style={{ color: "var(--accent-cyber-lime)" }} />
                  <span className="capitalize">{viewMode} Mode</span>
                </span>
              </div>

              {/* Step 1: Search Form */}
              {viewMode === "search" && (
                <SearchPanel
                  onSearch={handleSearch}
                  selectedFrom={origin}
                  selectedTo={destination}
                  isLoading={isLoadingSearch}
                />
              )}

              {/* Step 2: Route Results List */}
              {viewMode === "results" && (
                <RouteList
                  routes={MOCK_ROUTES}
                  selectedRouteId={selectedRoute.id}
                  onSelectRoute={handleSelectRoute}
                  destinationName={destination.name}
                  onBackToSearch={() => setViewMode("search")}
                />
              )}

              {/* Step 3: Route Detail Timeline */}
              {viewMode === "detail" && (
                <RouteDetailPanel
                  route={selectedRoute}
                  onBack={() => setViewMode("results")}
                  onStartJourney={handleStartJourney}
                  onBuyTicket={handleBuyTicket}
                  hasActiveTicket={Boolean(isLoggedIn && hasActiveTicketForRoute(selectedRoute.id))}
                  activeTicket={isLoggedIn ? getActiveTicketForRoute(selectedRoute.id) : undefined}
                  onViewTicket={handleViewTicket}
                />
              )}

              {/* Step 4: Live Navigation & Vehicle Tracking */}
              {viewMode === "journey" && (
                <LiveNavigationPanel
                  route={selectedRoute}
                  onEndJourney={handleEndJourney}
                  onViewTicket={handleViewTicket}
                  onStopIndexChange={(idx) => setActiveStopIndex(idx)}
                />
              )}
            </div>

            {/* Map Canvas (Full Width on Mobile, 70% Right on Desktop) */}
            <div className="relative flex-1 h-full w-full bg-gray-100 z-0">
              <MapView
                selectedRoute={selectedRoute}
                activeVehicle={selectedRoute.vehicle}
                locations={LOCATIONS}
                originLocation={origin}
                destinationLocation={destination}
                activeJourneyMode={viewMode === "journey"}
                activeStopIndex={activeStopIndex}
                onSelectStation={(loc) => {
                  setDestination(loc);
                  setIsSearchModalOpen(true);
                  setToastMsg(`Selected destination: ${loc.name}`);
                }}
              />

              {/* Mobile Only Floating Top Search Bar (md:hidden) */}
              <div className="md:hidden absolute top-4 left-4 right-4 z-20">
                <div
                  onClick={() => setIsSearchModalOpen(true)}
                  className="glass-panel p-3.5 rounded-2xl shadow-xl border border-gray-200/90 cursor-pointer hover:border-black transition-all flex items-center justify-between group active:scale-98 bg-white/95 backdrop-blur-md"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-md">
                      <Search className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Mau pergi ke mana?</span>
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {origin.name.split(" ")[0]} ➔ {destination.name.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                  <span className="px-3.5 py-2 bg-black text-white text-xs font-bold rounded-xl shrink-0 group-hover:bg-gray-800 transition shadow-md flex items-center space-x-1">
                    <span>Cari Rute</span>
                  </span>
                </div>
              </div>

              {/* Floating Vehicle Tracking Card (Top Right Desktop/Mobile) */}
              <div className="absolute top-4 right-4 z-10 hidden sm:block">
                <div
                  className="p-3.5 rounded-xl w-60 sm:w-64 shadow-lg space-y-2.5 backdrop-blur-md border"
                  style={{ background: "var(--panel-bg)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center space-x-1.5" style={{ color: "var(--foreground)" }}>
                      <Bus className="w-4 h-4" style={{ color: "var(--foreground)" }} />
                      <span>{selectedRoute.vehicle.name}</span>
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold shadow-inner border tracking-wider uppercase"
                      style={{
                        background: "var(--surface-secondary)",
                        color: "var(--foreground)",
                        borderColor: "var(--border)"
                      }}
                    >
                      ● ON ROUTE
                    </span>
                  </div>

                  <div className="text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
                    <p className="truncate font-semibold text-xs" style={{ color: "var(--foreground)" }}>
                      {selectedRoute.vehicle.currentLocationName}
                    </p>
                    <p className="text-[11px] mt-0.5">↓ Next: {selectedRoute.vehicle.nextStopName}</p>
                  </div>

                  <div
                    className="flex items-center justify-between pt-2.5 border-t text-xs"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="font-bold" style={{ color: "var(--foreground)" }}>{selectedRoute.vehicle.estimatedArrivalNextStop}</span>
                    <button
                      onClick={() => {
                        setViewMode("journey");
                        setActiveTab("map");
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all hover:scale-[1.02] shadow-sm border"
                      style={{ background: "var(--foreground)", color: "var(--background)", borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      View Trip
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Map Legend Pill */}
              <div
                className="absolute bottom-4 left-4 z-10 hidden md:flex items-center space-x-2 px-3.5 py-2 rounded-full backdrop-blur-md border text-xs font-semibold shadow-md"
                style={{ background: "var(--panel-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <Layers className="w-3.5 h-3.5 text-gray-500" />
                <span>OpenStreetMap Live Canvas</span>
              </div>

            </div>

          </div>
        )}

        {/* Full Screen Dedicated Search & Route Overlay (MOBILE ONLY - md:hidden) */}
        {isSearchModalOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 flex flex-col overflow-y-auto animate-fadeIn"
            style={{ background: "var(--background)", color: "var(--foreground)" }}
          >
            {/* Full Screen Header Bar */}
            <div
              className="sticky top-0 z-10 backdrop-blur-md border-b px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm"
              style={{ background: "var(--header-bg)", borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-xs shadow-md active:scale-95 transition"
              >
                <ArrowLeft className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                <span>Kembali ke Peta</span>
              </button>

              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 hidden sm:block" style={{ color: "var(--foreground-muted)" }} />
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
                  {viewMode === "search" ? "Pencarian Rute Perjalanan" : `${viewMode} Mode`}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                {viewMode !== "search" && (
                  <button
                    onClick={() => setViewMode("search")}
                    className="text-xs text-gray-600 hover:text-black font-semibold underline mr-2"
                  >
                    Reset Search
                  </button>
                )}
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition"
                  title="Tutup & Lihat Peta"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Full Screen Page Content Container */}
            <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6">
              <div className="glass-panel p-5 sm:p-7 rounded-3xl shadow-xl border border-gray-200 bg-white">
                {/* Step 1: Search Form */}
                {viewMode === "search" && (
                  <SearchPanel
                    onSearch={(from, to, pref) => {
                      handleSearch(from, to, pref);
                    }}
                    selectedFrom={origin}
                    selectedTo={destination}
                    isLoading={isLoadingSearch}
                  />
                )}

                {/* Step 2: Route Results List */}
                {viewMode === "results" && (
                  <RouteList
                    routes={MOCK_ROUTES}
                    selectedRouteId={selectedRoute.id}
                    onSelectRoute={handleSelectRoute}
                    destinationName={destination.name}
                    onBackToSearch={() => setViewMode("search")}
                  />
                )}

                {/* Step 3: Route Detail Timeline */}
                {viewMode === "detail" && (
                  <RouteDetailPanel
                    route={selectedRoute}
                    onBack={() => setViewMode("results")}
                    onStartJourney={handleStartJourney}
                    onBuyTicket={handleBuyTicket}
                    hasActiveTicket={Boolean(isLoggedIn && hasActiveTicketForRoute(selectedRoute.id))}
                    activeTicket={isLoggedIn ? getActiveTicketForRoute(selectedRoute.id) : undefined}
                    onViewTicket={handleViewTicket}
                  />
                )}

                {/* Step 4: Live Navigation & Vehicle Tracking */}
                {viewMode === "journey" && (
                  <LiveNavigationPanel
                    route={selectedRoute}
                    onEndJourney={() => {
                      handleEndJourney();
                      setIsSearchModalOpen(false);
                    }}
                    onViewTicket={handleViewTicket}
                    onStopIndexChange={(idx) => setActiveStopIndex(idx)}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Protected Auth State for Ticket Tab */}
        {activeTab === "ticket" && !isLoggedIn && (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mb-4 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
              <Ticket className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-display tracking-tight mb-2" style={{ color: "var(--foreground)" }}>
              Tiket Boarding Pass Memerlukan Akun
            </h2>
            <p className="text-sm max-w-md mb-6 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
              Masuk untuk melihat tiket perjalanan aktif, QR code check-in, dan rincian transit Anda.
            </p>
            <button
              onClick={() => {
                sessionStorage.setItem("urbanride-active-tab", "ticket");
                router.push("/login");
              }}
              className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg hover:opacity-90 transition cursor-pointer"
            >
              Masuk Sekarang
            </button>
          </div>
        )}

        {/* Ticket Tab View (Logged In) */}
        {activeTab === "ticket" && isLoggedIn && (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {!activeTicket ? (
              /* Empty State: Belum Ada Tiket */
              <div
                className="w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-sm text-center space-y-6 animate-fadeIn"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400 border" style={{ borderColor: "var(--border)" }}>
                  <Ticket className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300">
                    Belum Ada Tiket Aktif
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight" style={{ color: "var(--foreground)" }}>
                    Mulai Perjalanan Anda
                  </h2>
                  <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                    Anda belum membeli tiket perjalanan. Pilih rute keberangkatan di peta dan lakukan pembayaran untuk mendapatkan boarding pass digital QR code.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
                  <div className="p-3 rounded-2xl border" style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}>
                    <p className="font-bold">⚡ Scan Cepat</p>
                    <p className="text-[11px] text-gray-400 mt-1">Tap-in instan dengan QR code di gate stasiun.</p>
                  </div>
                  <div className="p-3 rounded-2xl border" style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}>
                    <p className="font-bold">🛡️ Aman & Resmi</p>
                    <p className="text-[11px] text-gray-400 mt-1">Terintegrasi armada bus & metro kota.</p>
                  </div>
                  <div className="p-3 rounded-2xl border" style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}>
                    <p className="font-bold">⏱️ Valid 4 Jam</p>
                    <p className="text-[11px] text-gray-400 mt-1">Fleksibel digunakan sesuai jadwal Anda.</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("map");
                    setViewMode("search");
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-xl hover:opacity-90 active:scale-[0.99] transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Rute & Beli Tiket Sekarang</span>
                </button>
              </div>
            ) : (
              /* Active State: Tiket Aktif & Boarding Pass Siap Digunakan */
              <div
                className="w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-xl space-y-5 animate-fadeIn"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                {/* Active Status Badge */}
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Tiket Aktif • Siap Tap-In
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-400">
                    {activeTicket.id}
                  </span>
                </div>

                {/* Route Header */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm">
                    {activeTicket.vehicleType === "train" ? (
                      <Train className="w-6 h-6" />
                    ) : (
                      <Bus className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight" style={{ color: "var(--foreground)" }}>
                      {activeTicket.routeTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {activeTicket.vehicleName} (#{activeTicket.vehicleCode}) • Plat {activeTicket.plateNumber}
                    </p>
                  </div>
                </div>

                {/* Origin -> Destination Box */}
                <div
                  className="p-4 rounded-2xl border space-y-3"
                  style={{ background: "var(--surface-secondary)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Stasiun Asal</p>
                      <p className="text-sm font-black mt-0.5" style={{ color: "var(--foreground)" }}>
                        {activeTicket.originName}
                      </p>
                      <p className="text-[11px] text-gray-400">{activeTicket.departureTime}</p>
                    </div>

                    <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400 mx-2" />

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase">Stasiun Tujuan</p>
                      <p className="text-sm font-black mt-0.5" style={{ color: "var(--foreground)" }}>
                        {activeTicket.destName}
                      </p>
                      <p className="text-[11px] text-gray-400">{activeTicket.arrivalTime}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    <span>Penumpang: {activeTicket.passengerName} ({activeTicket.passengerCount} Org)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {activeTicket.fare.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="w-full py-4 px-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-xl hover:opacity-90 active:scale-[0.99] transition cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Tampilkan QR Boarding Pass</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        setSelectedRoute(activeTicket.routeData);
                        setActiveTab("map");
                        setViewMode("journey");
                        setActiveStopIndex(1);
                        setToastMsg(`Tracking live armada #${activeTicket.vehicleCode}`);
                      }}
                      className="py-2.5 px-3 rounded-xl border text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Live Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("map");
                        setViewMode("search");
                      }}
                      className="py-2.5 px-3 rounded-xl border text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span>Beli Tiket Lain</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                    <button
                      onClick={() => {
                        clearTickets();
                        setToastMsg("Semua tiket demo berhasil dihapus & saldo dipulihkan.");
                      }}
                      className="w-full py-2 text-[11px] font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition cursor-pointer text-center flex items-center justify-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset / Hapus Tiket Demo (Ulangi Pembelian)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Protected Auth State for History Tab */}
        {activeTab === "history" && !isLoggedIn && (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mb-4 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
              <History className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-display tracking-tight mb-2" style={{ color: "var(--foreground)" }}>
              Riwayat Perjalanan Memerlukan Akun
            </h2>
            <p className="text-sm max-w-md mb-6 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
              Masuk untuk menyimpan riwayat perjalanan, melihat boarding pass sebelumnya, dan analisis pengeluaran transportasi.
            </p>
            <button
              onClick={() => {
                sessionStorage.setItem("urbanride-active-tab", "history");
                router.push("/login");
              }}
              className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg hover:opacity-90 transition cursor-pointer"
            >
              Masuk Sekarang
            </button>
          </div>
        )}

        {/* Standalone History Tab View (Logged In) */}
        {activeTab === "history" && isLoggedIn && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="max-w-[1080px] w-full mx-auto py-2 sm:py-3 px-2 sm:px-4 flex-1 min-h-0 flex flex-col overflow-hidden">
              <HistoryView
                onRebookRoute={(destName) => {
                  setActiveTab("map");
                  setViewMode("search");
                  setToastMsg(`Rebooking trip to ${destName}`);
                }}
                onViewTicketModal={handleViewTicket}
              />
            </div>
          </div>
        )}

      </main>

      {/* Ticket Modal View */}
      {showTicketModal && (
        <TicketView
          route={activeTicket ? activeTicket.routeData : selectedRoute}
          onClose={() => setShowTicketModal(false)}
        />
      )}

      {/* Auth Prompt Modal when selecting route as guest */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        pendingRoute={pendingRoute}
        onQuickLogin={handleQuickLogin}
        onGoToLogin={handleGoToLogin}
      />

      {/* Trip Completed Celebration & Arrival Modal */}
      <TripCompletedModal
        isOpen={showCompletedModal}
        route={completedRoute || selectedRoute}
        onClose={() => setShowCompletedModal(false)}
        onViewHistory={() => {
          setShowCompletedModal(false);
          setActiveTab("history");
        }}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
