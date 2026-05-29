'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Radio, AlertTriangle, PhoneCall, Shield } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    icon: Shield,
    title: 'Sensor Monitoring',
    desc: 'Accelerometer, gyroscope & strain gauge continuously sampled at 100Hz',
    trigger: 'always',
  },
  {
    id: 2,
    icon: AlertTriangle,
    title: 'Crash Detection',
    desc: 'ML threshold triggers on impact signature: >8g or roll >45°',
    trigger: 'impact',
  },
  {
    id: 3,
    icon: Radio,
    title: 'BLE Broadcast',
    desc: 'Emergency payload broadcast over BLE to nearby responders & devices',
    trigger: 'detected',
  },
  {
    id: 4,
    icon: PhoneCall,
    title: 'SOS Alert Sent',
    desc: 'SMS + API alert dispatched with GPS coordinates and severity level',
    trigger: 'sos',
  },
  {
    id: 5,
    icon: CheckCircle,
    title: 'Help En Route',
    desc: 'Nearest trauma center and emergency services notified with ETA',
    trigger: 'response',
  },
];

interface WorkflowTimelineProps {
  activeStep?: number;
  severity?: string;
}

export default function WorkflowTimeline({ activeStep = 1, severity = 'normal' }: WorkflowTimelineProps) {
  const isEmergency = severity === 'critical' || severity === 'sos';

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start gap-0 min-w-max">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx + 1 <= activeStep;
          const isCurrent = idx + 1 === activeStep;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-start">
              {/* Step */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex flex-col items-center w-44"
              >
                {/* Circle */}
                <div className="relative mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isActive
                        ? isEmergency && isCurrent
                          ? 'border-red-500 bg-red-500/20 text-red-400'
                          : 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-white/15 bg-white/5 text-gray-600'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  {isCurrent && (
                    <div
                      className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                        isEmergency ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    />
                  )}
                </div>

                {/* Text */}
                <p
                  className={`text-xs font-semibold text-center leading-tight mb-1 ${
                    isActive ? 'text-gray-200' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-gray-500 text-center leading-snug px-2">
                  {step.desc}
                </p>
              </motion.div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex items-center mt-5 flex-1">
                  <div
                    className={`h-0.5 w-8 transition-all duration-700 ${
                      idx + 1 < activeStep ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
