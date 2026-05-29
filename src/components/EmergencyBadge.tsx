'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyBadgeProps {
  severity: 'normal' | 'warning' | 'critical' | 'sos';
  className?: string;
}

const config = {
  normal: {
    label: 'NORMAL OPERATION',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    dot: 'bg-green-400',
    pulse: false,
  },
  warning: {
    label: 'MINOR INCIDENT DETECTED',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    pulse: true,
  },
  critical: {
    label: 'CRITICAL IMPACT',
    bg: 'bg-red-500/15',
    border: 'border-red-500/40',
    text: 'text-red-400',
    dot: 'bg-red-400',
    pulse: true,
  },
  sos: {
    label: '⚡ SOS — EMERGENCY ACTIVE',
    bg: 'bg-red-600/20',
    border: 'border-red-500/60',
    text: 'text-red-300',
    dot: 'bg-red-400',
    pulse: true,
  },
};

export default function EmergencyBadge({ severity, className = '' }: EmergencyBadgeProps) {
  const c = config[severity];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={severity}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border ${c.bg} ${c.border} ${className}`}
      >
        {/* Status dot with optional pulse ring */}
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
          {c.pulse && (
            <div
              className={`absolute inset-0 rounded-full ${c.dot} opacity-40 animate-ping`}
            />
          )}
        </div>
        <span className={`text-xs font-bold tracking-widest uppercase ${c.text}`}>
          {c.label}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
