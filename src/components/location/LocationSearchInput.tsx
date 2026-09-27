import { useState } from 'react';
import { Text, View } from 'react-native';
import { AppInput } from '../common/AppInput';
import { LocationCard } from './LocationCard';
import { searchLocations } from '../../services/locationService';
import type { Location } from '../../types/location';
import { spacing } from '../../constants/spacing';

interface Props { label: string; selected: Location | null; excludedId?: string; onSelect: (location: Location) => void }
export function LocationSearchInput({ label, selected, excludedId, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const results = searchLocations(query);
  return <View style={{ gap: spacing.sm }}>
    <AppInput label={label} value={query} onChangeText={setQuery} placeholder="Search demo locations" autoCorrect={false} />
    <Text>{selected ? `Selected: ${selected.name}` : 'Choose a location below'}</Text>
    {results.map((location) => <LocationCard key={location.id} location={location} selected={selected?.id === location.id} disabled={excludedId === location.id} onPress={() => onSelect(location)} />)}
    {results.length === 0 ? <Text accessibilityLiveRegion="polite">No demo locations found.</Text> : null}
  </View>;
}
