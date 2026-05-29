'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { TelemetryData } from '@/lib/telemetryStore';

// Fix leaflet default icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons
function createIcon(color: string, emoji: string) {
  return L.divIcon({
    html: `<div style="
      background: ${color};
      width: 36px; height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.5);
      border: 2px solid rgba(255,255,255,0.3);
    ">
      <span style="transform: rotate(45deg); font-size: 16px; line-height: 1;">${emoji}</span>
    </div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// Simulated nearby facilities around Bengaluru
const TRAUMA_CENTERS = [
  { lat: 12.9698, lng: 77.6052, name: 'Manipal Hospital', type: 'Level 1 Trauma' },
  { lat: 12.9784, lng: 77.5800, name: 'Fortis Hospital', type: 'Emergency Centre' },
  { lat: 12.9602, lng: 77.6120, name: 'St. John\'s Medical', type: 'Trauma & Burns' },
];

const POLICE_STATIONS = [
  { lat: 12.9740, lng: 77.5950, name: 'Shivajinagar PS', type: 'Emergency Response' },
  { lat: 12.9660, lng: 77.5870, name: 'Cubbon Park PS', type: 'PCR Unit' },
];

// Map auto-pan to vehicle location
function MapFollower({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const prev = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!prev.current || prev.current.lat !== lat || prev.current.lng !== lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
      prev.current = { lat, lng };
    }
  }, [lat, lng, map]);

  return null;
}

export default function MapView() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [mapKey] = useState(() => `map-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        const json = await res.json();
        setTelemetry(json.data);
      } catch {
        // Silently fail — map still renders with defaults
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const vehicleLat = telemetry?.location?.lat ?? 12.9716;
  const vehicleLng = telemetry?.location?.lng ?? 77.5946;
  const isEmergency = telemetry?.emergencyActive ?? false;
  const severity = telemetry?.severity ?? 'normal';

  const vehicleIcon = createIcon(
    isEmergency ? '#DC2626' : '#16A34A',
    isEmergency ? '🆘' : '🚗'
  );
  const traumaIcon = createIcon('#3B82F6', '🏥');
  const policeIcon = createIcon('#D97706', '🚔');

  // Emergency routing line — nearest trauma center
  const nearestTrauma = TRAUMA_CENTERS[0];
  const routeLine: [number, number][] = [
    [vehicleLat, vehicleLng],
    [nearestTrauma.lat, nearestTrauma.lng],
  ];

  return (
    <div className="w-full h-full relative">
      {/* Severity overlay label */}
      {isEmergency && (
        <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-bold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          EMERGENCY ROUTING ACTIVE
        </div>
      )}

      <MapContainer
        id="roadsos-map-container"
        key={mapKey}
        center={[vehicleLat, vehicleLng]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFollower lat={vehicleLat} lng={vehicleLng} />

        {/* Vehicle marker */}
        <Marker position={[vehicleLat, vehicleLng]} icon={vehicleIcon}>
          <Popup>
            <div className="text-sm">
              <strong>Vehicle Location</strong>
              <br />
              Status: <span className={isEmergency ? 'text-red-600 font-bold' : 'text-green-600'}>
                {severity.toUpperCase()}
              </span>
              <br />
              Speed: {telemetry?.speed?.toFixed(0) ?? '—'} km/h
              <br />
              Coords: {vehicleLat.toFixed(4)}, {vehicleLng.toFixed(4)}
            </div>
          </Popup>
        </Marker>

        {/* Emergency radius pulse */}
        {isEmergency && (
          <Circle
            center={[vehicleLat, vehicleLng]}
            radius={300}
            pathOptions={{
              color: '#DC2626',
              fillColor: '#DC2626',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '6 4',
            }}
          />
        )}

        {/* Emergency routing line */}
        {isEmergency && (
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: '#DC2626',
              weight: 3,
              dashArray: '8 5',
              opacity: 0.8,
            }}
          />
        )}

        {/* Trauma centers */}
        {TRAUMA_CENTERS.map((center) => (
          <Marker key={center.name} position={[center.lat, center.lng]} icon={traumaIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{center.name}</strong>
                <br />
                <span className="text-blue-600">{center.type}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Police stations */}
        {POLICE_STATIONS.map((station) => (
          <Marker key={station.name} position={[station.lat, station.lng]} icon={policeIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{station.name}</strong>
                <br />
                <span className="text-amber-600">{station.type}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend panel */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-[#1A1A1A]/95 backdrop-blur-md border border-white/10 rounded-xl p-4 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">
          Map Legend
        </p>
        {[
          { color: '#DC2626', label: 'Vehicle / SOS Point' },
          { color: '#3B82F6', label: 'Trauma Center' },
          { color: '#D97706', label: 'Police Station' },
          { color: '#DC2626', label: 'Emergency Route', dashed: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-xs text-gray-400">
            {item.dashed ? (
              <div
                className="w-5 h-0.5"
                style={{
                  borderTop: `2px dashed ${item.color}`,
                  opacity: 0.8,
                }}
              />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
            )}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
