# ROADSoS

### Road Accident Offline Survival & SOS System

Live Deployment: https://ketos-roadsos.vercel.app/

ROADSoS is a human-centered emergency response platform designed to reduce delays during road accidents, especially in low-connectivity environments where victims may be unconscious or unable to seek help manually.

Built for the IITM Road Safety Hackathon, the platform combines embedded systems, real-time telemetry, offline-first communication concepts, and interactive emergency monitoring into a single unified system.

---

# Problem Statement

During severe road accidents, emergency response is often delayed because:

* victims may lose consciousness,
* bystanders panic or lack medical information,
* mobile networks fail on highways and remote roads,
* and precise accident locations are difficult to communicate quickly.

The first few minutes after a crash are critical, yet existing systems still rely heavily on manual interaction and stable internet connectivity.

ROADSoS addresses this problem by creating an emergency-response workflow that minimizes human dependency during crisis situations.

---

# Key Features

* Real-time crash telemetry dashboard
* ESP32-based emergency simulation system
* Simulated sensor fusion architecture
* BLE-assisted emergency broadcasting
* Offline-first emergency communication concept
* Nearby trauma center and police station mapping
* Live emergency routing using OpenStreetMap
* Interactive emergency simulation controls
* Human-centered design thinking workflow

---

# Design Thinking & User Research

Before development, we conducted primary user research with 165+ respondents to understand real-world emergency behavior and concerns during road travel.

Key insights included:

* poor network connectivity during travel,
* panic during emergency situations,
* fear of delayed ambulance response,
* concerns about unconscious accident victims,
* women’s safety during isolated travel,
* and difficulty communicating exact locations during emergencies.

These insights directly influenced our technical decisions:

* offline-first architecture,
* automated crash workflows,
* minimal interaction emergency response,
* and BLE-assisted local emergency signaling.

---

# System Architecture

ROADSoS uses a lightweight full-stack architecture:

ESP32 → API Backend → Live Dashboard → Emergency Workflow

The ESP32 simulates:

* accelerometer values,
* gyroscope/roll data,
* OBD telemetry,
* structural strain levels,
* crash probability,
* and emergency severity.

Telemetry is sent to the backend using HTTP requests over WiFi.

In parallel, the ESP32 also broadcasts a local BLE emergency state to demonstrate offline emergency signaling concepts.

The frontend visualizes all telemetry in real time through an interactive emergency dashboard.

---

# Tech Stack

Frontend:

* Next.js
* Tailwind CSS
* Framer Motion
* Leaflet + OpenStreetMap

Backend:

* Next.js API Routes
* REST-based telemetry endpoints

Hardware:

* ESP32 Dev Module
* BLE Advertising
* Simulated Sensor Fusion

Deployment:

* Vercel

---

# Live Platform

The deployed ROADSoS platform is available here:

https://ketos-roadsos.vercel.app/

---

# Local Setup

Clone the repository:

```bash
git clone <repository-url>
cd RoadSoS
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# ESP32 Integration

The ESP32 firmware simulates:

* acceleration,
* vehicle roll,
* speed,
* strain values,
* crash probability,
* and emergency severity.

Update the firmware with:

* WiFi credentials
* deployed API endpoint

Then upload the code using Arduino IDE.

The ESP32 will continuously send telemetry to the deployed backend.

---

# Deployment

ROADSoS is fully deployed using Vercel.

Frontend and backend APIs are hosted together through a unified Next.js deployment workflow.

---

# Future Improvements

* Real TinyML crash classification
* Actual OBD integration
* Real strain gauge integration
* BLE mesh emergency relays
* Persistent telemetry storage
* Real emergency service integration

---

# Team

Built for the IITM Road Safety Hackathon.

ROADSoS focuses on treating emergency response as a human-centered infrastructure problem rather than just a mobile application problem.
