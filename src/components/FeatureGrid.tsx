import React from 'react';

export const FeatureGrid: React.FC = () => {
  return (
    <section id="features" className="w-full max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 pt-16 pb-10">
      {/* Feature 1 */}
      <div className="flex flex-col gap-3 relative p-4 mt-8 md:mt-0">
        <div className="text-[var(--color-signal-green)] font-['Caveat'] text-3xl w-fit mb-1">
          Instant
        </div>
        <h3 className="text-[var(--text-heading-sm)] font-medium text-[var(--color-ink-black)] leading-[var(--text-heading-sm--line-height)]">
          AI Signal Detection
        </h3>
        <p className="text-[var(--text-body)] text-[var(--color-steel-gray)] leading-[var(--text-body--line-height)]">
          Continuously scans thousands of social feeds, police broadcasts, and municipal sensor channels to identify spontaneous road events moments after occurrence.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="flex flex-col gap-3 relative p-4 mt-8 md:mt-0">
        <div className="text-[var(--color-signal-green)] font-['Caveat'] text-3xl w-fit mb-1">
          Predictive
        </div>
        <h3 className="text-[var(--text-heading-sm)] font-medium text-[var(--color-ink-black)] leading-[var(--text-heading-sm--line-height)]">
          Cascade Forecasts
        </h3>
        <p className="text-[var(--text-body)] text-[var(--color-steel-gray)] leading-[var(--text-body--line-height)]">
          Applies fluid-dynamic road network rules and historical traffic models to predict spillover bottlenecks across adjacent Ring Road intersections.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="flex flex-col gap-3 relative p-4 mt-8 md:mt-0">
        <div className="text-[var(--color-signal-green)] font-['Caveat'] text-3xl w-fit mb-1">
          Proactive
        </div>
        <h3 className="text-[var(--text-heading-sm)] font-medium text-[var(--color-ink-black)] leading-[var(--text-heading-sm--line-height)]">
          Pre-emptive Detours
        </h3>
        <p className="text-[var(--text-body)] text-[var(--color-steel-gray)] leading-[var(--text-body--line-height)]">
          Instantly calculates and dispatches alternative arterial routes to commuters and logistics drivers before standard GPS maps register congestion.
        </p>
      </div>
    </section>
  );
};
