import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Team Ketos ROADSoS',
  description:
    'An offline-first emergency response system for road accidents using ESP32, BLE broadcasting, and real-time telemetry. Built for speed, trust, and survival.',
  keywords: ['emergency response', 'road accident', 'ESP32', 'BLE', 'crash detection', 'IoT safety'],
  openGraph: {
    title: 'ROADSoS — Emergency Response for Road Accidents',
    description: 'What happens when accident victims cannot call for help?',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-[#0A0A0A] text-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
