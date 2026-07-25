import React from 'react';
import { NavTab } from '../types';
import { Monitor, Apple, Smartphone, LayoutGrid, Github, Twitter, Linkedin, Youtube, Radio } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full bg-[var(--color-paper-white)] min-h-[100svh] pt-20 pb-8 px-4 md:px-8 mt-auto relative z-40 overflow-hidden flex flex-col">
      <div className="max-w-[1200px] mx-auto w-full flex-grow flex flex-col">
        
        {/* Huge Final CTA */}
        <div className="flex flex-col items-center justify-center text-center flex-grow relative pb-16">
          <h2 className="text-[length:var(--text-heading)] md:text-[length:var(--text-display)] leading-[var(--leading-display)] font-normal text-[var(--color-ink-black)] max-w-[800px] mb-12 tracking-tight md:tracking-[var(--tracking-display)]">
            Take control of the grid before the next cascade.
          </h2>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="h-12 px-8 rounded-[var(--radius-buttons)] bg-[var(--color-signal-green)] text-white text-[14px] font-bold tracking-[0.02em] hover:opacity-90 transition-opacity flex items-center gap-2 border-none cursor-pointer shadow-sm"
          >
            <Monitor className="w-4 h-4" />
            Get started for free
          </button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-20 text-[14px]">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold text-[var(--color-graphite)] mb-2 tracking-wide">Platform</h4>
            <button onClick={() => setActiveTab('dashboard')} className="text-left font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">Live Dashboard</button>
            <button onClick={() => setActiveTab('incidents')} className="text-left font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">Incident Feeds</button>
            <button onClick={() => setActiveTab('planner')} className="text-left font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">Dynamic Route Planner</button>
            <button onClick={() => setActiveTab('forecast')} className="text-left font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">Predictive Forecast</button>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">API Access</a>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold text-[var(--color-graphite)] mb-2 tracking-wide">Solutions</h4>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">City Traffic Management</a>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Emergency Dispatch (EMS)</a>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Logistics & Freight</a>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Public Transit Ops</a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold text-[var(--color-graphite)] mb-2 tracking-wide">Resources</h4>
            <button onClick={() => setActiveTab('about-ai')} className="text-left font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">AI Architecture</button>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">TomTom Integration</a>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Simulation Engine</a>
            <button onClick={() => setActiveTab('documentation')} className="text-left font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">Documentation</button>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Grid Status</a>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold text-[var(--color-graphite)] mb-2 tracking-wide">Company</h4>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">About FlowCast</a>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Security & Trust</a>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Privacy Policy</a>
            <a href="#" className="font-medium text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] transition-colors">Terms of Service</a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-cloud)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[14px] font-medium text-[var(--color-body-charcoal)]">
            © 2026 FlowCast
          </div>
          
          <div className="flex items-center gap-6 text-[var(--color-body-charcoal)]">
            <a href="#" className="hover:text-[var(--color-ink-black)] transition-colors"><Github style={{ width: 20, height: 20 }} /></a>
            <a href="#" className="hover:text-[var(--color-ink-black)] transition-colors"><Twitter style={{ width: 20, height: 20 }} /></a>
            <a href="#" className="hover:text-[var(--color-ink-black)] transition-colors"><Youtube style={{ width: 20, height: 20 }} /></a>
            <a href="#" className="hover:text-[var(--color-ink-black)] transition-colors"><Linkedin style={{ width: 20, height: 20 }} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};
