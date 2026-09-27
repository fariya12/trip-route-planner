export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}
export interface Location {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly coordinates: Coordinates;
  readonly source: 'mock' | 'device' | 'map';
  readonly icon?: 'home' | 'location';
}
