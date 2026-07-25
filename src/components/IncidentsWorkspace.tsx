import React from 'react';
import { Incident, DispatchLogEntry } from '../types';
import { IncidentDispatch } from './IncidentDispatch';
import { HinglishReportForm } from './HinglishReportForm';
import { DispatchLog } from './DispatchLog';

interface IncidentsWorkspaceProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncidentId: (id: string) => void;
  forecastMinutes: number;
  onReloadIncidents?: () => void;
  onReportHinglish?: (text: string) => Promise<void>;
  dispatchLogs: DispatchLogEntry[];
}

export const IncidentsWorkspace: React.FC<IncidentsWorkspaceProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncidentId,
  forecastMinutes,
  onReloadIncidents,
  onReportHinglish,
  dispatchLogs,
}) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center gap-8 animate-zoom-in relative mb-12">
      <div className="w-full text-left relative mt-10 z-10 px-4 md:px-0">
        <h2 className="text-[40px] font-medium text-[var(--color-ink-black)] max-w-[800px] leading-tight tracking-tight">
          Incidents & Dispatch
        </h2>
        <p className="text-[16px] text-[var(--color-steel-gray)] mt-4 max-w-[600px] leading-relaxed">
          Manage active disruptions, ingest AI reports, and review live operations logs.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[var(--section-gap)]">
        {/* Left Column */}
        <div className="flex flex-col gap-[var(--element-gap)]">
          <IncidentDispatch
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={onSelectIncidentId}
            forecastMinutes={forecastMinutes}
            onReloadIncidents={onReloadIncidents}
          />
          {onReportHinglish && (
            <HinglishReportForm onSubmit={onReportHinglish} />
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[var(--element-gap)]">
          <DispatchLog logs={dispatchLogs} />
        </div>
      </div>
    </div>
  );
};
