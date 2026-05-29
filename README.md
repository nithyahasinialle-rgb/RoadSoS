# ROADSoS — Emergency Response & Crash Detection Platform

> **Live Application URL:** [https://ketos-roadsos.vercel.app/](https://ketos-roadsos.vercel.app/)  
> *Developed for the IITM Road Safety Hackathon*

---

## 📌 Executive Summary
Every year, over 1.3 million lives are lost to road accidents globally. In India, the first 60 minutes after a crash—frequently termed the **"Golden Hour"** are the most critical for survival. However, response times are often severely delayed because victims are unconscious, bystanders panic, or cellular signals fail on remote highways.

**ROADSoS** is an offline-first emergency platform designed to bridge this life-saving gap. By pairing an on-vehicle ESP32 microcontroller with a centralized Next.js command center, the system automatically detects crash signatures (high G-forces, vehicle roll, structural deformation) and broadcasts emergency telemetry. Even in complete network dead zones, it utilizes local Bluetooth Low Energy (BLE) signals to transmit location data, bypassing human panic and ensuring help is dispatched immediately.

---

## 📊 Design Thinking & Primary Research
Our development process was entirely user-centered. Before writing any code, we analyzed a structured primary research dataset of **166 active highway commuters** to map out real anxieties and behavioral patterns:

### 1. User Pain Points & Insights
* **The Network Crisis (93.4%):** 93.4% of travelers experience poor mobile network coverage while driving. This data confirmed that traditional, cloud-reliant emergency apps fail on highways. **Design response:** Built an offline-first system that queues alerts locally and uses Bluetooth Low Energy (BLE) to broadcast local distress signals without internet.
* **The Spectator Barrier (74.1%):** 74.1% of respondents have witnessed or experienced a road accident firsthand. Commuters want to help, but often lack medical details or panic in the moment. **Design response:** Built an automated, zero-interaction telemetry dashboard that presents critical crash metrics clearly, allowing passersby to immediately understand the situation.
* **Human Latency & Delayed Response (57.2%):** 57.2% cite emergency dispatch delay as their greatest fear. Manual phone calls create a massive bottleneck. **Design response:** Automated API alerts and direct GPS routing to trauma centers, stripping away manual phone queues.
* **Scene Panic & Disorientation (47%):** 47% of users highlight panic and confusion as major blockers during a crisis. **Design response:** Passive, sensor-triggered crash classification. The system acts automatically on behalf of the victim, removing the need for user input during high-stress moments.
* **Locational Ambiguity (18.7%):** 18.7% struggle to describe their location on landmarks-barren highways. **Design response:** Precise GPS telemetry mapped instantly to the nearest emergency responders.

### 2. Empathy Map: The Highway Commuter
* **SAY:** *"I don't know if an ambulance will find me on this highway."*, *"What if I crash, lose consciousness, and no one is around?"*
* **THINK:** Worrying about vehicular breakdowns, distrusting manual emergency call systems, and fearing being stranded in high-risk areas.
* **DO:** Informing family before long trips, checking offline maps, or carrying physical tools "just in case".
* **FEEL:** Anxious on unfamiliar routes, powerless in severe scenarios, but relieved when safety systems are automated.

---

## 🏗️ Technical Architecture & Pipeline
ROADSoS is designed as a unified, full-stack pipeline:

1. **Hardware Layer (ESP32 Dev Module):** Lightweight firmware monitors real-time vehicle sensors (accelerometer, gyroscope, and structural strain). 
2. **Communication Layer:** Sends JSON payloads via HTTP POST when Wi-Fi is available. If offline, it opens a BLE (Bluetooth Low Energy) advertising channel, broadcasting a structured JSON emergency packet to nearby smartphones and rescue beacons.
3. **Command Dashboard (Next.js 15):** A highly interactive dashboard styled with custom Tailwind CSS and animated with Framer Motion. It polls the telemetry API in real-time, instantly rendering speeds, G-force impact, rollover tilt angles, and structural strain.
4. **Emergency Map (Leaflet & OpenStreetMap):** A client-side mapped view that automatically tracks vehicle telemetry. If a critical state is detected, it geofences a pulsing red emergency boundary and calculates the shortest route to the nearest trauma center.

---

## ⚡ Quick Start (Local Development)

### 1. Project Setup
```bash
# Clone the repository and navigate to the directory
cd RoadSoS

# Install dependencies (incorporating legacy-peer-deps for React 19 compatibility)
npm install

# Set up environment variables
cp .env.example .env.local
```

### 2. Start the Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📡 Hardware Integration (ESP32 Setup)

The firmware is located in [esp32/roadsos_firmware.ino](file:///c:/Users/nithy/Downloads/RoadSoS/esp32/roadsos_firmware.ino). 
1. Open the firmware in the Arduino IDE and install the `ArduinoJson` library.
2. Edit the file to configure your local Wi-Fi credentials and local server URL:
   ```cpp
   const char* WIFI_SSID     = "YOUR_WIFI_SSID";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   const char* SERVER_URL    = "http://<YOUR_PC_IP>:3000/api/telemetry";
   ```
3. Upload to your ESP32 board to stream real-time sensor data directly to your local development dashboard.

---

## ☁️ Vercel Deployment

ROADSoS is optimized for **Vercel** serverless hosting, enabling unified deployment of the Next.js frontend application and backend API routes in a single workflow.

### Auto-Deploy via GitHub:
1. Push this project to your GitHub repository (ensure `.gitignore` excludes your local `.next` and `node_modules` folders).
2. Connect your repository to Vercel. 
3. Vercel automatically detects the Next.js framework, sets the output directory to `.next`, and deploys the backend files (`/api/...`) as scalable **Serverless Functions**.
4. In the Vercel Project Settings under **Environment Variables**, add:
   * `NEXT_PUBLIC_APP_URL` = `https://ketos-roadsos.vercel.app/`

> 💡 **Production Note:** The serverless backend uses an in-memory store for demo telemetry data, which resets during serverless cold starts. For a production release, update [src/lib/telemetryStore.ts](file:///c:/Users/nithy/Downloads/RoadSoS/src/lib/telemetryStore.ts) to interface with a Redis instance (such as Upstash) for permanent, distributed persistence.

---

## 📄 License
MIT — Built for IITM Road Safety Hackathon.
