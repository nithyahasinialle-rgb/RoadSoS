# ROADSoS — Emergency Response Platform

> *"What happens when accident victims cannot call for help?"*

ROADSoS is an offline-first crash detection and emergency response system for road accidents. It uses an ESP32 microcontroller to monitor real-time sensor data, detect crashes autonomously, and dispatch emergency alerts — even when the victim is unconscious and connectivity is zero.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone / download the project
cd RoadSoS

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
RoadSoS/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/page.tsx    # Live telemetry dashboard
│   │   ├── map/page.tsx          # Emergency map
│   │   ├── research/page.tsx     # Design thinking & research
│   │   ├── api/
│   │   │   ├── telemetry/route.ts  # GET/POST telemetry
│   │   │   └── simulate/route.ts   # Simulation endpoint
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── NavBar.tsx
│   │   ├── TelemetryCard.tsx
│   │   ├── EmergencyBadge.tsx
│   │   ├── WorkflowTimeline.tsx
│   │   ├── SimulationControls.tsx
│   │   └── MapView.tsx
│   └── lib/
│       ├── telemetryStore.ts     # In-memory store
│       └── simulationEngine.ts  # Sensor simulation
├── esp32/
│   └── roadsos_firmware.ino     # Arduino firmware
├── tailwind.config.js
├── next.config.js
└── .env.example
```

---

## 🌐 Pages

| Page | URL | Description |
|---|---|---|
| Landing | `/` | Cinematic hero + project overview |
| Dashboard | `/dashboard` | Live telemetry + simulation controls |
| Map | `/map` | OpenStreetMap with emergency routing |
| Research | `/research` | Design thinking & 165+ survey insights |

---

## 🔌 API Endpoints

### `GET /api/telemetry`
Returns the current telemetry state.

```json
{
  "success": true,
  "data": {
    "acceleration": 1.2,
    "rollAngle": 2.4,
    "speed": 62.0,
    "strainValue": 4,
    "crashProbability": 3.2,
    "severity": "normal",
    "emergencyActive": false,
    "bleStatus": "idle",
    "location": { "lat": 12.9716, "lng": 77.5946 }
  }
}
```

### `POST /api/telemetry`
Ingest telemetry from ESP32 device. Body is the same shape as the GET response.

### `POST /api/simulate`
Set simulation mode without an ESP32.

```json
{ "mode": "normal" }
// modes: "normal" | "minor" | "severe" | "sos"
```

---

## 📡 ESP32 Setup

### Prerequisites
- Arduino IDE 2.x or PlatformIO
- ESP32 board package installed
- Libraries:
  - `ArduinoJson` by Benoit Blanchon (v6+)
  - ESP32 BLE Arduino (included with ESP32 core)

### Steps

1. Open `esp32/roadsos_firmware.ino` in Arduino IDE
2. Update the configuration at the top:
   ```cpp
   const char* WIFI_SSID     = "YOUR_WIFI_SSID";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   const char* SERVER_URL    = "http://YOUR_PC_IP:3000/api/telemetry";
   ```
3. Select **ESP32 Dev Module** as the board
4. Upload firmware
5. Open Serial Monitor at **115200 baud**

> **Tip:** Find your PC's IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux). 
> Make sure the ESP32 and your PC are on the same WiFi network.

### BLE Emergency Broadcast
When a crash is detected, the ESP32 advertises the following BLE service:
- **Service UUID:** `12345678-1234-1234-1234-123456789abc`
- **Characteristic:** JSON payload with `{ emergency, severity, lat, lng }`

Any BLE scanner app (e.g., nRF Connect) can read this data without internet.

---

## ☁️ Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables on Vercel
Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL in the Vercel dashboard.

> **Note:** The in-memory telemetry store resets on each serverless invocation on Vercel. 
> For production, replace `telemetryStore.ts` with a Redis or Upstash connection.

---

## 🧪 Testing the Demo

1. Open the dashboard at `/dashboard`
2. Click **"Normal Ride"** — watch telemetry values update
3. Click **"Minor Accident"** — watch severity badge change to amber
4. Click **"Severe Crash"** — observe critical emergency state, red emergency banner
5. Click **"Trigger SOS"** — full emergency mode, BLE broadcasting, routing line on map

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Map | Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Backend | Next.js API Routes |
| Deployment | Vercel |
| Firmware | ESP32 (Arduino) |

---

## 📊 Research

This project is backed by a survey of **165+ respondents** covering:
- Poor connectivity fears (68%)
- Unconscious victim scenarios (74%)
- Response time as #1 survival factor (81%)
- Women's highway safety concerns (61%)

See `/research` for the full design thinking documentation.

---

## 📄 License

MIT — Built for IITM Road Safety Hackathon.
