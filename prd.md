# PRD — UrbanRide

## Smart City Transportation & Route Tracking Platform

**Versi:** 2.0  
**Platform:** Web Responsive  
**Framework:** Next.js + TypeScript  
**Design Approach:** Mobile-first  
**Status:** Product Design & Frontend Development

---

## 1. Product Overview

### 1.1 Nama Produk

**UrbanRide**

UrbanRide adalah platform transportasi kota yang membantu pengguna menemukan rute, membandingkan pilihan perjalanan, dan memantau perjalanan melalui antarmuka berbasis peta.

### 1.2 Product Vision

UrbanRide dirancang untuk membuat perjalanan menggunakan transportasi kota menjadi:

**Mudah → Cepat → Jelas → Terpantau**

Pengguna dapat mengetahui:
- lokasi saat ini;
- tujuan;
- pilihan transportasi;
- estimasi waktu perjalanan;
- tarif;
- status kendaraan;
- halte berikutnya;
- tujuan akhir.

---

## 2. Problem Statement

Komuter membutuhkan rute publik yang cepat, jelas, dan mudah dipantau.

Masalah utama:
1. Sulit menemukan rute yang sesuai.
2. Informasi transportasi tersebar di banyak tempat.
3. Pengguna tidak selalu mengetahui posisi/status kendaraan.
4. Pengguna membutuhkan petunjuk yang jelas mengenai halte berikutnya dan tujuan.

---

## 3. Product Goals

### Primary Goal

Membantu pengguna menemukan dan mengikuti perjalanan transportasi kota dengan jumlah langkah seminimal mungkin.

### Success Criteria

| Metric | Target |
|---|---:|
| Route search response | < 2 detik |
| Primary task completion | ≤ 4 langkah |
| Responsive breakpoint | 360 / 768 / 1280 px |
| Accessibility | WCAG AA |
| Lighthouse Accessibility | ≥ 90 |
| Dead-end flow | 0 |
| Input validation | 100% |

---

## 4. Target Users

### Persona 01 — Mahasiswa

**Kebutuhan:**
- mencari rute murah;
- mengetahui tarif;
- mencari transportasi menuju kampus;
- mengetahui halte terdekat.

**Prioritas:** Harga → Waktu → Kemudahan

### Persona 02 — Pekerja / Komuter

**Kebutuhan:**
- rute cepat;
- mengetahui keterlambatan;
- memantau kendaraan;
- menghindari transit yang tidak perlu.

**Prioritas:** Waktu → Keandalan → Rute

### Persona 03 — Wisatawan

**Kebutuhan:**
- mencari lokasi tujuan;
- memahami transportasi kota;
- mengetahui halte;
- melihat rute secara visual.

**Prioritas:** Kemudahan → Kejelasan → Navigasi

---

## 5. Product Concept

### "Map First, Information Second."

Peta menjadi elemen visual utama, bukan sekadar background.

Konsep desktop:
- large map sebagai area utama;
- search card sebagai floating element;
- route/vehicle information dalam floating card;
- informasi penting tetap mudah dipindai;
- navigasi tetap sederhana.

Konsep ini mengadaptasi karakter desain referensi:
- landing/dashboard minimal;
- large map;
- floating cards;
- rounded corners;
- whitespace;
- informasi perjalanan yang compact.

---

## 6. Information Architecture

```text
UrbanRide
│
├── Home / Map
│
├── Search Route
│   ├── From
│   ├── Destination
│   └── Preferences
│
├── Route Results
│   ├── Recommended
│   ├── Fastest
│   └── Cheapest
│
├── Route Detail
│   ├── Timeline
│   ├── Stops
│   ├── Fare
│   └── Vehicle Status
│
├── Live Navigation
│   ├── Current Location
│   ├── Next Stop
│   ├── Progress
│   └── Destination
│
├── Ticket
│
└── History
```

---

## 7. Navigation

### Desktop

Gunakan top navigation:

```text
UrbanRide

Map     Routes     Trips     History

                            Help   Profile
```

### Mobile

Gunakan bottom navigation:

```text
Map     Routes     Trips     More
```

---

## 8. Homepage / Map Dashboard

Homepage menjadi halaman utama UrbanRide.

### 8.1 Header

- Logo UrbanRide
- Map
- Routes
- Trips
- History
- Profile

### 8.2 Hero Map

Map mengambil sekitar 70–80% visual viewport desktop.

Di atas map terdapat search card.

### 8.3 Floating Search Card

