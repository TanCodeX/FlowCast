import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { TrafficNode, Incident } from '../types';
import { radiusAt } from '../lib/forecast';
import { AlertTriangle, Zap, Layers } from 'lucide-react';

interface InteractiveMapProps {
  nodes: TrafficNode[];
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  forecastMinutesAhead: number;
  verifications?: Record<string, 'confirmed' | 'unverified'>;
}

const DELHI: [number, number] = [28.61, 77.22];
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

// Representative AI detour
const DEMO_DETOUR: [number, number][] = [
  [28.6315, 77.2167],
  [28.6290, 77.2250],
  [28.6180, 77.2430],
  [28.6000, 77.2400],
  [28.5760, 77.1740],
];

const nodeColor = (status: string) =>
  status === 'severe' ? '#0a1b3f'
  : status === 'heavy' ? '#f39c12'
  : status === 'moderate' ? '#3498db'
  : '#34c759';

const sevColor = (s: string) =>
  s === 'severe' ? '#0a1b3f'
  : s === 'heavy' ? '#f39c12'
  : s === 'moderate' ? '#f1c40f'
  : '#f1c40f';

const incidentIcon = (selected: boolean, unverified: boolean) => {
  const c = unverified ? '243,156,18' : '10,27,63'; // yellow/orange vs ink black
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;background:rgba(${c},${
      selected ? '1' : '0.85'
    });border:2px solid #ffffff;border-radius:100px;color:#fff;font-size:14px;font-weight:bold;box-shadow:0 2px 8px rgba(${c},0.4)">${unverified ? '?' : '⚠'}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  nodes,
  incidents,
  selectedIncidentId,
  onSelectIncident,
  selectedNodeId,
  onSelectNode,
  forecastMinutesAhead,
  verifications = {},
}) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showDetours, setShowDetours] = useState(true);

  const t = Math.max(0, Math.min(30, forecastMinutesAhead)) / 30;
  const jamOpacity = 0.15 + t * 0.25;

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[16/8.5] bg-[var(--color-paper-white)] overflow-hidden border border-[var(--color-cloud)] select-none">
      <MapContainer
        center={DELHI}
        zoom={11}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', background: 'var(--color-paper-white)' }}
      >
        <TileLayer url={LIGHT_TILES} attribution="&copy; OpenStreetMap &copy; CARTO" />

        {/* Jam impact zones */}
        {showHeatmap &&
          incidents.map((inc) => {
            const color = verifications[inc.id] === 'unverified' ? '#f39c12' : sevColor(inc.severity);
            return (
              <Circle
                key={`jam-${inc.id}`}
                center={[inc.lat, inc.lng]}
                radius={radiusAt(inc, forecastMinutesAhead)}
                pathOptions={{ color, weight: 1, fillColor: color, fillOpacity: jamOpacity }}
              />
            );
          })}

        {/* AI detour */}
        {showDetours && (
          <Polyline positions={DEMO_DETOUR} pathOptions={{ color: 'var(--color-signal-green)', weight: 4, dashArray: '8 6' }} />
        )}

        {/* Traffic nodes */}
        {nodes.map((node) => {
          const selected = selectedNodeId === node.id;
          return (
            <CircleMarker
              key={node.id}
              center={[node.lat, node.lng]}
              radius={selected ? 9 : 6}
              pathOptions={{ color: '#ffffff', weight: 2, fillColor: nodeColor(node.status), fillOpacity: 1 }}
              eventHandlers={{ click: () => onSelectNode(node.id) }}
            >
              <Popup>
                <strong>{node.name}</strong>
                <br />
                <span style={{ color: nodeColor(node.status) }}>{node.avgSpeedKmh} km/h</span> · +{node.delayMinutes}m
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Incident markers */}
        {showIncidents &&
          incidents.map((inc) => {
            const unverified = verifications[inc.id] === 'unverified';
            return (
              <Marker
                key={inc.id}
                position={[inc.lat, inc.lng]}
                icon={incidentIcon(selectedIncidentId === inc.id, unverified)}
                eventHandlers={{ click: () => onSelectIncident(inc.id) }}
              >
                <Popup>
                  <span style={{ color: unverified ? '#d68910' : 'var(--color-signal-green)', fontWeight: 600, fontSize: 11, fontFamily: 'Inter' }}>
                    {unverified ? '⚠ UNVERIFIED WARNING' : '✓ CONFIRMED'}
                  </span>
                  <br />
                  <strong style={{ color: 'var(--color-ink-black)', fontFamily: 'Inter' }}>{inc.title}</strong>
                  <br />
                  {inc.area}
                  <br />
                  Delay +{inc.delayMinutes}m · starts in {inc.startsInMinutes}m · {inc.confidencePercent}% conf
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Layer Controls Bar */}
      <div className="absolute bottom-4 left-4 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] p-1.5 flex items-center gap-2 text-[12px] z-[1000] shadow-[var(--shadow-sm)] rounded-[100px] font-medium">
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] ${
            showHeatmap ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Heatmap</span>
        </button>

        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] ${
            showIncidents ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Incidents</span>
        </button>

        <button
          onClick={() => setShowDetours(!showDetours)}
          className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] ${
            showDetours ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[var(--color-signal-green)]" />
          <span>AI Detours</span>
        </button>
      </div>

      {/* Map Watermark */}
      <div className="absolute top-4 right-4 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] px-3 py-1.5 text-[12px] text-[var(--color-ink-black)] flex items-center gap-2 z-[1000] shadow-[var(--shadow-sm)] font-medium rounded-[100px] pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse" />
        <span>DELHI LIVE RADAR</span>
        <span className="text-[var(--color-signal-green)] font-semibold">+{forecastMinutesAhead}m</span>
      </div>
    </div>
  );
};
