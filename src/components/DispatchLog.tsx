import React from 'react';
import { DispatchLogEntry } from '../types';
import { Terminal, Clock, Activity } from 'lucide-react';

interface DispatchLogProps {
 logs: DispatchLogEntry[];
}

export const DispatchLog: React.FC<DispatchLogProps> = ({ logs }) => {
 const badgeColors = {
 system: 'bg-gray-100 text-gray-700 border-gray-200',
 alert: 'bg-amber-100 text-amber-700 border-amber-200',
 deploy: 'bg-emerald-100 text-[var(--color-steel-gray)] border-emerald-200',
 };

 return (
 <div className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-3 flex flex-col gap-2 shadow-[var(--shadow-subtle)] select-none flex-1 min-h-0">
 {/* Panel Header */}
 <div className="flex items-center justify-between border-b border-[var(--color-cloud)]/15 pb-2">
 <span className="text-xs font-bold text-[var(--color-ink-black)] flex items-center gap-1.5">
 <Terminal className="w-4 h-4 text-[var(--color-steel-gray)]" />
 <span>Dispatch Log</span>
 </span>
 <div className="flex items-center gap-1.5 text-[9px] text-[var(--color-ink-black)]/50">
 <Clock className="w-3 h-3 text-[var(--color-ink-black)]/40" />
 <span>Live Ops Ledger</span>
 </div>
 </div>

 {/* Log Feed */}
 <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-xs">
 {logs.length === 0 ? (
 <div className="text-[10px] text-[var(--color-ink-black)]/40 text-center py-6 border border-dashed border-[var(--color-cloud)]/10 bg-gray-50">
 No dispatch records recorded.
 </div>
 ) : (
 logs.map((log) => (
 <div
 key={log.id}
 className="flex items-start gap-3 border-b border-gray-100 pb-2.5 last:border-0 last:pb-0"
 >
 {/* Timestamp */}
 <span className="text-[var(--color-ink-black)]/40 text-[10px] font-bold shrink-0 pt-0.5">
 {log.time}
 </span>

 {/* Dot indicator */}
 <div className="flex flex-col gap-1.5 flex-grow">
 <div className="flex items-center justify-between gap-2">
 <span className="font-bold text-[var(--color-ink-black)] leading-tight text-[11px]">
 {log.title}
 </span>
 <span className={`px-1.5 py-0.2 text-[8px] font-bold border rounded uppercase ${badgeColors[log.type]}`}>
 {log.type}
 </span>
 </div>
 
 <p className="text-[10px] text-[var(--color-ink-black)]/60 leading-tight">
 {log.details}
 </p>

 {log.meta && (
 <span className="text-[9px] font-bold text-[var(--color-steel-gray)] mt-0.5 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 w-fit">
 {log.meta}
 </span>
 )}
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 );
};
