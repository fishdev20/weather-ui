import { useQuery } from '@tanstack/react-query'
import { reverseGeocodeLocation } from '../../../api/openMeteo'

export function useReverseGeocodeLocation(latitude?: number, longitude?: number, enabled = true) {
  return useQuery({
    queryKey: ['open-meteo', 'reverse-geocode', latitude, longitude],
    queryFn: () => reverseGeocodeLocation(latitude as number, longitude as number),
    enabled: enabled && typeof latitude === 'number' && typeof longitude === 'number',
    staleTime: 60 * 60_000,
  })
}
