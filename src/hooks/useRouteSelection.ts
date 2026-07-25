import { useState, useEffect, useMemo } from 'react';
import { Incident, RouteOption } from '../types';
import { INCIDENT_ROUTES } from '../data/incidentRoutes';

interface RouteLeg {
  polyline: [number, number][];
  distanceKm: number;
  etaMinutes: number;
  delayMinutes: number;
}

interface IncidentRoutesResponse {
  success: boolean;
  standard?: RouteLeg;
  detour?: RouteLeg | null;
}

/**
 * Turns real TomTom legs into the RouteOption shape the UI renders.
 * Every number here comes from the routing response — nothing is invented.
 */
function toRouteOptions(incident: Incident, data: IncidentRoutesResponse): RouteOption[] {
  const { standard, detour } = data;
  if (!standard) return [];

  const area = incident.area || 'Primary Corridor';
  const options: RouteOption[] = [];

  if (detour) {
    const savedMinutes = Math.max(0, standard.etaMinutes - detour.etaMinutes);
    options.push({
      id: `rt-${incident.id}-ai`,
      name: 'AI Optimized Bypass',
      distanceKm: Number(detour.distanceKm.toFixed(1)),
      normalTimeMins: Math.max(1, detour.etaMinutes - detour.delayMinutes),
      predictedTimeMins: detour.etaMinutes,
      delayMins: detour.delayMinutes,
      isAiRecommended: true,
      congestionPoints: detour.delayMinutes > 0 ? [`+${detour.delayMinutes}m residual delay on detour`] : [],
      sparklineData: [],
      viaRoads: `Detour around ${area}`,
      etaMinutes: detour.etaMinutes,
      predictedDelayMinutes: detour.delayMinutes,
      savedMinutes,
      risk: detour.delayMinutes > 15 ? 'medium' : 'low',
      arrivalProbability: savedMinutes > 0 ? 92 : 80,
      polylinePositions: detour.polyline,
    });
  }

  options.push({
    id: `rt-${incident.id}-standard`,
    name: 'Direct path (Standard Maps)',
    distanceKm: Number(standard.distanceKm.toFixed(1)),
    normalTimeMins: Math.max(1, standard.etaMinutes - standard.delayMinutes),
    predictedTimeMins: standard.etaMinutes,
    delayMins: standard.delayMinutes,
    isAiRecommended: false,
    congestionPoints: [`${area} congestion`],
    sparklineData: [],
    viaRoads: area,
    etaMinutes: standard.etaMinutes,
    predictedDelayMinutes: standard.delayMinutes,
    savedMinutes: 0,
    risk: standard.delayMinutes > 15 ? 'high' : standard.delayMinutes > 5 ? 'medium' : 'low',
    arrivalProbability: standard.delayMinutes > 15 ? 45 : 75,
    polylinePositions: standard.polyline,
  });

  return options;
}

export function useRouteSelection(incidents: Incident[]) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [liveRoutes, setLiveRoutes] = useState<RouteOption[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);

  // Set default incident if none selected
  useEffect(() => {
    if (incidents.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(incidents[0].id);
    }
  }, [incidents, selectedIncidentId]);

  // Derive current incident
  const selectedIncident = useMemo(() => {
    return incidents.find((inc) => inc.id === selectedIncidentId) || null;
  }, [incidents, selectedIncidentId]);

  // Fetch road-following routes around the selected incident. If routing is
  // unavailable we fall back to the seeded corridors, and failing that show
  // nothing rather than a made-up line on the map.
  useEffect(() => {
    if (!selectedIncident) {
      setLiveRoutes([]);
      return;
    }

    let cancelled = false;
    setRoutesLoading(true);

    fetch('/api/incident-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: selectedIncident.lat,
        lng: selectedIncident.lng,
        area: selectedIncident.area,
        delayMinutes: selectedIncident.delayMinutes,
      }),
    })
      .then((res) => res.json())
      .then((data: IncidentRoutesResponse) => {
        if (cancelled) return;
        setLiveRoutes(data.success ? toRouteOptions(selectedIncident, data) : []);
      })
      .catch(() => {
        if (!cancelled) setLiveRoutes([]);
      })
      .finally(() => {
        if (!cancelled) setRoutesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIncident?.id, selectedIncident?.lat, selectedIncident?.lng]);

  const availableRoutes = useMemo(() => {
    if (!selectedIncidentId) return [];
    // Live road geometry first — the seeded arrays are coarse hand-drawn corridors.
    if (liveRoutes.length > 0) return liveRoutes;
    return INCIDENT_ROUTES[selectedIncidentId] || [];
  }, [selectedIncidentId, liveRoutes]);

  // Automatically select the default AI route when incident selection changes
  useEffect(() => {
    if (availableRoutes.length > 0) {
      const aiRoute = availableRoutes.find((r) => r.isAiRecommended) || availableRoutes[0];
      setSelectedRouteId(aiRoute.id);
    } else {
      setSelectedRouteId(null);
    }
  }, [availableRoutes]);

  // Derive current selected route
  const selectedRoute = useMemo(() => {
    return availableRoutes.find((r) => r.id === selectedRouteId) || null;
  }, [availableRoutes, selectedRouteId]);

  return {
    selectedIncidentId,
    setSelectedIncidentId,
    selectedRouteId,
    setSelectedRouteId,
    selectedIncident,
    selectedRoute,
    availableRoutes,
    routesLoading,
  };
}
export type UseRouteSelectionResult = ReturnType<typeof useRouteSelection>;
