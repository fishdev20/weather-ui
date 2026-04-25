import { useQuery } from '@tanstack/react-query'
import { searchLocations } from '../../../api/openMeteo'

export function useLocationSearch(query: string) {
  const normalizedQuery = query.trim()

  return useQuery({
    queryKey: ['open-meteo', 'location-search', normalizedQuery],
    queryFn: () => searchLocations(normalizedQuery),
    enabled: normalizedQuery.length >= 2,
    staleTime: 5 * 60_000,
  })
}
