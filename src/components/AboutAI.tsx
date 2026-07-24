import React from 'react';
import { Sparkles, Cpu, Radio, Network, Send, CheckCircle2, XCircle } from 'lucide-react';

export const AboutAI: React.FC = () => {
  const pipelineStages = [
    {
      num: '01',
      title: 'Multimodal Signal Ingestion',
      icon: Radio,
      desc: 'Ingests real-time feeds from Delhi Traffic Police (@dtptraffic), X social posts, WhatsApp citizen channels, IMD rainfall radar, and FASTag toll sensors.',
    },
    {
      num: '02',
      title: 'Gemini NLP Event Extraction',
      icon: Cpu,
      desc: 'Extracts exact junction coordinates, affected carriage lanes, vehicle type stalls, and event severity using fine-tuned Gemini AI language models.',
    },
    {
      num: '03',
      title: 'Graph Network Cascade Simulation',
      icon: Network,
      desc: 'Models fluid dynamic traffic spillover across Delhi NCR road networks to forecast bottleneck formation 30 minutes before maps turn red.',
    },
    {
      num: '04',
      title: 'Pre-emptive Reroute Dispatch',
      icon: Send,
      desc: 'Calculates alternative arterial detours and broadcasts proactive warnings to commuters, delivery fleets, and traffic control rooms.',
    },
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto py-12 px-4 flex flex-col gap-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[length:var(--text-heading)] leading-[var(--text-heading--line-height)] font-normal text-[var(--color-ink-black)] tracking-tight">
          How FlowCast Outsmarts Gridlock
        </h2>
        <p className="text-[length:var(--text-body)] text-[var(--color-steel-gray)] leading-[var(--text-body--line-height)]">
          FlowCast doesn't just display red lines. We synthesize multiple urban data streams into a singular predictive engine.sruptions before vehicles come to a halt.
        </p>
      </div>

      {/* Reactive vs Predictive Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional GPS */}
        <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] border border-[var(--color-cloud)] p-8 flex flex-col gap-6 shadow-[var(--shadow-subtle)]">
          <div className="flex items-center justify-between border-b border-[var(--color-mist)] pb-4">
            <span className="font-medium text-[length:var(--text-subheading)] text-[var(--color-ink-black)]">Traditional GPS</span>
            <span className="text-[var(--color-graphite)] bg-[var(--color-paper-white)] text-[length:var(--text-caption)] px-3 py-1 font-medium tracking-[var(--tracking-caption)] uppercase rounded-[100px] border border-[var(--color-cloud)]">REACTIVE</span>
          </div>
          <ul className="space-y-4 text-[length:var(--text-body)] text-[var(--color-body-charcoal)]">
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-[var(--color-graphite)] shrink-0 mt-0.5" />
              <span>Relies solely on vehicle GPS speed drops AFTER traffic has accumulated.</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-[var(--color-graphite)] shrink-0 mt-0.5" />
              <span>Reroutes thousands of drivers onto the same narrow side street, creating secondary jams.</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-[var(--color-graphite)] shrink-0 mt-0.5" />
              <span>Blind to spontaneous events (waterlogging, rallies, VVIP movements) until 20+ mins later.</span>
            </li>
          </ul>
        </div>

        {/* FlowCast */}
        <div className="bg-[var(--color-blush-mist)] rounded-[var(--radius-cards)] border border-[var(--color-cloud)] p-8 flex flex-col gap-6 shadow-[var(--shadow-subtle)]">
          <div className="flex items-center justify-between border-b border-[var(--color-signal-green)]/20 pb-4">
            <span className="font-medium text-[length:var(--text-subheading)] text-[var(--color-ink-black)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-signal-green)]" />
              <span>FlowCast Engine</span>
            </span>
            <span className="text-[var(--color-signal-green)] bg-white text-[length:var(--text-caption)] px-3 py-1 font-medium tracking-[var(--tracking-caption)] uppercase rounded-[100px] border border-[var(--color-cloud)]">PREDICTIVE</span>
          </div>
          <ul className="space-y-4 text-[length:var(--text-body)] text-[var(--color-body-charcoal)]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-signal-green)] shrink-0 mt-0.5" />
              <span>Scans police alerts, citizen posts, and rain cell radar moments after an event occurs.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-signal-green)] shrink-0 mt-0.5" />
              <span>Simulates traffic flow cascading across adjacent Ring Road flyovers 30 mins in advance.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-signal-green)] shrink-0 mt-0.5" />
              <span>Provides pre-emptive detours BEFORE roads reach critical capacity.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4-Stage Pipeline Grid */}
      <div className="mb-16">
        <h3 className="text-[length:var(--text-heading-sm)] font-medium text-[var(--color-ink-black)] text-center">4-Stage Intelligence Pipeline</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineStages.map((stg) => {
            const Icon = stg.icon;
            return (
              <div key={stg.num} className="bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] border border-[var(--color-cloud)] p-6 flex flex-col gap-4 shadow-[var(--shadow-subtle-2)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[length:var(--text-heading-sm)] font-medium text-[var(--color-graphite)]">{stg.num}</span>
                  <div className="w-10 h-10 bg-[var(--color-paper-white)] rounded-full flex items-center justify-center text-[var(--color-ink-black)]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-medium text-[16px] text-[var(--color-ink-black)] leading-tight">{stg.title}</h4>
                <p className="text-[14px] text-[var(--color-steel-gray)] leading-relaxed">{stg.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] p-8 shadow-[var(--shadow-subtle)] border border-[var(--color-cloud)] flex flex-col items-center justify-center text-center gap-2">
          <div className="text-[length:var(--text-heading)] font-normal text-[var(--color-signal-green)]">94.2%</div>
          <div className="text-[length:var(--text-caption)] text-[var(--color-graphite)] uppercase tracking-[var(--tracking-caption)] font-medium">Disruption Prediction Accuracy</div>
        </div>

        <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] p-8 shadow-[var(--shadow-subtle)] border border-[var(--color-cloud)] flex flex-col items-center justify-center text-center gap-2">
          <div className="text-[length:var(--text-heading)] font-normal text-[var(--color-ink-black)]">32 Mins</div>
          <div className="text-[length:var(--text-caption)] text-[var(--color-graphite)] uppercase tracking-[var(--tracking-caption)] font-medium">Average Early Warning</div>
        </div>

        <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-cards)] p-8 shadow-[var(--shadow-subtle)] border border-[var(--color-cloud)] flex flex-col items-center justify-center text-center gap-2">
          <div className="text-[length:var(--text-heading)] font-normal text-[var(--color-ink-black)]">1.4M L</div>
          <div className="text-[length:var(--text-caption)] text-[var(--color-graphite)] uppercase tracking-[var(--tracking-caption)] font-medium">Estimated Fuel Saved Annually</div>
        </div>
      </div>
    </div>
  );
};
