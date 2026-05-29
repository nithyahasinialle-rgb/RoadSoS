'use client';

import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import {
  Users,
  Wifi,
  Clock,
  ShieldAlert,
  Heart,
  Brain,
  Lightbulb,
  TrendingUp,
  Map,
  Phone,
} from 'lucide-react';

const KEY_STATS = [
  { value: '166', label: 'Survey Responses', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { value: '93%', label: 'Experience poor mobile network when travelling', icon: Wifi, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { value: '74%', label: 'Have witnessed or experienced an accident', icon: Brain, color: 'text-red-400', bg: 'bg-red-500/10' },
  { value: '95%', label: 'Trust or would trust automatic crash alerts', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const CONCERNS = [
  {
    icon: Wifi,
    title: 'Poor Connectivity',
    pct: 93,
    color: 'blue',
    barColor: 'bg-blue-500',
    quote: '"My phone had no signal for 40 km on NH-48. If anything happened, no one would know."',
    insight: '93.4% of users face prolonged connectivity dead zones while travelling. Emergency systems must function offline and use BLE.',
  },
  {
    icon: Brain,
    title: 'Witnessed Accidents',
    pct: 74,
    color: 'red',
    barColor: 'bg-red-500',
    quote: '"Witnessed a critical highway accident, there was no one passing by to help leading to delays in treatment."',
    insight: '3 out of 4 users have experienced or witnessed a road accident firsthand, showing the immediate personal relevance of crash systems.',
  },
  {
    icon: Clock,
    title: 'Delayed Response',
    pct: 57,
    color: 'amber',
    barColor: 'bg-amber-500',
    quote: '"We waited 25 minutes for an ambulance. The traffic meant paramedics didn\'t know which route to take."',
    insight: '57.2% cite response delays as the biggest challenge. Automating detection and routing to the nearest trauma center shaves off critical minutes.',
  },
  {
    icon: ShieldAlert,
    title: 'Panic & Confusion',
    pct: 47,
    color: 'pink',
    barColor: 'bg-pink-500',
    quote: '"The people involved and surrounding have no common sense. They are least bothered about lives involved and focus on taking photos."',
    insight: '47% point to human panic and confusion as major bottlenecks. Removing human latency through passive detection saves lives.',
  },
  {
    icon: Heart,
    title: 'Trust in Automation',
    pct: 95,
    color: 'green',
    barColor: 'bg-green-500',
    quote: '"knowing i have a system which detects the accident and calls for help as soon as possible makes me feel safer."',
    insight: '94.6% of commuters (63.3% Yes, 31.3% Maybe) express willingness to adopt and trust an automated emergency alert system.',
  },
  {
    icon: Map,
    title: 'Difficulty Finding Help',
    pct: 19,
    color: 'purple',
    barColor: 'bg-purple-500',
    quote: '"We could not describe where we were on the highway. No landmarks, just kilometer posts, and struggled finding hospital details."',
    insight: '18.7% cite finding nearby hospitals as a critical challenge. Automatic GPS telemetry and hospital mapping resolve location ambiguity.',
  },
];

const EMPATHY_STAGES = [
  {
    stage: 'Say',
    content: [
      '"I don\'t know if help will come in time."',
      '"My phone dies on long trips."',
      '"What if I\'m alone and unconscious?"',
    ],
    color: 'border-blue-500/30 bg-blue-500/5',
    label: 'text-blue-400',
  },
  {
    stage: 'Think',
    content: [
      'Highway drive = anxiety about breakdowns',
      'Distrust of emergency call centers',
      'Worry about being a burden to family',
    ],
    color: 'border-amber-500/30 bg-amber-500/5',
    label: 'text-amber-400',
  },
  {
    stage: 'Do',
    content: [
      'Texting family before long drives',
      'Googling hospital numbers "just in case"',
      'Carrying paper maps as backup',
    ],
    color: 'border-green-500/30 bg-green-500/5',
    label: 'text-green-400',
  },
  {
    stage: 'Feel',
    content: [
      'Anxious on unfamiliar roads',
      'Powerless in an unconscious scenario',
      'Relieved when help arrives quickly',
    ],
    color: 'border-red-500/30 bg-red-500/5',
    label: 'text-red-400',
  },
];

const HOW_WE_RESPONDED = [
  { challenge: 'Poor connectivity', solution: 'BLE emergency broadcast + offline queue', icon: Radio },
  { challenge: 'Unconscious victims', solution: 'Fully autonomous detection: no user action needed', icon: Brain },
  { challenge: 'Delayed response', solution: 'Auto-dispatch with GPS + severity to nearest center', icon: Clock },
  { challenge: "Women's safety", solution: 'Silent SOS mode with passive monitoring', icon: ShieldAlert },
  { challenge: 'Trust issues', solution: 'Transparent telemetry: the user can always see what was sent', icon: Heart },
  { challenge: 'Location ambiguity', solution: 'Precise GPS coordinates + altitude in every alert', icon: Map },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Radio(props: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </svg>
  );
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-50">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-3 block">
            Design Thinking & Primary Research
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Designed from
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              real fear.
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Before writing any code, we surveyed 166 travelers about their real experiences and safety fears on the road. Every single feature in ROADSoS is a direct response to a real concern shared by a commuter.
          </p>
        </motion.div>

        {/* ── Key stats ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {KEY_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-5 rounded-xl border border-white/8 bg-[#1A1A1A]"
              >
                <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-4`}>
                  <Icon size={18} />
                </div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 leading-tight">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Section divider ───────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-white/6" />
          <span className="text-xs text-gray-600 uppercase tracking-widest">Core User Concerns</span>
          <div className="h-px flex-1 bg-white/6" />
        </div>

        {/* ── User concern cards ───────────────────────────────────── */}
        <div className="space-y-6 mb-24">
          {CONCERNS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-xl border border-white/8 bg-[#1A1A1A]"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Left: stat + bar */}
                  <div className="md:w-56 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-4xl font-black text-white mb-3">{item.pct}%</div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className={`h-full rounded-full ${item.barColor}`}
                      />
                    </div>
                  </div>

                  {/* Right: quote + insight */}
                  <div className="flex-1">
                    <blockquote className="text-gray-300 text-sm italic border-l-2 border-white/15 pl-4 mb-4 leading-relaxed">
                      {item.quote}
                    </blockquote>
                    <div className="flex items-start gap-2.5">
                      <Lightbulb size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-500 leading-relaxed">{item.insight}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Empathy map ──────────────────────────────────────────── */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-white/6" />
            <span className="text-xs text-gray-600 uppercase tracking-widest">Empathy Map</span>
            <div className="h-px flex-1 bg-white/6" />
          </div>

          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2 block">
              User Archetype
            </span>
            <h2 className="text-2xl font-bold text-white">
              The highway traveller facing an emergency
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {EMPATHY_STAGES.map((stage, i) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`p-6 rounded-xl border ${stage.color}`}
              >
                <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${stage.label}`}>
                  {stage.stage}
                </div>
                <ul className="space-y-2">
                  {stage.content.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0 opacity-50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── How we responded ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-white/6" />
            <span className="text-xs text-gray-600 uppercase tracking-widest">Design Response</span>
            <div className="h-px flex-1 bg-white/6" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              From insight to feature
            </h2>
            <p className="text-gray-500">
              Every concern from our research maps directly to a system capability.
            </p>
          </motion.div>

          <div className="space-y-3">
            {HOW_WE_RESPONDED.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.challenge}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-white/6 bg-[#1A1A1A] hover:bg-[#1E1E1E] transition-colors"
                >
                  <div className="flex items-center gap-3 sm:w-64 flex-shrink-0">
                    <Icon size={14} className="text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-400">{item.challenge}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 hidden sm:flex">
                    <TrendingUp size={12} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-sm text-green-400 font-medium">{item.solution}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-6 rounded-xl border border-purple-500/20 bg-purple-500/5"
          >
            <div className="flex items-start gap-3">
              <Users size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-purple-400">Research methodology:</strong> 165 structured surveys 
                  distributed via Google Forms across college students, working professionals, and regular highway commuters 
                  aged 18–55 in India. The survey covered emergency experience, technology comfort, trust in 
                  existing systems, and willingness to adopt IoT-based safety solutions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