```text
Where do you want to go?

From
[ Current Location ]

To
[ Search destination ]

[ Find Route ]
```

Karakter:
- white surface;
- rounded corners;
- subtle shadow;
- compact;
- floating di atas map.

### 8.4 Map Markers

| Marker | Fungsi |
|---|---|
| User location | Posisi pengguna |
| Vehicle | Kendaraan |
| Station | Halte/stasiun |
| Transfer | Titik transit |
| Destination | Tujuan |

### 8.5 Live Vehicle Card

```text
BUS 24

● On Route

Central Station
↓
University Station

7 min away

[ View Trip ]
```

---

## 9. Quick Statistics

Di bawah hero map dapat ditampilkan statistik singkat:

```text
12+              38              24              8
Routes           Stations        Vehicles        Lines
```

Statistik bersifat informatif dan tidak menjadi fitur utama.

---

## 10. Route Search

### Input

```text
From
[ Current Location ]

To
[ Search destination ]
```

Optional:

```text
Departure
[ Now ▼ ]

Preference
[ Fastest ▼ ]
```

Primary CTA:

**Find Route**

### Autocomplete

Saat pengguna mengetik tujuan, tampilkan suggestion:

```text
Search destination

University
University Station
University Campus
University Mall
```

---

## 11. Route Results

Setelah pencarian:

```text
Routes to University

3 routes found
```

Contoh route card:

```text
FASTEST

24 min
Bus 12 → Walk

08:15 ───────────── 08:39

Rp 5.000

2 stops

[ View Route ]
```

### Informasi minimum route card

- total waktu;
- tarif;
- jumlah transit;
- moda transportasi;
- departure;
- arrival;
- status kendaraan.

### Sorting

- Recommended
- Fastest
- Cheapest

---

## 12. Route Detail

```text
← Back

University

24 min · Rp 5.000

────────────────────

08:15
● Current Location

│
│ Walk 4 min
│
○ Central Station

│
│ Bus 12
│
○ City Center

│
│ Walk 3 min
│
● University

08:39
```

---

## 13. Vehicle Status

```text
BUS 12

● On Time

Current location
Central Station

Next stop
City Center

Estimated arrival
08:31
```

Status harus mudah dipindai secara visual dan tidak hanya bergantung pada warna.

---

## 14. Live Navigation

Setelah pengguna memilih **Start Journey**, UI masuk ke mode perjalanan aktif.

```text
┌───────────────────────────────┐
│                               │
│             MAP               │
│                               │
│          ●                    │
│          │                    │
│      ────●────                │
│          │                    │
│          ●                    │
│                               │
├───────────────────────────────┤
│ BUS 12                        │
│                               │
│ Next stop                     │
│ City Center                   │
│                               │
│ 7 min                         │
│                               │
│ 3 stops remaining             │
└───────────────────────────────┘
```

---

## 15. Journey Progress

Gunakan progress indicator:

```text
●────────●────────○────────○

You      Next     Transfer   Destination
```

Atau timeline:

```text
Central Station
      ↓
City Center
      ↓
Market
      ↓
University
```

---

## 16. Ticket

Halaman Ticket tetap tersedia, tetapi transaksi finansial nyata berada di luar MVP.

Contoh:

```text
My Ticket

URBANRIDE

Route
Bus 12

From
Central Station

To
University

Date
01 Oct 2026

Status
VALID
```

---

## 17. History

```text
Recent Trips

Today

University
Bus 12
24 min · Rp 5.000

────────────────

Yesterday

Central Mall
Bus 8
31 min · Rp 6.000
```

---

## 18. Required UI States

Setiap fitur/komponen yang relevan wajib memiliki state berikut.

### Normal
- data tersedia;
- aksi utama aktif;
- navigasi jelas.

### Loading
- skeleton;
- loading indicator;
- pesan proses jika diperlukan.

### Empty
```text
No routes found

We couldn't find a route
between these locations.

[ Change Destination ]
```

### Error
```text
Something went wrong

We couldn't load the route.
Please check your connection.

[ Try Again ]
```

### Success
```text
✓ Route saved

Your route has been added
to your recent trips.
```

---

## 19. Design Direction

### Visual Style

**Minimalist + Premium + Map-centric**

Karakter:
- banyak whitespace;
- rounded corners;
- thin borders;
- soft shadow;
- clean typography;
- muted map;
- floating cards;
- sedikit warna aksen;
- icon sederhana;
- informasi compact.

### Color System

#### Background

