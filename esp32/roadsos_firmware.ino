/*
 * ROADSoS — ESP32 Emergency Response Firmware
 * =============================================
 * Board:    ESP32 Dev Module
 * Libraries: WiFi.h, HTTPClient.h, BLEDevice.h, ArduinoJson
 *
 * This firmware:
 *   1. Simulates all sensor values (accelerometer, gyroscope, OBD, strain gauge)
 *   2. Detects crash conditions via threshold logic
 *   3. Sends telemetry via HTTP POST to the ROADSoS server
 *   4. Broadcasts an emergency BLE beacon when a crash is detected
 *
 * Install via Arduino IDE / PlatformIO:
 *   - ArduinoJson by Benoit Blanchon (v6+)
 *   - ESP32 BLE Arduino (built into ESP32 core)
 */

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLEAdvertising.h>
#include <math.h>

// ── Configuration ──────────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL    = "http://YOUR_SERVER_IP:3000/api/telemetry";

// Crash detection thresholds
const float CRASH_ACCEL_THRESHOLD  = 8.0;   // m/s² — impact G-force
const float CRASH_ROLL_THRESHOLD   = 35.0;  // degrees — vehicle tilt
const float CRASH_STRAIN_THRESHOLD = 50.0;  // 0–100 — deformation

// BLE settings
const char* BLE_DEVICE_NAME   = "ROADSoS-ESP32";
const char* BLE_SERVICE_UUID  = "12345678-1234-1234-1234-123456789abc";
const char* BLE_CHAR_UUID     = "87654321-4321-4321-4321-cba987654321";

// Telemetry interval
const unsigned long TELEMETRY_INTERVAL_MS = 2000;

// ── Simulation State ───────────────────────────────────────────────
struct SensorData {
  float acceleration;      // m/s²
  float rollAngle;         // degrees
  float speed;             // km/h
  float strainValue;       // 0–100
  float crashProbability;  // 0–100 %
  String severity;         // "normal" | "warning" | "critical" | "sos"
  bool emergencyActive;
  String bleStatus;
  float lat;
  float lng;
};

SensorData sensorData;
unsigned long lastTelemetryTime = 0;
bool crashDetected = false;
int sosCountdown = 0;  // Countdown before SOS auto-cancel

// BLE
BLEServer* pBLEServer = nullptr;
BLECharacteristic* pEmergencyChar = nullptr;
BLEAdvertising* pAdvertising = nullptr;
bool bleInitialized = false;

// ── Simulated Sensor Reading ───────────────────────────────────────
float simFloat(float minVal, float maxVal) {
  return minVal + (float)random(0, 1000) / 1000.0f * (maxVal - minVal);
}

void updateSensorSimulation() {
  if (crashDetected) {
    // Simulate post-crash state
    sensorData.acceleration    = simFloat(14.0, 28.0);
    sensorData.rollAngle       = simFloat(45.0, 120.0);
    sensorData.speed           = simFloat(0.0, 5.0);
    sensorData.strainValue     = simFloat(70.0, 95.0);
    sensorData.crashProbability = simFloat(85.0, 99.0);
    sensorData.severity        = "critical";
    sensorData.emergencyActive = true;
    sensorData.bleStatus       = "broadcasting";
  } else {
    // Normal ride simulation with occasional spikes
    float spike = (random(0, 100) > 95) ? simFloat(5.0, 10.0) : 0.0;
    sensorData.acceleration    = simFloat(0.3, 1.8) + spike;
    sensorData.rollAngle       = simFloat(-5.0, 5.0) + (spike > 0 ? simFloat(10, 20) : 0);
    sensorData.speed           = simFloat(45.0, 80.0);
    sensorData.strainValue     = simFloat(1.0, 8.0) + (spike * 2);
    sensorData.crashProbability = simFloat(0.5, 4.0) + (spike * 3);
    sensorData.severity        = "normal";
    sensorData.emergencyActive = false;
    sensorData.bleStatus       = "idle";
  }

  // GPS: small drift around Bengaluru for demo
  sensorData.lat = 12.9716f + simFloat(-0.002f, 0.002f);
  sensorData.lng = 77.5946f + simFloat(-0.002f, 0.002f);
}

// ── Crash Detection ────────────────────────────────────────────────
bool detectCrash() {
  bool accelTrigger  = sensorData.acceleration > CRASH_ACCEL_THRESHOLD;
  bool rollTrigger   = abs(sensorData.rollAngle) > CRASH_ROLL_THRESHOLD;
  bool strainTrigger = sensorData.strainValue > CRASH_STRAIN_THRESHOLD;

  // At least 2 sensors must agree
  int triggers = (accelTrigger ? 1 : 0) + (rollTrigger ? 1 : 0) + (strainTrigger ? 1 : 0);
  return triggers >= 2;
}

