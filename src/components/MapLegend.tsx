import React from 'react';

export interface MapLayerFlags {
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
export const MapLegend: React.FC<MapLayerFlags> = ({
  showTraffic,
  showWeather,
  showHeatmap,
  showIncidents,
  showAlternativeRoutes,
  hasUserLocation,
}) => {
  return (
    <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] shadow-[var(--shadow-subtle)] p-5 flex flex-col gap-4">
      <span className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-ink-black)]">
        Map Legend
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">

        {showTraffic && (
          <Group title="Junctions">
            <Row><Swatch color="#059669" /><span>Clear — 42 km/h and above</span></Row>
            <Row><Swatch color="#2563EB" /><span>Moderate — 28-42 km/h</span></Row>
            <Row><Swatch color="#D97706" /><span>Heavy — 18-28 km/h</span></Row>
            <Row><Swatch color="#D93B2D" /><span>Severe — under 18 km/h</span></Row>
          </Group>
        )}

        {showTraffic && (
          <Group title="Live road flow">
            <Row><Line color="#22c55e" /><span>Free flowing</span></Row>
            <Row><Line color="#eab308" /><span>Slowing down</span></Row>
            <Row><Line color="#ef4444" /><span>Queueing / standstill</span></Row>
            <Row><span className="text-[11px] text-[var(--color-steel-gray)]">Road colours come from TomTom live speed</span></Row>
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
    </div>
  );
};
