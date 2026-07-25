import React from 'react';
import { Incident } from '../types';
import { ShieldAlert, AlertTriangle, ShieldCheck, MapPin, Layers } from 'lucide-react';

interface IncidentCardProps {
 incident: Incident;
 isSelected: boolean;
 onSelect: () => void;
 forecastMinutes: number;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
 incident,
 isSelected,
 onSelect,
 forecastMinutes,
}) => {
 const isConfirmed = incident.verificationStatus === 'confirmed';
 
 // Calculate adjusted startsIn minutes
 const rawStartsIn = incident.startsInMinutes - forecastMinutes;
 const startsIn = rawStartsIn <= 0 ? 0 : rawStartsIn;

 return (
 <div
 onClick={onSelect}
 className={`p-4 border transition-all duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden select-none ${
 isSelected
 ? 'bg-[var(--color-paper-white)] border-[var(--color-ink-black)] shadow-md translate-x-1'
 : 'bg-[var(--color-card-snow)] border-[var(--color-cloud)]/10 hover:border-[var(--color-cloud)]/30 hover:bg-[#FDFDFD]'
 }`}
 >
 {/* Selection Left Bar Indicator */}
 {isSelected && (
 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-ink-black)]" />
 )}

 {/* Top Badges Row */}
 <div className="flex items-center justify-between text-[10px] font-bold ">
 <span className="flex items-center gap-1">
 {isConfirmed ? (
 <span className="bg-[var(--color-ink-black)] text-white px-2 py-0.5 flex items-center gap-1 font-semibold">
 <ShieldCheck className="w-3 h-3" />
 <span>CONFIRMED</span>
 </span>
 ) : (
 <span className="bg-[var(--color-body-charcoal)] text-white px-2 py-0.5 flex items-center gap-1 font-semibold">
 <AlertTriangle className="w-3 h-3 animate-pulse" />
 <span>UNVERIFIED WARNING</span>
 </span>
 )}
 </span>
 <span className="text-xs text-[var(--color-ink-black)] font-bold">
 +{incident.delayMinutes}m delay
 </span>
 </div>

 {/* Title & Area */}
 <div>
 <h4 className="font-bold text-sm text-[var(--color-ink-black)] leading-tight mb-1">
 {incident.title}
 </h4>
 <div className="flex items-center gap-1 text-[11px] text-[var(--color-ink-black)]/60 font-sans">
 <MapPin className="w-3 h-3 text-red-500 shrink-0" />
 <span className="truncate">{incident.area}</span>
 </div>
 </div>

 {/* Middle Stats Section */}
 <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[var(--color-cloud)]/10 text-[10px] ">
 <div>
 <span className="text-[var(--color-ink-black)]/50 block">Starts in</span>
 <span className={`font-bold ${startsIn === 0 ? 'text-[var(--color-ink-black)]' : 'text-[var(--color-ink-black)]'}`}>
 {startsIn === 0 ? 'IMMEDIATE' : `${startsIn} min`}
 </span>
 </div>
 <div>
 <span className="text-[var(--color-ink-black)]/50 block">Confidence</span>
 <span className="font-bold text-[var(--color-steel-gray)]">{incident.confidencePercent}%</span>
 </div>
 <div>
 <span className="text-[var(--color-ink-black)]/50 block">Sources</span>
 <span className="font-bold text-[var(--color-ink-black)]">{incident.sourcesCount} Reports</span>
 </div>
 </div>

 {/* Affected Roads Footer */}
 <div className="flex items-center gap-1.5 text-[9px] text-[var(--color-ink-black)]/60 pt-1">
 <Layers className="w-3 h-3 text-[var(--color-ink-black)]/40 shrink-0" />
 <span className="truncate">
 Roads: <span className="font-bold text-[var(--color-ink-black)]">{incident.affectedRoads.join(', ')}</span>
 </span>
 </div>
 </div>
 );
};
