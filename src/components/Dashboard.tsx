import React, { useState, useMemo } from 'react';
import { Incident, TrafficNode, CameraFeed, SocialSignal, RouteOption } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { verifyIncident, Verification } from '../lib/verify';
import {
  Clock,
  Sparkles,
  TrendingUp,
  Radio,
  Camera,
  ShieldAlert,
  Sliders,
  Search,
  ChevronRight
} from 'lucide-react';

const VerifyBadge: React.FC<{ v: Verification }> = ({ v }) =>
  v === 'confirmed' ? (
    <span className="text-[10px] font-medium tracking-[0.036em] uppercase text-[var(--color-signal-green)] bg-[var(--color-signal-green)]/10 px-2 py-0.5 rounded-[100px] whitespace-nowrap">
      ✓ Confirmed
    </span>
  ) : (
    <span className="text-[10px] font-medium tracking-[0.036em] uppercase text-[var(--color-ink-black)] bg-[var(--color-cloud)] px-2 py-0.5 rounded-[100px] whitespace-nowrap">
      ⚠ Unverified
    </span>
  );

interface DashboardProps {
  nodes: TrafficNode[];
  incidents: Incident[];
  cameras: CameraFeed[];
  socialSignals: SocialSignal[];
  routes: RouteOption[];
  onOpenDemoModal: () => void;
  onNavigateToRoutePlanner: () => void;
  onCorroborate: (inc: Incident) => void;
  dataLive: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  nodes,
  incidents,
  cameras,
  socialSignals,
  routes,
  onOpenDemoModal,
  onNavigateToRoutePlanner,
  onCorroborate,
  dataLive,
}) => {
  const [forecastMinutes, setForecastMinutes] = useState<number>(30);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('inc-1');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-cp');
  const [activeCameraModal, setActiveCameraModal] = useState<CameraFeed | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summary?: string;
    criticalHotspots?: string[];
    recommendedAction?: string;
    confidenceScore?: number;
  } | null>(null);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const verifications = useMemo(
    () =>
      Object.fromEntries(incidents.map((i) => [i.id, verifyIncident(i, socialSignals, nodes)])) as Record<
        string,
        Verification
      >,
    [incidents, socialSignals, nodes],
  );

  const handleFetchAiForecast = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeIncidents: incidents,
          currentNodes: nodes,
          timeHorizonMinutes: forecastMinutes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data);
      }
    } catch (err) {
      console.error('Error fetching AI forecast:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Feature Statement Block */}
      <div className="relative w-full text-left md:text-center mt-12 mb-4">
        <div className="text-[var(--color-signal-green)] font-['Caveat'] text-3xl md:text-4xl absolute -top-8 md:-top-12 md:left-1/2 md:-ml-32 transform -rotate-6">
          Imagine...
        </div>
        <h2 className="text-[length:var(--text-heading-sm)] md:text-[length:var(--text-heading)] leading-[var(--text-heading--line-height)] font-medium text-[var(--color-ink-black)] max-w-[600px] mx-auto">
          The future of traffic management in a single view.
        </h2>
      </div>

      {/* Product Mockup Card */}
      <div className="relative w-full rounded-[var(--radius-product-mockup)] shadow-[var(--shadow-xl)] overflow-hidden p-3 md:p-8 lg:p-12" 
           style={{ background: 'linear-gradient(135deg, #1b3a5b 0%, #3575f8 40%, #e6d385 100%)' }}>
        
        {/* Inner App UI */}
        <div className="bg-[var(--color-paper-white)] rounded-[var(--radius-cards)] shadow-[var(--shadow-subtle-2)] overflow-hidden flex flex-col w-full border border-[var(--color-cloud)] relative z-10">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[var(--color-card-snow)] border-b border-[var(--color-cloud)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-[12px] font-medium text-[var(--color-steel-gray)] ml-4 hidden sm:inline-block">
                FlowCast App
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-[12px] text-[var(--color-steel-gray)]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className={`w-2 h-2 rounded-full ${dataLive ? 'bg-[var(--color-signal-green)]' : 'bg-[var(--color-graphite)]'}`} />
                {dataLive ? 'Live Sync' : 'Simulated'}
              </span>
              <div className="hidden lg:flex items-center gap-2 bg-[var(--color-paper-white)] px-3 py-1.5 rounded-[12.5px] border border-[var(--color-cloud)] text-[var(--color-steel-gray)]">
                <Search className="w-3 h-3" />
                <span>Search grid...</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[var(--color-mist)]">
            
            {/* Left Panel */}
            <div className="lg:col-span-3 bg-[var(--color-card-snow)] p-6 flex flex-col gap-8">
              <div>
                <div className="text-[length:var(--text-caption)] font-semibold tracking-[var(--tracking-caption)] uppercase text-[var(--color-graphite)] mb-2">City Metrics</div>
                <div className="text-[length:var(--text-heading-sm)] font-medium text-[var(--color-ink-black)]">54,312</div>
                <div className="text-[length:var(--text-body)] text-[var(--color-steel-gray)]">Active Commuters</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="text-[length:var(--text-caption)] font-semibold tracking-[var(--tracking-caption)] uppercase text-[var(--color-graphite)]">Avg Speed</div>
                  <div className="text-xl font-medium text-[var(--color-ink-black)]">38 km/h</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[length:var(--text-caption)] font-semibold tracking-[var(--tracking-caption)] uppercase text-[var(--color-graphite)]">Incidents</div>
                  <div className="text-xl font-medium text-[var(--color-ink-black)]">18 Active</div>
                </div>
              </div>

              {/* Cameras */}
              <div className="flex flex-col gap-3">
                <div className="text-[length:var(--text-caption)] font-semibold tracking-[var(--tracking-caption)] uppercase text-[var(--color-graphite)] flex items-center gap-2">
                  <Camera className="w-3 h-3" /> Live Feeds
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {cameras.slice(0, 2).map((cam) => (
                    <div
                      key={cam.id}
                      onClick={() => setActiveCameraModal(cam)}
                      className="cursor-pointer rounded-[var(--radius-lg)] overflow-hidden relative aspect-video"
                    >
                      <img src={cam.snapshotUrl} alt={cam.junctionName} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Map & Forecast */}
            <div className="lg:col-span-6 bg-[var(--color-paper-white)] flex flex-col h-[500px] lg:h-auto relative">
              <div className="flex-grow relative border-b border-[var(--color-mist)]">
                <InteractiveMap
                  nodes={nodes}
                  incidents={incidents}
                  selectedIncidentId={selectedIncidentId}
                  onSelectIncident={(id) => setSelectedIncidentId(id)}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={(id) => setSelectedNodeId(id)}
                  forecastMinutesAhead={forecastMinutes}
                  verifications={verifications}
                />
                
                {/* Alert Overlay */}
                <div className="absolute top-4 left-4 bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] p-4 shadow-[var(--shadow-sm)] w-[280px] border border-[var(--color-cloud)] z-30">
                  <div className="flex items-center gap-2 text-[length:var(--text-caption)] font-medium text-[var(--color-ink-black)] uppercase tracking-[var(--tracking-caption)] mb-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)]" /> PREDICTIVE ALERT
                  </div>
                  <div className="text-[length:var(--text-subheading)] font-medium text-[var(--color-ink-black)] leading-[var(--text-subheading--line-height)]">
                    {selectedIncident ? selectedIncident.title : 'Congestion'}
                  </div>
                  <div className="text-[length:var(--text-body)] text-[var(--color-steel-gray)] mt-2">
                    Cascade in {selectedIncident ? selectedIncident.startsInMinutes : 24} mins
                  </div>
                  <div className="mt-3">
                    <VerifyBadge v={selectedIncident ? verifications[selectedIncident.id] : 'unverified'} />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-[var(--color-card-snow)] flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 bg-[var(--color-paper-white)] p-1 rounded-[100px] border border-[var(--color-cloud)]">
                  {[0, 15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setForecastMinutes(mins)}
                      className={`px-4 py-1.5 text-[14px] font-medium rounded-[100px] transition-colors ${
                        forecastMinutes === mins
                          ? 'bg-[var(--color-ink-black)] text-white'
                          : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
                      }`}
                    >
                      {mins === 0 ? 'Now' : `+${mins}m`}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleFetchAiForecast}
                  disabled={isAiLoading}
                  className="bg-[var(--color-signal-green)] text-white px-6 py-2 text-[14px] font-medium rounded-[100px] flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4" />
                  {isAiLoading ? 'Simulating...' : 'AI Forecast'}
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-3 bg-[var(--color-card-snow)] p-6 flex flex-col gap-6">
              
              {/* Incidents */}
              <div>
                <div className="text-[length:var(--text-caption)] font-semibold tracking-[var(--tracking-caption)] uppercase text-[var(--color-graphite)] mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> Incidents
                </div>
                <div className="space-y-3">
                  {incidents.slice(0, 3).map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className={`p-3 rounded-[var(--radius-lg)] border cursor-pointer transition-colors ${
                        selectedIncidentId === inc.id ? 'bg-[var(--color-blush-mist)] border-[var(--color-ink-black)]' : 'bg-transparent border-[var(--color-cloud)] hover:border-[var(--color-mist)]'
                      }`}
                    >
                      <div className="text-[14px] font-medium text-[var(--color-ink-black)]">{inc.title}</div>
                      <div className="text-[12px] text-[var(--color-steel-gray)] mt-1">{inc.area}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Routes */}
              <div>
                <div className="text-[length:var(--text-caption)] font-semibold tracking-[var(--tracking-caption)] uppercase text-[var(--color-graphite)] mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Route Detours</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
                <div className="space-y-3">
                  {routes.map((rt) => (
                    <div
                      key={rt.id}
                      onClick={onNavigateToRoutePlanner}
                      className="p-3 rounded-[var(--radius-lg)] border border-[var(--color-cloud)] hover:border-[var(--color-mist)] cursor-pointer"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-[14px] font-medium text-[var(--color-ink-black)] truncate max-w-[140px]">{rt.name}</div>
                        <div className="text-[12px] font-medium">{rt.predictedTimeMins}m</div>
                      </div>
                      <div className="text-[12px] text-[var(--color-steel-gray)] truncate">{rt.viaRoads}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          
          {/* Social Telemetry Ticker */}
          <div className="bg-[var(--color-paper-white)] px-6 py-3 border-t border-[var(--color-mist)] flex items-center gap-4 text-[12px]">
            <span className="font-medium text-[var(--color-ink-black)] whitespace-nowrap">Social Telemetry:</span>
            <span className="text-[var(--color-steel-gray)] truncate">{socialSignals[0].text}</span>
          </div>

        </div>
      </div>

      {/* Camera Feed Modal */}
      {activeCameraModal && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--color-card-snow)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] max-w-lg w-full p-6 flex flex-col gap-4 shadow-[var(--shadow-xl)]">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[length:var(--text-subheading)] text-[var(--color-ink-black)]">{activeCameraModal.junctionName}</h3>
              <button
                onClick={() => setActiveCameraModal(null)}
                className="text-[var(--color-graphite)] hover:text-[var(--color-ink-black)] font-medium text-xl px-2 py-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="relative rounded-[var(--radius-lg)] overflow-hidden aspect-video border border-[var(--color-cloud)]">
              <img src={activeCameraModal.snapshotUrl} alt="Camera view" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-[var(--color-signal-green)] text-white px-2 py-1 text-[10px] font-medium rounded-[100px]">
                ● LIVE
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
