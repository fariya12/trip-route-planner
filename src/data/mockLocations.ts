import type { Location } from '../types/location';

// Approximate MOCK demo positions around Doha, NOT verified address/building coordinates.
// Do not use these points for real navigation, deliveries or geocoding.
export const mockLocations: readonly Location[] = [
  { id: 'home', name: 'Home', address: 'Villa 12, Street 840, Zone 61 · West Bay', coordinates: { latitude: 25.33, longitude: 51.52 }, source: 'mock', icon: 'home' },
  { id: 'office', name: 'Marina Office Tower', address: 'Level 14, Al Fardan Rd · Lusail Marina', coordinates: { latitude: 25.41, longitude: 51.51 }, source: 'mock', icon: 'home' },
  { id: 'ferry', name: 'Corniche Ferry Terminal', address: 'Gate 3, Corniche Promenade', coordinates: { latitude: 25.30, longitude: 51.54 }, source: 'mock', icon: 'location' },
  { id: 'metro', name: 'Msheireb Metro Station', address: 'Al Kahraba St · Msheireb Downtown', coordinates: { latitude: 25.28, longitude: 51.53 }, source: 'mock', icon: 'location' },
  { id: 'airport', name: 'Hamad International Airport', address: 'Doha · Qatar', coordinates: { latitude: 25.26, longitude: 51.61 }, source: 'mock', icon: 'location' },
];
