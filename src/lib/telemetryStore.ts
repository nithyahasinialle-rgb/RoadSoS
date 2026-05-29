// In-memory telemetry store for demo purposes
// In production, replace with Redis or a database

export type SeverityLevel = 'normal' | 'warning' | 'critical' | 'sos';
export type SimulationMode = 'normal' | 'minor' | 'severe' | 'sos';

export interface TelemetryData {
  timestamp: number;
  acceleration: number;       // m/s² resultant
  rollAngle: number;          // degrees
  speed: number;              // km/h
  strainValue: number;        // 0–100 normalised
  crashProbability: number;   // 0–100 %
  severity: SeverityLevel;
  emergencyActive: boolean;
  bleStatus: 'broadcasting' | 'idle' | 'disconnected';
  simulationMode: SimulationMode;
  location: { lat: number; lng: number };
}

const defaultTelemetry: TelemetryData = {
  timestamp: Date.now(),
  acceleration: 0.8,
  rollAngle: 1.2,
  speed: 0,
  strainValue: 2,
  crashProbability: 0,
  severity: 'normal',
  emergencyActive: false,
  bleStatus: 'idle',
  simulationMode: 'normal',
  location: { lat: 12.9716, lng: 77.5946 }, // Bengaluru default
};

// Module-level singleton (persists across requests in the same process)
let store: TelemetryData = { ...defaultTelemetry };

export function getTelemetry(): TelemetryData {
  return { ...store };
}

export function setTelemetry(data: Partial<TelemetryData>): TelemetryData {
  store = { ...store, ...data, timestamp: Date.now() };
  return { ...store };
}

export function resetTelemetry(): TelemetryData {
  store = { ...defaultTelemetry, timestamp: Date.now() };
  return { ...store };
}
