// Data tiruan: lokasi, rute, kendaraan, dan riwayat perjalanan untuk tampilan demo
export interface LocationItem {
  id: string;
  name: string;
  category: "station" | "campus" | "mall" | "landmark" | "hub";
  address: string;
  latitude: number;
  longitude: number;
}

export interface StopItem {
  id: string;
  name: string;
  time: string;
  latitude: number;
  longitude: number;
  passed?: boolean;
}

export interface VehicleInfo {
  id: string;
  name: string; // e.g. "BUS 12"
  code: string;
  type: "bus" | "train";
  driverName: string;
  driverAvatar: string;
  plateNumber: string;
  status: "on-time" | "delayed" | "on-route";
  statusText: string;
  delayMinutes?: number;
  currentLocationName: string;
  nextStopName: string;
  estimatedArrivalNextStop: string;
  latitude: number;
  longitude: number;
}

export interface RouteLeg {
  id: string;
  type: "walk" | "bus" | "train";
  modeName: string;
  lineCode?: string;
  durationMinutes: number;
  fromName: string;
  toName: string;
  stopsCount?: number;
  color?: string;
}

export interface RouteOption {
  id: string;
  title: string;
  badge: "RECOMMENDED" | "FASTEST" | "CHEAPEST";
  totalDurationMinutes: number;
  fare: number;
  departureTime: string;
  arrivalTime: string;
  stopsCount: number;
  transportTypes: ("bus" | "train" | "walk")[];
  vehicle: VehicleInfo;
  legs: RouteLeg[];
  stops: StopItem[];
  polylineCoordinates: [number, number][];
}

export interface TripHistoryItem {
  id: string;
  destination: string;
  origin: string;
  routeName: string;
  date: string;
  durationMinutes: number;
  fare: number;
  transportType: "bus" | "train";
  ticketCode: string;
  status: "COMPLETED" | "VALID" | "EXPIRED";
}

// Coordinate origin base around city center (e.g., Jakarta / Stockholm-like city grid)
export const LOCATIONS: LocationItem[] = [
  {
    id: "loc-current",
    name: "Current Location (Sudirman Hub)",
    category: "hub",
    address: "Jl. Jend. Sudirman No. 45",
    latitude: -6.2088,
    longitude: 106.8229,
  },
  {
    id: "loc-1",
    name: "Central Station",
    category: "station",
    address: "Central Transit Hub Platform 2",
    latitude: -6.2000,
    longitude: 106.8250,
  },
  {
    id: "loc-2",
    name: "University Station (Campus Utama)",
    category: "campus",
    address: "Jl. Ganesha / University Ring Road",
    latitude: -6.1850,
    longitude: 106.8380,
  },
  {
    id: "loc-3",
    name: "City Center Square",
    category: "landmark",
    address: "Merdeka Plaza Center",
    latitude: -6.1920,
    longitude: 106.8310,
  },
  {
    id: "loc-4",
    name: "Central Mall & Business Park",
    category: "mall",
    address: "Jl. HR Rasuna Said Lot 8",
    latitude: -6.2150,
    longitude: 106.8300,
  },
  {
    id: "loc-5",
    name: "Tech Park Terminal",
    category: "hub",
    address: "Innovation Blvd No. 12",
    latitude: -6.1780,
    longitude: 106.8450,
  },
  {
    id: "loc-6",
    name: "City Harbor & Marina",
    category: "landmark",
    address: "Harbor Promenade Gate 3",
    latitude: -6.1650,
    longitude: 106.8100,
  },
];

