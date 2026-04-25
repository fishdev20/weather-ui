import { useQuery } from '@tanstack/react-query'
import { fetchWeatherSnapshot } from '../../../api/openMeteo'
import type { UnitPreferences } from '../../../types/weather'

type UseWeatherSnapshotInput = {
  latitude?: number
  longitude?: number
  units: UnitPreferences
}

export function useWeatherSnapshot({ latitude, longitude, units }: UseWeatherSnapshotInput) {
  return useQuery({
    queryKey: ['open-meteo', 'weather-snapshot', latitude, longitude, units],
    queryFn: () =>
      fetchWeatherSnapshot({
        latitude: latitude as number,
        longitude: longitude as number,
        units,
      }),
    enabled: typeof latitude === 'number' && typeof longitude === 'number',
    staleTime: 2 * 60_000,
  })
}
