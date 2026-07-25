// Run: npx tsx src/utils/viewport.test.ts
import assert from 'node:assert/strict';
import { TrafficNode } from '../types';
import { inBounds, summarizeNodes, distanceKm } from './viewport';

const bounds: [[number, number], [number, number]] = [[28.5, 77.0], [28.8, 77.4]];
assert.equal(inBounds(28.63, 77.21, bounds), true, 'Connaught Place is inside Delhi bounds');
assert.equal(inBounds(19.07, 72.87, bounds), false, 'Mumbai is outside Delhi bounds');
assert.equal(inBounds(28.5, 77.0, bounds), true, 'corner counts as inside');

const node = (id: string, status: TrafficNode['status'], avgSpeedKmh: number): TrafficNode => ({
  id,
  name: id,
  status,
  avgSpeedKmh,
  delayMinutes: 0,
  coords: { x: 0, y: 0 },
  lat: 28.6,
  lng: 77.2,
});

const empty = summarizeNodes([]);
assert.equal(empty.count, 0);
assert.equal(empty.worst, null, 'no worst junction without nodes');

const s = summarizeNodes([
  node('a', 'clear', 50),
  node('b', 'moderate', 30),
  node('c', 'heavy', 20),
  node('d', 'severe', 10),
]);
assert.equal(s.count, 4);
assert.equal(s.avgSpeed, 28, 'average of 50/30/20/10');
assert.equal(s.clearPct, 50, 'clear + moderate count as flowing');
assert.equal(s.heavyPct, 25, 'severe share');
assert.equal(s.modPct, 25, 'remainder, so the bar always totals 100');
assert.equal(s.clearPct + s.modPct + s.heavyPct, 100);
assert.equal(s.worst?.id, 'd', 'slowest junction is the worst');

// Connaught Place -> India Gate is roughly 3 km
const d = distanceKm(28.6315, 77.2167, 28.6129, 77.2295);
assert.ok(d > 2 && d < 4, `expected ~3 km, got ${d.toFixed(2)}`);
assert.equal(distanceKm(28.6, 77.2, 28.6, 77.2), 0, 'same point is zero distance');

console.log('viewport utils OK');
