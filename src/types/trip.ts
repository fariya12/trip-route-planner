import type { Coordinates, Location } from './location';

export type TravelMode = 'drive' | 'ride' | 'walk';
export interface RouteStep {
  readonly instruction: string;
  readonly description: string;
  readonly distance: string;
  readonly direction: 'straight' | 'right' | 'left' | 'arrive';
}
export interface RoutePreview {
  readonly durationMinutes: number;
  readonly distanceKm: number;
  readonly coordinates: Coordinates[];
  readonly steps: readonly RouteStep[];
  readonly trafficWarning?: string;
}

export interface TripRoute {
  readonly id: string;
  readonly originId: string;
  readonly destinationId: string;
  readonly source: 'mock';
  readonly description: string;
  readonly modes?: Partial<Record<TravelMode, RoutePreview>>;
}

export interface TripState {
  origin: Location | null;
  destination: Location | null;
  route: TripRoute | null;
}
