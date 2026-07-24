import React from 'react';
import { NavTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[var(--color-paper-white)] text-[var(--color-steel-gray)] text-[14px] border-t border-[var(--color-cloud)] py-10 px-4 md:px-8 mt-16 w-full">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="font-medium text-xl text-[var(--color-ink-black)] tracking-tight cursor-pointer hover:text-[var(--color-signal-green)] transition-colors"
        >
          FlowCast
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[14px]">
          <button onClick={() => setActiveTab('documentation')} className="hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => setActiveTab('documentation')} className="hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">
            Terms of Service
          </button>
          <button onClick={() => setActiveTab('documentation')} className="hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">
            Data Sources
          </button>
          <button onClick={() => setActiveTab('documentation')} className="hover:text-[var(--color-ink-black)] transition-colors cursor-pointer">
            API Status
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right text-[12px] text-[var(--color-graphite)]">
          © 2026 FlowCast Predictive Systems.
        </div>
      </div>
    </footer>
  );
};