// ── BLE Setup ──────────────────────────────────────────────────────
void initBLE() {
  BLEDevice::init(BLE_DEVICE_NAME);
  pBLEServer = BLEDevice::createServer();

  BLEService* pService = pBLEServer->createService(BLE_SERVICE_UUID);
  pEmergencyChar = pService->createCharacteristic(
    BLE_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pEmergencyChar->setValue("STANDBY");
  pService->start();

  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(BLE_SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  BLEDevice::startAdvertising();

  bleInitialized = true;
  Serial.println("[BLE] Advertising started: " + String(BLE_DEVICE_NAME));
}

void updateBLE() {
  if (!bleInitialized || !pEmergencyChar) return;

  String payload = "{";
  payload += "\"emergency\":" + String(sensorData.emergencyActive ? "true" : "false") + ",";
  payload += "\"severity\":\"" + sensorData.severity + "\",";
  payload += "\"lat\":" + String(sensorData.lat, 6) + ",";
  payload += "\"lng\":" + String(sensorData.lng, 6);
  payload += "}";

  pEmergencyChar->setValue(payload.c_str());
  pEmergencyChar->notify();
}

// ── HTTP Telemetry POST ────────────────────────────────────────────
void postTelemetry() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Disconnected — queuing telemetry for BLE broadcast");
    updateBLE();
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<512> doc;
  doc["acceleration"]     = round(sensorData.acceleration * 10) / 10.0;
  doc["rollAngle"]        = round(sensorData.rollAngle * 10) / 10.0;
  doc["speed"]            = round(sensorData.speed * 10) / 10.0;
  doc["strainValue"]      = (int)sensorData.strainValue;
  doc["crashProbability"] = round(sensorData.crashProbability * 10) / 10.0;
  doc["severity"]         = sensorData.severity;
  doc["emergencyActive"]  = sensorData.emergencyActive;
  doc["bleStatus"]        = sensorData.bleStatus;

  JsonObject loc = doc.createNestedObject("location");
  loc["lat"] = sensorData.lat;
  loc["lng"] = sensorData.lng;

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  if (code == HTTP_CODE_OK) {
    Serial.println("[HTTP] Telemetry posted OK — " + sensorData.severity);
  } else {
    Serial.println("[HTTP] POST failed: " + String(code));
    // Fall back to BLE broadcast
    updateBLE();
  }

  http.end();
}

// ── Setup ──────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(0));

  Serial.println("╔════════════════════════════════╗");
  Serial.println("║   ROADSoS Emergency System     ║");
  Serial.println("║   ESP32 Firmware v1.0          ║");
  Serial.println("╚════════════════════════════════╝");

  // WiFi
  Serial.println("[WiFi] Connecting to " + String(WIFI_SSID));
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[WiFi] Failed — operating in BLE-only mode");
  }

  // BLE
  initBLE();

  // Initial sensor state
  sensorData = {
    .acceleration     = 1.0,
    .rollAngle        = 0.0,
    .speed            = 0.0,
    .strainValue      = 2.0,
    .crashProbability = 1.0,
    .severity         = "normal",
    .emergencyActive  = false,
    .bleStatus        = "idle",
    .lat              = 12.9716f,
    .lng              = 77.5946f,
  };

  Serial.println("[System] Monitoring started — threshold: " + String(CRASH_ACCEL_THRESHOLD) + " m/s²");
}

// ── Loop ───────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = now;

    // Update sensor simulation
    updateSensorSimulation();

    // Check crash condition
    if (!crashDetected && detectCrash()) {
      crashDetected = true;
      sosCountdown = 15;  // Auto-cancel after 30s (15 × 2000ms)
      Serial.println("[ALERT] *** CRASH DETECTED — INITIATING SOS ***");
      Serial.println("[ALERT] Accel: " + String(sensorData.acceleration) + " m/s²");
      Serial.println("[ALERT] Roll:  " + String(sensorData.rollAngle) + "°");
      Serial.println("[ALERT] Strain:" + String(sensorData.strainValue));
    }

    // SOS auto-cancel countdown (demo only)
    if (crashDetected && sosCountdown > 0) {
      sosCountdown--;
      if (sosCountdown == 0) {
        crashDetected = false;
        Serial.println("[System] SOS cleared — resuming normal monitoring");
      }
    }

    // BLE update
    updateBLE();

    // Send telemetry
    postTelemetry();

    // Status print
    Serial.printf("[T] Accel=%.1f | Roll=%.1f° | Speed=%.0f | Strain=%.0f | P=%.1f%% | %s\n",
      sensorData.acceleration,
      sensorData.rollAngle,
      sensorData.speed,
      sensorData.strainValue,
      sensorData.crashProbability,
      sensorData.severity.c_str()
    );
  }
}