export const MOCK_ROUTES: RouteOption[] = [
  {
    id: "route-fastest",
    title: "Express Bus 12 Line",
    badge: "FASTEST",
    totalDurationMinutes: 24,
    fare: 5000,
    departureTime: "08:15",
    arrivalTime: "08:39",
    stopsCount: 2,
    transportTypes: ["walk", "bus", "walk"],
    vehicle: {
      id: "veh-bus-12",
      name: "BUS 12",
      code: "B-1294",
      type: "bus",
      driverName: "Harris Whitaker",
      driverAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      plateNumber: "B 7482 UBR",
      status: "on-time",
      statusText: "On Time",
      currentLocationName: "Central Station",
      nextStopName: "City Center Square",
      estimatedArrivalNextStop: "7 min away",
      latitude: -6.2000,
      longitude: 106.8250,
    },
    legs: [
      {
        id: "leg-1",
        type: "walk",
        modeName: "Walk",
        durationMinutes: 4,
        fromName: "Current Location",
        toName: "Central Station",
      },
      {
        id: "leg-2",
        type: "bus",
        modeName: "Bus 12",
        lineCode: "Line 12",
        durationMinutes: 17,
        fromName: "Central Station",
        toName: "City Center Square",
        stopsCount: 2,
        color: "#22c55e",
      },
      {
        id: "leg-3",
        type: "walk",
        modeName: "Walk",
        durationMinutes: 3,
        fromName: "City Center Square",
        toName: "University Station",
      },
    ],
    stops: [
      { id: "s1", name: "Sudirman Hub (Start)", time: "08:15", latitude: -6.2088, longitude: 106.8229, passed: true },
      { id: "s2", name: "Central Station", time: "08:19", latitude: -6.2000, longitude: 106.8250, passed: true },
      { id: "s3", name: "City Center Square", time: "08:31", latitude: -6.1920, longitude: 106.8310, passed: false },
      { id: "s4", name: "University Station (Destination)", time: "08:39", latitude: -6.1850, longitude: 106.8380, passed: false },
    ],
    polylineCoordinates: [
      [-6.2088, 106.8229],
      [-6.2000, 106.8250],
      [-6.1920, 106.8310],
      [-6.1850, 106.8380],
    ],
  },
  {
    id: "route-recommended",
    title: "Metro Express M1 + Walk",
    badge: "RECOMMENDED",
    totalDurationMinutes: 28,
    fare: 6500,
    departureTime: "08:12",
    arrivalTime: "08:40",
    stopsCount: 3,
    transportTypes: ["walk", "train", "walk"],
    vehicle: {
      id: "veh-train-m1",
      name: "METRO M1",
      code: "M1-04",
      type: "train",
      driverName: "Sarah Jenkins",
      driverAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      plateNumber: "M1-SET-88",
      status: "on-time",
      statusText: "On Schedule",
      currentLocationName: "Sudirman Hub",
      nextStopName: "Central Station",
      estimatedArrivalNextStop: "3 min away",
      latitude: -6.2088,
      longitude: 106.8229,
    },
    legs: [
      {
        id: "leg-r1",
        type: "walk",
        modeName: "Walk to Metro",
        durationMinutes: 2,
        fromName: "Current Location",
        toName: "Sudirman Metro Gate",
      },
      {
        id: "leg-r2",
        type: "train",
        modeName: "Metro M1 Line",
        lineCode: "M1",
        durationMinutes: 22,
        fromName: "Sudirman Gate",
        toName: "University Station",
        stopsCount: 3,
        color: "#3b82f6",
      },
      {
        id: "leg-r3",
        type: "walk",
        modeName: "Walk to Campus",
        durationMinutes: 4,
        fromName: "University Metro Exit",
        toName: "University Station",
      },
    ],
    stops: [
      { id: "sr1", name: "Sudirman Hub", time: "08:12", latitude: -6.2088, longitude: 106.8229, passed: true },
      { id: "sr2", name: "Central Station", time: "08:18", latitude: -6.2000, longitude: 106.8250, passed: false },
      { id: "sr3", name: "Tech Park Crossing", time: "08:29", latitude: -6.1890, longitude: 106.8320, passed: false },
      { id: "sr4", name: "University Station", time: "08:40", latitude: -6.1850, longitude: 106.8380, passed: false },
    ],
    polylineCoordinates: [
      [-6.2088, 106.8229],
      [-6.2000, 106.8250],
      [-6.1890, 106.8320],
      [-6.1850, 106.8380],
    ],
  },
  {
    id: "route-cheapest",
    title: "Feeder Bus 8 Direct",
    badge: "CHEAPEST",
    totalDurationMinutes: 35,
    fare: 3500,
    departureTime: "08:10",
    arrivalTime: "08:45",
    stopsCount: 5,
    transportTypes: ["bus"],
    vehicle: {
      id: "veh-bus-8",
      name: "BUS 8",
      code: "B-0811",
      type: "bus",
      driverName: "Ahmad Rizky",
      driverAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      plateNumber: "B 3910 UBR",
      status: "delayed",
      statusText: "Delayed +4 min",
      delayMinutes: 4,
      currentLocationName: "Sudirman South",
      nextStopName: "Central Mall",
      estimatedArrivalNextStop: "9 min away",
      latitude: -6.2150,
      longitude: 106.8300,
    },
    legs: [
      {
        id: "leg-c1",
        type: "bus",
        modeName: "Feeder Bus 8",
        lineCode: "Line 8",
        durationMinutes: 35,
        fromName: "Current Location",
        toName: "University Station",
        stopsCount: 5,
        color: "#f59e0b",
      },
    ],
    stops: [
      { id: "sc1", name: "Sudirman South", time: "08:10", latitude: -6.2150, longitude: 106.8300, passed: true },
      { id: "sc2", name: "Central Mall", time: "08:19", latitude: -6.2050, longitude: 106.8280, passed: false },
      { id: "sc3", name: "City Center Square", time: "08:30", latitude: -6.1920, longitude: 106.8310, passed: false },
      { id: "sc4", name: "University Gate A", time: "08:42", latitude: -6.1870, longitude: 106.8360, passed: false },
      { id: "sc5", name: "University Station", time: "08:45", latitude: -6.1850, longitude: 106.8380, passed: false },
    ],
    polylineCoordinates: [
      [-6.2150, 106.8300],
      [-6.2050, 106.8280],
      [-6.1920, 106.8310],
      [-6.1870, 106.8360],
      [-6.1850, 106.8380],
    ],
  },
];

export const MOCK_HISTORY: TripHistoryItem[] = [
  {
    id: "hist-1",
    destination: "University Station",
    origin: "Sudirman Hub",
    routeName: "Bus 12 Express",
    date: "01 Oct 2026",
    durationMinutes: 24,
    fare: 5000,
    transportType: "bus",
    ticketCode: "UBR-984210",
    status: "VALID",
  },
  {
    id: "hist-2",
    destination: "Central Mall & Business Park",
    origin: "Sudirman Hub",
    routeName: "Feeder Bus 8",
    date: "30 Sep 2026",
    durationMinutes: 31,
    fare: 3500,
    transportType: "bus",
    ticketCode: "UBR-772914",
    status: "COMPLETED",
  },
  {
    id: "hist-3",
    destination: "Tech Park Terminal",
    origin: "City Harbor",
    routeName: "Metro M1 Line",
    date: "28 Sep 2026",
    durationMinutes: 19,
    fare: 6500,
    transportType: "train",
    ticketCode: "UBR-551029",
    status: "COMPLETED",
  },
];
