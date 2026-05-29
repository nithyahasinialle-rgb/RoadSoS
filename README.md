# ROADSoS — Emergency Response Platform for Road Accidents

> *"What happens when accident victims cannot call for help?"*

ROADSoS is an offline-first crash detection and emergency response system built for the **IITM Road Safety Hackathon**. It uses an ESP32 microcontroller to monitor real-time vehicle sensor data, detect crashes autonomously, and dispatch emergency alerts — even when the driver is unconscious and connectivity is zero.

---

## 🚀 Impact & Core Philosophy
Every year, over 1.3 million lives are lost in road accidents globally. In India, a major bottleneck in survival rates is the **"Golden Hour"** — the first 60 minutes after a crash. 

ROADSoS was designed from the ground up to solve three critical real-world challenges:
1. **Unconscious Victims:** When a driver is incapacitated, they cannot call for help. ROADSoS detects the impact autonomously and acts on their behalf.
2. **Network Dead Zones:** Highway accidents frequently occur in areas with poor cellular coverage. The system utilizes Bluetooth Low Energy (BLE) to broadcast local distress signals to passing vehicles and nearby devices even with zero internet.
3. **Location Ambiguity:** Victims often struggle to describe their exact location. ROADSoS automatically transmits precise GPS telemetry to the nearest trauma center and maps the fastest route for responders.

---

## 📊 Survey Insights (Primary Research)
Our design decisions are backed by a structured survey of **166 active commuters**:
* **93.4%** experience poor mobile network coverage while traveling, proving that emergency safety nets must work offline.
* **74.1%** have witnessed or experienced a road accident firsthand, highlighting the critical relevance of this technology.
* **57.2%** cite delay in emergency response as the single biggest challenge during accidents.
* **94.6%** express immediate willingness to trust and adopt an automated emergency alert system.

---

## 🏗️ Technical Architecture
ROADSoS is a unified, full-stack platform:
* **Hardware Layer:** ESP32 Dev Module monitoring real-time vehicle sensors (accelerometer, gyroscope, and structural strain).
* **Communication Layer:** WiFi ingestion for standard API logging and BLE (Bluetooth Low Energy) advertising for offline broadcasting.
* **Frontend Web App:** Built with Next.js 15, styled with Tailwind CSS, and featuring smooth animations using Framer Motion.
* **Emergency Map:** Fully interactive map built with Leaflet and OpenStreetMap showing live tracking, emergency geofencing, and trauma center routing.
* **Backend API:** Built as Next.js API routes serving dynamic telemetry states and simulator endpoints.

---

## ⚡ Quick Start (Local Development)

### 1. Project Setup
```bash
# Clone or download the repository, then navigate inside
cd RoadSoS

# Install dependencies (utilizing legacy peer deps for Leaflet/React 19 compatibility)
npm install --legacy-peer-deps

# Create environment configuration
cp .env.example .env.local
```

### 2. Start the Application
```bash
# Start the Next.js development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📡 ESP32 Controller Setup

1. Open `esp32/roadsos_firmware.ino` in the Arduino IDE.
2. Ensure you have installed the `ArduinoJson` library.
3. Configure your local Wi-Fi credentials and point the server URL to your computer's local IP address:
   ```cpp
   const char* WIFI_SSID     = "YOUR_WIFI_SSID";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   const char* SERVER_URL    = "http://<YOUR_PC_IP>:3000/api/telemetry";
   ```
4. Flash the code to your ESP32 board.
5. Live telemetry coordinates will stream directly to the web dashboard and map in real-time.

---

## ☁️ Vercel Deployment (Frontend & Backend)

Next.js is natively optimized for Vercel. When you deploy the application, Vercel **automatically hosts both the frontend pages and the backend API routes** (deploying the APIs as secure, auto-scaling Serverless Functions).

### Deploy in 3 Steps:

1. **Push your code to GitHub** (make sure your `.gitignore` is active so you don't push `node_modules` or `.env.local` files).
2. **Import to Vercel:** Go to [Vercel](https://vercel.com), click **Add New Project**, and import your GitHub repository.
3. **Configure Environment Variables:** In the Vercel project settings, add:
   * `NEXT_PUBLIC_APP_URL` = `https://your-project-name.vercel.app` (your live deployment URL).

Click **Deploy**, and Vercel will build and launch your full-stack platform globally!

> 💡 **Production Note:** The serverless backend environment uses an in-memory store for demo telemetry data, which resets during cold starts. For a production launch, update `src/lib/telemetryStore.ts` to connect to a Redis instance (like Upstash) for persistent state.

---

## 🧪 Testing the Live Demo
If you don't have an ESP32 hardware device on hand, you can fully test the emergency pipeline using our built-in simulator:
1. Open the **Dashboard** at `/dashboard`.
2. Scroll to **Simulation Controls** at the bottom.
3. Select **"Severe Crash"** or **"Trigger SOS"** — witness the telemetry cards spike, the flashing emergency banner activate, and the BLE status transition to broadcasting.
4. Navigate to the **Map** page at `/map` to see the live accident coordinate, the pulsing coverage circle, and the routing path to the nearest emergency room.

---

## 📄 License
MIT — Built for IITM Road Safety Hackathon.
