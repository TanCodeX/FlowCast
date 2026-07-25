import React from 'react';
import { Shield, MonitorSmartphone, Bot, Play, CheckCircle2, Navigation2, Activity, Inbox, Map, BarChart2, Settings, User, MapPin, AlertCircle, Clock, Filter, MoreVertical } from 'lucide-react';

interface HeroSectionProps {
  onLaunchDemo: () => void;
  onExploreRoutePlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchDemo, onExploreRoutePlanner }) => {
  return (
    <div className="w-full flex flex-col items-center bg-[var(--color-paper-white)] min-h-screen relative font-sans text-[var(--color-body-charcoal)]">

      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center pt-32 pb-8 px-4 md:px-8 w-full max-w-[var(--page-max-width)] text-center">
        {/* Dawn Wash Atmospheric Light */}
        <div 
          className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0" 
          style={{ 
            background: 'var(--gradient-dawn-wash)', 
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', 
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' 
          }} 
        />

        <div className="relative z-10 w-full flex flex-col items-center gap-6 mt-8">
          {/* Social Proof Badge */}
          <div className="flex items-center gap-2 bg-[var(--color-card-snow)] rounded-[100px] px-3 py-1.5 shadow-[var(--shadow-subtle-2)] border border-[var(--color-cloud)] mb-2">
            <span className="w-1 h-1 rounded-full bg-[var(--color-signal-green)]"></span>
            <span className="text-[12px] font-medium text-[var(--color-body-charcoal)]">Live — Delhi NCR prediction active</span>
          </div>

          <h1 className="text-[length:var(--text-heading-lg)] leading-[var(--leading-heading-lg)] tracking-[var(--tracking-heading-lg)] md:text-[length:var(--text-display)] md:leading-[var(--leading-display)] md:tracking-[var(--tracking-display)] font-normal text-[var(--color-ink-black)] max-w-[900px] mx-auto m-0">
            Predict traffic jams <br className="hidden md:block" />
            <span className="italic text-[var(--color-steel-gray)]">15–30 minutes</span> before they form
          </h1>

          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--color-steel-gray)] max-w-[600px] mx-auto m-0">
            FlowCast fuses real-time social signals, official updates, and GPS anomalies to forecast Delhi disruptions — protests, VIP convoys, accidents — before congestion ever begins.
          </p>

          <button
            onClick={onLaunchDemo}
            className="bg-[var(--color-signal-green)] text-[var(--color-card-snow)] font-medium text-[14px] rounded-[var(--radius-buttons)] px-5 py-2.5 hover:opacity-90 transition-opacity mt-4 flex items-center gap-2 cursor-pointer border-none"
          >
            Launch Live Demo
          </button>
        </div>
      </section>

      {/* 2. PRODUCT MOCKUP SECTION */}
      <section className="relative w-full max-w-[1000px] px-4 md:px-8 mt-12 mb-[var(--section-gap)] z-10 flex justify-center">
        <div className="relative w-full max-w-[900px] aspect-[16/10] md:h-[600px] rounded-[var(--radius-product-mockup)] shadow-[var(--shadow-xl)] overflow-hidden bg-[var(--color-card-snow)]">
          {/* Painted landscape background */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/van-gogh.png)' }}>
          </div>

          {/* White UI Window */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-[var(--color-card-snow)] rounded-[var(--radius-product-mockup)] shadow-[var(--shadow-sm)] overflow-hidden flex flex-col border border-[var(--color-mist)]">
            {/* macOS Window Chrome */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-cloud)] bg-[#ffffff]">
              <span className="w-3 h-3 rounded-full bg-[var(--color-mist)]"></span>
              <span className="w-3 h-3 rounded-full bg-[var(--color-mist)]"></span>
              <span className="w-3 h-3 rounded-full bg-[var(--color-mist)]"></span>
              <span className="ml-4 text-[length:var(--text-caption)] tracking-[var(--tracking-caption)] font-semibold text-[var(--color-graphite)] uppercase">FlowCast — Inbox</span>
            </div>
            
            {/* Inbox Layout */}
            <div className="flex flex-1 overflow-hidden bg-[var(--color-card-snow)]">
              
              {/* Left Column — Inbox Cards */}
              <div className="w-[320px] border-r border-[var(--color-cloud)] flex flex-col overflow-y-auto">
                <div className="p-5 border-b border-[var(--color-cloud)] flex justify-between items-center bg-[var(--color-paper-white)]">
                  <span className="text-[length:var(--text-body)] font-medium text-[var(--color-ink-black)]">Alerts</span>
                </div>
                
                {/* Active Card */}
                <div className="p-5 border-b border-[var(--color-cloud)] bg-[var(--color-card-snow)] relative cursor-pointer">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-signal-green)]"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-green)]"></span>
                    <span className="text-[length:var(--text-caption)] tracking-[var(--tracking-caption)] font-semibold text-[var(--color-body-charcoal)] uppercase">Confirmed</span>
                    <span className="text-[length:var(--text-caption)] text-[var(--color-graphite)] ml-auto">Just now</span>
                  </div>
                  <h4 className="text-[length:var(--text-body)] font-medium text-[var(--color-ink-black)] mb-1 leading-tight">VIP Convoy Detected</h4>
                  <p className="text-[13px] text-[var(--color-steel-gray)] m-0 truncate">Connaught Place · 18 min to cascade</p>
                </div>
                
                {/* Inactive Card */}
                <div className="p-5 border-b border-[var(--color-cloud)] bg-[var(--color-card-snow)] cursor-pointer hover:bg-[var(--color-paper-white)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ash)]"></span>
                    <span className="text-[length:var(--text-caption)] tracking-[var(--tracking-caption)] font-semibold text-[var(--color-graphite)] uppercase">Warning</span>
                    <span className="text-[length:var(--text-caption)] text-[var(--color-ash)] ml-auto">12m ago</span>
                  </div>
                  <h4 className="text-[length:var(--text-body)] font-normal text-[var(--color-body-charcoal)] mb-1 leading-tight">Possible Road Cave-in</h4>
                  <p className="text-[13px] text-[var(--color-ash)] m-0 truncate">Lajpat Nagar · Awaiting signals</p>
                </div>
              </div>

              {/* Right Column — Details (Flat, No nested boxes) */}
              <div className="flex-1 flex flex-col p-10 overflow-y-auto">
                <div className="max-w-[600px]">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 rounded-[var(--radius-buttons)] border border-[var(--color-signal-green)] text-[length:var(--text-caption)] tracking-[var(--tracking-caption)] font-semibold text-[var(--color-signal-green)] uppercase">87% Confidence</span>
                    <span className="px-3 py-1 rounded-[var(--radius-buttons)] border border-[var(--color-cloud)] text-[length:var(--text-caption)] tracking-[var(--tracking-caption)] font-semibold text-[var(--color-steel-gray)] uppercase">4 Sources</span>
                  </div>
                  
                  <h2 className="text-[length:var(--text-heading)] leading-[var(--leading-heading)] font-normal text-[var(--color-ink-black)] tracking-tight mb-8">
                    VIP Convoy Detected — Heavy Gridlock Forecast
                  </h2>

                  <p className="text-[length:var(--text-subheading)] leading-[var(--leading-subheading)] font-normal text-[var(--color-body-charcoal)] mb-8">
                    Three geo-tagged social posts and one official traffic handle confirm a VIP movement near Rajpath. Cascade congestion will reach <strong className="font-medium text-[var(--color-ink-black)]">Connaught Place in ~18 minutes</strong>.
                  </p>

                  <div className="h-[1px] w-full bg-[var(--color-cloud)] mb-8"></div>

                  <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--color-steel-gray)] mb-10">
                    Rerouting via Barakhamba Road is highly recommended to avoid the projected congestion radius.
                  </p>

                  <button
                    onClick={onExploreRoutePlanner}
                    className="bg-[var(--color-signal-green)] text-[var(--color-card-snow)] font-medium text-[14px] rounded-[var(--radius-buttons)] px-6 py-3 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    Deploy Detour Route
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST LOGO BAR */}
      <section className="w-full max-w-[var(--page-max-width)] flex flex-col items-center gap-6 mb-[var(--section-gap)] mt-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.036em] text-[var(--color-graphite)]">
          Used by professionals at
        </span>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 text-[var(--color-graphite)] opacity-80">
          <span className="text-xl font-bold tracking-tighter">Delhivery</span>
          <span className="text-xl font-bold tracking-tighter">Blinkit</span>
          <span className="text-xl font-bold tracking-tighter italic">Swiggy</span>
          <span className="text-xl font-bold tracking-tighter">Ola</span>
          <span className="text-xl font-bold tracking-tighter">Delhi Traffic Police</span>
        </div>
      </section>

      {/* 4. FEATURE DESCRIPTION BLOCKS */}
      <section className="w-full max-w-[900px] flex flex-col gap-32 px-4 md:px-8 mb-[var(--section-gap)] mt-16 mx-auto">

        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 flex flex-col items-start gap-4">
            <div className="relative">
              <div 
                className="absolute -top-12 left-0 text-[var(--color-signal-green)] text-xl rotate-[-5deg] flex flex-col items-center"
                style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}
              >
                Before congestion forms
                <svg width="24" height="24" viewBox="0 0 30 30" fill="none" className="mt-1">
                  <path d="M5 5 Q 15 25 25 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M20 15 L 25 20 L 20 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <h2 className="text-[length:var(--text-heading-sm)] leading-[var(--leading-heading-sm)] font-medium text-[var(--color-ink-black)] max-w-[400px] m-0">
                Know about a jam before Maps does
              </h2>
            </div>
            <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--color-steel-gray)] max-w-[400px] m-0 mt-2">
              FlowCast listens to geo-tagged social posts, official traffic handles, and live GPS anomalies. Our AI warns you 15–30 minutes before congestion forms — not after you're already stuck.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="w-full aspect-[4/3] rounded-[var(--radius-product-mockup)] shadow-[var(--shadow-sm)] border border-[var(--color-cloud)] overflow-hidden flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: 'url(/feature-1-bg.png)' }}>
              
              {/* Floating UI Window */}
              <div className="w-[85%] max-w-[340px] rounded-[var(--radius-cards)] shadow-[var(--shadow-xl)] border border-white/40 overflow-hidden flex flex-col bg-white/95 backdrop-blur-md transform transition-transform hover:scale-[1.02] duration-500">
                <div className="px-4 py-3 border-b border-[var(--color-cloud)] bg-white/80 flex items-center gap-1.5">
                   <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                   <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                   <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                   <span className="ml-2.5 text-[9px] font-bold text-[var(--color-graphite)] tracking-[0.1em] uppercase">Anomaly Detection</span>
                </div>
                <div className="p-6 flex flex-col bg-transparent">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse-badge"></span>
                         <span className="text-[10px] font-bold text-[var(--color-signal-green)] tracking-[0.1em] uppercase">Predictive Alert</span>
                      </div>
                      <span className="text-[12px] font-medium text-[var(--color-graphite)] tracking-tight">ITO Bridge</span>
                   </div>
                   
                   {/* Pixel-Perfect Flex Timeline */}
                   <div className="flex flex-col pl-1 mb-2">
                      {/* Item 1 */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center w-4 shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[var(--color-cloud)] ring-4 ring-white/95 relative z-10 shrink-0 mt-1"></div>
                          <div className="w-px h-full bg-[var(--color-cloud)] -mt-1 -mb-1"></div>
                        </div>
                        <div className="pb-6 pt-0.5">
                          <div className="text-[9px] text-[var(--color-graphite)] font-bold tracking-[0.1em] uppercase mb-1.5">10:41 AM</div>
                          <div className="text-[13px] text-[var(--color-steel-gray)] font-medium leading-snug tracking-tight">5 geo-tagged social posts report "protest"</div>
                        </div>
                      </div>
                      {/* Item 2 */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center w-4 shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[var(--color-mist)] ring-4 ring-white/95 relative z-10 shrink-0 mt-1"></div>
                          <div className="w-px h-full bg-[var(--color-cloud)] -mt-1 -mb-1"></div>
                        </div>
                        <div className="pb-6 pt-0.5">
                          <div className="text-[9px] text-[var(--color-graphite)] font-bold tracking-[0.1em] uppercase mb-1.5">10:43 AM</div>
                          <div className="text-[13px] text-[var(--color-steel-gray)] font-medium leading-snug tracking-tight">Velocity drop detected on GPS telemetry</div>
                        </div>
                      </div>
                      {/* Item 3 */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center w-4 shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-signal-green)] ring-4 ring-white/95 relative z-10 shrink-0 mt-0.5 shadow-sm"></div>
                        </div>
                        <div className="pb-2 pt-0">
                          <div className="text-[9px] font-bold text-[var(--color-signal-green)] tracking-[0.1em] uppercase mb-1.5">10:44 AM (Now)</div>
                          <div className="text-[14px] font-medium text-[var(--color-ink-black)] leading-snug tracking-tight">Cascade congestion forecasted in 22 min.</div>
                        </div>
                      </div>
                   </div>

                   {/* Pill Action */}
                   <div className="mt-4 flex items-center justify-between p-2 pl-4 border border-[var(--color-cloud)] rounded-[100px] bg-white shadow-[var(--shadow-subtle-2)]">
                      <span className="text-[13px] font-medium text-[var(--color-ink-black)] tracking-tight">Reroute active fleets</span>
                      <button className="h-8 shrink-0 px-4 rounded-full bg-[var(--color-signal-green)] text-white text-[10px] font-bold tracking-[0.05em] uppercase border-none cursor-pointer flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                         Deploy <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </button>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="flex-1 flex flex-col items-start gap-4">
            <div className="relative">
              <div 
                className="absolute -top-12 left-0 text-[var(--color-signal-green)] text-xl rotate-[-5deg] flex flex-col items-center"
                style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}
              >
                Cross-verified, not just a tweet
                <svg width="24" height="24" viewBox="0 0 30 30" fill="none" className="mt-1">
                  <path d="M5 5 Q 15 25 25 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M20 15 L 25 20 L 20 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <h2 className="text-[length:var(--text-heading-sm)] leading-[var(--leading-heading-sm)] font-medium text-[var(--color-ink-black)] max-w-[400px] m-0">
                Confidence scores that filter the noise
              </h2>
            </div>
            <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--color-steel-gray)] max-w-[400px] m-0 mt-2">
              One unverified post stays gray — Warning. When GPS anomalies and official handles corroborate it, it turns green — Confirmed. Only cross-validated events trigger detour dispatches.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="w-full aspect-[4/3] rounded-[var(--radius-product-mockup)] shadow-[var(--shadow-sm)] border border-[var(--color-cloud)] overflow-hidden flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: 'url(/feature-2-bg.png)' }}>
              
              {/* Floating UI Window */}
              <div className="w-[85%] max-w-[340px] rounded-[var(--radius-cards)] shadow-[var(--shadow-xl)] border border-white/40 overflow-hidden flex flex-col bg-white/95 backdrop-blur-md transform transition-transform hover:scale-[1.02] duration-500">
                <div className="px-4 py-3 border-b border-[var(--color-cloud)] bg-white/80 flex items-center gap-1.5">
                   <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                   <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                   <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                   <span className="ml-2.5 text-[9px] font-bold text-[var(--color-graphite)] tracking-[0.1em] uppercase">Cross-Validation</span>
                </div>
                <div className="p-6 flex flex-col gap-5 bg-transparent">
                  
                  {/* Warning Card */}
                  <div className="p-5 rounded-[var(--radius-cards)] border border-[var(--color-cloud)] bg-white/95 shadow-[var(--shadow-subtle-2)]">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-[var(--color-graphite)]"></span>
                           <span className="text-[9px] font-bold text-[var(--color-graphite)] tracking-[0.1em] uppercase">Unverified</span>
                        </div>
                        <span className="text-[12px] font-medium text-[var(--color-graphite)] tracking-tight">Lajpat Nagar</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[14px] font-medium text-[var(--color-body-charcoal)] mb-1 tracking-tight">Possible road cave-in</div>
                          <div className="text-[12px] text-[var(--color-steel-gray)] font-medium tracking-tight">1 signal. Awaiting GPS validation.</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[9px] text-[var(--color-graphite)] uppercase font-bold tracking-[0.1em] mb-1">Confidence</div>
                           <div className="text-xl font-medium text-[var(--color-graphite)] leading-none tracking-tighter">12%</div>
                        </div>
                     </div>
                  </div>

                  {/* Confirmed Card */}
                  <div className="p-5 rounded-[var(--radius-cards)] border border-[var(--color-signal-green)] bg-white shadow-[var(--shadow-sm)] relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-signal-green)]"></div>
                     <div className="flex items-center justify-between mb-4 pl-1">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse-badge"></span>
                           <span className="text-[9px] font-bold text-[var(--color-signal-green)] tracking-[0.1em] uppercase">Confirmed</span>
                        </div>
                        <span className="text-[12px] font-medium text-[var(--color-graphite)] tracking-tight">Rajpath</span>
                     </div>
                     <div className="flex justify-between items-end pl-1">
                        <div>
                          <div className="text-[14px] font-medium text-[var(--color-ink-black)] mb-2 tracking-tight">VIP Convoy Detected</div>
                          <div className="flex items-center gap-1.5">
                             <span className="px-2 py-0.5 bg-[var(--color-paper-white)] border border-[var(--color-cloud)] rounded-md text-[9px] font-bold tracking-[0.05em] text-[var(--color-graphite)]">3 SOCIAL</span>
                             <span className="text-[10px] font-medium text-[var(--color-mist)]">+</span>
                             <span className="px-2 py-0.5 bg-[var(--color-paper-white)] border border-[var(--color-cloud)] rounded-md text-[9px] font-bold tracking-[0.05em] text-[var(--color-graphite)]">GPS DROP</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[9px] text-[var(--color-graphite)] uppercase font-bold tracking-[0.1em] mb-1">Confidence</div>
                           <div className="text-3xl font-medium text-[var(--color-ink-black)] leading-none tracking-tighter">87%</div>
                        </div>
                     </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
        {/* Feature 3 - Map view */}
        <div className="flex flex-col gap-12 mt-16 pt-8">
          <div className="flex flex-col items-center text-center relative">
            <div 
              className="absolute -top-12 text-[var(--color-signal-green)] text-xl rotate-[2deg] flex flex-col items-center ml-48"
              style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}
            >
              See the whole picture
              <svg width="24" height="24" viewBox="0 0 30 30" fill="none" className="mt-0">
                <path d="M15 5 L 15 20 M 10 15 L 15 20 L 20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <h2 className="text-[length:var(--text-heading-sm)] leading-[var(--leading-heading-sm)] font-medium text-[var(--color-ink-black)] max-w-[500px] m-0 tracking-tight">
              City-wide dispatch routing
            </h2>
            <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--color-steel-gray)] max-w-[600px] m-0 mt-4">
              Switch from individual incident feeds to a comprehensive live map. 
              Track moving anomalies and monitor fleet rerouting in real time.
            </p>
          </div>
          
          <div className="w-full relative aspect-video md:aspect-[21/9] rounded-[var(--radius-product-mockup)] shadow-[var(--shadow-xl)] border border-[var(--color-cloud)] overflow-hidden bg-[var(--color-card-snow)]">
            {/* The Map Background */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/map-bg.png)' }}></div>
            
            {/* Active Route Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 500">
               {/* Original Congested Route (Red/Warning) */}
               <path d="M 300 200 L 450 300 L 600 280" fill="none" stroke="var(--color-mist)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" className="opacity-50" />
               <circle cx="600" cy="280" r="5" fill="var(--color-mist)" className="opacity-50" />
               
               {/* New Dynamic Reroute (Signal Green) */}
               <path d="M 300 200 L 400 150 L 550 180 L 650 250 L 800 220" fill="none" stroke="var(--color-signal-green)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
               <circle cx="300" cy="200" r="6" fill="white" stroke="var(--color-signal-green)" strokeWidth="3" />
               <circle cx="800" cy="220" r="7" fill="var(--color-signal-green)" className="animate-pulse" />
               <circle cx="800" cy="220" r="3" fill="white" />
            </svg>
            
            {/* Top Bar Chrome */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-[var(--color-cloud)] flex items-center px-5 justify-between">
               <div className="flex items-center gap-1.5">
                 <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                 <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
                 <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5]"></span>
               </div>
               <div className="flex items-center bg-[var(--color-paper-white)] px-4 py-1.5 rounded-full border border-[var(--color-cloud)] shadow-[var(--shadow-subtle-2)]">
                  <span className="text-[10px] font-bold text-[var(--color-graphite)] tracking-[0.1em] uppercase">Live Dispatch Map</span>
               </div>
               <div className="w-[42px]"></div> {/* Balancer for flex-between */}
            </div>

            {/* Floating UI Overlay */}
            <div className="absolute inset-0 top-14 flex items-center justify-center p-8 pointer-events-none">
               <div className="bg-white/95 backdrop-blur-md p-5 rounded-[var(--radius-cards)] shadow-[var(--shadow-sm)] border border-[var(--color-signal-green)] max-w-[280px] mt-24 ml-48 pointer-events-auto">
                  <div className="flex items-center justify-between mb-3">
                     <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-signal-green)] animate-pulse-badge"></span>
                        <span className="text-[9px] font-bold text-[var(--color-signal-green)] tracking-[0.1em] uppercase">Active Detour</span>
                     </span>
                  </div>
                  <h5 className="font-semibold text-[14px] text-[var(--color-ink-black)] tracking-tight mb-1">Convoy Routing</h5>
                  <p className="text-[12px] text-[var(--color-steel-gray)] font-medium mb-5 leading-snug">6 active fleets successfully rerouted to avoid cascading congestion.</p>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-[var(--color-graphite)] tracking-[0.05em] uppercase">
                       <span>Clearance</span>
                       <span className="text-[var(--color-signal-green)]">80%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-cloud)] rounded-full w-full overflow-hidden">
                       <div className="h-full bg-[var(--color-signal-green)] rounded-full w-[80%]"></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </section>

      {/* 5. FLOATING NAVIGATION CAPSULE — handled by Header component */}

    </div>
  );
};

