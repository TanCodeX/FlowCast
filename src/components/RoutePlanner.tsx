import React, { useState } from 'react';
import { RouteOption } from '../types';
import { Sparkles, MapPin, Navigation, Clock, ShieldCheck, Zap } from 'lucide-react';

interface RoutePlannerProps {
  routes: RouteOption[];
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({ routes }) => {
  const [origin, setOrigin] = useState('Connaught Place, New Delhi');
  const [destination, setDestination] = useState('Gurgaon Cyber City, Haryana');
  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const presetPairs = [
    { from: 'Connaught Place', to: 'Gurgaon Cyber City' },
    { from: 'Noida Sector 62', to: 'AIIMS Junction' },
    { from: 'Dwarka Sector 21', to: 'IGI Airport T3' },
    { from: 'Anand Vihar ISBT', to: 'Nehru Place' },
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/route-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          timeHorizonMins: forecastHorizon,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data);
      }
    } catch (err) {
      console.error('Route analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto py-12 px-4 flex flex-col gap-12">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-[length:var(--text-heading)] leading-[var(--text-heading--line-height)] font-normal text-[var(--color-ink-black)] tracking-tight">
          Bypass Gridlock Before Maps Turn Red
        </h2>
        <p className="text-[length:var(--text-body)] text-[var(--color-steel-gray)] leading-[var(--text-body--line-height)]">
          Compare standard GPS routing against FlowCast's 30-minute predictive cascade algorithm.
        </p>
      </div>

      {/* Query Card */}
      <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] border border-[var(--color-cloud)] p-8 shadow-[var(--shadow-subtle)] flex flex-col gap-8">
        {/* Origin / Destination Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-medium uppercase text-[var(--color-graphite)] tracking-[var(--tracking-caption)] flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Start Location (Origin)</span>
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-white rounded-[100px] border border-[var(--color-cloud)] focus:border-[var(--color-signal-green)] focus:ring-1 focus:ring-[var(--color-signal-green)] px-6 py-3.5 text-[14px] text-[var(--color-ink-black)] outline-none transition-all shadow-[var(--shadow-inner)]"
              placeholder="e.g. Connaught Place"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-medium uppercase text-[var(--color-graphite)] tracking-[var(--tracking-caption)] flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-white rounded-[100px] border border-[var(--color-cloud)] focus:border-[var(--color-signal-green)] focus:ring-1 focus:ring-[var(--color-signal-green)] px-6 py-3.5 text-[14px] text-[var(--color-ink-black)] outline-none transition-all shadow-[var(--shadow-inner)]"
              placeholder="e.g. Cyber City Gurgaon"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-[12px] text-[var(--color-graphite)] font-medium uppercase mr-2 tracking-[var(--tracking-caption)]">Popular Arterials:</span>
          {presetPairs.map((pair, idx) => (
            <button
              key={idx}
              onClick={() => {
                setOrigin(pair.from);
                setDestination(pair.to);
              }}
              className="bg-[var(--color-paper-white)] hover:bg-[var(--color-cloud)] text-[var(--color-body-charcoal)] border border-[var(--color-cloud)] px-4 py-2 rounded-[100px] text-[12px] font-medium transition-colors cursor-pointer"
            >
              {pair.from} → {pair.to}
            </button>
          ))}
        </div>

        {/* Time Horizon Slider + Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[var(--color-mist)]">
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-[var(--color-graphite)]" />
            <div>
              <div className="text-[12px] font-medium text-[var(--color-ink-black)] uppercase tracking-[var(--tracking-caption)]">Forecast Horizon:</div>
              <div className="text-[12px] text-[var(--color-steel-gray)]">Predicting road conditions in +{forecastHorizon} mins</div>
            </div>
            <div className="flex items-center gap-2 bg-[var(--color-paper-white)] p-1 rounded-[100px] border border-[var(--color-cloud)] ml-4">
              {[15, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => setForecastHorizon(m)}
                  className={`px-4 py-1.5 text-[14px] font-medium rounded-[100px] cursor-pointer transition-colors ${
                    forecastHorizon === m ? 'bg-[var(--color-ink-black)] text-white' : 'text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)]'
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
            className="w-full sm:w-auto bg-[var(--color-signal-green)] text-white hover:opacity-90 px-8 py-3.5 rounded-[100px] font-medium text-[14px] flex items-center justify-center gap-2 cursor-pointer transition-opacity"
          >
            <Sparkles className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Simulating...' : 'Analyze AI Detours'}</span>
          </button>
        </div>
      </div>

      {/* AI Custom Analysis Output if available */}
      {aiAnalysis && (
        <div className="bg-[var(--color-blush-mist)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] p-8 shadow-[var(--shadow-subtle)] flex flex-col gap-6 animate-fade-up">
          <div className="flex items-center justify-between border-b border-[var(--color-mist)] pb-4">
            <span className="text-[length:var(--text-subheading)] font-medium text-[var(--color-ink-black)] flex items-center gap-3">
              <Zap className="w-5 h-5 text-[var(--color-signal-green)]" />
              <span>Gemini AI Route Disruption Investigation</span>
            </span>
            <span className="bg-[var(--color-signal-green)]/10 text-[var(--color-signal-green)] px-3 py-1 font-medium text-[10px] uppercase tracking-[var(--tracking-caption)] rounded-[100px]">
              {aiAnalysis.riskLevel || 'High Risk on Standard GPS'}
            </span>
          </div>

          <div className="text-[length:var(--text-body)] text-[var(--color-body-charcoal)] leading-[var(--text-body--line-height)]">
            {aiAnalysis.aiAnalysis}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-lg)] p-6 border border-[var(--color-cloud)]">
              <div className="text-[12px] text-[var(--color-graphite)] font-medium uppercase tracking-[var(--tracking-caption)]">Recommended AI Detour</div>
              <div className="text-[length:var(--text-heading-sm)] font-medium text-[var(--color-signal-green)] mt-2">{aiAnalysis.recommendedDetourName || 'Via Lodi Road & Dhaula Kuan Express'}</div>
            </div>

            <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-lg)] p-6 border border-[var(--color-cloud)]">
              <div className="text-[12px] text-[var(--color-graphite)] font-medium uppercase tracking-[var(--tracking-caption)]">Time Saved</div>
              <div className="text-[length:var(--text-heading)] font-normal text-[var(--color-ink-black)] mt-2">
                {aiAnalysis.timeSavedMinutes || 18} Mins
              </div>
            </div>

            <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-lg)] p-6 border border-[var(--color-cloud)]">
              <div className="text-[12px] text-[var(--color-graphite)] font-medium uppercase tracking-[var(--tracking-caption)]">Avoid Chokepoints</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(aiAnalysis.keyChokepointsToAvoid || ['AIIMS Junction', 'CP Regal Circle', 'Ring Road South']).map((pt: string, i: number) => (
                  <span key={i} className="bg-white px-3 py-1 text-[12px] font-medium text-[var(--color-graphite)] rounded-[100px] border border-[var(--color-cloud)]">
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Route Options Comparison Cards */}
      <div className="space-y-6">
        <h3 className="text-[length:var(--text-heading-sm)] font-medium text-[var(--color-ink-black)] flex items-center gap-3">
          <span>AI Multi-Route Comparison</span>
          <span className="text-[14px] text-[var(--color-steel-gray)] font-normal">({origin} to {destination})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((rt) => (
            <div
              key={rt.id}
              className={`p-8 rounded-[var(--radius-cards)] flex flex-col justify-between gap-6 transition-all shadow-[var(--shadow-subtle)] border ${
                rt.isAiRecommended
                  ? 'border-[var(--color-signal-green)] bg-[var(--color-blush-mist)]'
                  : 'border-[var(--color-cloud)] bg-[var(--color-card-snow)]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {rt.isAiRecommended ? (
                    <span className="bg-[var(--color-signal-green)] text-white text-[10px] uppercase font-medium tracking-[var(--tracking-caption)] px-3 py-1 rounded-[100px] flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Recommended Detour</span>
                    </span>
                  ) : (
                    <span className="bg-[var(--color-paper-white)] border border-[var(--color-cloud)] text-[var(--color-graphite)] text-[10px] uppercase font-medium tracking-[var(--tracking-caption)] px-3 py-1 rounded-[100px]">
                      Standard GPS
                    </span>
                  )}
                  <span className="text-[14px] font-medium text-[var(--color-steel-gray)]">{rt.distanceKm} km</span>
                </div>

                <h4 className="font-medium text-[length:var(--text-subheading)] text-[var(--color-ink-black)]">{rt.name}</h4>
                <p className="text-[14px] text-[var(--color-steel-gray)] leading-relaxed">{rt.viaRoads}</p>
              </div>

              <div className="pt-6 border-t border-[var(--color-mist)] space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[14px] text-[var(--color-graphite)] font-medium">Predicted Time:</span>
                  <span className="text-[length:var(--text-heading-sm)] font-medium text-[var(--color-ink-black)]">{rt.predictedTimeMins} min</span>
                </div>

                <div className="flex justify-between text-[14px] font-medium">
                  <span className="text-[var(--color-graphite)]">Expected Delay:</span>
                  <span className={rt.delayMins > 15 ? 'text-red-500' : 'text-[var(--color-signal-green)]'}>
                    +{rt.delayMins} min
                  </span>
                </div>

                <div className="text-[12px] text-[var(--color-body-charcoal)] bg-white rounded-[var(--radius-lg)] p-4 border border-[var(--color-cloud)] mt-2">
                  <span className="font-medium text-[var(--color-ink-black)]">Key Points: </span>
                  {rt.congestionPoints.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
