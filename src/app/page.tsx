"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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
import { Bus, MapPin, Sparkles, Navigation, Layers, X, Search, ArrowLeft } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"map" | "routes" | "trips" | "ticket" | "history">("map");
  const [viewMode, setViewMode] = useState<"search" | "results" | "detail" | "journey">("search");

  const [origin, setOrigin] = useState<LocationItem>(LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationItem>(LOCATIONS[2]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(MOCK_ROUTES[0]);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(1);

  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  // Uber / Grab Style Floating Search Bar & Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Handle Search submit
  const handleSearch = (fromLoc: LocationItem, toLoc: LocationItem, preference: string) => {
    setIsLoadingSearch(true);
    setOrigin(fromLoc);
    setDestination(toLoc);

    setTimeout(() => {
      setIsLoadingSearch(false);
      setViewMode("results");
      setActiveTab("routes");
      setToastMsg(`Found 3 routes to ${toLoc.name}`);
    }, 600);
  };

  // Handle selecting a route card
  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
    setViewMode("detail");
  };

  // Handle Start Journey
  const handleStartJourney = (route: RouteOption) => {
    setSelectedRoute(route);
    setViewMode("journey");
    setActiveTab("trips");
    setActiveStopIndex(1);
    setIsSearchModalOpen(false); // Close modal on journey start to show 100% full map
    setToastMsg(`Journey Started! Tracking ${route.vehicle.name}`);
  };

  // Handle End Journey
  const handleEndJourney = () => {
    setViewMode("search");
    setActiveTab("map");
    setToastMsg("Journey ended safely.");
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans pb-20 md:pb-6 transition-colors"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "map" && viewMode === "results") setViewMode("search");
          if (tab === "ticket") setShowTicketModal(true);
        }}
      />

      {/* Success Feedback Toast */}
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 sm:px-8 py-2 sm:py-3 space-y-4">

        {/* Quick System Stats Cards Top Placement */}
        {(activeTab === "map" || activeTab === "routes" || activeTab === "trips") && (
          <QuickStatsBar />
        )}

        {/* Hero Section & Map Dashboard */}
        {(activeTab === "map" || activeTab === "routes" || activeTab === "trips") && (
          <div
            className="relative w-full h-[580px] sm:h-[640px] md:h-[calc(100vh-220px)] min-h-[500px] rounded-3xl overflow-hidden shadow-sm border flex flex-col md:flex-row"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >

            {/* Left Sidebar Control Panel (DESKTOP ONLY - Always Visible Side-by-Side) */}
            <div
              className="hidden md:flex md:w-[400px] lg:w-[440px] p-5 z-20 overflow-y-auto max-h-full backdrop-blur-md border-r flex-col space-y-4 shrink-0"
              style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
            >
              {/* Tab navigation indicators inside panel */}
              <div
                className="flex items-center justify-between text-xs font-bold pb-2 border-b"
                style={{ color: "var(--foreground-muted)", borderColor: "var(--border)" }}
              >
                <span className="flex items-center space-x-1.5" style={{ color: "var(--foreground)" }}>
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span className="capitalize">{viewMode} Mode</span>
                </span>

                {viewMode !== "search" && (
                  <button
                    onClick={() => setViewMode("search")}
                    className="text-[11px] font-semibold underline transition"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    Reset Search
                  </button>
                )}
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
                />
              )}

              {/* Step 4: Live Navigation & Vehicle Tracking */}
              {viewMode === "journey" && (
                <LiveNavigationPanel
                  route={selectedRoute}
                  onEndJourney={handleEndJourney}
                  onViewTicket={() => setShowTicketModal(true)}
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
                      <Search className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Mau pergi ke mana?</span>
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {origin.name.split(" ")[0]} ➔ {destination.name.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                  <span className="px-3.5 py-2 bg-black text-white text-xs font-extrabold rounded-xl shrink-0 group-hover:bg-emerald-600 transition shadow-md flex items-center space-x-1">
                    <span>Cari Rute</span>
                  </span>
                </div>
              </div>

              {/* Floating Vehicle Tracking Card (Top Right Desktop/Mobile) */}
              <div className="absolute top-4 right-4 z-10 hidden sm:block">
                <div
                  className="p-3.5 rounded-2xl w-64 shadow-xl space-y-2 backdrop-blur-md border"
                  style={{ background: "var(--panel-bg)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black flex items-center space-x-1.5" style={{ color: "var(--foreground)" }}>
                      <Bus className="w-4 h-4 text-emerald-600" />
                      <span>{selectedRoute.vehicle.name}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      ● ON ROUTE
                    </span>
                  </div>

                  <div className="text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
                    <p className="truncate font-semibold" style={{ color: "var(--foreground)" }}>
                      {selectedRoute.vehicle.currentLocationName}
                    </p>
                    <p className="text-[10px]">↓ Next: {selectedRoute.vehicle.nextStopName}</p>
                  </div>

                  <div
                    className="flex items-center justify-between pt-1 border-t text-xs"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="font-extrabold text-emerald-600">{selectedRoute.vehicle.estimatedArrivalNextStop}</span>
                    <button
                      onClick={() => {
                        setViewMode("journey");
                        setActiveTab("trips");
                      }}
                      className="px-2.5 py-1 bg-black text-white text-[10px] font-bold rounded-lg hover:bg-gray-800 transition"
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
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-full font-extrabold text-xs shadow-md active:scale-95 transition"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                <span>Kembali ke Peta</span>
              </button>

              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-emerald-600 hidden sm:block" />
                <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
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
                    onViewTicket={() => setShowTicketModal(true)}
                    onStopIndexChange={(idx) => setActiveStopIndex(idx)}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Standalone Ticket Tab View */}
        {activeTab === "ticket" && !showTicketModal && (
          <div className="py-6 flex justify-center">
            <button
              onClick={() => setShowTicketModal(true)}
              className="py-3 px-6 bg-black text-white rounded-full font-bold text-sm shadow-xl"
            >
              Open Digital Ticket Boarding Pass
            </button>
          </div>
        )}

        {/* Standalone History Tab View */}
        {activeTab === "history" && (
          <div className="max-w-2xl mx-auto py-2">
            <HistoryView
              onRebookRoute={(destName) => {
                setActiveTab("map");
                setViewMode("search");
                setToastMsg(`Rebooking trip to ${destName}`);
              }}
              onViewTicketModal={() => setShowTicketModal(true)}
            />
          </div>
        )}

      </main>

      {/* Ticket Modal View */}
      {showTicketModal && (
        <TicketView
          route={selectedRoute}
          onClose={() => setShowTicketModal(false)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "ticket") setShowTicketModal(true);
        }}
      />
    </div>
  );
}
