'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/NavBar';
import TelemetryCard from '@/components/TelemetryCard';
import EmergencyBadge from '@/components/EmergencyBadge';
import WorkflowTimeline from '@/components/WorkflowTimeline';
import SimulationControls from '@/components/SimulationControls';
import type { TelemetryData, SimulationMode } from '@/lib/telemetryStore';
import {
  Activity,
  Zap,
  Gauge,
  RotateCw,
  Radio,
  AlertTriangle,
  Wifi,
  WifiOff,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  RefreshCw,
  Clock,
} from 'lucide-react';

const POLL_INTERVAL = 2000;

function getBleColor(status: string) {
  if (status === 'broadcasting') return 'red';
  if (status === 'idle') return 'green';
  return 'default';
}

function getWorkflowStep(severity: string): number {
  switch (severity) {
    case 'sos': return 5;
    case 'critical': return 4;
    case 'warning': return 3;
    default: return 1;
  }
}

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [activeMode, setActiveMode] = useState<SimulationMode>('normal');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/telemetry');
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      setTelemetry(json.data);
      setBackendStatus('connected');
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setBackendStatus('disconnected');
      setError('Cannot reach backend. Reconnecting...');
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  const handleModeChange = async (mode: SimulationMode) => {
    setLoading(true);
    setActiveMode(mode);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        const json = await res.json();
        setTelemetry(json.data);
        setLastUpdated(new Date());
      }
    } catch {
      setError('Simulation trigger failed');
    } finally {
      setLoading(false);
    }
  };

  const severity = telemetry?.severity ?? 'normal';
  const isEmergency = severity === 'critical' || severity === 'sos';
  const workflowStep = getWorkflowStep(severity);

  return (
    <div
      className={`min-h-screen bg-[#0A0A0A] text-gray-50 transition-all duration-1000 ${
        severity === 'sos' ? 'emergency-active' : ''
      }`}
    >
      <NavBar />

      {/* Emergency alert banner */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-16 left-0 right-0 z-40 px-6 py-3 flex items-center justify-center gap-3 text-sm font-semibold ${
              severity === 'sos'
                ? 'bg-red-600/90 text-white'
                : 'bg-amber-600/90 text-white'
            } backdrop-blur-md border-b border-white/10`}
          >
            <AlertTriangle size={16} className="animate-pulse" />
            {severity === 'sos'
              ? '⚡ EMERGENCY ACTIVE — SOS BROADCAST IN PROGRESS'
              : '⚠️  CRITICAL IMPACT DETECTED — ALERTING EMERGENCY SERVICES'}
            <AlertTriangle size={16} className="animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`max-w-7xl mx-auto px-6 pb-20 ${isEmergency ? 'pt-32' : 'pt-24'}`}>
        {/* ── Header row ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Live Emergency Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time telemetry from ESP32 device
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Backend status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-white/8">
              {backendStatus === 'connected' ? (
                <>
                  <Wifi size={13} className="text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Backend Connected</span>
                </>
              ) : backendStatus === 'disconnected' ? (
                <>
                  <WifiOff size={13} className="text-red-400" />
                  <span className="text-xs text-red-400 font-medium">Disconnected</span>
                </>
              ) : (
                <>
                  <RefreshCw size={13} className="text-gray-400 animate-spin" />
                  <span className="text-xs text-gray-400 font-medium">Connecting...</span>
                </>
              )}
            </div>

            {/* Last updated */}
            {lastUpdated && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-white/8">
                <Clock size={13} className="text-gray-500" />
                <span className="text-xs text-gray-500">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            )}

            {/* Manual refresh */}
            <button
              onClick={fetchTelemetry}
              className="p-2 rounded-lg bg-[#1A1A1A] border border-white/8 text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
              aria-label="Refresh telemetry"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* ── Severity badge ───────────────────────────────────────── */}
        <div className="mb-8">
          <EmergencyBadge severity={severity as 'normal' | 'warning' | 'critical' | 'sos'} />
        </div>

        {/* ── Telemetry cards grid ─────────────────────────────────── */}
        {telemetry ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <TelemetryCard
              label="Acceleration"
              value={telemetry.acceleration.toFixed(1)}
              unit="m/s²"
              icon={<Zap size={16} />}
              color={telemetry.acceleration > 12 ? 'red' : telemetry.acceleration > 5 ? 'amber' : 'green'}
              highlighted={telemetry.acceleration > 5}
              subtitle={telemetry.acceleration > 12 ? 'Impact detected' : 'Resultant G-force'}
            />
            <TelemetryCard
              label="Roll Angle"
              value={Math.abs(telemetry.rollAngle).toFixed(1)}
              unit="°"
              icon={<RotateCw size={16} />}
              color={Math.abs(telemetry.rollAngle) > 45 ? 'red' : Math.abs(telemetry.rollAngle) > 15 ? 'amber' : 'green'}
              highlighted={Math.abs(telemetry.rollAngle) > 15}
              subtitle={Math.abs(telemetry.rollAngle) > 45 ? 'Vehicle rollover!' : 'Vehicle tilt angle'}
            />
            <TelemetryCard
              label="Speed"
              value={telemetry.speed.toFixed(0)}
              unit="km/h"
              icon={<Gauge size={16} />}
              color={telemetry.speed === 0 && isEmergency ? 'red' : 'default'}
              highlighted={telemetry.speed === 0 && isEmergency}
              subtitle={telemetry.speed === 0 && isEmergency ? 'Vehicle stopped' : 'OBD telemetry'}
            />
            <TelemetryCard
              label="Strain Level"
              value={telemetry.strainValue.toFixed(0)}
              unit="/ 100"
              icon={<Activity size={16} />}
              color={telemetry.strainValue > 70 ? 'red' : telemetry.strainValue > 30 ? 'amber' : 'green'}
              highlighted={telemetry.strainValue > 30}
              subtitle={`Structural deformation: ${telemetry.strainValue > 70 ? 'Severe' : telemetry.strainValue > 30 ? 'Moderate' : 'None'}`}
            />
            <TelemetryCard
              label="Crash Probability"
              value={telemetry.crashProbability.toFixed(1)}
              unit="%"
              icon={<TrendingUp size={16} />}
              color={telemetry.crashProbability > 80 ? 'red' : telemetry.crashProbability > 40 ? 'amber' : 'green'}
              highlighted={telemetry.crashProbability > 40}
              subtitle={`ML confidence score`}
            />
            <TelemetryCard
              label="Severity"
              value={severity.toUpperCase()}
              icon={isEmergency ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              color={severity === 'sos' || severity === 'critical' ? 'red' : severity === 'warning' ? 'amber' : 'green'}
              highlighted={isEmergency}
              subtitle={`System classification`}
            />
            <TelemetryCard
              label="Emergency State"
              value={telemetry.emergencyActive ? 'ACTIVE' : 'STANDBY'}
              icon={<AlertTriangle size={16} />}
              color={telemetry.emergencyActive ? 'red' : 'green'}
              highlighted={telemetry.emergencyActive}
              subtitle={telemetry.emergencyActive ? 'Alert dispatched' : 'Monitoring...'}
            />
            <TelemetryCard
              label="BLE Status"
              value={telemetry.bleStatus.toUpperCase()}
              icon={<Radio size={16} />}
              color={getBleColor(telemetry.bleStatus)}
              highlighted={telemetry.bleStatus === 'broadcasting'}
              subtitle={
                telemetry.bleStatus === 'broadcasting'
                  ? 'Emergency beacon active'
                  : telemetry.bleStatus === 'idle'
                  ? 'Ready to broadcast'
                  : 'No BLE connection'
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-[#1A1A1A] border border-white/6 shimmer" />
            ))}
          </div>
        )}

        {/* ── Crash probability bar ────────────────────────────────── */}
        {telemetry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-5 rounded-xl border border-white/8 bg-[#1A1A1A]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Crash Risk Meter
              </span>
              <span
                className={`text-sm font-bold metric-value ${
                  telemetry.crashProbability > 80
                    ? 'text-red-400'
                    : telemetry.crashProbability > 40
                    ? 'text-amber-400'
                    : 'text-green-400'
                }`}
              >
                {telemetry.crashProbability.toFixed(1)}%
              </span>
            </div>
            <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
                  telemetry.crashProbability > 80
                    ? 'bg-gradient-to-r from-red-600 to-red-400'
                    : telemetry.crashProbability > 40
                    ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                    : 'bg-gradient-to-r from-green-700 to-green-500'
                }`}
                style={{ width: `${Math.min(telemetry.crashProbability, 100)}%` }}
                animate={{ width: `${Math.min(telemetry.crashProbability, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-green-600">Safe</span>
              <span className="text-[10px] text-amber-600">Caution</span>
              <span className="text-[10px] text-red-600">Emergency</span>
            </div>
          </motion.div>
        )}

        {/* ── Emergency workflow ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-xl border border-white/8 bg-[#1A1A1A]"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 rounded-full bg-blue-500" />
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
              Emergency Response Pipeline
            </h2>
          </div>
          <WorkflowTimeline activeStep={workflowStep} severity={severity} />
        </motion.div>

        {/* ── Simulation controls ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl border border-white/8 bg-[#1A1A1A]"
        >
          <SimulationControls
            activeMode={activeMode}
            onModeChange={handleModeChange}
            loading={loading}
          />
          <p className="mt-4 text-xs text-gray-600">
            Select a scenario to simulate crash detection and observe real-time dashboard updates.
            These controls replicate what the ESP32 firmware sends to the API.
          </p>
        </motion.div>

        {/* ── Raw telemetry panel ─────────────────────────────────── */}
        {telemetry && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 rounded-xl border border-white/8 bg-[#1A1A1A] overflow-hidden"
          >
            <summary className="flex items-center gap-2 px-5 py-3.5 cursor-pointer text-xs text-gray-500 uppercase tracking-widest hover:text-gray-300 transition-colors list-none">
              <Activity size={13} />
              Raw Telemetry JSON
              <span className="ml-auto text-gray-700">▾</span>
            </summary>
            <pre className="px-5 pb-5 text-[11px] text-gray-400 font-mono leading-relaxed overflow-x-auto">
              {JSON.stringify(telemetry, null, 2)}
            </pre>
          </motion.details>
        )}
      </main>
    </div>
  );
}
