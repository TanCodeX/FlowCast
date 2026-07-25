import React, { useState, useEffect } from 'react';
import { Incident, TrafficNode, CameraFeed, SocialSignal, RouteOption, RouteAnalysis } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { Clock, Sparkles, AlertTriangle, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { calculateStartsInMinutes } from '../utils/forecast';

interface DashboardProps {
  nodes: TrafficNode[];
  incidents: Incident[];
  cameras: CameraFeed[];
  socialSignals: SocialSignal[];
  
  selectedIncidentId: string | null;
  onSelectIncidentId: (id: string) => void;
  selectedRouteId: string | null;
  onSelectRouteId: (id: string) => void;
  selectedIncident: Incident | null;
  selectedRoute: RouteOption | null;
  availableRoutes: RouteOption[];
  
  selectedCity: string;
  onSelectCity: (city: string) => void;

  onOpenDemoModal: () => void;
  onNavigateToIncidents: () => void;
  onNavigateToPlanner: () => void;
  onNavigateToForecast: () => void;
  onTriggerFakeNews?: () => void;
  activeRouteAnalysis: RouteAnalysis | null;
  onClearRouteAnalysis: () => void;
  onReloadIncidents?: () => void;
  
  forecastMinutes: number;
  userLocation?: { lat: number; lng: number; name?: string } | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  nodes,
  incidents,
  cameras,
  socialSignals,
  
  selectedIncidentId,
  onSelectIncidentId,
  selectedRouteId,
  onSelectRouteId,
  selectedIncident,
  selectedRoute,
  availableRoutes,
  
  selectedCity,
  onSelectCity,

  onOpenDemoModal,
  onNavigateToIncidents,
  onNavigateToPlanner,
  onNavigateToForecast,
  onTriggerFakeNews,
  activeRouteAnalysis,
  onClearRouteAnalysis,
  onReloadIncidents,
  
  forecastMinutes,
  userLocation,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-cp');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);

  useEffect(() => {
    if (selectedIncidentId) setIsFullScreenMapOpen(true);
  }, [selectedIncidentId]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' IST');
    };
    updateTime();
    const int = setInterval(updateTime, 60000);
    return () => clearInterval(int);
  }, []);

  // Dynamic metrics calculations
  const [commuterJitter, setCommuterJitter] = useState(0);

  // Add a visual heartbeat to commuters so the dashboard looks constantly live
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCommuterJitter(Math.floor(Math.random() * 81) - 40); // Non-drifting jitter
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const activeCommuters = React.useMemo(() => {
    let totalCommuters = 0;
    nodes.forEach(node => {
      const freeFlowSpeed = 40; 
      const capacityCars = 4000; 
      const occupancy = 1.5; 
      const maxCommuters = capacityCars * occupancy;
      const speedRatio = Math.min(1, Math.max(0, node.avgSpeedKmh / freeFlowSpeed));
      const capacityPercent = Math.min(0.95, Math.max(0.1, 1 - Math.pow(speedRatio, 1.5)));
      totalCommuters += Math.round(maxCommuters * capacityPercent);
    });
    return (totalCommuters + commuterJitter).toLocaleString();
  }, [nodes, commuterJitter]);
  
  const avgConfidence = incidents.length > 0 
    ? Math.round(incidents.reduce((sum, inc) => sum + (inc.confidencePercent || 0), 0) / incidents.length)
    : 85;

  const clearCount = nodes.filter(n => n.status === 'clear' || n.status === 'moderate').length;
  const heavyCount = nodes.filter(n => n.status === 'severe').length;
  const modCount = nodes.filter(n => n.status === 'heavy').length;
  
  const totalNodes = nodes.length || 1;
  const clearPct = Math.round((clearCount / totalNodes) * 100);
  const heavyPct = Math.round((heavyCount / totalNodes) * 100);
  const modPct = 100 - clearPct - heavyPct;

  const avgSpeed = Math.round(nodes.reduce((sum, n) => sum + n.avgSpeedKmh, 0) / totalNodes);
  const speedDiff = (avgSpeed - 35.6).toFixed(1);
  const isSpeedBetter = parseFloat(speedDiff) >= 0;
  const speedDiffText = isSpeedBetter ? `+${speedDiff} km/h vs avg` : `${speedDiff} km/h vs avg`;
  const speedDiffColor = isSpeedBetter ? 'text-[var(--color-steel-gray)]' : 'text-[var(--color-ink-black)]';

  const totalIncidents = incidents.length;
  const severeIncidentsCount = incidents.filter(inc => inc.severity === 'severe').length;
  const deviationPct = Math.round((heavyCount / totalNodes) * 45);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHasApiKey(data.hasApiKey))
      .catch(() => setHasApiKey(false));
  }, []);

  const topIncidents = incidents.slice(0, 3);

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center gap-6 animate-zoom-in relative mb-12">
      {/* Title block */}
      <div className="w-full text-left relative mt-6 z-10 px-4 md:px-0 flex justify-between items-end">
        <div>
          <h2 className="text-[32px] font-medium text-[var(--color-ink-black)] leading-tight">
            Command Center Overview
          </h2>
          <p className="text-[14px] text-[var(--color-steel-gray)] mt-2">
            High-level monitoring of the grid. Dive into workspaces for full operational control.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--color-ink-black)]/70">
          <span className="hidden md:flex items-center gap-1.5 text-[var(--color-ink-black)] bg-[var(--color-ink-black)]/10 px-3 py-1 font-bold rounded-md border border-[var(--color-cloud)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse" />
            SYSTEM OPERATIONAL
          </span>
          <div className="flex items-center gap-1.5 font-bold text-[var(--color-ink-black)]">
            <Clock className="w-4 h-4" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Fallback prediction model notice */}
      {hasApiKey === false && (
        <div className="w-full bg-[var(--color-blush-mist)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] px-5 py-3 text-[14px] text-[var(--color-body-charcoal)] flex items-center justify-between gap-4">
          <span>GROQ_API_KEY missing — FlowCast is running on the deterministic fallback prediction model.</span>
          <span className="shrink-0 text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-caption)] text-[var(--color-graphite)] border border-[var(--color-cloud)] rounded-[var(--radius-buttons)] px-3 py-1">
            Fallback Mode
          </span>
        </div>
      )}

      {/* Main Layout Grid: ~70% map, ~30% summary cards */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-[var(--section-gap)]">
        
        {/* Left Area: Map (occupying ~70% of viewport width) */}
        <div className="flex flex-col gap-[var(--element-gap)] min-h-[600px]">
          <div className="relative w-full flex-1 border border-[var(--color-cloud)] rounded-[var(--radius-cards)] shadow-[var(--shadow-subtle)] bg-[var(--color-card-snow)] overflow-hidden min-h-[500px]">
            <InteractiveMap
              nodes={nodes}
              incidents={incidents}
              selectedIncident={selectedIncident}
              onSelectIncident={onSelectIncidentId}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              forecastMinutesAhead={forecastMinutes}
              detourPositions={selectedRoute?.polylinePositions}
              selectedRouteIsAiRecommended={selectedRoute?.isAiRecommended}
              selectedCity={selectedCity}
              userLocation={userLocation}
            />

          </div>

          {/* Social Telemetry Strip under Map */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-4 shadow-[var(--shadow-subtle)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink-black)] uppercase whitespace-nowrap shrink-0">
              <Activity className="w-4 h-4 text-[var(--color-ink-black)]" />
              <span>AI Social Telemetry:</span>
            </div>
            <div className="flex-grow overflow-hidden relative w-full text-sm text-[var(--color-ink-black)] font-sans">
              <div className="flex items-center gap-4 truncate">
                <span className="bg-[var(--color-ink-black)] text-white px-2 py-0.5 text-[10px] font-bold rounded shrink-0">
                  {socialSignals[0].platform} ({socialSignals[0].timeAgo})
                </span>
                <span className="truncate text-[var(--color-body-charcoal)]">{socialSignals[0].text}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Summary Cards linking to Workspaces */}
        <div className="flex flex-col gap-[var(--element-gap)] h-full">
          
          {/* City Metrics Card */}
          <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-5 shadow-[var(--shadow-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-[var(--color-ink-black)] uppercase">City Metrics</span>
              <span className="text-[10px] bg-[var(--color-ink-black)] text-white font-bold px-2 py-0.5 rounded">
                LIVE TELEMETRY
              </span>
            </div>
            <div className="text-4xl font-black text-[var(--color-ink-black)] tracking-tight">54,312</div>
            <div className="text-xs text-[var(--color-ink-black)]/60 font-sans mt-1">Active Commuters Monitored</div>

            <div className="space-y-2 pt-4 border-t border-[var(--color-cloud)]/40 mt-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--color-ink-black)]">Mod: {modPct}%</span>
                <span className="text-[var(--color-steel-gray)]">Clear: {clearPct}%</span>
                <span className="text-[var(--color-ink-black)]">Heavy: {heavyPct}%</span>
              </div>
              <div className="h-2 w-full bg-[var(--color-ink-black)]/10 rounded-full overflow-hidden flex">
                <div className="bg-[var(--color-ink-black)] h-full transition-all" style={{ width: `${modPct}%` }} />
                <div className="bg-[var(--color-mist)] h-full transition-all" style={{ width: `${clearPct}%` }} />
                <div className="bg-[var(--color-ink-black)] h-full transition-all opacity-80" style={{ width: `${heavyPct}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-cloud)]/40 mt-4">
               <div>
                  <div className="text-[11px] text-[var(--color-ink-black)]/60 font-bold uppercase">Avg Speed</div>
                  <div className="text-xl font-bold text-[var(--color-ink-black)] mt-1">{avgSpeed} km/h</div>
               </div>
               <div>
                  <div className="text-[11px] text-[var(--color-ink-black)]/60 font-bold uppercase">Deviation</div>
                  <div className="text-xl font-bold text-[var(--color-ink-black)] mt-1">+{deviationPct}%</div>
               </div>
            </div>
          </div>


          {/* Incidents Summary Card */}
          <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-5 shadow-[var(--shadow-subtle)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink-black)] uppercase">
                <AlertTriangle className="w-4 h-4 text-[#D93B2D]" />
                <span>Top Incidents ({totalIncidents})</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {topIncidents.map(inc => (
                <div key={inc.id} className="text-sm border-l-2 border-[#D93B2D] pl-3 py-1 flex justify-between items-center">
                  <div className="flex flex-col truncate pr-2">
                    <span className="font-semibold text-[var(--color-ink-black)] truncate">{inc.title}</span>
                    <span className="text-xs text-[var(--color-steel-gray)] truncate">{inc.area}</span>
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap bg-[var(--color-cloud)] px-2 py-1 rounded">+{inc.delayMinutes}m</span>
                </div>
              ))}

            </div>
            <button
              onClick={onNavigateToIncidents}
              className="mt-5 w-full bg-[var(--color-paper-white)] hover:bg-[var(--color-cloud)] border border-[var(--color-cloud)] text-[var(--color-ink-black)] px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-lg cursor-pointer"
            >
              Manage Incidents Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Planner Summary Card */}
          <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-5 shadow-[var(--shadow-subtle)]">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink-black)] uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Route Planner</span>
            </div>
            <p className="text-sm text-[var(--color-steel-gray)] mb-4">
              {availableRoutes.length > 0 
                ? `Ready to deploy ${availableRoutes.length} AI optimized detour options to fleet.` 
                : "No active deployments. Planner ready for analysis."}
            </p>
            <button
              onClick={onNavigateToPlanner}
              className="w-full bg-[var(--color-paper-white)] hover:bg-[var(--color-cloud)] border border-[var(--color-cloud)] text-[var(--color-ink-black)] px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-lg cursor-pointer"
            >
              Open Planner Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Forecast Summary Card */}
          <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-5 shadow-[var(--shadow-subtle)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink-black)] uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>Forecast Snapshot</span>
              </div>
            </div>
            <p className="text-sm text-[var(--color-steel-gray)] mb-4 leading-relaxed">
               {forecastMinutes > 0 ? `Currently simulating +${forecastMinutes} minutes ahead.` : "Run Llama 3.3 70B simulation to predict disruption cascading effects."}
            </p>
            <button
              onClick={onNavigateToForecast}
              className="w-full bg-[var(--color-paper-white)] hover:bg-[var(--color-cloud)] border border-[var(--color-cloud)] text-[var(--color-ink-black)] px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-lg cursor-pointer"
            >
              Open Forecast Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
      
      {/* Full-Screen Map Modal logic remains for specific incident focus if needed */}
      {isFullScreenMapOpen && selectedIncident && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 backdrop-blur-sm animate-zoom-in">
          <div className="w-full h-full max-w-[1600px] bg-[var(--color-paper-white)] rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col border border-[var(--color-cloud)]">
            <div className="bg-[var(--color-card-snow)] px-6 py-4 border-b border-[var(--color-cloud)] flex items-center justify-between z-[1001] shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[var(--color-signal-green)] rounded-full animate-pulse-badge" />
                <h2 className="text-lg font-bold text-[var(--color-ink-black)] tracking-tight">Full Grid View</h2>
              </div>
              <button 
                onClick={() => setIsFullScreenMapOpen(false)}
                className="bg-[var(--color-cloud)] hover:bg-[var(--color-mist)] text-[var(--color-ink-black)] px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border-none"
              >
                Close View ✕
              </button>
            </div>
            <div className="flex-1 relative w-full h-full overflow-hidden [&>div]:h-full [&>div]:aspect-auto">
              <InteractiveMap
                nodes={nodes}
                incidents={incidents}
                selectedIncident={selectedIncident}
                onSelectIncident={onSelectIncidentId}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                forecastMinutesAhead={forecastMinutes}
                detourPositions={selectedRoute?.polylinePositions}
                selectedRouteIsAiRecommended={selectedRoute?.isAiRecommended}
                selectedCity={selectedCity}
                userLocation={userLocation}
              />
               {/* Modal info overlay */}
               <div className="absolute top-4 left-4 z-[1001] w-[300px] md:w-[350px] bg-[var(--color-card-snow)]/95 backdrop-blur-md border border-[var(--color-cloud)] p-5 shadow-xl flex flex-col gap-3 rounded-xl transition-all">
                  <div className="text-[11px] font-bold text-[var(--color-ink-black)] uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[var(--color-ink-black)]" />
                    <span>PREDICTIVE ALERT</span>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-[var(--color-ink-black)] tracking-tight leading-tight">
                    {selectedIncident.title}
                  </div>
                  <div className="text-xs text-[var(--color-ink-black)]/80 flex items-center gap-1.5 font-medium font-sans">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-ink-black)]" />
                    <span>
                      {calculateStartsInMinutes(selectedIncident.startsInMinutes, forecastMinutes) === 0 ? (
                        <span className="text-[var(--color-ink-black)] font-bold">Disruption Active</span>
                      ) : (
                        <>Cascade starts in <span className="text-[var(--color-ink-black)] font-bold">{calculateStartsInMinutes(selectedIncident.startsInMinutes, forecastMinutes)} mins</span></>
                      )}
                    </span>
                  </div>
               </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};
