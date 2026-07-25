import React from 'react';
import { NavTab } from '../types';
import { Radio, Loader2, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userLocation?: { lat: number; lng: number; name?: string } | null;
  onGetUserLocation?: () => void;
  isLocating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userLocation,
  onGetUserLocation,
  isLocating,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'planner', label: 'Planner' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'about-ai', label: 'About AI' },
    { id: 'documentation', label: 'Docs' },
  ];

  return (
    <header className="w-full flex justify-center pt-6 pb-2 z-50 shrink-0">
      <div className="bg-[var(--color-card-snow)] rounded-[var(--radius-nav-capsule)] shadow-[var(--shadow-sm)] px-6 py-3 flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar w-[max-content] max-w-[90vw]">
        {/* Logo Icon */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="cursor-pointer flex items-center justify-center text-[var(--color-ink-black)] hover:text-[var(--color-signal-green)] transition-colors shrink-0"
        >
          <Radio className="w-5 h-5" />
        </div>

        {/* Desktop Navigation (Ghost text links) */}
        <nav className="flex items-center gap-4 shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-[14px] transition-colors whitespace-nowrap px-2 py-1 rounded-[100px] ${
                  isActive
                    ? 'font-medium text-[var(--color-signal-green)]'
                    : 'font-normal text-[var(--color-body-charcoal)] hover:text-[var(--color-ink-black)] bg-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button (Outline) — live GPS fix */}
        {onGetUserLocation && (
          <button
            onClick={onGetUserLocation}
            disabled={isLocating}
            title={userLocation ? `Location: ${userLocation.name || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}` : 'Locate my position'}
            className={`shrink-0 flex items-center gap-2 bg-transparent border rounded-[var(--radius-buttons)] px-4 py-2 text-[14px] font-medium transition-colors whitespace-nowrap disabled:opacity-60 ${
              userLocation
                ? 'border-[var(--color-signal-green)] text-[var(--color-signal-green)]'
                : 'border-[var(--color-body-charcoal)] text-[var(--color-body-charcoal)] hover:bg-[var(--color-cloud)]'
            }`}
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            <span className="truncate max-w-[130px]">
              {isLocating ? 'Locating' : userLocation ? (userLocation.name || 'Located') : 'Locate Me'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
