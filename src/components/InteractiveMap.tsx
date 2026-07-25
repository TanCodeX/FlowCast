import React, { useState, useEffect, useRef } from 'react';
import { TrafficNode, Incident } from '../types';
import { AlertTriangle, Layers, Activity, CloudRain, Zap } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Circle, Polyline, Popup, Tooltip, LayerGroup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Circle as LeafletCircle, Map as LeafletMap } from 'leaflet';

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

interface RoadSegment {
  from: TrafficNode;
  to: TrafficNode;
}

function getMockRoadSegments(nodesList: TrafficNode[]): RoadSegment[] {
  const segments: RoadSegment[] = [];
  const seen = new Set<string>();

  nodesList.forEach((node) => {
    const targets = nodesList
      .filter((n) => n.id !== node.id)
      .map((n) => {
        const dist = Math.pow(n.lat - node.lat, 2) + Math.pow(n.lng - node.lng, 2);
        return { node: n, dist };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);

    targets.forEach((target) => {
      const key = [node.id, target.node.id].sort().join('-');
      if (!seen.has(key)) {
        seen.add(key);
        segments.push({ from: node, to: target.node });
      }
    });
  });

  return segments;
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
}) => {
 const [showHeatmap, setShowHeatmap] = useState(FEATURES.heatmap);
 const [showIncidents, setShowIncidents] = useState(true);
 const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(FEATURES.detours);
 const [showTraffic, setShowTraffic] = useState(true);
 const [showWeather, setShowWeather] = useState(true);
 const [currentTime, setCurrentTime] = useState('');

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

 {/* Viewport Reporter */}
 {onViewportChange && <MapViewportReporter onChange={onViewportChange} />}


 <TileLayer url={tileUrl} />

 {/* TomTom Live Traffic Flow Overlay / mock local flow network fallback */}
 {showTraffic && (
 (import.meta as any).env.VITE_TOMTOM_API_KEY ? (
 <TileLayer url={TRAFFIC_FLOW_TILE_URL} opacity={0.65} zIndex={10} />
 ) : (
 <LayerGroup>
 {getMockRoadSegments(nodes).map((seg, idx) => {
 const avgSpeedKmh = (seg.from.avgSpeedKmh + seg.to.avgSpeedKmh) / 2;
 const statusColor = avgSpeedKmh < 18
 ? '#D93B2D'
 : avgSpeedKmh < 28
 ? '#D97706'
 : avgSpeedKmh < 42
 ? '#2563EB'
 : 'var(--color-signal-green)';

 return (
 <Polyline
 key={`mock-road-${idx}`}
 positions={[[seg.from.lat, seg.from.lng], [seg.to.lat, seg.to.lng]]}
 pathOptions={{
 color: statusColor,
 weight: 4,
 opacity: 0.7,
 dashArray: avgSpeedKmh < 28 ? '5, 8' : undefined
 }}
 />
 );
 })}
 </LayerGroup>
 )
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
 {/* Pulse Concentric Glow for Selected Marker */}
 {isSelected && (
 <CircleMarker
 center={[inc.lat, inc.lng]}
 radius={22}
 pathOptions={{
 color: color,
 weight: 2,
 fillColor: color,
 fillOpacity: 0.15,
 className: 'animate-pulse',
 }}
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
 fillOpacity: 0.16,
 color: '#6D28D9',
 weight: 1.5,
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
 weight: 2,
 fillColor: color,
 fillOpacity: 0.22
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

 {/* Detour Routes Polyline */}
 {showAlternativeRoutes && detourPositions && detourPositions.length > 0 && (
 <Polyline
 positions={detourPositions}
 pathOptions={{
 color: selectedRouteIsAiRecommended ? '#10B981' : '#D93B2D',
 dashArray: '6, 6',
 weight: 3.5,
 }}
 />
 )}
 </MapContainer>

 {/* Layer Controls Bar */}
 <div className="absolute bottom-4 left-4 right-4 w-fit max-w-[calc(100%-2rem)] bg-[var(--color-card-snow)] border border-[var(--color-cloud)] p-1.5 flex flex-wrap items-center gap-1.5 text-[12px] z-[1000] shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)] font-medium">
 <div className="flex items-center gap-1 bg-[var(--color-paper-white)] px-2 py-1 border border-[var(--color-cloud)] rounded-[100px] text-[var(--color-ink-black)]">
 <span className="text-[10px] text-[var(--color-graphite)] uppercase ">Base Layer</span>
 <select
 value={mapEngine}
 onChange={(e: any) => setMapEngine(e.target.value)}
 className="bg-transparent border-none text-[10px] font-medium text-[var(--color-ink-black)] outline-none cursor-pointer pr-1 uppercase"
 >
 <option value="leaflet">Leaflet (Light)</option>
 <option value="maplibre">MapLibre GL</option>
 <option value="openlayers">OpenLayers</option>
 <option value="google-road">Google Roads</option>
 <option value="google-satellite">Google Satellite</option>
 </select>
 </div>

 <button
 onClick={() => setShowTraffic(!showTraffic)}
 className={`px-3 py-1.5 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showTraffic ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <Activity className="w-3.5 h-3.5" />
 <span>Live Traffic</span>
 </button>

 <button
 onClick={() => setShowWeather(!showWeather)}
 className={`px-3 py-1.5 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showWeather ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <CloudRain className="w-3.5 h-3.5" />
 <span>Weather</span>
 </button>

 <button
 onClick={() => setShowHeatmap(!showHeatmap)}
 className={`px-3 py-1.5 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showHeatmap ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <Layers className="w-3.5 h-3.5" />
 <span>Heatmap</span>
 </button>

 <button
 onClick={() => setShowIncidents(!showIncidents)}
 className={`px-3 py-1.5 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showIncidents ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <AlertTriangle className="w-3.5 h-3.5" />
 <span>Incidents</span>
 </button>

 <button
 onClick={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
 className={`px-3 py-1.5 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showAlternativeRoutes ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <Zap className="w-3.5 h-3.5 text-[var(--color-signal-green)]" />
 <span>AI Detours</span>
 </button>

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
