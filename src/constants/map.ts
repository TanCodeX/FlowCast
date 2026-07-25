export const DELHI_CENTER: [number, number] = [28.61, 77.22];
export const DELHI_NCR_BOUNDS: [[number, number], [number, number]] = [
  [28.20, 76.80],
  [28.95, 77.65]
];
export const DEFAULT_ZOOM = 11.5;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 15;
export const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

// TomTom traffic-flow tiles, proxied by our server so the key stays server-side.
// Colour-codes real roads by live speed; serves 404 when no key is configured.
export const TRAFFIC_FLOW_TILE_URL = '/api/traffic-tile/{z}/{x}/{y}';
