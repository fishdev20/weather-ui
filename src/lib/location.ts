import type { LocationSummary } from '../types/location'

export function locationLabel(location: LocationSummary): string {
  return [location.name, location.region, location.country].filter(Boolean).join(', ')
}
