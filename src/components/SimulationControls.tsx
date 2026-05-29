'use client';

import { motion } from 'framer-motion';
import type { SimulationMode } from '@/lib/telemetryStore';

interface SimulationControlsProps {
  activeMode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
  loading?: boolean;
}

const SCENARIOS = [
  {
    mode: 'normal' as SimulationMode,
    label: 'Normal Ride',
    desc: 'Steady highway cruise',
    color: 'border-green-500/30 hover:border-green-400/60 hover:bg-green-500/10',
    activeColor: 'border-green-400 bg-green-500/15 shadow-[0_0_16px_rgba(34,197,94,0.2)]',
    dot: 'bg-green-400',
    textColor: 'text-green-400',
    icon: '🛣️',
  },
  {
    mode: 'minor' as SimulationMode,
    label: 'Minor Accident',
    desc: 'Fender bender, alert sent',
    color: 'border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/10',
    activeColor: 'border-amber-400 bg-amber-500/15 shadow-[0_0_16px_rgba(245,158,11,0.2)]',
    dot: 'bg-amber-400',
    textColor: 'text-amber-400',
    icon: '⚠️',
  },
  {
    mode: 'severe' as SimulationMode,
    label: 'Severe Crash',
    desc: 'High-impact collision',
    color: 'border-red-500/30 hover:border-red-400/60 hover:bg-red-500/10',
    activeColor: 'border-red-400 bg-red-500/15 shadow-[0_0_16px_rgba(239,68,68,0.25)]',
    dot: 'bg-red-400',
    textColor: 'text-red-400',
    icon: '💥',
  },
  {
    mode: 'sos' as SimulationMode,
    label: 'Trigger SOS',
    desc: 'Immediate emergency broadcast',
    color: 'border-red-600/40 hover:border-red-500/80 hover:bg-red-600/15',
    activeColor: 'border-red-500 bg-red-600/20 shadow-[0_0_24px_rgba(220,38,38,0.4)]',
    dot: 'bg-red-500 animate-pulse',
    textColor: 'text-red-300',
    icon: '🆘',
  },
];

export default function SimulationControls({
  activeMode,
  onModeChange,
  loading = false,
}: SimulationControlsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full bg-emergency-red" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          Simulation Scenarios
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SCENARIOS.map((scenario) => {
          const isActive = activeMode === scenario.mode;
          return (
            <motion.button
              key={scenario.mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onModeChange(scenario.mode)}
              disabled={loading}
              className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-300 ${
                isActive ? scenario.activeColor : scenario.color
              } border bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl">{scenario.icon}</span>
                <div className={`w-2 h-2 rounded-full ${isActive ? scenario.dot : 'bg-white/20'}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${isActive ? scenario.textColor : 'text-gray-300'}`}>
                  {scenario.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{scenario.desc}</p>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl bg-current"
                  style={{ color: scenario.textColor.includes('green') ? '#4ade80' : scenario.textColor.includes('amber') ? '#fbbf24' : '#f87171' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
