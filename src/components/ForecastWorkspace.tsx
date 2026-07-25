import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import { FEATURES } from '../constants/features';

interface ForecastWorkspaceProps {
  forecastMinutes: number;
  setForecastMinutes: (mins: number) => void;
  isAiLoading: boolean;
  aiLoadingStep: string;
  aiReport: any;
  handleFetchAiForecast: () => void;
}

export const ForecastWorkspace: React.FC<ForecastWorkspaceProps> = ({
  forecastMinutes,
  setForecastMinutes,
  isAiLoading,
  aiLoadingStep,
  aiReport,
  handleFetchAiForecast,
}) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center gap-8 animate-zoom-in relative mb-12">
      <div className="w-full text-left relative mt-10 z-10 px-4 md:px-0">
        <h2 className="text-[40px] font-medium text-[var(--color-ink-black)] max-w-[800px] leading-tight tracking-tight">
          Forecast & Simulation
        </h2>
        <p className="text-[16px] text-[var(--color-steel-gray)] mt-4 max-w-[600px] leading-relaxed">
          Simulate cascading traffic disruptions ahead of time using predictive AI.
        </p>
      </div>

      <div className="w-full max-w-[800px] mx-auto flex flex-col gap-[var(--section-gap)]">
        {/* Prediction Time Horizon Control Slider */}
        <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-[var(--card-padding)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[var(--shadow-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--color-ink-black)] flex items-center justify-center text-white rounded-lg">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold uppercase text-[var(--color-ink-black)]">Forecast Horizon</div>
              <div className="text-xs text-[var(--color-ink-black)]/60 font-sans">Simulate cascading disruptions ahead of time</div>
            </div>
          </div>

          {/* Native Range Slider */}
          {FEATURES.horizon && (
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <div className="flex justify-between text-[11px] font-bold text-[var(--color-ink-black)]/70">
                <span>NOW</span>
                <span>+15M</span>
                <span>+30M</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="15"
                value={forecastMinutes > 30 ? 30 : forecastMinutes}
                onChange={(e) => setForecastMinutes(Number(e.target.value))}
                className="w-full accent-[#D93B2D] cursor-pointer"
              />
            </div>
          )}

          {/* Generate AI Report Button */}
          {FEATURES.aiForecast && (
            <button
              onClick={handleFetchAiForecast}
              disabled={isAiLoading}
              className="bg-[var(--color-ink-black)] hover:bg-[var(--color-body-charcoal)] text-white px-6 py-3 text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm rounded-lg"
            >
              <Sparkles className={`w-5 h-5 text-white ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'Predicting...' : 'Run AI Forecast'}</span>
            </button>
          )}
        </div>

        {/* Simulated AI Loading Steps */}
        {isAiLoading && (
          <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)]/10 p-4 shadow-sm flex items-center gap-3 text-xs text-[var(--color-ink-black)] animate-pulse rounded-lg">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-[var(--color-ink-black)] animate-spin" />
            <span>[AI ENGINE]: {aiLoadingStep}</span>
          </div>
        )}

        {/* AI Real-time Report Banner */}
        {aiReport && (
          <div className="bg-[var(--color-card-snow)] border-2 border-[var(--color-ink-black)] p-6 flex flex-col gap-4 shadow-md animate-fade-up rounded-xl">
            <div className="flex items-center justify-between text-sm font-bold text-[var(--color-ink-black)]">
              <span className="flex items-center gap-1.5 uppercase">
                <Sparkles className="w-5 h-5" />
                <span>Llama 3.3 70B Forecast (+{forecastMinutes} mins)</span>
              </span>
              <span className="bg-[var(--color-ink-black)] text-white px-3 py-1 text-xs font-bold rounded">
                CONFIDENCE: {aiReport.confidenceScore || 94}%
              </span>
            </div>

            <p className="text-sm text-[var(--color-ink-black)] leading-relaxed font-sans font-medium">{aiReport.summary}</p>

            {aiReport.recommendedAction && (
              <div className="text-sm text-[var(--color-ink-black)] bg-[var(--color-paper-white)] p-4 border-l-4 border-[var(--color-ink-black)] mt-2 font-medium rounded-r-lg">
                💡 RECOMMENDED DETOUR: {aiReport.recommendedAction}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
