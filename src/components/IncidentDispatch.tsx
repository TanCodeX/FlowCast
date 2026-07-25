import React from 'react';
import { Incident } from '../types';
import { IncidentCard } from './IncidentCard';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface IncidentDispatchProps {
    incidents: Incident[];
    selectedIncidentId: string | null;
    onSelectIncident: (id: string) => void;
    forecastMinutes: number;
    onReloadIncidents?: () => void;
    onReportHinglish?: (text: string) => Promise<void>;
}

export const IncidentDispatch: React.FC<IncidentDispatchProps> = ({
    incidents,
    selectedIncidentId,
    onSelectIncident,
    forecastMinutes,
    onReloadIncidents,
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const severeIncidents = incidents.filter(inc => inc.severity === 'severe');
    const displayIncidents = isExpanded ? incidents : (severeIncidents.length > 0 ? severeIncidents : incidents.slice(0, 2));
    const hiddenCount = incidents.length - displayIncidents.length;

    return (
        <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-3 flex flex-col gap-2 shadow-[var(--shadow-subtle)] select-none flex-1 min-h-0">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-2">
                <span className="text-[var(--text-caption)] font-semibold text-[var(--color-ink-black)] flex items-center gap-1.5 uppercase tracking-[var(--tracking-caption)]">
                    <ShieldAlert className="w-4 h-4 text-[var(--color-ink-black)]" />
                    <span>Incident Dispatch</span>
                </span>
                <div className="flex items-center gap-[var(--element-gap)]">
                    {onReloadIncidents && (
                        <button
                            onClick={onReloadIncidents}
                            title="Sync Live Sensors"
                            className="p-1 border border-transparent hover:border-[var(--color-mist)] text-[var(--color-steel-gray)] hover:text-[var(--color-ink-black)] cursor-pointer transition-colors bg-transparent rounded-[var(--radius-buttons)]"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <span className="text-[var(--text-caption)] text-[var(--color-card-snow)] bg-[var(--color-ink-black)] px-2 py-0.5 font-bold tracking-[var(--tracking-caption)] uppercase rounded-[var(--radius-buttons)]">
                        ● CRITICAL
                    </span>
                </div>
            </div>

            {/* Incident List */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {incidents.length === 0 ? (
                    <div className="text-[var(--text-body)] text-[var(--color-steel-gray)] py-8 text-center bg-[var(--color-paper-white)] border border-[var(--color-mist)] rounded-[var(--radius-cards)]">
                        No active incidents detected.
                    </div>
                ) : (
                    displayIncidents.map((inc) => (
                        <IncidentCard
                            key={inc.id}
                            incident={inc}
                            isSelected={selectedIncidentId === inc.id}
                            onSelect={() => onSelectIncident(inc.id)}
                            forecastMinutes={forecastMinutes}
                        />
                    ))
                )}
                {hiddenCount > 0 && !isExpanded && (
                    <button 
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-center text-[10px] text-[var(--color-steel-gray)] hover:text-[var(--color-ink-black)] bg-[var(--color-paper-white)] py-1.5 rounded-[var(--radius-cards)] border border-dashed border-[var(--color-cloud)] transition-colors cursor-pointer"
                    >
                        + {hiddenCount} More Incidents
                    </button>
                )}
                {isExpanded && hiddenCount > 0 && (
                    <button 
                        onClick={() => setIsExpanded(false)}
                        className="w-full text-center text-[10px] text-[var(--color-steel-gray)] hover:text-[var(--color-ink-black)] bg-[var(--color-paper-white)] py-1.5 rounded-[var(--radius-cards)] border border-dashed border-[var(--color-cloud)] transition-colors cursor-pointer"
                    >
                        Show Less
                    </button>
                )}
            </div>
        </div>
    );
};
