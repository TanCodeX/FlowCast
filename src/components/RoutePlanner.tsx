import React, { useState } from 'react';
import { RouteAnalysis } from '../types';
import { Sparkles, MapPin, Navigation, Clock } from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

interface RoutePlannerProps {
 activeRouteAnalysis: RouteAnalysis | null;
 setActiveRouteAnalysis: (analysis: RouteAnalysis | null) => void;
 loading: boolean;
 setLoading: (loading: boolean) => void;
 onNavigateToDashboard: () => void;
 selectedCity: string;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
 activeRouteAnalysis,
 setActiveRouteAnalysis,
 loading,
 setLoading,
 onNavigateToDashboard,
 selectedCity,
}) => {
 const [origin, setOrigin] = useState('Connaught Place, New Delhi');
 const [destination, setDestination] = useState('Gurgaon Cyber City, Haryana');
 const [forecastHorizon, setForecastHorizon] = useState(30);
 const [locating, setLocating] = useState(false);
 const [routeError, setRouteError] = useState<string | null>(null);

 const handleGetLocation = () => {
 if (!navigator.geolocation) {
 alert("Geolocation is not supported by your browser");
 return;
 }
 setLocating(true);
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const { latitude, longitude } = position.coords;
 setOrigin(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
 setLocating(false);
 },
 (error) => {
 console.error("Geolocation failed:", error);
 alert(`Failed to retrieve your location: ${error.message}`);
 setLocating(false);
 },
 { enableHighAccuracy: true, timeout: 8000 }
 );
 };

 // Sync origin/destination with city switch
 React.useEffect(() => {
 if (selectedCity === 'mumbai') {
 setOrigin('Bandra Junction, Mumbai');
 setDestination('Worli Sea Link Entrance, Mumbai');
 } else if (selectedCity === 'bengaluru') {
 setOrigin('MG Road Metro, Bengaluru');
 setDestination('Silk Board Junction, Bengaluru');
 } else {
 setOrigin('Connaught Place, New Delhi');
 setDestination('Gurgaon Cyber City, Haryana');
 }
 }, [selectedCity]);

 const presetPairs = React.useMemo(() => {
 if (selectedCity === 'mumbai') {
 return [
 { from: 'Bandra Junction', to: 'Worli Sea Link' },
 { from: 'Dadar Chowk', to: 'CST Terminus' },
 { from: 'Powai Lake Crossing', to: 'Andheri WEH Metro' },
 { from: 'Vashi Bridge Toll', to: 'Kurla East' },
 ];
 } else if (selectedCity === 'bengaluru') {
 return [
 { from: 'MG Road Metro', to: 'Silk Board Junction' },
 { from: 'Majestic bus stand', to: 'Electronic City Phase 1 Toll' },
 { from: 'Hebbal Flyover', to: 'Whitefield Hope Farm' },
 { from: 'Yeswanthpur Junction', to: 'Koramangala Sony World' },
 ];
 } else {
 return [
 { from: 'Connaught Place', to: 'Gurgaon Cyber City' },
 { from: 'Noida Sector 62', to: 'AIIMS Junction' },
 { from: 'Dwarka Sector 21', to: 'IGI Airport T3' },
 { from: 'Anand Vihar ISBT', to: 'Nehru Place' },
 ];
 }
 }, [selectedCity]);

 const handleAnalyze = async () => {
 setLoading(true);
 setRouteError(null);
 try {
 const res = await fetch('/api/route-analyze', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 origin,
 destination,
 timeHorizonMins: forecastHorizon,
 city: selectedCity,
 }),
 });

 if (res.ok) {
 const data = await res.json();
 if (data.success) {
 setActiveRouteAnalysis(data);
 return;
 }
 }

 throw new Error('Routing service returned no usable route');
 } catch (err) {
 // No invented geometry: a fabricated polyline looks authoritative and isn't.
 console.warn('Route analysis failed:', err);
 setActiveRouteAnalysis(null);
 setRouteError('Live routing is unavailable right now, so no route is shown. Check the TomTom key on the server and try again.');
 } finally {
 setLoading(false);
 }
 };

 const previewRoute = activeRouteAnalysis?.aiRoute;

 return (
 <div className="w-full max-w-[1200px] mx-auto py-8 px-4 flex flex-col gap-8 animate-fade-up">
 {/* Title Header */}
 <div className="text-center max-w-2xl mx-auto space-y-2">
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-card-snow)]/5 border border-[var(--color-cloud)]/20 text-[var(--color-ink-black)] text-xs font-bold uppercase ">
 <Sparkles className="w-3.5 h-3.5 text-[var(--color-ink-black)]" />
 <span>PREDICTIVE ROUTE OPTIMIZER</span>
 </div>
 <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-ink-black)] tracking-tight">
 Bypass Gridlock Before Maps Turn Red
 </h2>
 <p className="text-base text-[var(--color-steel-gray)]">
 Compare standard GPS routing against FlowCast's 30-minute predictive cascade algorithm.
 </p>
 </div>

 {/* Query Card */}
 <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)]/15 p-6 md:p-8 shadow-sm flex flex-col gap-6">
 {/* Origin / Destination Inputs */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <div className="flex justify-between items-center">
 <label className="text-xs font-bold uppercase text-[var(--color-ink-black)] tracking-wider flex items-center gap-1.5">
 <MapPin className="w-4 h-4 text-[var(--color-ink-black)]" />
 <span>Start Location (Origin)</span>
 </label>
 <button
 onClick={handleGetLocation}
 disabled={locating}
 className="text-[10px] font-bold text-[var(--color-ink-black)] hover:text-[var(--color-ink-black)] bg-[var(--color-paper-white)] hover:bg-[var(--color-ink-black)]/10 px-2 py-0.5 border border-[var(--color-cloud)]/20 cursor-pointer uppercase flex items-center gap-1 transition-colors"
 >
 <span>{locating ? 'Locating...' : '📍 Locate Me'}</span>
 </button>
 </div>
 <input
 type="text"
 value={origin}
 onChange={(e) => setOrigin(e.target.value)}
 className="w-full bg-[var(--color-paper-white)] border border-[var(--color-cloud)]/20 focus:border-[var(--color-ink-black)] px-4 py-3 text-sm font-sans text-[var(--color-ink-black)] outline-none transition-colors"
 placeholder="e.g. Connaught Place"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-bold uppercase text-[var(--color-steel-gray)] tracking-wider flex items-center gap-1.5">
 <Navigation className="w-4 h-4 text-[var(--color-steel-gray)]" />
 <span>Destination</span>
 </label>
 <input
 type="text"
 value={destination}
 onChange={(e) => setDestination(e.target.value)}
 className="w-full bg-[var(--color-paper-white)] border border-[var(--color-cloud)]/20 focus:border-[var(--color-ink-black)] px-4 py-3 text-sm font-sans text-[var(--color-ink-black)] outline-none transition-colors"
 placeholder="e.g. Cyber City Gurgaon"
 />
 </div>
 </div>

 {/* Quick Presets */}
 <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--color-cloud)]/10">
 <span className="text-xs text-[var(--color-ink-black)]/60 font-bold uppercase mr-2">Popular Presets:</span>
 {presetPairs.map((pair, idx) => (
 <button
 key={idx}
 onClick={() => {
 setOrigin(pair.from);
 setDestination(pair.to);
 }}
 className="bg-[var(--color-paper-white)] hover:bg-[var(--color-ink-black)] text-[var(--color-ink-black)] hover:text-white border border-[var(--color-cloud)]/20 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer border-none"
 >
 {pair.from} → {pair.to}
 </button>
 ))}
 </div>

 {/* Time Horizon Slider + Submit Button */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--color-cloud)]/10">
 <div className="flex items-center gap-3">
 <Clock className="w-5 h-5 text-[var(--color-ink-black)]" />
 <div>
 <div className="text-xs font-bold text-[var(--color-ink-black)] uppercase">Forecast Horizon:</div>
 <div className="text-xs text-[var(--color-ink-black)]/60 font-sans">Predicting road conditions in +{forecastHorizon} mins</div>
 </div>
 <div className="flex items-center gap-1 bg-[var(--color-paper-white)] p-1 border border-[var(--color-cloud)]/20 ml-2">
 {[15, 30, 45, 60].map((m) => (
 <button
 key={m}
 onClick={() => setForecastHorizon(m)}
 className={`px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors border-none ${
 forecastHorizon === m ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-ink-black)]/70 hover:text-[var(--color-ink-black)]'
 }`}
 >
 +{m}m
 </button>
 ))}
 </div>
 </div>

 <button
 onClick={handleAnalyze}
 disabled={loading}
 className="w-full sm:w-auto bg-[var(--color-ink-black)] hover:bg-[var(--color-ink-black)] text-white px-8 py-3 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors border-none"
 >
 <Sparkles className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
 <span>{loading ? 'Analyzing...' : 'Analyze AI Detours'}</span>
 </button>
 </div>
 </div>

 {routeError && (
 <div className="bg-[var(--color-blush-mist)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] px-5 py-3 text-[14px] text-[var(--color-body-charcoal)]">
 {routeError}
 </div>
 )}

 {/* Planned Route Preview */}
 {previewRoute && activeRouteAnalysis && (
 <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] shadow-[var(--shadow-subtle)] overflow-hidden">
 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-[var(--color-mist)]">
 <div className="space-y-1">
 <div className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">Preview Map</div>
 <h3 className="text-[length:var(--text-subheading)] font-medium text-[var(--color-ink-black)]">Planned AI Route</h3>
 <p className="text-[14px] text-[var(--color-steel-gray)]">
 The recommended corridor is drawn here so you can inspect it before switching tabs.
 </p>
 </div>
 <div className="flex flex-wrap items-center gap-2 text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)]">
 <span className="px-3 py-1.5 rounded-[var(--radius-buttons)] border border-[var(--color-cloud)] text-[var(--color-body-charcoal)]">ETA {previewRoute.etaMinutes} mins</span>
 <span className="px-3 py-1.5 rounded-[var(--radius-buttons)] bg-[var(--color-signal-green)]/10 text-[var(--color-signal-green)]">Saved {activeRouteAnalysis.comparison.savedMinutes} mins</span>
 <button
 onClick={onNavigateToDashboard}
 className="px-4 py-1.5 rounded-[var(--radius-buttons)] bg-[var(--color-signal-green)] text-white font-medium cursor-pointer border-none hover:opacity-90 transition-opacity"
 >
 Open Dashboard
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
 <div className="p-5 bg-[var(--color-paper-white)]">
 <InteractiveMap
 nodes={[]}
 incidents={[]}
 selectedIncident={null}
 onSelectIncident={() => {}}
 selectedNodeId={null}
 onSelectNode={() => {}}
 forecastMinutesAhead={forecastHorizon}
 detourPositions={previewRoute.polylinePositions}
 selectedRouteIsAiRecommended={true}
 selectedCity={selectedCity}
 fillContainer={false}
 />
 </div>

 <div className="p-6 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-[var(--color-mist)]">
 <div>
 <div className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">Route Summary</div>
 <div className="mt-1 text-[length:var(--text-subheading)] font-medium text-[var(--color-ink-black)]">{previewRoute.viaRoads}</div>
 </div>

 <div className="grid grid-cols-2 gap-3">
 {[
 { label: 'Distance', value: `${previewRoute.distanceKm} km` },
 { label: 'Delay', value: `${previewRoute.delayMinutes} mins` },
 { label: 'ETA', value: `${previewRoute.etaMinutes} mins` },
 { label: 'Risk', value: activeRouteAnalysis.comparison.riskLevel },
 ].map((stat) => (
 <div key={stat.label} className="bg-[var(--color-paper-white)] border border-[var(--color-cloud)] rounded-[var(--radius-inputs)] p-3">
 <div className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)]">{stat.label}</div>
 <div className="text-[16px] font-medium text-[var(--color-ink-black)] mt-1 capitalize">{stat.value}</div>
 </div>
 ))}
 </div>

 <p className="text-[14px] text-[var(--color-steel-gray)] leading-[1.5]">
 {activeRouteAnalysis.aiSummary}
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
export default RoutePlanner;
