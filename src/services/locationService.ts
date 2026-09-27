import { coordinateLocation } from '../utils/locationUtils';
import { mockLocations } from '../data/mockLocations';
import type { Location } from '../types/location';

export function searchLocations(query: string): readonly Location[] {
  const normalized = query.trim().toLowerCase();
  return mockLocations.filter((location) =>
    `${location.name} ${location.address}`.toLowerCase().includes(normalized),
  );
}

// Imported only by mobile screens. No geocoding or external location service.
export async function getCurrentLocation(): Promise<Location> {
  const DeviceLocation = await import('expo-location');
  const permission = await DeviceLocation.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error(permission.canAskAgain
      ? 'Location permission was denied. Try again or pick a point on the map.'
      : 'Location permission is disabled. Enable it in device settings or pick a point on the map.');
  }
  if (!await DeviceLocation.hasServicesEnabledAsync()) {
    throw new Error('Location services are off. Enable them in device settings and try again.');
  }
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const position = await Promise.race([
      DeviceLocation.getCurrentPositionAsync({ accuracy: DeviceLocation.Accuracy.Balanced }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Finding your location timed out. Please try again or pick on map.')), 15000);
      }),
    ]);
    return coordinateLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }, 'device');
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
