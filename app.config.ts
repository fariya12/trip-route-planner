import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const androidMapsKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
  return {
    ...config,
    name: config.name ?? 'Wayfare',
    slug: config.slug ?? 'trip-route-planner',
    plugins: [
      ...(config.plugins ?? []),
      ...(androidMapsKey ? [['react-native-maps', { androidGoogleMapsApiKey: androidMapsKey }] as [string, { androidGoogleMapsApiKey: string }]] : []),
    ],
    extra: { ...config.extra, androidMapsConfigured: Boolean(androidMapsKey) },
  };
};
