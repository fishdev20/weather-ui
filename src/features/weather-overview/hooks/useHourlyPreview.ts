import { useQuery } from '@tanstack/react-query'
import { fetchHourlyPreview } from '../../../api/openMeteo'
import type { UnitPreferences } from '../../../types/weather'

type UseHourlyPreviewInput = {
  latitude: number
  longitude: number
  units: UnitPreferences
  enabled?: boolean
}

export function useHourlyPreview({ latitude, longitude, units, enabled = true }: UseHourlyPreviewInput) {
  return useQuery({
    queryKey: ['open-meteo', 'hourly-preview', latitude, longitude, units.temperature],
    queryFn: () => fetchHourlyPreview({ latitude, longitude, units }),
    enabled,
    staleTime: 10 * 60_000,
  })
}
