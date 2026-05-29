import type { TelemetryData, SimulationMode } from './telemetryStore';

function rand(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateSimulatedTelemetry(mode: SimulationMode): Partial<TelemetryData> {
  switch (mode) {
    case 'normal':
      return {
        acceleration: rand(0.2, 1.5),
        rollAngle: rand(-3, 3),
        speed: rand(40, 80),
        strainValue: rand(1, 8),
        crashProbability: rand(0, 5),
        severity: 'normal',
        emergencyActive: false,
        bleStatus: 'idle',
        simulationMode: 'normal',
      };

    case 'minor':
      return {
        acceleration: rand(4, 9),
        rollAngle: rand(8, 18),
        speed: rand(15, 45),
        strainValue: rand(30, 55),
        crashProbability: rand(35, 65),
        severity: 'warning',
        emergencyActive: false,
        bleStatus: 'broadcasting',
        simulationMode: 'minor',
      };

    case 'severe':
      return {
        acceleration: rand(14, 28),
        rollAngle: rand(45, 120),
        speed: rand(0, 20),
        strainValue: rand(70, 92),
        crashProbability: rand(82, 97),
        severity: 'critical',
        emergencyActive: true,
        bleStatus: 'broadcasting',
        simulationMode: 'severe',
      };

    case 'sos':
      return {
        acceleration: rand(22, 40),
        rollAngle: rand(90, 180),
        speed: 0,
        strainValue: 100,
        crashProbability: 99,
        severity: 'sos',
        emergencyActive: true,
        bleStatus: 'broadcasting',
        simulationMode: 'sos',
      };

    default:
      return {};
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'sos': return '#DC2626';
    case 'critical': return '#EF4444';
    case 'warning': return '#D97706';
    default: return '#16A34A';
  }
}

export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'sos': return 'SOS — CALL FOR HELP';
    case 'critical': return 'CRITICAL IMPACT';
    case 'warning': return 'MINOR INCIDENT';
    default: return 'NORMAL OPERATION';
  }
}
