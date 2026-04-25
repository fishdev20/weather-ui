import { useQuery } from '@tanstack/react-query'
import { fetchHourlyPreviewBatch } from '../../../api/openMeteo'
import type { LocationSummary } from '../../../types/location'
import type { UnitPreferences } from '../../../types/weather'

type UseLocationPreviewsInput = {
  locations: LocationSummary[]
  units: UnitPreferences
  enabled?: boolean
  scope: 'recent-searches' | 'watchlist'
}

export function useLocationPreviews({
  locations,
  units,
  enabled = true,
  scope,
}: UseLocationPreviewsInput) {
  return useQuery({
    queryKey: [
      'open-meteo',
      'hourly-preview-batch',
      scope,
      units.temperature,
      locations.map((location) => `${location.id}:${location.latitude}:${location.longitude}`).join('|'),
    ],
    queryFn: () =>
      fetchHourlyPreviewBatch({
        locations,
        units,
      }),
    enabled: enabled && locations.length > 0,
    staleTime: 10 * 60_000,
  })
}
