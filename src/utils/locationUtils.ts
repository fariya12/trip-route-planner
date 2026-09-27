import type { Coordinates, Location } from '../types/location';

export function isValidCoordinate(point: Coordinates | null | undefined): point is Coordinates {
  if (!point) return false;
  return Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
    && Math.abs(point.latitude) <= 90 && Math.abs(point.longitude) <= 180;
}

export function isSameLocation(a: Location | null, b: Location | null): boolean {
  if (!a || !b) return false;
  // Treat points within roughly a metre as identical, including device/map duplicates.
  return a.id === b.id || (Math.abs(a.coordinates.latitude - b.coordinates.latitude) < 0.00001
    && Math.abs(a.coordinates.longitude - b.coordinates.longitude) < 0.00001);
}

export function coordinateLocation(coordinates: Coordinates, source: 'device' | 'map'): Location {
  return {
    id: `point:${coordinates.latitude.toFixed(5)},${coordinates.longitude.toFixed(5)}`,
    name: source === 'device' ? 'Current location' : 'Pinned location',
    address: `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`,
    coordinates, source,
  };
}