```text
Primary Background: #F7F7F5
Surface: #FFFFFF
Secondary Surface: #F1F2F0
```

#### Text

```text
Primary: #111111
Secondary: #6B6B6B
Muted: #999999
```

#### Accent

```text
Accent: #111111
```

Status menggunakan warna semantik:
- Success → Green
- Warning → Orange
- Error → Red
- Info → Blue

### Typography

Font yang disarankan:

**Inter**

Hierarchy:
- Hero: 48–64px
- Page heading: 32–40px
- Section heading: 24px
- Card heading: 16–18px
- Body: 14–16px
- Metadata: 12–13px

### Card

```text
background: white
border-radius: 16–24px
border: 1px solid #EAEAEA
box-shadow: subtle
```

---

## 20. Responsive Design

### Mobile — 360+

- satu kolom;
- bottom navigation;
- map tetap dominan;
- CTA mudah dijangkau;
- konten prioritas ditampilkan lebih dahulu.

```text
┌──────────────────────┐
│ UrbanRide       ☰    │
├──────────────────────┤
│                      │
│        MAP           │
│                      │
├──────────────────────┤
│ Search               │
│ From                 │
│ To                   │
│ [ Find Route ]       │
├──────────────────────┤
│ Map Routes Trips More│
└──────────────────────┘
```

### Tablet — 768+

- grid dua kolom;
- navigasi ringkas;
- panel detail adaptif;
- target sentuhan minimal 44px.

```text
┌──────────────────────────────┐
│ Header                       │
├───────────────┬──────────────┤
│ Search / List │              │
│               │     MAP      │
│ Route Card    │              │
│ Route Card    │              │
└───────────────┴──────────────┘
```

### Desktop — 1280+

- top navigation atau sidebar;
- map sebagai area utama;
- grid 2–4 kolom bila diperlukan;
- informasi lebih padat;
- maksimal lebar konten terkontrol.

---

## 21. Component Architecture

```text
components/
│
├── layout/
│   ├── Header
│   ├── Sidebar
│   └── BottomNavigation
│
├── map/
│   ├── MapView
│   ├── MapMarker
│   ├── RouteLine
│   └── VehicleMarker
│
├── search/
│   ├── LocationInput
│   ├── DestinationInput
│   └── SearchPanel
│
├── route/
│   ├── RouteCard
│   ├── RouteList
│   ├── RouteTimeline
│   └── RouteSummary
│
├── journey/
│   ├── JourneyProgress
│   ├── VehicleStatus
│   └── NextStop
│
├── ticket/
│   └── TicketCard
│
└── feedback/
    ├── LoadingState
    ├── EmptyState
    ├── ErrorState
    └── SuccessToast
```

---

## 22. Data Model

Untuk prototype gunakan dummy/local data. Struktur harus siap diganti API.

### Location

```typescript
type Location = {
  id: string
  name: string
  latitude: number
  longitude: number
}
```

### Route

```typescript
type Route = {
  id: string
  name: string
  transportType: "bus" | "train" | "walk"
  duration: number
  fare: number
  stops: Stop[]
  status: "on-time" | "delayed"
}
```

### Stop

```typescript
type Stop = {
  id: string
  name: string
  latitude: number
  longitude: number
}
```

### Journey

```typescript
type Journey = {
  id: string
  origin: Location
  destination: Location
  route: Route
  status: "planned" | "active" | "completed"
}
```

---

## 23. Main User Flow

```text
Open UrbanRide
      ↓
Current Location
      ↓
Destination
      ↓
Route Results
      ↓
Route Detail
      ↓
Start Journey
      ↓
Live Tracking
      ↓
Destination
```

Flow utama:
1. Masukkan tujuan.
2. Pilih rute.
3. Lihat detail.
4. Mulai perjalanan.
5. Pantau halte.
6. Selesai.

---

## 24. UX Rules

1. Setiap halaman memiliki satu primary CTA.
2. Pengguna tidak kehilangan input ketika kembali ke halaman sebelumnya.
3. Informasi penting ditampilkan terlebih dahulu.
4. Map menjadi konteks visual, bukan pengganti informasi tekstual.
5. Status tidak boleh hanya dibedakan menggunakan warna.
6. Semua input memiliki label permanen.
7. Error message menjelaskan masalah dan tindakan berikutnya.
8. Perubahan data selalu memberikan feedback yang terlihat.
9. Navigasi keyboard harus memiliki urutan fokus yang logis.
10. Target sentuhan minimal 44px.

---

## 25. MVP Scope

