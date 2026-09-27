import { isSameLocation, isValidCoordinate } from './locationUtils';
import { mockLocations } from '../data/mockLocations';
import { homeToOfficePreview, mockRoutes } from '../data/mockRoutes';
import type { Location } from '../types/location';
import type { RoutePreview, TravelMode, TripRoute } from '../types/trip';

export function areLocationsDistinct(origin: Location | null, destination: Location | null): boolean {
  return Boolean(origin && destination && isValidCoordinate(origin.coordinates) && isValidCoordinate(destination.coordinates) && !isSameLocation(origin, destination));
}

export function getMockRoute(origin: Location, destination: Location): TripRoute | null {
  if (!areLocationsDistinct(origin, destination)) return null;
  return mockRoutes.find((route) => route.originId === origin.id && route.destinationId === destination.id) ?? { id: `mock-${origin.id}-${destination.id}`, originId: origin.id, destinationId: destination.id, source: 'mock', description: 'Demo connection only. No road route or travel estimate is available.' };
}

/** Match IDs AND fixture coordinates, never reuse the fixture for arbitrary GPS/map points. */
export function getRoutePreview(origin: Location, destination: Location, mode: TravelMode): RoutePreview | undefined {
  if (!areLocationsDistinct(origin, destination)) return undefined;
  const fixtureOrigin = mockLocations.find((location) => location.id === origin.id);
  const fixtureDestination = mockLocations.find((location) => location.id === destination.id);
  if (!fixtureOrigin || !fixtureDestination || origin.source !== 'mock' || destination.source !== 'mock') return undefined;
  const matches = (a: Location, b: Location) => a.coordinates.latitude === b.coordinates.latitude && a.coordinates.longitude === b.coordinates.longitude;
  if (!matches(origin, fixtureOrigin) || !matches(destination, fixtureDestination)) return undefined;
  if (origin.id !== homeToOfficePreview.originId || destination.id !== homeToOfficePreview.destinationId) return undefined;
  return homeToOfficePreview.modes?.[mode];
}
