import React, { useState, useEffect, useRef } from 'react';
import { TrafficNode, Incident } from '../types';
import { AlertTriangle, Layers, Activity, CloudRain, Zap, ChevronUp, Crosshair, Maximize2, RotateCcw, LocateFixed, Download } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Circle, Polyline, Popup, Tooltip, LayerGroup, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Circle as LeafletCircle, Map as LeafletMap, divIcon } from 'leaflet';

import { AnimatedIncidentCircle } from './AnimatedIncidentCircle';
import { radiusAt, severityToColor } from '../utils/radiusAt';
import { isIncidentConfirmed } from '../utils/verification';
import { DELHI_CENTER, DELHI_NCR_BOUNDS, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, TILE_LAYER_URL, TRAFFIC_FLOW_TILE_URL } from '../constants/map';
import { FEATURES } from '../constants/features';
import { CITIES } from '../constants/cities';
import { MapLayerFlags } from './MapLegend';
import { Viewport } from '../utils/viewport';

interface WaterloggingHazard {
  name: string;
  lat: number;
  lng: number;
  baseRadius: number; // in meters
  severity: 'heavy' | 'severe' | 'moderate';
}

const WATERLOGGING_ZONES: Record<string, WaterloggingHazard[]> = {
  delhi: [
    { name: "Minto Bridge Underpass", lat: 28.6330, lng: 77.2200, baseRadius: 150, severity: 'severe' },
    { name: "Jahangirpuri Metro Subway", lat: 28.7256, lng: 77.1128, baseRadius: 100, severity: 'heavy' },
    { name: "Pul Prahladpur Underpass", lat: 28.5244, lng: 77.2513, baseRadius: 120, severity: 'moderate' }
  ],
  mumbai: [
    { name: "Milan Subway (Santacruz)", lat: 19.0880, lng: 72.8420, baseRadius: 180, severity: 'severe' },
    { name: "Hindmata Chowk (Dadar)", lat: 19.0180, lng: 72.8480, baseRadius: 130, severity: 'severe' },
    { name: "King's Circle Railway Bridge", lat: 19.0290, lng: 72.8550, baseRadius: 110, severity: 'heavy' }
  ],
  bengaluru: [
    { name: "Silk Board Underpass Tunnel", lat: 12.9174, lng: 77.6228, baseRadius: 150, severity: 'severe' },
    { name: "Outer Ring Road (Bellandur)", lat: 12.9360, lng: 77.6880, baseRadius: 130, severity: 'heavy' },
    { name: "Hope Farm Underpass", lat: 12.9840, lng: 77.7520, baseRadius: 90, severity: 'moderate' }
  ]
};

const STORM_CELLS: Record<string, { lat: number; lng: number; radius: number }[]> = {
  delhi: [
    { lat: 28.65, lng: 77.20, radius: 2800 },
    { lat: 28.58, lng: 77.28, radius: 2000 }
  ],
  mumbai: [
    { lat: 19.08, lng: 72.86, radius: 3500 },
    { lat: 19.15, lng: 72.89, radius: 2500 }
  ],
  bengaluru: [
    { lat: 12.95, lng: 77.62, radius: 3000 },
    { lat: 12.89, lng: 77.66, radius: 2200 }
  ]
};

// relative-delay tiles are sparse (only delayed roads), so they are useful even at
// city overview zoom — show them from zoom 11 onward.
const TRAFFIC_MIN_ZOOM = 11;

/** Samples a route and returns arrow anchors with a bearing, so direction of travel is readable. */
function routeArrows(points: [number, number][]): { position: [number, number]; bearing: number }[] {
  if (points.length < 8) return [];
  const step = Math.max(6, Math.floor(points.length / 8));
  const arrows: { position: [number, number]; bearing: number }[] = [];

  for (let i = step; i < points.length - 1; i += step) {
    const [lat1, lng1] = points[i - 1];
    const [lat2, lng2] = points[i];
    // Screen-space bearing: 0deg points north, matching the rotated glyph.
    const bearing = (Math.atan2(lng2 - lng1, lat2 - lat1) * 180) / Math.PI;
    arrows.push({ position: points[i], bearing });
  }
  return arrows;
}

