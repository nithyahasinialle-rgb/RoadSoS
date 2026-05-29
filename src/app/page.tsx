'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import {
  Activity,
  Wifi,
  ShieldAlert,
  Cpu,
  Radio,
  Map,
  ArrowRight,
  Users,
  Clock,
  Heart,
  Zap,
  ChevronDown,
} from 'lucide-react';

const STATS = [
  { value: '1.35M', label: 'Road deaths annually', sub: 'WHO 2023' },
  { value: '73%', label: 'occur in low-connectivity zones', sub: 'NCRB Data' },
  { value: '6 min', label: 'Average emergency response time', sub: 'India metro' },
  { value: '166', label: 'Survey respondents', sub: 'IITM Hackathon Research' },
];

const FEATURES = [
  {
    icon: Cpu,
    title: 'ESP32 Embedded',
    desc: 'A complete crash-sensing system built on a $5 microcontroller, fusing accelerometer, gyroscope, and structural strain data.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Radio,
    title: 'BLE Emergency Broadcast',
    desc: 'When cellular networks fail, the device broadcasts a Bluetooth emergency signal that nearby drivers and rescue units can pick up without internet.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Wifi,
    title: 'Offline-First Design',
    desc: 'Built for the dark highway zones where networks drop. Alerts are saved locally and sent automatically the instant signal is found.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: ShieldAlert,
    title: 'Crash Detection AI',
    desc: 'Intelligent sensor fusion that instantly detects high-impact crashes, rollovers, and vehicle frame damage.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    icon: Map,
    title: 'Emergency Routing',
    desc: 'Instantly locates the nearest trauma hospitals and police units, mapping the fastest route to get help there first.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Heart,
    title: 'Human-Centered',
    desc: 'Designed for the critical moments when you cannot react. No buttons to press, no app to open. The system acts on your behalf.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
];

const RESEARCH_INSIGHTS = [
  { icon: Wifi, pct: 93, label: 'have experienced poor mobile network coverage while travelling' },
  { icon: Users, pct: 74, label: 'have witnessed or experienced a road accident firsthand' },
  { icon: Clock, pct: 57, label: 'cite delay in emergency response as the biggest challenge' },
  { icon: ShieldAlert, pct: 95, label: 'trust or would consider trusting an automated emergency alert system' },
];

const ARCH_STEPS = [
  { label: 'ESP32 Device', desc: 'Sensors + BLE + WiFi', color: 'border-blue-500/40 bg-blue-500/5' },
  { label: 'HTTP POST', desc: '/api/telemetry', color: 'border-white/10 bg-white/2' },
  { label: 'Next.js API', desc: 'In-memory store', color: 'border-purple-500/40 bg-purple-500/5' },
  { label: 'Dashboard', desc: 'Live telemetry UI', color: 'border-green-500/40 bg-green-500/5' },
  { label: 'Emergency Map', desc: 'Routing + Responders', color: 'border-red-500/40 bg-red-500/5' },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-50">
      <NavBar />

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-gradient-radial from-red-950/30 via-[#0A0A0A] to-[#0A0A0A]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          {/* Pre-badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-widest mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Emergency Response Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-balance mb-6"
          >
            <span className="text-white">What happens when accident victims </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              cannot call for help?
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 text-balance"
          >
            When a crash happens on a remote highway, every second counts. ROADSoS is an offline-first system that detects accidents autonomously, broadcasts an SOS over Bluetooth, and dispatches emergency alerts <em className="text-red-500 not-italic font-semibold">even if you are unconscious and there is no cellular signal.</em>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2.5 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]"
            >
              <Activity size={18} />
              Open Live Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/research"
              className="flex items-center gap-2.5 px-8 py-4 border border-white/12 hover:border-white/25 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-200 hover:bg-white/5"
            >
              <Users size={18} />
              View Research
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-white/6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400 leading-tight">{stat.label}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-3 block">
              Platform Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Built for the moments
              <br />
              <span className="text-gray-400">when systems fail.</span>
            </h2>
            <p className="text-gray-500 max-w-xl leading-relaxed">
              Every design decision was driven by a single constraint: what if there is no connectivity, 
              no conscious operator, and no time?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="card p-6 card-hover group"
                >
                  <div className={`inline-flex p-2.5 rounded-lg ${f.bg} ${f.color} mb-5`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-white mb-2.5 text-[15px]">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Architecture ───────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3 block">
              System Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-gray-500">
              From sensor to emergency dispatch: a complete, deployable pipeline.
            </p>
          </motion.div>

          {/* Architecture flow */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {ARCH_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`px-4 py-3 rounded-lg border text-sm ${step.color}`}>
                  <div className="font-semibold text-white text-xs">{step.label}</div>
                  <div className="text-gray-500 text-[10px] mt-0.5">{step.desc}</div>
                </div>
                {i < ARCH_STEPS.length - 1 && (
                  <ArrowRight size={14} className="text-gray-700 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Code preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-white/8 bg-[#111111] overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-[#0D0D0D]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-gray-600 font-mono ml-2">ESP32 → POST /api/telemetry</span>
            </div>
            <pre className="p-6 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`// ESP32 Telemetry Payload (JSON)
{
  "acceleration": 1.2,
  "rollAngle": 2.4,
  "speed": 62.0,
  "strainValue": 4,
  "crashProbability": 3.2,
  "severity": "normal",
  "emergencyActive": false,
  "bleStatus": "idle",
  "location": { "lat": 12.9716, "lng": 77.5946 }
}`}
            </pre>
          </motion.div>
        </div>
      </section>

      {/* ─── Research Insights ──────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-3 block">
              Primary Research — 165+ Responses
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Designed from real fear.
            </h2>
            <p className="text-gray-500 max-w-xl leading-relaxed">
              We surveyed 166 people about their real experiences and safety fears on the road.
              Their feedback shaped every feature we built.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {RESEARCH_INSIGHTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-5 p-6 rounded-xl border border-white/8 bg-[#1A1A1A]"
                >
                  <div className="text-4xl font-black text-white min-w-[60px]">{item.pct}%</div>
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-400 leading-relaxed">{item.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/research"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              View full research findings
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
              <Zap size={14} className="text-red-400" />
              <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">Live Demo Active</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See it in action
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Trigger a crash simulation, watch the dashboard react in real time, 
              and see how the emergency system responds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2.5 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]"
              >
                <Activity size={18} />
                Launch Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/map"
                className="flex items-center gap-2.5 px-8 py-4 border border-white/12 hover:border-white/25 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-200 hover:bg-white/5"
              >
                <Map size={18} />
                Emergency Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-sm text-white">
              ROAD<span className="text-red-500">SoS</span>
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Emergency Response Platform · Built for IITM Road Safety Hackathon
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
            <Link href="/map" className="hover:text-gray-400 transition-colors">Map</Link>
            <Link href="/research" className="hover:text-gray-400 transition-colors">Research</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
