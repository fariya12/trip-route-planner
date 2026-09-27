import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import type { Location } from '../types/location';
import type { TripRoute, TripState } from '../types/trip';

import { isSameLocation, isValidCoordinate } from '../utils/locationUtils';

interface TripContextValue extends TripState {
  setOrigin: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  setRoute: (route: TripRoute | null) => void;
  resetTrip: () => void;
  swapLocations: () => void;
}

const emptyTrip: TripState = { origin: null, destination: null, route: null };
export const TripContext = createContext<TripContextValue | undefined>(undefined);

export function TripProvider({ children }: PropsWithChildren) {
  const [trip, setTrip] = useState<TripState>(emptyTrip);
  const setOrigin = useCallback((origin: Location | null) => {
    setTrip((current) => origin && (!isValidCoordinate(origin.coordinates) || isSameLocation(origin, current.destination)) ? current : { ...current, origin, route: null });
  }, []);
  const setDestination = useCallback((destination: Location | null) => {
    setTrip((current) => destination && (!isValidCoordinate(destination.coordinates) || isSameLocation(destination, current.origin)) ? current : { ...current, destination, route: null });
  }, []);
  const setRoute = useCallback((route: TripRoute | null) => {
    setTrip((current) => {
      if (route && (route.originId !== current.origin?.id || route.destinationId !== current.destination?.id)) return current;
      return { ...current, route };
    });
  }, []);
  const swapLocations = useCallback(() => setTrip((current) => ({ origin: current.destination, destination: current.origin, route: null })), []);
  const resetTrip = useCallback(() => setTrip(emptyTrip), []);
  const value = useMemo(() => ({ ...trip, setOrigin, setDestination, setRoute, resetTrip, swapLocations }), [trip, setOrigin, setDestination, setRoute, resetTrip, swapLocations]);
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}
