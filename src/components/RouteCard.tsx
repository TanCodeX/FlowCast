import React from 'react';
import { RouteOption } from '../types';
import { Sparkles, Route, Check, ShieldAlert } from 'lucide-react';

interface RouteCardProps {
 route: RouteOption;
 isSelected: boolean;
 onSelect: () => void;
 onDeploy: (e: React.MouseEvent) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
 route,
 isSelected,
 onSelect,
 onDeploy,
}) => {
 const riskColors = {
 low: 'text-[var(--color-steel-gray)] bg-emerald-50 border-emerald-200/50',
 medium: 'text-[var(--color-body-charcoal)] bg-[var(--color-body-charcoal)]/5 border-[var(--color-body-charcoal)]/20',
 high: 'text-[var(--color-ink-black)] bg-[var(--color-ink-black)]/5 border-[var(--color-ink-black)]/20',
 };

 return (
 <div
 onClick={onSelect}
 className={`p-4 border transition-all duration-200 cursor-pointer flex flex-col gap-3 relative overflow-hidden select-none ${
 isSelected
 ? 'bg-[var(--color-paper-white)] border-[var(--color-mist)] shadow-md translate-x-1'
 : 'bg-[var(--color-card-snow)] border-[var(--color-cloud)]/10 hover:border-[var(--color-cloud)]/30 hover:bg-[#FDFDFD]'
 }`}
 >
 {/* Selection Left Bar Indicator */}
 {isSelected && (
 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-mist)]" />
 )}

 {/* Top Badge & Status */}
 <div className="flex items-center justify-between text-[10px] font-bold ">
 <span className="flex items-center gap-1">
 {route.isAiRecommended ? (
 <span className="bg-[var(--color-ink-black)] text-white px-2 py-0.5 flex items-center gap-1 font-semibold">
 <Sparkles className="w-3 h-3 text-white" />
 <span>AI RECOMMENDED</span>
 </span>
 ) : (
 <span className="bg-gray-700 text-white px-2 py-0.5 flex items-center gap-1 font-semibold">
 <Route className="w-3 h-3" />
 <span>STANDARD PATH</span>
 </span>
 )}
 </span>
 
 {isSelected ? (
 <span className="text-[var(--color-steel-gray)] font-bold flex items-center gap-0.5">
 <Check className="w-3.5 h-3.5" />
 <span>ACTIVE ROUTE</span>
 </span>
 ) : (
 <span className="text-[var(--color-ink-black)]/40 font-semibold group-hover:text-[var(--color-ink-black)]/60">
 [Select]
 </span>
 )}
 </div>

 {/* Title & Via Landmarks */}
 <div>
 <h4 className="font-bold text-sm text-[var(--color-ink-black)] leading-tight">
 {route.name}
 </h4>
 <p className="text-[10px] text-[var(--color-ink-black)]/55 mt-0.5 truncate">
 Via: {route.viaRoads}
 </p>
 </div>

 {/* Sparkline SVG Visualizer */}
 <div className="h-6 w-full pt-1 border-t border-b border-[var(--color-cloud)]/10 py-1">
 <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
 <polyline
 fill="none"
 stroke={route.isAiRecommended ? '#047857' : '#D93B2D'}
 strokeWidth="2"
 points={route.sparklineData.map((val, idx) => `${(idx / (route.sparklineData.length - 1)) * 100},${20 - (val / 65) * 18}`).join(' ')}
 />
 </svg>
 </div>

 {/* Grid Stats */}
 <div className="grid grid-cols-4 gap-1 text-[10px] ">
 <div>
 <span className="text-[var(--color-ink-black)]/50 block">ETA</span>
 <span className="font-bold text-[var(--color-ink-black)] text-xs">{route.etaMinutes} min</span>
 </div>
 <div>
 <span className="text-[var(--color-ink-black)]/50 block">Saved</span>
 <span className="font-bold text-[var(--color-steel-gray)] text-xs">
 {route.savedMinutes > 0 ? `-${route.savedMinutes}m` : '0m'}
 </span>
 </div>
 <div>
 <span className="text-[var(--color-ink-black)]/50 block">Risk</span>
 <span className={`font-bold uppercase text-[9px] px-1 border block text-center mt-0.5 ${riskColors[route.risk]}`}>
 {route.risk}
 </span>
 </div>
 <div>
 <span className="text-[var(--color-ink-black)]/50 block">On-Time</span>
 <span className="font-bold text-[var(--color-steel-gray)] text-xs">{route.arrivalProbability}%</span>
 </div>
 </div>

 {/* Deploy Button */}
 {isSelected && (
 <button
 onClick={onDeploy}
 className="mt-1 w-full bg-transparent text-[var(--color-ink-black)] border border-[var(--color-ink-black)] hover:bg-[var(--color-cloud)] rounded-[100px] text-[10px] font-bold py-2 shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
 >
 <Sparkles className="w-3.5 h-3.5" />
 <span>Deploy AI Route</span>
 </button>
 )}
 </div>
 );
};
