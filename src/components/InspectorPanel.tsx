import React from 'react';
import { Incident, TrafficNode } from '../types';
import { Maximize2, X, MapPin, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { calculateStartsInMinutes, calculateEstimatedVehicles } from '../utils/forecast';
import { radiusAt } from '../utils/radiusAt';
import { distanceKm } from '../utils/viewport';

interface InspectorPanelProps {
  mode: 'node' | 'incident';
  node: TrafficNode | null;
  incident: Incident | null;
  incidents: Incident[];
  forecastMinutes: number;
  onSelectIncident: (id: string) => void;
  onExpandMap: () => void;
  onClose: () => void;
  onNavigateToIncidents: () => void;
}

const STATUS_COLOR: Record<TrafficNode['status'], string> = {
  severe: '#D93B2D',
  heavy: '#D97706',
  moderate: '#2563EB',
  clear: '#059669',
};

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <div className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">
      {label}
    </div>
    <div className="text-[18px] font-medium text-[var(--color-ink-black)] mt-1">{value}</div>
  </div>
);

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  mode,
  node,
  incident,
  incidents,
  forecastMinutes,
  onSelectIncident,
  onExpandMap,
  onClose,
  onNavigateToIncidents,
}) => {
  // Incidents whose predicted spread reaches this junction (radius grows with the forecast horizon)
  const nearbyIncidents = React.useMemo(() => {
    if (!node) return [];
    return incidents
      .map((inc) => ({ inc, km: distanceKm(node.lat, node.lng, inc.lat, inc.lng) }))
      .filter(({ inc, km }) => km <= Math.max(2, radiusAt(inc, forecastMinutes) / 1000))
      .sort((a, b) => a.km - b.km)
      .slice(0, 4);
  }, [node, incidents, forecastMinutes]);

  const isConfirmed = incident?.verificationStatus === 'confirmed';
  const startsIn = incident ? calculateStartsInMinutes(incident.startsInMinutes, forecastMinutes) : 0;

  return (
    <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] shadow-[var(--shadow-subtle)] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 border-b border-[var(--color-mist)]">
        <div className="min-w-0">
          <div className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">
            {mode === 'node' ? 'Junction' : 'Incident'}
          </div>
          <h3 className="text-[20px] font-medium text-[var(--color-ink-black)] leading-snug mt-1 truncate">
            {mode === 'node' ? node?.name : incident?.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onExpandMap}
            title="Expand map"
            className="p-2 rounded-[var(--radius-buttons)] text-[var(--color-steel-gray)] hover:text-[var(--color-ink-black)] hover:bg-[var(--color-paper-white)] transition-colors cursor-pointer border-none bg-transparent"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close inspector"
            className="p-2 rounded-[var(--radius-buttons)] text-[var(--color-steel-gray)] hover:text-[var(--color-ink-black)] hover:bg-[var(--color-paper-white)] transition-colors cursor-pointer border-none bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Node mode */}
      {mode === 'node' && node && (
        <div className="p-5 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-buttons)] text-[12px] font-medium"
              style={{ backgroundColor: `${STATUS_COLOR[node.status]}1a`, color: STATUS_COLOR[node.status] }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLOR[node.status] }} />
              {node.status.toUpperCase()}
            </span>
            <span className="text-[12px] text-[var(--color-steel-gray)] flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Stat label="Avg speed" value={`${node.avgSpeedKmh} km/h`} />
            <Stat label="Delay" value={`+${node.delayMinutes} min`} />
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-[var(--color-mist)]">
            <span className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">
              Incidents affecting this junction ({nearbyIncidents.length})
            </span>

            {nearbyIncidents.length === 0 ? (
              <p className="text-[14px] text-[var(--color-steel-gray)]">
                No predicted disruption reaches this junction at +{forecastMinutes} min.
              </p>
            ) : (
              nearbyIncidents.map(({ inc, km }) => (
                <button
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className="text-left bg-[var(--color-paper-white)] border border-[var(--color-cloud)] rounded-[var(--radius-inputs)] p-3 hover:border-[var(--color-mist)] transition-colors cursor-pointer flex items-start justify-between gap-3"
                >
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium text-[var(--color-ink-black)] truncate">{inc.title}</span>
                    <span className="block text-[12px] text-[var(--color-steel-gray)] truncate">
                      {inc.area} · {km.toFixed(1)} km away
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] font-medium text-[var(--color-ink-black)]">+{inc.delayMinutes}m</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Incident mode */}
      {mode === 'incident' && incident && (
        <div className="p-5 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-buttons)] text-[12px] font-medium"
              style={{
                backgroundColor: `${STATUS_COLOR[incident.severity === 'low' ? 'clear' : incident.severity]}1a`,
                color: STATUS_COLOR[incident.severity === 'low' ? 'clear' : incident.severity],
              }}
            >
              {incident.severity.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-buttons)] text-[12px] font-medium border border-[var(--color-cloud)] text-[var(--color-body-charcoal)]">
              {isConfirmed ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {isConfirmed ? 'Confirmed' : 'Unverified'}
            </span>
            <span className="text-[12px] text-[var(--color-steel-gray)] flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {incident.area}
            </span>
          </div>

          <p className="text-[14px] text-[var(--color-body-charcoal)] leading-[1.5]">{incident.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <Stat label="Delay" value={`+${incident.delayMinutes} min`} />
            <Stat label="Starts in" value={startsIn === 0 ? 'Active now' : `${startsIn} min`} />
            <Stat label="Confidence" value={`${incident.confidencePercent}%`} />
            <Stat label="Sources" value={`${incident.sourcesCount} reports`} />
          </div>

          <div className="pt-4 border-t border-[var(--color-mist)] flex flex-col gap-2">
            <span className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">
              Affected roads
            </span>
            <div className="flex flex-wrap gap-2">
              {incident.affectedRoads.map((road) => (
                <span
                  key={road}
                  className="text-[12px] text-[var(--color-body-charcoal)] bg-[var(--color-paper-white)] border border-[var(--color-cloud)] rounded-[var(--radius-buttons)] px-3 py-1"
                >
                  {road}
                </span>
              ))}
            </div>
            <span className="text-[12px] text-[var(--color-steel-gray)] mt-1">
              ~{calculateEstimatedVehicles(incident.severity, incident.confidencePercent).toLocaleString()} vehicles impacted ·
              source: {incident.socialSource}
            </span>
          </div>

          <button
            onClick={onNavigateToIncidents}
            className="w-full bg-[var(--color-paper-white)] hover:bg-[var(--color-cloud)] border border-[var(--color-cloud)] text-[var(--color-ink-black)] px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-lg cursor-pointer"
          >
            Manage in Incidents Workspace <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