interface InteractiveMapProps {
 nodes: TrafficNode[];
 incidents: Incident[];
 selectedIncident: Incident | null;
 onSelectIncident: (id: string) => void;
 selectedNodeId: string | null;
 onSelectNode: (id: string) => void;
 forecastMinutesAhead: number;
 detourPositions?: [number, number][];
 selectedRouteIsAiRecommended?: boolean;
 selectedCity: string;
 fillContainer?: boolean;
 userLocation?: { lat: number; lng: number; name?: string } | null;
 selectedNode?: TrafficNode | null;
 onViewportChange?: (viewport: Viewport) => void;
 onLayersChange?: (flags: MapLayerFlags) => void;
 onLocate?: () => void;
 onExpand?: () => void;
}

// Inner subcomponent to handle programmatic map viewport transitions
const MapController: React.FC<{
 selectedIncident: Incident | null;
 selectedCity?: string;
 center?: [number, number];
 userLocation?: { lat: number; lng: number; name?: string } | null;
 detourPositions?: [number, number][];
 selectedNode?: TrafficNode | null;
}> = ({ selectedIncident, selectedCity, center, userLocation, detourPositions, selectedNode }) => {
 const map = useMap();

 useEffect(() => {
 if (center) {
 map.flyTo(center, 12, {
 animate: true,
 duration: 1.5,
 });
 }
 }, [selectedCity, center, map]);

 useEffect(() => {
 if (selectedIncident) {
 map.flyTo([selectedIncident.lat, selectedIncident.lng], 13, {
 animate: true,
 duration: 1.2,
 });
 } else if (userLocation) {
 map.flyTo([userLocation.lat, userLocation.lng], 13.5, {
 animate: true,
 duration: 1.2,
 });
 }
 }, [selectedIncident?.id, userLocation?.lat, userLocation?.lng, map]);

 useEffect(() => {
 if (selectedNode) {
 map.flyTo([selectedNode.lat, selectedNode.lng], 14, {
 animate: true,
 duration: 1.2,
 });
 }
 }, [selectedNode?.id, map]);

 useEffect(() => {
 if (!selectedIncident && !userLocation && detourPositions && detourPositions.length > 1) {
 map.fitBounds(detourPositions, {
 animate: true,
 duration: 1.2,
 padding: [40, 40],
 maxZoom: 14,
 });
 }
 }, [detourPositions, selectedIncident, userLocation, map]);

 return null;
};

// Reports the visible bounds up so the dashboard can describe what is on screen
const MapViewportReporter: React.FC<{ onChange: (viewport: Viewport) => void }> = ({ onChange }) => {
 const report = (map: LeafletMap) => {
 const b = map.getBounds();
 const c = map.getCenter();
 onChange({
 bounds: [[b.getSouth(), b.getWest()], [b.getNorth(), b.getEast()]],
 zoom: map.getZoom(),
 center: [c.lat, c.lng],
 });
 };

 const map = useMapEvents({
 moveend: () => report(map),
 zoomend: () => report(map),
 });

 useEffect(() => {
 report(map);
 }, [map]);

 return null;
};

// Hands the Leaflet instance to the parent so the action buttons can drive it.
const MapRefBridge: React.FC<{ onReady: (map: LeafletMap) => void }> = ({ onReady }) => {
 const map = useMap();
 useEffect(() => {
 onReady(map);
 }, [map, onReady]);
 return null;
};

