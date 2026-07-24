import React from 'react';

interface HeroSectionProps {
  onLaunchDemo: () => void;
  onExploreRoutePlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchDemo }) => {
  return (
    <section className="relative flex flex-col items-center pt-24 pb-16 px-4 w-full text-center">
      {/* Dawn Wash Atmospheric Light */}
      <div className="absolute top-[-100px] left-0 right-0 h-[600px] pointer-events-none z-0" style={{ background: 'linear-gradient(180deg, rgba(150, 223, 255, 0.4) 0%, rgba(237, 237, 237, 0.2) 58.17%, rgba(245, 245, 244, 0) 100%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[800px]">
        {/* Social Proof Badge */}
        <div className="flex items-center gap-2 bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[100px] px-3 py-1.5 shadow-[var(--shadow-subtle-4)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-green)]"></span>
          <span className="text-[12px] text-[var(--color-body-charcoal)] font-medium">7,000+ Active Sensors</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-[length:var(--text-heading-lg)] leading-[var(--text-heading-lg--line-height)] tracking-[var(--text-heading-lg--letter-spacing)] md:text-[length:var(--text-display)] md:leading-[var(--text-display--line-height)] md:tracking-[var(--text-display--letter-spacing)] font-normal text-[var(--color-ink-black)]">
          Predict disruptions <br className="hidden md:block" />
          before they happen.
        </h1>

        {/* Body Description */}
        <p className="text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[var(--color-steel-gray)] max-w-[600px]">
          FlowCast synthesizes real-time social telemetry and neural cascade modeling to forecast municipal gridlock 30 minutes before maps turn red.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onLaunchDemo}
          className="bg-[var(--color-signal-green)] text-white font-medium text-[14px] rounded-[100px] px-8 py-3.5 shadow-[var(--shadow-sm)] hover:opacity-90 transition-opacity mt-4 cursor-pointer"
        >
          Launch Live Demo
        </button>

        {/* Trust Logo Bar */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.036em] text-[var(--color-graphite)]">
            Trusted by municipalities & enterprises
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Logos represented by text for now */}
            <span className="text-xl font-bold text-[var(--color-body-charcoal)] tracking-tighter">Delhi Metro</span>
            <span className="text-xl font-bold text-[var(--color-body-charcoal)] tracking-tighter">TomTom</span>
            <span className="text-xl font-bold text-[var(--color-body-charcoal)] tracking-tighter">NHAI</span>
            <span className="text-xl font-bold text-[var(--color-body-charcoal)] tracking-tighter">DTC</span>
          </div>
        </div>
      </div>
    </section>
  );
};
