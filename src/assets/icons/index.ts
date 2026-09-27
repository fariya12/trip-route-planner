import type { ImageSourcePropType } from 'react-native';
import { svgIcons } from './svgIcons';

export const icons = {
  currentLocation: require('./pinmap.png') as ImageSourcePropType,
  map: require('./layers.png') as ImageSourcePropType,
  visible: require('./visible.png') as ImageSourcePropType,
} as const;
export { svgIcons };
export type IconName = keyof typeof icons;
export type SvgIconName = keyof typeof svgIcons;
