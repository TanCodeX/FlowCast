import React, { useState } from 'react';
import { Sparkles, Zap, X, Check } from 'lucide-react';
import { Incident } from '../types';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

interface DemoSimulationModalProps {
 isOpen: boolean;
 onClose: () => void;
 onTriggerIncident: (newIncident: Incident) => void;
}

export const DemoSimulationModal: React.FC<DemoSimulationModalProps> = ({
 isOpen,
 onClose,
 onTriggerIncident,
}) => {
 const [selectedScenario, setSelectedScenario] = useState(0);

 if (!isOpen) return null;

 const handleApplyScenario = () => {
 const sc = DEMO_SCENARIOS[selectedScenario];
 const newInc: Incident = {
 id: `sim-${Date.now()}`,
 title: sc.title,
 area: sc.area,
 severity: 'severe',
 category: sc.category,
 delayMinutes: sc.delay,
 startsInMinutes: sc.startsIn,
 confidencePercent: 98,
 socialSource: 'LIVE DEMO SIMULATOR SIGNAL',
 description: sc.desc,
 coords: sc.coords,
 lat: sc.lat,
 lng: sc.lng,
 cascadingRoads: ['Ring Road South', 'August Kranti Marg', 'Aurobindo Marg'],
 affectedRoads: [sc.area],
 verificationStatus: 'confirmed',
 sourcesCount: 18
 };

 onTriggerIncident(newInc);
 onClose();
 };

 return (
 <div className="fixed inset-0 z-50 bg-[var(--color-ink-black)]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
 <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] max-w-lg w-full p-8 shadow-[var(--shadow-xl)] border border-[var(--color-cloud)] flex flex-col gap-6 relative">
 {/* Close Button */}
 <button
 onClick={onClose}
 className="absolute top-6 right-6 text-[var(--color-graphite)] hover:text-[var(--color-ink-black)] p-2 rounded-full hover:bg-[var(--color-paper-white)] cursor-pointer transition-colors"
 >
 <X className="w-5 h-5" />
 </button>

 {/* Header */}
 <div className="space-y-2 pr-8">
 <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-signal-green)] uppercase tracking-[var(--tracking-caption)]">
 <Sparkles className="w-3.5 h-3.5" />
 <span>DISRUPTIVE SCENARIO SIMULATOR</span>
 </div>
 <h3 className="text-[var(--text-subheading)] leading-[var(--text-subheading--line-height)] font-medium text-[var(--color-ink-black)]">Simulate Real-time Incident</h3>
 <p className="text-[14px] text-[var(--color-steel-gray)] leading-relaxed">
 Inject a sudden traffic event to observe how FlowCast updates node forecasts & detour routes 30 mins in advance.
 </p>
 </div>

 {/* Scenarios List */}
 <div className="space-y-3">
 {DEMO_SCENARIOS.map((sc, idx) => {
 const isSelected = selectedScenario === idx;
 return (
 <div
 key={idx}
 onClick={() => setSelectedScenario(idx)}
 className={`p-4 rounded-[var(--radius-lg)] border transition-all cursor-pointer flex items-start gap-4 ${
 isSelected
 ? 'bg-[var(--color-blush-mist)] border-[var(--color-signal-green)]'
 : 'bg-white border-[var(--color-cloud)] hover:border-[var(--color-mist)]'
 }`}
 >
 <div className={`mt-0.5 w-5 h-5 rounded-[100px] border flex items-center justify-center shrink-0 ${
 isSelected ? 'border-[var(--color-signal-green)] bg-[var(--color-signal-green)] text-white' : 'border-[var(--color-mist)] bg-[var(--color-paper-white)]'
 }`}>
 {isSelected && <Check className="w-3 h-3" />}
 </div>

 <div className="flex-grow space-y-1.5">
 <div className="flex items-center justify-between">
 <span className="text-[14px] font-medium text-[var(--color-ink-black)]">{sc.title}</span>
 <span className="text-[12px] font-medium text-[var(--color-signal-green)] bg-[var(--color-signal-green)]/10 px-2 py-0.5 rounded-[100px]">
 +{sc.delay}m
 </span>
 </div>
 <div className="text-[12px] font-medium text-[var(--color-signal-green)]">{sc.area}</div>
 <div className="text-[13px] text-[var(--color-steel-gray)] leading-relaxed">{sc.desc}</div>
 </div>
 </div>
 );
 })}
 </div>

 {/* Action Buttons */}
 <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--color-mist)]">
 <button
 onClick={onClose}
 className="px-4 py-2 text-[14px] font-medium text-[var(--color-graphite)] hover:text-[var(--color-ink-black)] cursor-pointer"
 >
 Cancel
 </button>
 <button
 onClick={handleApplyScenario}
 className="bg-[var(--color-signal-green)] hover:opacity-90 text-white px-6 py-2.5 rounded-[100px] text-[14px] font-medium flex items-center gap-2 cursor-pointer transition-opacity"
 >
 <Zap className="w-4 h-4 text-white" />
 <span>Inject & Recalculate AI</span>
 </button>
 </div>
 </div>
 </div>
 );
};