### P0 — Wajib

| Feature | Priority |
|---|---|
| Map dashboard | P0 |
| Search origin | P0 |
| Search destination | P0 |
| Route results | P0 |
| Route detail | P0 |
| Transport mode | P0 |
| Estimated time | P0 |
| Fare | P0 |
| Vehicle status | P0 |
| Live journey UI | P0 |
| History | P0 |
| Loading | P0 |
| Empty | P0 |
| Error | P0 |
| Success feedback | P0 |
| Responsive | P0 |
| Accessibility | P0 |

### P1

- filter rute;
- favorite route;
- favorite destination;
- recent locations;
- filter transport type;
- route comparison.

### P2

- personalisasi;
- fitur sosial;
- rekomendasi berdasarkan pola penggunaan.

---

## 26. Out of Scope

Tidak termasuk MVP:

- Social login;
- integrasi pihak ketiga;
- pembayaran nyata;
- transaksi finansial;
- production push notification;
- full admin panel;
- advanced AI analytics.

---

## 27. Technical Requirements

### Frontend

```text
Next.js
TypeScript
CSS / Tailwind CSS
Reusable Components
Responsive Layout
```

### Data

Tahap prototype:

```text
Local JSON / Mock Data
```

Arsitektur pengembangan:

```text
Frontend
   ↓
API
   ↓
Transportation Data
```

Implementasi harus menghindari ukuran tetap yang dapat memotong konten.

---

## 28. Accessibility

Minimum requirements:

- WCAG AA contrast;
- keyboard navigation;
- visible focus state;
- semantic HTML;
- accessible labels;
- button/touch target minimal 44px;
- warna bukan satu-satunya indikator status;
- form menggunakan label permanen;
- pesan error spesifik;
- urutan fokus logis.

---

## 29. Definition of Done

### UI

- [ ] Responsive 360px
- [ ] Responsive 768px
- [ ] Responsive 1280px
- [ ] Tidak ada text overflow
- [ ] Tidak ada overlapping component
- [ ] Spacing konsisten

### UX

- [ ] Primary flow dapat diselesaikan
- [ ] Tidak ada dead-end
- [ ] Primary CTA jelas
- [ ] Error dapat dipulihkan
- [ ] Loading state tersedia
- [ ] Empty state tersedia
- [ ] Success feedback tersedia

### Technical

- [ ] TypeScript tanpa error
- [ ] Reusable components
- [ ] Mock data terstruktur
- [ ] Semantic HTML
- [ ] Accessible form

### Testing

- [ ] 360px PASS
- [ ] 768px PASS
- [ ] 1280px PASS
- [ ] Keyboard navigation PASS
- [ ] Accessibility ≥ 90
- [ ] Primary flow PASS

---

## 30. Deliverables

### UX

- User flow
- Information architecture
- Wireframe

### UI

- Design system
- High-fidelity desktop design
- High-fidelity tablet design
- High-fidelity mobile design

### Prototype

- Interactive prototype
- Route search
- Route selection
- Journey tracking
- History

### Development

- Next.js project
- TypeScript
- Reusable components
- Responsive implementation
- Mock data

### Documentation

- README
- Screenshots
- Testing evidence
- Accessibility testing

---

## 31. Final UI Direction

UrbanRide harus memiliki karakter visual:

**Map-first transportation dashboard**

Struktur desktop utama:

```text
┌────────────────────────────────────────────────────────────┐
│ URBANRIDE       MAP    ROUTES    TRIPS       PROFILE       │
├──────────────────┬─────────────────────────────────────────┤
│                  │                                         │
│ Search           │                                         │
│                  │                  MAP                    │
│ From             │                                         │
│ [ Location ]     │             ●──────●                    │
│                  │                  ╲                      │
│ To               │                   ●                     │
│ [ Destination ]  │                                         │
│                  │                         ┌─────────────┐ │
│ [ Find Route ]   │                         │ Trip Detail │ │
│                  │                         └─────────────┘ │
│ Recent Routes    │                                         │
└──────────────────┴─────────────────────────────────────────┘
```

Prinsip akhir:
- **Map adalah pusat pengalaman.**
- Search, route, dan status kendaraan menggunakan floating cards.
- Informasi penting harus terlihat tanpa membuat pengguna membuka terlalu banyak halaman.
- Visual harus minimal, bersih, modern, dan memiliki banyak whitespace.
- Mobile tetap mempertahankan konsep map-first tetapi menggunakan bottom navigation dan layout satu kolom.
