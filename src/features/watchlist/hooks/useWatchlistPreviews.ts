import { useLocationPreviews } from '../../location-search/hooks/useLocationPreviews'
import type { LocationSummary } from '../../../types/location'
import type { UnitPreferences } from '../../../types/weather'

type UseWatchlistPreviewsInput = {
  locations: LocationSummary[]
  units: UnitPreferences
  enabled?: boolean
}

export function useWatchlistPreviews({
  locations,
  units,
  enabled = true,
}: UseWatchlistPreviewsInput) {
  return useLocationPreviews({
    locations,
    units,
    enabled,
    scope: 'watchlist',
  })
}
