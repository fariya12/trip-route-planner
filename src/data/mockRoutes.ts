import type { TripRoute } from '../types/trip';
import { mockLocations } from './mockLocations';

// Static demo connections for every ordered pair. No distance, ETA or road geometry.
export const mockRoutes: readonly TripRoute[] = mockLocations.flatMap((origin) =>
  mockLocations.filter((destination) => destination.id !== origin.id).map((destination) => ({
    id: `mock-${origin.id}-${destination.id}`,
    originId: origin.id,
    destinationId: destination.id,
    source: 'mock' as const,
    description: 'Demo connection only. No road route or travel estimate is available.',
  })),
);

// Hand-authored fictional fixture for Home -> Marina Office Tower ONLY.
// Geometry, instructions and estimates illustrate UI, not verified roads or live traffic.
export const homeToOfficePreview: TripRoute = {
  id: 'mock-home-office-preview', originId: 'home', destinationId: 'office', source: 'mock',
  description: 'Illustrative mock route. Roads, estimates and traffic are not live or verified.',
  modes: {
    drive: {
      durationMinutes: 24, distanceKm: 9.6,
      coordinates: [{ latitude: 25.33, longitude: 51.52 }, { latitude: 25.334, longitude: 51.52 }, { latitude: 25.334, longitude: 51.53 }, { latitude: 25.38, longitude: 51.53 }, { latitude: 25.40, longitude: 51.51 }, { latitude: 25.41, longitude: 51.51 }],
      trafficWarning: 'Heavy traffic near the marina',
      steps: [
        { direction: 'straight', instruction: 'Head north on Street 840', description: 'Keep right past the service road', distance: '450 m' },
        { direction: 'right', instruction: 'Turn right onto Al Istiqlal St', description: 'Moderate traffic near the roundabout', distance: '1.8 km' },
        { direction: 'left', instruction: 'Continue toward Lusail Marina', description: 'Follow the demo route toward the marina', distance: '7.35 km' },
        { direction: 'arrive', instruction: 'Arrive at Marina Office Tower', description: 'Demo destination · Level 14, Al Fardan Rd', distance: '0 m' },
      ],
    },
    ride: {
      durationMinutes: 28, distanceKm: 10.2,
      coordinates: [{ latitude: 25.33, longitude: 51.52 }, { latitude: 25.336, longitude: 51.52 }, { latitude: 25.336, longitude: 51.525 }, { latitude: 25.37, longitude: 51.525 }, { latitude: 25.395, longitude: 51.515 }, { latitude: 25.41, longitude: 51.515 }, { latitude: 25.41, longitude: 51.51 }],
      steps: [
        { direction: 'straight', instruction: 'Leave the pickup area', description: 'Demo ride via the service-road connection', distance: '600 m' },
        { direction: 'right', instruction: 'Take the marina approach', description: 'Illustrative ride route; not verified roads', distance: '8.9 km' },
        { direction: 'left', instruction: 'Enter the drop-off area', description: 'Continue to Marina Office Tower', distance: '700 m' },
        { direction: 'arrive', instruction: 'Arrive at Marina Office Tower', description: 'End of the ride demo', distance: '0 m' },
      ],
    },
    walk: {
      durationMinutes: 118, distanceKm: 9.1,
      coordinates: [{ latitude: 25.33, longitude: 51.52 }, { latitude: 25.35, longitude: 51.52 }, { latitude: 25.35, longitude: 51.515 }, { latitude: 25.39, longitude: 51.515 }, { latitude: 25.39, longitude: 51.51 }, { latitude: 25.41, longitude: 51.51 }],
      steps: [
        { direction: 'straight', instruction: 'Head toward the marina', description: 'Fictional walking example, not a verified footpath', distance: '2.3 km' },
        { direction: 'left', instruction: 'Follow the demo connection', description: 'Do not use this fixture for real walking guidance', distance: '4.6 km' },
        { direction: 'straight', instruction: 'Continue to the destination', description: 'Approach Marina Office Tower', distance: '2.2 km' },
        { direction: 'arrive', instruction: 'Arrive at Marina Office Tower', description: 'End of the walking demo', distance: '0 m' },
      ],
    },
  },
};
