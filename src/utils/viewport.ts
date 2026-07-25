import { TrafficNode } from '../types';

export interface Viewport {
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  zoom: number;
  center: [number, number];
}

export function inBounds(lat: number, lng: number, bounds: Viewport['bounds']): boolean {
  const [[south, west], [north, east]] = bounds;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

export interface NodeSummary {
  count: number;
  avgSpeed: number;
  clearPct: number;
  modPct: number;
  heavyPct: number;
  worst: TrafficNode | null;
}

/** Congestion split + average speed for a set of junctions (whole city or just the ones on screen). */
export function summarizeNodes(nodes: TrafficNode[]): NodeSummary {
  const count = nodes.length;
  if (count === 0) {
    return { count: 0, avgSpeed: 0, clearPct: 0, modPct: 0, heavyPct: 0, worst: null };
  }

  const clearCount = nodes.filter((n) => n.status === 'clear' || n.status === 'moderate').length;
  const heavyCount = nodes.filter((n) => n.status === 'severe').length;

  const clearPct = Math.round((clearCount / count) * 100);
  const heavyPct = Math.round((heavyCount / count) * 100);

  return {
    count,
    avgSpeed: Math.round(nodes.reduce((sum, n) => sum + n.avgSpeedKmh, 0) / count),
    clearPct,
    heavyPct,
    modPct: 100 - clearPct - heavyPct,
    worst: nodes.reduce((slowest, n) => (n.avgSpeedKmh < slowest.avgSpeedKmh ? n : slowest), nodes[0]),
  };
}

/** Rough great-circle distance in km — good enough to ask "is this incident near that junction?". */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
