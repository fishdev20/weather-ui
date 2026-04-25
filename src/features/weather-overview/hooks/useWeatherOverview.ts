import { useQuery } from '@tanstack/react-query'
import { fetchWeatherOverview } from '../../../api/openMeteo'
import type { UnitPreferences } from '../../../types/weather'

type UseWeatherOverviewInput = {
  latitude?: number
  longitude?: number
  units: UnitPreferences
}

export function useWeatherOverview({ latitude, longitude, units }: UseWeatherOverviewInput) {
  return useQuery({
    queryKey: ['open-meteo', 'weather-overview', latitude, longitude, units],
    queryFn: () =>
      fetchWeatherOverview({
        latitude: latitude as number,
        longitude: longitude as number,
        units,
      }),
    enabled: typeof latitude === 'number' && typeof longitude === 'number',
    staleTime: 2 * 60_000,
  })
}
