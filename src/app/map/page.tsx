'use client';

import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
import { motion } from 'framer-motion';

// Dynamically import the actual map component to prevent SSR issues
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] rounded-xl border border-white/8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading emergency map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-8 flex flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-red-500">
              Emergency Map
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">
              Vehicle Location & Nearby Responders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Live position tracking with trauma centers and police stations
            </p>
          </div>

          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-400">Vehicle / SOS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-gray-400">Trauma Center</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-gray-400">Police Station</span>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-[520px] rounded-xl overflow-hidden border border-white/8"
        >
          <MapView />
        </motion.div>
      </main>
    </div>
  );
}
