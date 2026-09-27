import { SvgXml } from 'react-native-svg';
import { svgIcons, type SvgIconName } from '../../assets';

export function TripIcon({ name, size = 40 }: { name: SvgIconName; size?: number }) {
  return <SvgXml xml={svgIcons[name]} width={size} height={size} />;
}
