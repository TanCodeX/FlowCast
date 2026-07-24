import React, { useState } from 'react';
import { Terminal, Code, Check, Copy, Database } from 'lucide-react';

export const Documentation: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forecast' | 'route'>('forecast');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const sampleForecastRequest = `{
  "timeHorizonMinutes": 30,
  "activeIncidents": [
    {
      "title": "Connaught Place Vehicle Collision",
      "delayMinutes": 28,
      "severity": "severe"
    }
  ],
  "currentNodes": [
    { "id": "node-cp", "name": "Connaught Place", "avgSpeedKmh": 14 }
  ]
}`;

  const sampleForecastResponse = `{
  "success": true,
  "summary": "Forecast based on historical rules & social telemetry: Heavy congestion spillover detected from Connaught Place to Barakhamba and AIIMS Flyover.",
  "criticalHotspots": ["Connaught Place Regal Circle", "NH44 Jahangirpuri", "AIIMS Junction"],
  "recommendedAction": "Dispatch pre-emptive detours via Pragati Tunnel & Lodi Road corridor immediately.",
  "confidenceScore": 94
}`;

  const sampleRouteRequest = `{
  "origin": "Connaught Place, New Delhi",
  "destination": "Gurgaon Cyber City, Haryana",
  "timeHorizonMins": 30
}`;

  const sampleRouteResponse = `{
  "success": true,
  "origin": "Connaught Place, New Delhi",
  "destination": "Gurgaon Cyber City, Haryana",
  "aiAnalysis": "Standard GPS route will experience +25m delay due to cascading blockage at AIIMS Junction. Take Lodi Estate detour.",
  "recommendedDetourName": "Via Barakhamba Road & Lodi Estate Corridor",
  "timeSavedMinutes": 18,
  "riskLevel": "High Risk on Standard Route"
}`;

  return (
    <div className="w-full max-w-[1200px] mx-auto py-12 px-4 flex flex-col gap-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-[length:var(--text-heading)] leading-[var(--text-heading--line-height)] font-normal text-[var(--color-ink-black)] tracking-tight">
          FlowCast Developer Platform
        </h2>
        <p className="text-[length:var(--text-body)] text-[var(--color-steel-gray)] leading-[var(--text-body--line-height)]">
          Integrate real-time predictive traffic forecasts into municipal control centers, logistics fleets, and navigation apps.
        </p>
      </div>

      {/* Interactive API Explorer */}
      <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-8 shadow-[var(--shadow-subtle)] flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-mist)] pb-6 gap-4">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-[var(--color-signal-green)]" />
            <h3 className="font-medium text-[length:var(--text-subheading)] text-[var(--color-ink-black)]">REST API Endpoints</h3>
          </div>

          <div className="flex items-center gap-2 bg-[var(--color-paper-white)] p-1 rounded-[100px] border border-[var(--color-cloud)]">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-4 py-1.5 text-[14px] font-medium rounded-[100px] transition-colors cursor-pointer ${
                activeTab === 'forecast' ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
              }`}
            >
              POST /api/ai-forecast
            </button>
            <button
              onClick={() => setActiveTab('route')}
              className={`px-4 py-1.5 text-[14px] font-medium rounded-[100px] transition-colors cursor-pointer ${
                activeTab === 'route' ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
              }`}
            >
              POST /api/route-analyze
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Payload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[length:var(--text-caption)] font-medium text-[var(--color-graphite)] tracking-[var(--tracking-caption)] uppercase">Sample Request Body</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    activeTab === 'forecast' ? sampleForecastRequest : sampleRouteRequest,
                    'req'
                  )
                }
                className="text-[length:var(--text-caption)] font-medium text-[var(--color-signal-green)] hover:opacity-80 flex items-center gap-1 cursor-pointer uppercase tracking-[var(--tracking-caption)]"
              >
                {copiedEndpoint === 'req' ? <Check className="w-4 h-4 text-[var(--color-signal-green)]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEndpoint === 'req' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-[var(--color-ink-black)] rounded-[var(--radius-lg)] p-6 text-[13px] font-mono text-[var(--color-paper-white)] overflow-x-auto h-[300px] shadow-[var(--shadow-inner)] leading-[1.6]">
              {activeTab === 'forecast' ? sampleForecastRequest : sampleRouteRequest}
            </pre>
          </div>

          {/* Response Payload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[length:var(--text-caption)] font-medium text-[var(--color-graphite)] tracking-[var(--tracking-caption)] uppercase">Expected Response (200 OK)</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    activeTab === 'forecast' ? sampleForecastResponse : sampleRouteResponse,
                    'res'
                  )
                }
                className="text-[length:var(--text-caption)] font-medium text-[var(--color-signal-green)] hover:opacity-80 flex items-center gap-1 cursor-pointer uppercase tracking-[var(--tracking-caption)]"
              >
                {copiedEndpoint === 'res' ? <Check className="w-4 h-4 text-[var(--color-signal-green)]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEndpoint === 'res' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-[var(--color-ink-black)] rounded-[var(--radius-lg)] p-6 text-[13px] font-mono text-[var(--color-paper-white)] overflow-x-auto h-[300px] shadow-[var(--shadow-inner)] leading-[1.6]">
              {activeTab === 'forecast' ? sampleForecastResponse : sampleRouteResponse}
            </pre>
          </div>
        </div>
      </div>

      {/* Connected Data Sources Status */}
      <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-8 shadow-[var(--shadow-subtle)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-mist)] pb-4 gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[var(--color-signal-green)]" />
            <h3 className="font-medium text-[length:var(--text-subheading)] text-[var(--color-ink-black)]">Live Data Ingestion Pipeline Status</h3>
          </div>
          <span className="text-[length:var(--text-caption)] font-medium text-[var(--color-signal-green)] flex items-center gap-2 tracking-[var(--tracking-caption)] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-signal-green)] animate-pulse" />
            <span>ALL FEEDS HEALTHY</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[var(--color-mist)] text-[var(--color-graphite)] uppercase text-[length:var(--text-caption)] tracking-[var(--tracking-caption)] font-medium">
                <th className="pb-4 pt-2">Data Source Provider</th>
                <th className="pb-4 pt-2">Feed Protocol</th>
                <th className="pb-4 pt-2">Uptime</th>
                <th className="pb-4 pt-2">Latency</th>
                <th className="pb-4 pt-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-mist)]">
              <tr>
                <td className="py-4 font-medium text-[var(--color-ink-black)]">Delhi Traffic Police Official Feed</td>
                <td className="py-4 text-[var(--color-steel-gray)]">REST API / Webhook</td>
                <td className="py-4 text-[var(--color-signal-green)] font-medium">99.9%</td>
                <td className="py-4 text-[var(--color-ink-black)]">1.2s</td>
                <td className="py-4 text-right">
                  <span className="bg-[var(--color-signal-green)]/10 text-[var(--color-signal-green)] px-3 py-1 font-medium tracking-[var(--tracking-caption)] uppercase rounded-[100px] text-[10px]">
                    ONLINE
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-[var(--color-ink-black)]">IMD Rain Cell Radar (Delhi/NCR)</td>
                <td className="py-4 text-[var(--color-steel-gray)]">NetCDF / GeoJSON Stream</td>
                <td className="py-4 text-[var(--color-signal-green)] font-medium">99.8%</td>
                <td className="py-4 text-[var(--color-ink-black)]">3.4s</td>
                <td className="py-4 text-right">
                  <span className="bg-[var(--color-signal-green)]/10 text-[var(--color-signal-green)] px-3 py-1 font-medium tracking-[var(--tracking-caption)] uppercase rounded-[100px] text-[10px]">
                    ONLINE
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-[var(--color-ink-black)]">Delhi Metro Rail Operations (DMRC)</td>
                <td className="py-4 text-[var(--color-steel-gray)]">GTFS-RT Protocol</td>
                <td className="py-4 text-[var(--color-signal-green)] font-medium">100.0%</td>
                <td className="py-4 text-[var(--color-ink-black)]">0.8s</td>
                <td className="py-4 text-right">
                  <span className="bg-[var(--color-signal-green)]/10 text-[var(--color-signal-green)] px-3 py-1 font-medium tracking-[var(--tracking-caption)] uppercase rounded-[100px] text-[10px]">
                    ONLINE
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-[var(--color-ink-black)]">National Highway Toll Sensors (FASTag)</td>
                <td className="py-4 text-[var(--color-steel-gray)]">MQTT Stream</td>
                <td className="py-4 text-[var(--color-signal-green)] font-medium">99.5%</td>
                <td className="py-4 text-[var(--color-ink-black)]">1.5s</td>
                <td className="py-4 text-right">
                  <span className="bg-[var(--color-signal-green)]/10 text-[var(--color-signal-green)] px-3 py-1 font-medium tracking-[var(--tracking-caption)] uppercase rounded-[100px] text-[10px]">
                    ONLINE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