// Component to handle dynamic resizing of the container without window resize events
const MapResizer: React.FC = () => {
 const map = useMap();
 useEffect(() => {
 const container = map.getContainer();
 const resizeObserver = new ResizeObserver(() => {
 map.invalidateSize();
 });
 resizeObserver.observe(container);
 return () => resizeObserver.disconnect();
 }, [map]);
 return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
 nodes,
 incidents,
 selectedIncident,
 onSelectIncident,
 selectedNodeId,
 onSelectNode,
 forecastMinutesAhead,
 detourPositions,
 selectedRouteIsAiRecommended,
 selectedCity,
 fillContainer = false,
 userLocation,
 selectedNode,
 onViewportChange,
 onLayersChange,
 onLocate,
 onExpand,
}) => {
 const [showHeatmap, setShowHeatmap] = useState(FEATURES.heatmap);
 const [showIncidents, setShowIncidents] = useState(true);
 const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(FEATURES.detours);
 const [showTraffic, setShowTraffic] = useState(true);
 const [showWeather, setShowWeather] = useState(true);
 const [currentTime, setCurrentTime] = useState('');
 const [layersOpen, setLayersOpen] = useState(false);
 const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);

 const [mapEngine, setMapEngine] = useState<'leaflet' | 'maplibre' | 'openlayers' | 'google-road' | 'google-satellite'>('leaflet');

 useEffect(() => {
 onLayersChange?.({
 showTraffic,
 showWeather,
 showHeatmap,
 showIncidents,
 showAlternativeRoutes,
 hasUserLocation: !!userLocation,
 });
 }, [showTraffic, showWeather, showHeatmap, showIncidents, showAlternativeRoutes, userLocation, onLayersChange]);

 useEffect(() => {
 const updateTime = () => {
 const now = new Date();
 setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' IST');
 };
 updateTime();
 const int = setInterval(updateTime, 60000);
 return () => clearInterval(int);
 }, []);

 const circleRef = useRef<LeafletCircle | null>(null);
 const mapRef = useRef<LeafletMap | null>(null);
 const handleMapReady = React.useCallback((map: LeafletMap) => {
 mapRef.current = map;
 }, []);

 const zoomToIncident = () => {
 if (!mapRef.current || !selectedIncident) return;
 mapRef.current.flyTo([selectedIncident.lat, selectedIncident.lng], 15, { animate: true, duration: 1 });
 };

 const resetView = () => {
 const center = CITIES[selectedCity]?.center || DELHI_CENTER;
 mapRef.current?.flyTo(center, DEFAULT_ZOOM, { animate: true, duration: 1 });
 };

 const flyToUser = () => {
 if (userLocation) {
 mapRef.current?.flyTo([userLocation.lat, userLocation.lng], 14, { animate: true, duration: 1 });
 } else {
 onLocate?.();
 }
 };

 // Tiles are cross-origin, which taints a canvas export — so the snapshot is the
 // data behind the view: every junction and incident currently on screen.
 const exportView = () => {
 const map = mapRef.current;
 if (!map) return;
 const b = map.getBounds();
 const within = (lat: number, lng: number) =>
 lat >= b.getSouth() && lat <= b.getNorth() && lng >= b.getWest() && lng <= b.getEast();

 const rows = [
 ['type', 'name', 'status_or_severity', 'speed_kmh_or_delay_min', 'lat', 'lng'],
 ...nodes.filter((n) => within(n.lat, n.lng)).map((n) => ['junction', n.name, n.status, String(n.avgSpeedKmh), String(n.lat), String(n.lng)]),
 ...incidents.filter((i) => within(i.lat, i.lng)).map((i) => ['incident', i.title, i.severity, String(i.delayMinutes), String(i.lat), String(i.lng)]),
 ];

 const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
 const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
 const a = document.createElement('a');
 a.href = url;
 a.download = `flowcast-view-${new Date().toISOString().slice(0, 16).replace(':', '')}.csv`;
 a.click();
 URL.revokeObjectURL(url);
 };

 // Dynamic Tile Layer URL computation
 const tileUrl = React.useMemo(() => {
 switch (mapEngine) {
 case 'maplibre':
 return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png';
 case 'openlayers':
 return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
 case 'google-road':
 return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
 case 'google-satellite':
 return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
 default:
 // Design: light CartoDB basemap to match the FlowCast light theme
 return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
 }
 }, [mapEngine]);

 const watermarkText = React.useMemo(() => {
 const cityName = CITIES[selectedCity].name.toUpperCase();
 switch (mapEngine) {
 case 'maplibre':
 return `${cityName} (MAPLIBRE GL)`;
 case 'openlayers':
 return `${cityName} (OPENLAYERS)`;
 case 'google-road':
 return `${cityName} (GOOGLE ROADMAP)`;
 case 'google-satellite':
 return `${cityName} (GOOGLE SATELLITE)`;
 default:
 return `${cityName} (LEAFLET RADAR)`;
 }
 }, [selectedCity, mapEngine]);

 const routeColor = selectedRouteIsAiRecommended ? '#3575f8' : '#1c1d1f';

 const getNodeColor = (status: string) => {
 switch (status) {
 case 'severe': return '#D93B2D';
 case 'heavy': return '#D97706';
 case 'moderate': return '#2563EB';
 default: return '#059669';
 }
 };

 const containerClass = fillContainer
 ? 'relative h-full w-full min-h-0 bg-[var(--color-card-snow)] overflow-hidden group select-none'
 : 'relative h-full w-full min-h-[400px] bg-[var(--color-card-snow)] overflow-hidden group select-none';

 return (
 <div className={containerClass}>
 {/* Leaflet Map Container */}
 <MapContainer
 center={userLocation ? [userLocation.lat, userLocation.lng] : (CITIES[selectedCity]?.center || DELHI_CENTER)}
 zoom={DEFAULT_ZOOM}
 minZoom={MIN_ZOOM}
 maxZoom={MAX_ZOOM}
 maxBounds={CITIES[selectedCity].bounds}
 maxBoundsViscosity={1.0}
 style={{ height: '100%', width: '100%' }}
 zoomControl={false}
 attributionControl={false}
 >
 {/* FlyTo Centering Controller */}
 <MapController
 selectedIncident={selectedIncident}
 selectedCity={selectedCity}
 center={CITIES[selectedCity].center}
 userLocation={userLocation}
 detourPositions={detourPositions}
 selectedNode={selectedNode}
 />

 {/* Dynamic Resizer */}
 <MapResizer />

 <MapRefBridge onReady={handleMapReady} />

 {/* Viewport Reporter */}
 <MapViewportReporter
 onChange={(viewport) => {
 setZoom(viewport.zoom);
 onViewportChange?.(viewport);
 }}
 />


 <TileLayer url={tileUrl} />

 {/* Live TomTom traffic flow, drawn on the real road network */}
 {showTraffic && zoom >= TRAFFIC_MIN_ZOOM && (
 <TileLayer url={TRAFFIC_FLOW_TILE_URL} opacity={0.85} zIndex={10} />
 )}

 {/* User Current Location Marker */}
 {userLocation && (
 <LayerGroup>
 <Circle
 center={[userLocation.lat, userLocation.lng]}
 radius={400}
 pathOptions={{
 color: '#2563EB',
 fillColor: '#3B82F6',
 fillOpacity: 0.15,
 weight: 2,
 dashArray: '4, 4'
 }}
 />
 <CircleMarker
 center={[userLocation.lat, userLocation.lng]}
 radius={10}
 pathOptions={{
 color: '#FFFFFF',
 fillColor: '#2563EB',
 fillOpacity: 1,
 weight: 3,
 }}
 >
 <Tooltip permanent direction="top" offset={[0, -10]} className="text-[10px] font-medium border border-[var(--color-cloud)] shadow-[var(--shadow-sm)] px-2 py-0.5 bg-[var(--color-card-snow)] text-[var(--color-ink-black)] rounded-[100px]">
 {userLocation.name || 'YOUR LOCATION'}
 </Tooltip>
 <Popup>
 <div className="text-xs p-1 font-sans">
 <div className="font-medium text-[var(--color-ink-black)]">
 {userLocation.name || 'Your Current Location'}
 </div>
 <div className="text-[10px] text-[var(--color-steel-gray)] mt-1">
 Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
 </div>
 </div>
 </Popup>
 </CircleMarker>
 </LayerGroup>
 )}

 {/* Heatmap Overlay Layer */}
 {showHeatmap && (
 <LayerGroup>
 {incidents.map((inc) => {
 const baseRad = radiusAt(inc, forecastMinutesAhead);
 const opacity = 0.12 + (forecastMinutesAhead / 30) * 0.12;
 const color = severityToColor(inc.severity);
 return (
 <Circle
 key={`heatmap-${inc.id}`}
 center={[inc.lat, inc.lng]}
 radius={baseRad}
 pathOptions={{
 fillColor: color,
 fillOpacity: opacity,
 color: 'transparent',
 }}
 />
 );
 })}
 </LayerGroup>
 )}

 {/* Incidents Layer Group */}
 {showIncidents && (
 <LayerGroup>
 {incidents.map((inc) => {
 const isSelected = selectedIncident?.id === inc.id;
 const isConfirmed = isIncidentConfirmed(inc, [], nodes);
 const color = isConfirmed ? '#D93B2D' : '#D97706';
 const targetRadius = radiusAt(inc, forecastMinutesAhead);

 return (
 <React.Fragment key={inc.id}>
 {/* Selected incident: wide halo + glow so it reads at a glance */}
 {isSelected && (
 <CircleMarker
 center={[inc.lat, inc.lng]}
 radius={34}
 pathOptions={{
 color: color,
 weight: 3,
 fillColor: color,
 fillOpacity: 0.18,
 className: 'animate-pulse',
 }}
 />
 )}
 {isSelected && (
 <CircleMarker
 center={[inc.lat, inc.lng]}
 radius={13}
 pathOptions={{ color: '#FFFFFF', weight: 3, fillColor: color, fillOpacity: 1 }}
 />
 )}


 <AnimatedIncidentCircle
 ref={isSelected ? circleRef : null}
 center={[inc.lat, inc.lng]}
 targetRadius={targetRadius}
 color={color}
 fillColor={color}
 fillOpacity={isSelected ? 0.35 : 0.18}
 >
 <Popup>
 <div className="p-1.5 text-[#1A1A1A] max-w-[210px] font-sans">
 <div className="flex items-center gap-1 font-bold text-xs mb-1">
 <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-ink-black)]" />
 <span className="text-[11px] font-bold text-gray-900 leading-tight">{inc.title}</span>
 </div>
 <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase text-white mb-2 ${isConfirmed ? 'bg-[var(--color-ink-black)]' : 'bg-[var(--color-body-charcoal)]'}`}>
 {isConfirmed ? 'Confirmed' : 'Unverified Warning'}
 </span>
 <p className="text-[10px] m-0 mb-1.5 text-gray-700 leading-tight font-normal font-sans">
 {inc.description}
 </p>
 <div className="text-[9px] text-gray-500 flex justify-between pt-1 border-t border-gray-200/80">
 <span>Delay: +{inc.delayMinutes}m</span>
 <span>In: {Math.max(0, inc.startsInMinutes - forecastMinutesAhead)}m</span>
 </div>
 <div className="text-[9px] text-gray-400 mt-0.5">
 Source: {inc.socialSource}
 </div>
 <button
 onClick={() => onSelectIncident(inc.id)}
 className="w-full mt-2.5 bg-[#1A1A1A] text-white py-1 px-2 text-[9px] uppercase font-bold hover:bg-[var(--color-ink-black)] transition-colors border-none cursor-pointer"
 >
 Inspect Details
 </button>
 </div>
 </Popup>
 </AnimatedIncidentCircle>
 </React.Fragment>
 );
 })}
 </LayerGroup>
 )}

 {/* Traffic Node Markers — toggled by Live Traffic */}
 {showTraffic && (
 <LayerGroup>
 {nodes.map((node) => {
 const isSelected = selectedNodeId === node.id;
 const color = getNodeColor(node.status);

 return (
 <CircleMarker
 key={node.id}
 center={[node.lat, node.lng]}
 radius={isSelected ? 9 : 6.5}
 pathOptions={{
 color: isSelected ? '#FFFFFF' : color,
 fillColor: color,
 fillOpacity: 0.9,
 weight: isSelected ? 2.5 : 1.2,
 }}
 eventHandlers={{
 click: () => onSelectNode(node.id),
 }}
 >
 <Popup>
 <div className="p-1 text-[#1A1A1A] font-sans">
 <div className="font-bold text-xs ">{node.name}</div>
 <div className="text-[10px] mt-1 flex justify-between gap-4">
 <span>Status: <span className="font-bold uppercase" style={{ color }}>{node.status}</span></span>
 <span>Speed: <b>{node.avgSpeedKmh} km/h</b></span>
 </div>
 <div className="text-[9px] text-gray-500 mt-0.5">
 Delay: +{node.delayMinutes} mins
 </div>
 <button
 onClick={() => onSelectNode(node.id)}
 className="w-full mt-2 bg-[#1A1A1A] text-white py-1 px-2 text-[9px] uppercase font-bold hover:bg-[var(--color-ink-black)] transition-colors border-none cursor-pointer"
 >
 Inspect Node
 </button>
 </div>
 </Popup>
 </CircleMarker>
 );
 })}
 </LayerGroup>
 )}

 {/* Weather Radar Storm Cells & Waterlogging overlays */}
 {showWeather && (
 <LayerGroup>
 {/* Storm cells drift with the forecast timeline */}
 {(STORM_CELLS[selectedCity.toLowerCase()] || STORM_CELLS.delhi).map((cell, idx) => {
 const driftLat = cell.lat + (forecastMinutesAhead / 60) * 0.015;
 const driftLng = cell.lng + (forecastMinutesAhead / 60) * 0.012;
 return (
 <Circle
 key={`storm-cell-${idx}`}
 center={[driftLat, driftLng]}
 radius={cell.radius}
 pathOptions={{
 fillColor: '#8B5CF6',
 fillOpacity: 0.07,
 color: '#8B5CF6',
 weight: 1,
 opacity: 0.5,
 dashArray: '3, 6'
 }}
 />
 );
 })}

 {/* Chronic flood-prone subways grow with the forecast slider */}
 {(WATERLOGGING_ZONES[selectedCity.toLowerCase()] || WATERLOGGING_ZONES.delhi).map((zone, idx) => {
 const scaleFactor = 1 + (forecastMinutesAhead / 60) * 0.6;
 const currentRadius = zone.baseRadius * scaleFactor;
 const color = zone.severity === 'severe' ? '#D93B2D' : zone.severity === 'heavy' ? '#D97706' : '#2563EB';
 return (
 <React.Fragment key={`flood-zone-${idx}`}>
 {/* Glow indicator ring */}
 <Circle
 center={[zone.lat, zone.lng]}
 radius={currentRadius * 1.5}
 pathOptions={{
 color: color,
 weight: 1,
 fillColor: 'transparent',
 dashArray: '4, 8',
 className: 'animate-pulse'
 }}
 />
 {/* Base alert zone */}
 <Circle
 center={[zone.lat, zone.lng]}
 radius={currentRadius}
 pathOptions={{
 color: color,
 weight: 1.5,
 opacity: 0.65,
 fillColor: color,
 fillOpacity: 0.12
 }}
 >
 <Tooltip direction="top" opacity={0.9} className="text-[10px] font-medium bg-[var(--color-ink-black)] text-white border-none px-2 py-0.5 shadow-[var(--shadow-sm)] rounded-[100px]">
 Flood: {zone.name} ({Math.round(currentRadius)}m)
 </Tooltip>
 <Popup>
 <div className="text-xs p-1 text-[var(--color-ink-black)] font-sans">
 <div className="font-medium uppercase text-[10px] tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">
 Active Flood Zone
 </div>
 <div className="mt-1 font-medium">{zone.name}</div>
 <div className="text-[10px] text-[var(--color-steel-gray)] mt-1">
 Flooded Area: ~{Math.round(currentRadius)} meters (Forecast: +{forecastMinutesAhead}m)
 </div>
 <div className="text-[10px] font-medium uppercase mt-1 text-[var(--color-graphite)]">
 Hazard Risk: <span style={{ color }}>{zone.severity.toUpperCase()}</span>
 </div>
 </div>
 </Popup>
 </Circle>
 </React.Fragment>
 );
 })}
 </LayerGroup>
 )}

 {/* Selected route — white casing under a solid core so it stays legible
 on top of the live traffic colours */}
 {showAlternativeRoutes && detourPositions && detourPositions.length > 0 && (
 <>
 <Polyline
 positions={detourPositions}
 pathOptions={{ color: '#FFFFFF', weight: 12, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }}
 />
 <Polyline
 positions={detourPositions}
 pathOptions={{
 color: routeColor,
 weight: 7,
 opacity: 1,
 lineCap: 'round',
 lineJoin: 'round',
 }}
 />
 {routeArrows(detourPositions).map((arrow, idx) => (
 <Marker
 key={`route-arrow-${idx}`}
 position={arrow.position}
 interactive={false}
 icon={divIcon({
 className: '',
 iconSize: [18, 18],
 iconAnchor: [9, 9],
 html: `<div style="transform: rotate(${arrow.bearing}deg); color:#fff; font-size:16px; line-height:18px; text-align:center; text-shadow:0 1px 2px rgba(0,0,0,.45)">&#9650;</div>`,
 })}
 />
 ))}
 </>
 )}
 </MapContainer>

 {/* Layer Controls — only the two most-used toggles stay visible; the rest
 live behind Layers so the map keeps its space. */}
 <div className="absolute bottom-3 left-3 flex items-end gap-2 z-[1000]">
 <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] p-1 flex items-center gap-1 text-[11px] shadow-[var(--shadow-sm)] rounded-[100px] font-medium">
 <button
 onClick={() => setShowTraffic(!showTraffic)}
 title={zoom >= TRAFFIC_MIN_ZOOM ? 'Live traffic flow' : 'Live traffic flow — zoom in to show road colours'}
 className={`px-2.5 py-1 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showTraffic ? 'bg-[var(--color-ink-black)] text-white' : 'bg-transparent text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <Activity className="w-3 h-3" />
 <span>Traffic</span>
 </button>

 <button
 onClick={() => setShowIncidents(!showIncidents)}
 title="Incident markers"
 className={`px-2.5 py-1 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showIncidents ? 'bg-[var(--color-ink-black)] text-white' : 'bg-transparent text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <AlertTriangle className="w-3 h-3" />
 <span>Incidents</span>
 </button>

 <div className="relative">
 <button
 onClick={() => setLayersOpen(!layersOpen)}
 className={`px-2.5 py-1 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 layersOpen ? 'bg-[var(--color-ink-black)] text-white' : 'bg-transparent text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <Layers className="w-3 h-3" />
 <span>Layers</span>
 <ChevronUp className={`w-3 h-3 transition-transform ${layersOpen ? 'rotate-180' : ''}`} />
 </button>

 {layersOpen && (
 <div className="absolute bottom-full left-0 mb-2 w-[210px] bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] shadow-[var(--shadow-sm)] p-3 flex flex-col gap-2">
 {[
 { label: 'Weather radar', icon: CloudRain, on: showWeather, toggle: () => setShowWeather(!showWeather) },
 { label: 'Forecast heatmap', icon: Layers, on: showHeatmap, toggle: () => setShowHeatmap(!showHeatmap) },
 { label: 'AI detour route', icon: Zap, on: showAlternativeRoutes, toggle: () => setShowAlternativeRoutes(!showAlternativeRoutes) },
 ].map(({ label, icon: Icon, on, toggle }) => (
 <button
 key={label}
 onClick={toggle}
 className="flex items-center justify-between gap-2 text-[12px] text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] bg-transparent border-none cursor-pointer p-1 rounded-[var(--radius-inputs)] hover:bg-[var(--color-paper-white)] transition-colors"
 >
 <span className="flex items-center gap-2">
 <Icon className="w-3.5 h-3.5" />
 {label}
 </span>
 <span
 className={`w-8 h-4 rounded-[100px] relative transition-colors ${on ? 'bg-[var(--color-signal-green)]' : 'bg-[var(--color-mist)]'}`}
 >
 <span
 className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${on ? 'left-[18px]' : 'left-0.5'}`}
 />
 </span>
 </button>
 ))}

 <label className="flex flex-col gap-1 pt-2 border-t border-[var(--color-mist)] text-[10px] uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">
 Base layer
 <select
 value={mapEngine}
 onChange={(e: any) => setMapEngine(e.target.value)}
 className="bg-[var(--color-paper-white)] border border-[var(--color-cloud)] rounded-[var(--radius-inputs)] px-2 py-1 text-[12px] font-medium text-[var(--color-ink-black)] outline-none cursor-pointer normal-case tracking-normal"
 >
 <option value="leaflet">Leaflet (Light)</option>
 <option value="maplibre">MapLibre GL</option>
 <option value="openlayers">OpenLayers</option>
 <option value="google-road">Google Roads</option>
 <option value="google-satellite">Google Satellite</option>
 </select>
 </label>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Map actions */}
 <div className="absolute top-16 right-4 z-[1000] flex flex-col bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-inputs)] shadow-[var(--shadow-sm)] overflow-hidden">
 {[
 { icon: Crosshair, label: 'Zoom to incident', action: zoomToIncident, disabled: !selectedIncident },
 { icon: RotateCcw, label: 'Reset view', action: resetView, disabled: false },
 { icon: LocateFixed, label: userLocation ? 'Go to my location' : 'Locate me', action: flyToUser, disabled: !userLocation && !onLocate },
 { icon: Maximize2, label: 'Fullscreen map', action: () => onExpand?.(), disabled: !onExpand },
 { icon: Download, label: 'Export this view (CSV)', action: exportView, disabled: false },
 ].map(({ icon: Icon, label, action, disabled }) => (
 <button
 key={label}
 onClick={action}
 disabled={disabled}
 title={label}
 aria-label={label}
 className="p-2 bg-transparent border-none cursor-pointer text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] hover:bg-[var(--color-paper-white)] transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
 >
 <Icon className="w-4 h-4" />
 </button>
 ))}
 </div>

 {/* GPS Fix Badge */}
 {userLocation && (
 <div className="absolute top-4 left-4 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] px-3 py-1.5 text-[12px] text-[var(--color-ink-black)] flex items-center gap-2 z-[1000] shadow-[var(--shadow-sm)] font-medium rounded-[100px] pointer-events-none">
 <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse" />
 <span className="text-[var(--color-graphite)] uppercase text-[10px] tracking-[var(--tracking-caption)]">GPS Fix</span>
 <span className="truncate max-w-[160px]">{userLocation.name || 'Active'}</span>
 </div>
 )}

 {/* Map Watermark & Live Time */}
 <div className="absolute top-4 right-4 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] px-3 py-1.5 text-[12px] text-[var(--color-ink-black)] flex items-center gap-2 z-[1000] shadow-[var(--shadow-sm)] font-medium rounded-[100px] pointer-events-none max-w-[50%]">
 <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse shrink-0" />
 <span className="truncate">{watermarkText}</span>
 <span className="text-[var(--color-graphite)] shrink-0">{currentTime}</span>
 </div>
 </div>
 );
};
export default InteractiveMap;
