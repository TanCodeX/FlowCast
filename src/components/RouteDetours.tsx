import React from 'react';
import { RouteOption } from '../types';
import { RouteCard } from './RouteCard';
import { TrendingUp, ChevronRight } from 'lucide-react';

interface RouteDetoursProps {
 routes: RouteOption[];
 selectedRouteId: string | null;
 onSelectRouteId: (id: string) => void;
 onDeployRoute: (route: RouteOption) => void;
 onNavigateToRoutePlanner: () => void;
}

export const RouteDetours: React.FC<RouteDetoursProps> = ({
 routes,
 selectedRouteId,
 onSelectRouteId,
 onDeployRoute,
 onNavigateToRoutePlanner,
}) => {
 const [isExpanded, setIsExpanded] = React.useState(false);
 const aiRecommendedRoute = routes.find(r => r.isAiRecommended);
 const defaultDisplay = aiRecommendedRoute ? [aiRecommendedRoute] : routes.slice(0, 1);
 const displayRoutes = isExpanded ? routes : defaultDisplay;
 const hiddenCount = routes.length - displayRoutes.length;

 return (
 <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-3 flex flex-col gap-2 shadow-[var(--shadow-subtle)] select-none flex-1 min-h-0">
 {/* Panel Header */}
 <div className="flex items-center justify-between border-b border-[var(--color-cloud)]/15 pb-2">
 <span className="text-xs font-bold text-[var(--color-ink-black)] flex items-center gap-1.5">
 <TrendingUp className="w-4 h-4 text-[var(--color-ink-black)]" />
 <span>Route Detours</span>
 </span>
 <button
 onClick={onNavigateToRoutePlanner}
 className="text-[11px] font-bold text-[var(--color-ink-black)] hover:underline flex items-center gap-0.5 cursor-pointer border-none bg-transparent"
 >
 <span>Planner</span>
 <ChevronRight className="w-3 h-3" />
 </button>
 </div>

 <p className="text-[11px] text-[var(--color-ink-black)]/60 font-sans leading-tight">
 AI-optimized detour paths with predicted travel times & bottlenecks.
 </p>

 {/* Routes List */}
 <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
 {routes.length === 0 ? (
 <div className="text-xs text-[var(--color-ink-black)]/50 py-8 text-center bg-gray-50 border border-dashed border-[var(--color-cloud)]/10">
 Select an incident to view alternative routes.
 </div>
 ) : (
 displayRoutes.map((rt) => (
 <RouteCard
 key={rt.id}
 route={rt}
 isSelected={selectedRouteId === rt.id}
 onSelect={() => onSelectRouteId(rt.id)}
 onDeploy={(e) => {
 e.stopPropagation();
 onDeployRoute(rt);
 }}
 />
 ))
 )}
 {hiddenCount > 0 && !isExpanded && (
     <button 
         onClick={() => setIsExpanded(true)}
         className="w-full text-center text-[10px] text-[var(--color-steel-gray)] hover:text-[var(--color-ink-black)] bg-[var(--color-paper-white)] py-1.5 rounded-[var(--radius-cards)] border border-dashed border-[var(--color-cloud)] transition-colors cursor-pointer"
     >
         + View {hiddenCount} Alternative Routes
     </button>
 )}
 {isExpanded && hiddenCount > 0 && (
     <button 
         onClick={() => setIsExpanded(false)}
         className="w-full text-center text-[10px] text-[var(--color-steel-gray)] hover:text-[var(--color-ink-black)] bg-[var(--color-paper-white)] py-1.5 rounded-[var(--radius-cards)] border border-dashed border-[var(--color-cloud)] transition-colors cursor-pointer"
     >
         Hide Alternatives
     </button>
 )}
 </div>
 </div>
 );
};
