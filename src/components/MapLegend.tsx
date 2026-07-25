import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MapLegendProps {
  showTraffic: boolean;
  showWeather: boolean;
  showHeatmap: boolean;
  showIncidents: boolean;
  showAlternativeRoutes: boolean;
  hasUserLocation: boolean;
}

const Swatch: React.FC<{ color: string; ring?: boolean; dashed?: boolean }> = ({ color, ring, dashed }) => (
  <span
    className="w-3 h-3 rounded-full shrink-0"
    style={{
      backgroundColor: ring ? 'transparent' : color,
      border: ring ? `2px ${dashed ? 'dashed' : 'solid'} ${color}` : 'none',
    }}
  />
);

const Line: React.FC<{ color: string; dashed?: boolean }> = ({ color, dashed }) => (
  <span
    className="w-4 h-0 shrink-0"
    style={{ borderTop: `2px ${dashed ? 'dashed' : 'solid'} ${color}` }}
  />
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-2 text-[12px] text-[var(--color-body-charcoal)]">{children}</div>
);

const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">
      {title}
    </span>
    {children}
  </div>
);

/** Decodes the map symbols — only for layers that are actually switched on. */
export const MapLegend: React.FC<MapLegendProps> = ({
  showTraffic,
  showWeather,
  showHeatmap,
  showIncidents,
  showAlternativeRoutes,
  hasUserLocation,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-[240px] bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] shadow-[var(--shadow-sm)] p-4 flex flex-col gap-4 z-[1001]">
          {showTraffic && (
            <Group title="Junctions">
              <Row><Swatch color="#059669" /><span>Clear — 42 km/h and above</span></Row>
              <Row><Swatch color="#2563EB" /><span>Moderate — 28-42 km/h</span></Row>
              <Row><Swatch color="#D97706" /><span>Heavy — 18-28 km/h</span></Row>
              <Row><Swatch color="#D93B2D" /><span>Severe — under 18 km/h</span></Row>
              <Row><Line color="#059669" /><span>Flow line, solid = moving</span></Row>
              <Row><Line color="#D97706" dashed /><span>Flow line, dashed = congested</span></Row>
            </Group>
          )}

          {showIncidents && (
            <Group title="Incidents">
              <Row><Swatch color="#D93B2D" ring /><span>Confirmed disruption</span></Row>
              <Row><Swatch color="#D97706" ring /><span>Unverified warning</span></Row>
              <Row><span className="text-[11px] text-[var(--color-steel-gray)]">Circle grows with the forecast horizon</span></Row>
            </Group>
          )}

          {showHeatmap && (
            <Group title="Heatmap">
              <Row><Swatch color="#D93B2D" /><span>Wash = predicted spread, by severity</span></Row>
            </Group>
          )}

          {showWeather && (
            <Group title="Weather">
              <Row><Swatch color="#6D28D9" ring dashed /><span>Storm cell, drifts with forecast</span></Row>
              <Row><Swatch color="#2563EB" ring /><span>Flood-prone underpass</span></Row>
            </Group>
          )}

          {showAlternativeRoutes && (
            <Group title="Routes">
              <Row><Line color="#10B981" dashed /><span>AI recommended detour</span></Row>
              <Row><Line color="#D93B2D" dashed /><span>Standard route</span></Row>
            </Group>
          )}

          {hasUserLocation && (
            <Group title="You">
              <Row><Swatch color="#2563EB" /><span>Your GPS fix</span></Row>
            </Group>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
          open ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
        }`}
      >
        <span>Legend</span>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
