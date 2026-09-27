import type { ImageSourcePropType } from 'react-native';

export const images = {
  logo: require('./logo.png') as ImageSourcePropType,
  mapView: require('./mapview.png') as ImageSourcePropType,
} as const;
export type ImageName = keyof typeof images;
