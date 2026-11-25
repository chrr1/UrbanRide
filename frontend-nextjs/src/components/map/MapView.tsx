"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Bus, Train, Layers, LocateFixed } from "lucide-react";
import { RouteOption, VehicleInfo, LocationItem, StopItem } from "@/data/mockData";
import { MAP_PROVIDERS } from "@/config/mapConfig";

const DEFAULT_CENTER: [number, number] = [-6.1980, 106.8280];
const DEFAULT_ZOOM = 13;

interface MapViewProps {
  selectedRoute?: RouteOption | null;
  activeVehicle?: VehicleInfo | null;
  locations: LocationItem[];
  originLocation?: LocationItem | null;
  destinationLocation?: LocationItem | null;
  activeJourneyMode?: boolean;
  activeStopIndex?: number;
  onSelectStation?: (location: LocationItem) => void;
}

export default function MapView({
  selectedRoute,
  activeVehicle,
  locations,
  originLocation,
  destinationLocation,
  activeJourneyMode = false,
  activeStopIndex = 0,
  onSelectStation,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);
  const initialViewRef = useRef<{ center: L.LatLng; zoom: number } | null>(null);
  const hasSavedInitialViewRef = useRef<boolean>(false);

  const [isMapMoved, setIsMapMoved] = useState<boolean>(false);

  // Inisialisasi peta Leaflet dan canvas utama
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Menentukan titik tengah peta (koordinat Jakarta Pusat)
    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    initialViewRef.current = {
      center: L.latLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]),
      zoom: DEFAULT_ZOOM,
    };

    // Mengambil tile peta dasar dari OpenStreetMap
    const currentProvider = MAP_PROVIDERS.openStreetMap;
    L.tileLayer(currentProvider.url, {
      attribution: currentProvider.attribution,
      maxZoom: currentProvider.maxZoom,
    }).addTo(map);

    // Kontrol zoom peta di pojok kanan bawah
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersRef.current = layerGroup;
    mapRef.current = map;

    // CRITICAL: invalidateSize ensures Leaflet recalculates container
    // dimensions after Next.js dynamic import finishes painting the DOM.
    // Without this, the map renders in a 0x0 container and tiles are blank.
    const rafId = requestAnimationFrame(() => {
      if (mapRef.current) {
        try {
          map.invalidateSize({ animate: false });
        } catch {
          // ignore if unmounted
        }
      }
    });

    // Also listen for container resize (flex layout changes)
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        try {
          map.invalidateSize({ animate: false });
        } catch {
          // ignore if unmounted
        }
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Pantau pergeseran/zoom peta untuk menandai apakah posisi berubah dari posisi awal
    const handleViewportChange = () => {
      if (!initialViewRef.current) return;
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      const distance = currentCenter.distanceTo(initialViewRef.current.center);
      const zoomChanged = Math.abs(currentZoom - initialViewRef.current.zoom) > 0.01;
      setIsMapMoved(distance > 25 || zoomChanged);
    };

    map.on("moveend", handleViewportChange);
    map.on("zoomend", handleViewportChange);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      map.off("moveend", handleViewportChange);
      map.off("zoomend", handleViewportChange);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers & Polylines when selected route / locations change
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = markersRef.current;
    if (!map || !layerGroup) return;

    // Clear previous markers & polylines
    layerGroup.clearLayers();
    polylinesRef.current.forEach((pl) => pl.remove());
    polylinesRef.current = [];

    const bounds: [number, number][] = [];

    // Helper: SVG Custom Icon Creators
    const createCustomIcon = (html: string, className = "", iconSize: [number, number] = [36, 36]) => {
      return L.divIcon({
        html,
        className: `custom-leaflet-icon ${className}`,
        iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
      });
    };

    // Menampilkan semua stasiun/halte kota ke peta
    locations.forEach((loc) => {
      bounds.push([loc.latitude, loc.longitude]);

      const isOrigin = originLocation?.id === loc.id;
      const isDest = destinationLocation?.id === loc.id;

      // Default station marker — inline styles only
      let iconHtml = `
        <div style="width:32px;height:32px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.18);border:2px solid #1f2937;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.15s">
          <div style="width:10px;height:10px;border-radius:50%;background:#1f2937"></div>
        </div>
      `;

      if (isOrigin) {
        iconHtml = `
          <div style="position:relative;display:flex;align-items:center;justify-content:center">
            <div style="width:36px;height:36px;border-radius:50%;background:#10b981;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;box-shadow:0 4px 12px rgba(16,185,129,0.45);border:2px solid #fff;animation:pulse-ring 2s infinite">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `;
      } else if (isDest) {
        iconHtml = `
          <div style="width:40px;height:40px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.35);border:2px solid #fff">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
          </div>
        `;
      }

      const icon = createCustomIcon(iconHtml, "", [40, 40]);
      const marker = L.marker([loc.latitude, loc.longitude], { icon });

      // Custom Popup — inline styles only (Leaflet renders outside React tree)
      const popupContent = `
        <div style="padding:12px;max-width:220px;font-family:Inter,sans-serif">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">${loc.category}</div>
          <h4 style="font-weight:700;color:#111;font-size:13px;margin:0 0 3px">${loc.name}</h4>
          <p style="font-size:11px;color:#6b7280;margin:0 0 8px">${loc.address}</p>
          <button style="width:100%;padding:6px 12px;background:#111;color:#fff;font-size:11px;font-weight:600;border-radius:8px;border:none;cursor:pointer">
            Set Destination
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 240 });
      marker.on("click", () => {
        if (onSelectStation) onSelectStation(loc);
      });
      layerGroup.addLayer(marker);
    });

    // Menggambar garis jalur rute perjalanan terpilih
    if (selectedRoute && selectedRoute.polylineCoordinates.length > 0) {
      const stops = selectedRoute.stops;

      // Fungsi menggambar garis latar dan garis utama rute
      const drawRouteLines = (coords: [number, number][]) => {
        // Clear previous polylines
        polylinesRef.current.forEach((pl) => pl.remove());
        polylinesRef.current = [];

        // Garis latar bayangan rute
        const bgLine = L.polyline(coords, {
          color: "#94a3b8",
          weight: 6,
          opacity: 0.5,
          lineCap: "round",
        });

        // Garis jalur utama rute
        const mainLine = L.polyline(coords, {
          color: "#111111",
          weight: 5,
          opacity: 0.9,
          dashArray: activeJourneyMode ? "10, 10" : undefined,
          className: activeJourneyMode ? "route-active-line" : "",
        });

        bgLine.addTo(map);
        mainLine.addTo(map);
        polylinesRef.current.push(bgLine, mainLine);
      };

      // Menggambar jalur awal garis rute
      drawRouteLines(selectedRoute.polylineCoordinates);

      // Mengambil API rute jalan raya dari OSRM
      if (stops && stops.length >= 2) {
        const coordParam = stops.map((s) => `${s.longitude},${s.latitude}`).join(";");
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordParam}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
          .then((res) => {
            if (!res.ok) throw new Error("OSRM request failed");
            return res.json();
          })
          .then((data) => {
            if (data.routes && data.routes[0] && data.routes[0].geometry?.coordinates) {
              const roadCoords: [number, number][] = data.routes[0].geometry.coordinates.map(
                (pt: [number, number]) => [pt[1], pt[0]]
              );
              if (roadCoords.length > 0) {
                drawRouteLines(roadCoords);
              }
            }
          })
          .catch(() => {
            // Tetap menggunakan garis awal jika API OSRM tidak terjangkau
          });
      }

      // Menampilkan marker halte/stasiun di sepanjang rute
      selectedRoute.stops.forEach((stop, idx) => {
        const isPassed = activeJourneyMode && idx < activeStopIndex;
        const isCurrent = activeJourneyMode && idx === activeStopIndex;

        let bg = "#fff"; let border = "#111"; let color = "#111"; let scale = "";
        if (isPassed) { bg = "#10b981"; border = "#fff"; color = "#fff"; }
        if (isCurrent) { bg = "#111"; border = "#fff"; color = "#fff"; scale = "transform:scale(1.25);outline:3px solid rgba(52,211,153,0.4);outline-offset:2px;"; }

        const stopHtml = `
          <div style="width:24px;height:24px;border-radius:50%;background:${bg};border:2px solid ${border};color:${color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;box-shadow:0 2px 6px rgba(0,0,0,0.18);${scale}font-family:Inter,sans-serif">
            ${idx + 1}
          </div>
        `;
        const stopIcon = createCustomIcon(stopHtml, "", [24, 24]);
        const stopMarker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon });
        stopMarker.bindTooltip(`<b>${stop.name}</b><br/>ETA: ${stop.time}`, { direction: "top", offset: [0, -12] });
        layerGroup.addLayer(stopMarker);
      });
    }

    // Menampilkan marker posisi armada kendaraan secara realtime
    const veh = activeVehicle || selectedRoute?.vehicle;
    if (veh) {
      const statusBg = veh.status === "delayed" ? "#f59e0b" : "#10b981";

      const vehicleHtml = `
        <div style="display:inline-flex;align-items:center;cursor:pointer">
          <div style="padding:5px 12px;border-radius:9999px;background:#111;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.35);border:2px solid #fff;display:flex;align-items:center;gap:6px;font-weight:700;font-size:11px;font-family:Inter,sans-serif;white-space:nowrap">
            <span style="width:8px;height:8px;border-radius:50%;background:${statusBg};display:inline-block;animation:ping 1s cubic-bezier(0,0,0.2,1) infinite"></span>
            <span>${veh.name}</span>
            <span style="font-size:10px;color:#9ca3af;font-weight:400">| ${veh.estimatedArrivalNextStop}</span>
          </div>
        </div>
      `;

      const vehicleIcon = createCustomIcon(vehicleHtml, "", [160, 36]);
      const vehMarker = L.marker([veh.latitude, veh.longitude], { icon: vehicleIcon, zIndexOffset: 1000 });

      const statusTextStyle = veh.status === "delayed"
        ? "color:#d97706"
        : "color:#059669";

      const vehPopup = `
        <div style="padding:12px;width:200px;font-family:Inter,sans-serif">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:11px;font-weight:700;${statusTextStyle}">${veh.statusText}</span>
            <span style="font-size:10px;font-weight:600;color:#9ca3af">${veh.plateNumber}</span>
          </div>
          <h4 style="font-weight:700;font-size:14px;color:#111;margin:0 0 2px">${veh.name}</h4>
          <p style="font-size:11px;color:#6b7280;margin:0">Driver: <b>${veh.driverName}</b></p>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;font-size:11px">
            <span style="color:#6b7280">Next stop:</span>
            <span style="font-weight:600;color:#111">${veh.nextStopName}</span>
          </div>
        </div>
      `;
      vehMarker.bindPopup(vehPopup, { maxWidth: 240 });
      layerGroup.addLayer(vehMarker);
    }

    // Mengatur sudut pandang kamera peta agar seluruh rute terlihat penuh
    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [80, 80], maxZoom: 15 });
    }

    // Simpan posisi awal & tingkat zoom pertama kali peta selesai menyesuaikan bounds
    if (!hasSavedInitialViewRef.current) {
      initialViewRef.current = {
        center: map.getCenter(),
        zoom: map.getZoom(),
      };
      hasSavedInitialViewRef.current = true;
      setIsMapMoved(false);
    }
  }, [selectedRoute, activeVehicle, locations, originLocation, destinationLocation, activeJourneyMode, activeStopIndex, onSelectStation]);

  // Mengembalikan peta ke posisi awal dan tingkat zoom sebelumnya
  const handleRecenter = () => {
    const map = mapRef.current;
    if (!map) return;

    const target = initialViewRef.current ?? {
      center: L.latLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]),
      zoom: DEFAULT_ZOOM,
    };

    map.flyTo(target.center, target.zoom, {
      animate: true,
      duration: 0.6,
    });
    setIsMapMoved(false);
  };

  const [activeFilter, setActiveFilter] = useState<"all" | "bus" | "train">("all");

  return (
    <div className="relative w-full h-full min-h-[500px]">

      {/* Bar filter moda transportasi (Semua, Bus, Kereta) di atas peta */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-1.5 p-1.5 backdrop-blur-md rounded-full shadow-lg border select-none"
        style={{ background: "var(--panel-bg)", borderColor: "var(--border)" }}
      >
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all text-sm font-semibold`}
          style={activeFilter === "all"
            ? { background: "var(--foreground)", color: "var(--background)" }
            : { color: "var(--foreground-muted)" }
          }
        >
          <Layers className="w-4 h-4" />
          <span>All</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("bus")}
          className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all text-sm font-semibold"
          style={activeFilter === "bus"
            ? { background: "var(--accent-cyber-lime)", color: "#000" }
            : { color: "var(--foreground-muted)" }
          }
        >
          <Bus className="w-4 h-4" />
          <span>Bus</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("train")}
          className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all text-sm font-semibold"
          style={activeFilter === "train"
            ? { background: "var(--foreground)", color: "var(--background)" }
            : { color: "var(--foreground-muted)" }
          }
        >
          <Train className="w-4 h-4" />
          <span>Metro</span>
        </button>
      </div>

      {/* Tombol Kembali ke Lokasi Awal (Recenter Map) di atas kontrol zoom */}
      <button
        type="button"
        onClick={handleRecenter}
        aria-label="Kembali ke lokasi awal"
        title="Kembali ke lokasi awal"
        className={`absolute bottom-[88px] right-2.5 z-10 w-10 h-10 rounded-xl backdrop-blur-md border shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isMapMoved ? "ring-2 ring-emerald-500/40" : ""
        }`}
        style={{
          background: "var(--panel-bg)",
          borderColor: isMapMoved ? "var(--accent-cyber-lime)" : "var(--border)",
          color: isMapMoved ? "var(--accent-cyber-lime)" : "var(--foreground)",
        }}
      >
        <LocateFixed className="w-5 h-5" />
      </button>

      <div ref={mapContainerRef} className="w-full h-full rounded-2xl overflow-hidden z-0" />
    </div>
  );
}
