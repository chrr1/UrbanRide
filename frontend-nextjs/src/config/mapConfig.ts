// Konfigurasi penyedia tile peta dan API eksternal yang digunakan UrbanRide

export interface MapProviderConfig {
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  requiresApiKey: boolean;
}

export const MAP_PROVIDERS: Record<string, MapProviderConfig> = {
  // 1. OpenStreetMap Standard (DEFAULT - 100% Free, No Watermark, No API Key)
  openStreetMap: {
    name: "OpenStreetMap Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    requiresApiKey: false,
  },

  // 2. Esri Light Gray Canvas (100% Free, Sleek Modern Minimalist, No API Key)
  esriLight: {
    name: "Esri Light Gray Canvas",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    maxZoom: 16,
    requiresApiKey: false,
  },

  // 3. CartoDB Positron (Requires CARTO API Key)
  cartoLight: {
    name: "CartoDB Positron (Requires API Key)",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    requiresApiKey: true,
  },

  // 4. MapTiler Dataviz Light (Requires Free API Key from maptiler.com)
  mapTilerDataviz: {
    name: "MapTiler Dataviz Light",
    url: "https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key={apiKey}",
    attribution:
      '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    requiresApiKey: true,
  },
};

// API eksternal: routing OSRM dan geocoding Nominatim
export const EXTERNAL_APIS = {
  osrmRoutingApi: "https://router.project-osrm.org/route/v1/driving",
  nominatimGeocodingApi: "https://nominatim.openstreetmap.org/search",
};
