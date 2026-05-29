'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface TelemetryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  color?: 'green' | 'amber' | 'red' | 'blue' | 'default';
  trend?: 'up' | 'down' | 'stable';
  highlighted?: boolean;
  subtitle?: string;
}

const colorMap = {
  green: {
    icon: 'text-green-400',
    value: 'text-green-300',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  },
  amber: {
    icon: 'text-amber-400',
    value: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  },
  red: {
    icon: 'text-red-400',
    value: 'text-red-300',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
  },
  blue: {
    icon: 'text-blue-400',
    value: 'text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: '',
  },
  default: {
    icon: 'text-gray-400',
    value: 'text-white',
    bg: 'bg-white/5',
    border: 'border-white/8',
    glow: '',
  },
};

export default function TelemetryCard({
  label,
  value,
  unit,
  icon,
  color = 'default',
  highlighted = false,
  subtitle,
}: TelemetryCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative rounded-xl border p-5 transition-all duration-300 ${c.border} ${
        highlighted ? `${c.glow} ${c.bg}` : 'bg-[#1A1A1A] hover:bg-[#1E1E1E]'
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </span>
        <div className={`p-1.5 rounded-lg ${c.bg} ${c.icon}`}>{icon}</div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5">
        <span className={`metric-value text-3xl font-bold leading-none ${c.value}`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-gray-500 mb-0.5 font-medium">{unit}</span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
      )}

      {/* Highlight pulse bar */}
      {highlighted && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl ${
            color === 'red' ? 'bg-red-500' : color === 'amber' ? 'bg-amber-500' : 'bg-green-500'
          }`}
        />
      )}
    </motion.div>
  );
}
