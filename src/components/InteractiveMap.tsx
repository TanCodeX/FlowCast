import React, { useState, useEffect, useRef } from 'react';
import { TrafficNode, Incident } from '../types';
import { AlertTriangle, Zap, Layers } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Circle, Polyline, Popup, LayerGroup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Circle as LeafletCircle } from 'leaflet';

import { AnimatedIncidentCircle } from './AnimatedIncidentCircle';
import { radiusAt, severityToColor } from '../utils/radiusAt';
import { isIncidentConfirmed } from '../utils/verification';
import { DELHI_CENTER, DELHI_NCR_BOUNDS, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, TILE_LAYER_URL } from '../constants/map';
import { FEATURES } from '../constants/features';
import { CITIES } from '../constants/cities';

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
}

// Inner subcomponent to handle programmatic map viewport transitions
const MapController: React.FC<{ selectedIncident: Incident | null; selectedCity: string; center: [number, number] }> = ({ selectedIncident, selectedCity, center }) => {
 const map = useMap();

 useEffect(() => {
 map.flyTo(center, 12, {
 animate: true,
 duration: 1.5,
 });
 }, [selectedCity, center, map]);

 useEffect(() => {
 if (selectedIncident) {
 map.flyTo([selectedIncident.lat, selectedIncident.lng], 13, {
 animate: true,
 duration: 1.2,
 });
 }
 }, [selectedIncident, map]);

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
}) => {
 const [showHeatmap, setShowHeatmap] = useState(FEATURES.heatmap);
 const [showIncidents, setShowIncidents] = useState(true);
 const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(FEATURES.detours);
 const [mapEngine, setMapEngine] = useState<'leaflet' | 'maplibre' | 'openlayers' | 'google-road' | 'google-satellite'>('leaflet');

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

 return (
 <div className="relative h-full w-full min-h-[400px] bg-[var(--color-card-snow)] overflow-hidden group select-none">
 {/* Leaflet Map Container */}
 <MapContainer
 center={CITIES[selectedCity].center}
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
 <MapController selectedIncident={selectedIncident} selectedCity={selectedCity} center={CITIES[selectedCity].center} />

 {/* Dynamic Resizer */}
 <MapResizer />

 <TileLayer url={tileUrl} />

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

 {/* Traffic Node Markers */}
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
 <div className="absolute bottom-4 left-4 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] p-1.5 flex items-center gap-2 text-[12px] z-[1000] shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)] font-medium">
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
 onClick={() => setShowHeatmap(!showHeatmap)}
 className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showHeatmap ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <Layers className="w-3.5 h-3.5" />
 <span>Heatmap</span>
 </button>

 <button
 onClick={() => setShowIncidents(!showIncidents)}
 className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showIncidents ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <AlertTriangle className="w-3.5 h-3.5" />
 <span>Incidents</span>
 </button>

 <button
 onClick={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
 className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-[100px] border-none ${
 showAlternativeRoutes ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
 }`}
 >
 <Zap className="w-3.5 h-3.5 text-[var(--color-signal-green)]" />
 <span>AI Detours</span>
 </button>
 </div>

 {/* Map Watermark & Live Time */}
 <div className="absolute top-4 right-4 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] px-3 py-1.5 text-[12px] text-[var(--color-ink-black)] flex items-center gap-2 z-[1000] shadow-[var(--shadow-sm)] font-medium rounded-[100px] pointer-events-none">
 <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse" />
 <span>{watermarkText}</span>
 </div>
 </div>
 );
};
export default InteractiveMap;
