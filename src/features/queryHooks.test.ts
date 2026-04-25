import { describe, expect, it, vi } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import {
  fetchHourlyPreview,
  fetchHourlyPreviewBatch,
  fetchWeatherOverview,
  fetchWeatherSnapshot,
  reverseGeocodeLocation,
  searchLocations,
} from '../api/openMeteo'
import { useLocationPreviews } from './location-search/hooks/useLocationPreviews'
import { useLocationSearch } from './location-search/hooks/useLocationSearch'
import { useReverseGeocodeLocation } from './location-search/hooks/useReverseGeocodeLocation'
import { useHourlyPreview } from './weather-overview/hooks/useHourlyPreview'
import { useWeatherOverview } from './weather-overview/hooks/useWeatherOverview'
import { useWeatherSnapshot } from './weather-overview/hooks/useWeatherSnapshot'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn((options) => options),
}))

vi.mock('../api/openMeteo', () => ({
  searchLocations: vi.fn(),
  reverseGeocodeLocation: vi.fn(),
  fetchHourlyPreviewBatch: vi.fn(),
  fetchHourlyPreview: vi.fn(),
  fetchWeatherSnapshot: vi.fn(),
  fetchWeatherOverview: vi.fn(),
}))

const useQueryMock = vi.mocked(useQuery)
const searchLocationsMock = vi.mocked(searchLocations)
const reverseGeocodeLocationMock = vi.mocked(reverseGeocodeLocation)
const fetchHourlyPreviewBatchMock = vi.mocked(fetchHourlyPreviewBatch)
const fetchHourlyPreviewMock = vi.mocked(fetchHourlyPreview)
const fetchWeatherSnapshotMock = vi.mocked(fetchWeatherSnapshot)
const fetchWeatherOverviewMock = vi.mocked(fetchWeatherOverview)

const units = {
  temperature: 'celsius' as const,
  windSpeed: 'kmh' as const,
  precipitation: 'mm' as const,
  pressure: 'hpa' as const,
  distance: 'km' as const,
}

function getLastQueryOptions() {
  const call = useQueryMock.mock.calls.at(-1)
  expect(call).toBeDefined()
  return call![0]
}

async function runQueryFn(options: ReturnType<typeof getLastQueryOptions>) {
  expect(typeof options.queryFn).toBe('function')
  const queryFn = options.queryFn as (context?: unknown) => Promise<unknown>
  return queryFn()
}

describe('query hook wrappers', () => {
  beforeEach(() => {
    useQueryMock.mockClear()
  })

  it('useLocationSearch normalizes query and enables only 2+ chars', async () => {
    useLocationSearch('  he  ')
    const result = getLastQueryOptions()

    expect(result.queryKey).toEqual(['open-meteo', 'location-search', 'he'])
    expect(result.enabled).toBe(true)

    searchLocationsMock.mockResolvedValue([])
    await runQueryFn(result)
    expect(searchLocationsMock).toHaveBeenCalledWith('he')

    useLocationSearch(' h ')
    const disabledResult = getLastQueryOptions()
    expect(disabledResult.enabled).toBe(false)
  })

  it('useLocationPreviews builds stable key and guarded enabled flag', async () => {
    useLocationPreviews({
      locations: [
        { id: 1, name: 'A', latitude: 1, longitude: 2 },
        { id: 2, name: 'B', latitude: 3, longitude: 4 },
      ],
      units,
      scope: 'watchlist',
    })
    const result = getLastQueryOptions()

    expect(result.queryKey).toEqual([
      'open-meteo',
      'hourly-preview-batch',
      'watchlist',
      'celsius',
      '1:1:2|2:3:4',
    ])
    expect(result.enabled).toBe(true)

    fetchHourlyPreviewBatchMock.mockResolvedValue({})
    await runQueryFn(result)
    expect(fetchHourlyPreviewBatchMock).toHaveBeenCalledWith({
      locations: [
        { id: 1, name: 'A', latitude: 1, longitude: 2 },
        { id: 2, name: 'B', latitude: 3, longitude: 4 },
      ],
      units,
    })

    useLocationPreviews({
      locations: [],
      units,
      scope: 'recent-searches',
      enabled: false,
    })
    const disabled = getLastQueryOptions()
    expect(disabled.enabled).toBe(false)
  })

  it('useReverseGeocodeLocation requires numeric coords and forwards queryFn args', async () => {
    useReverseGeocodeLocation(60.17, 24.94)
    const result = getLastQueryOptions()
    expect(result.enabled).toBe(true)
    expect(result.queryKey).toEqual(['open-meteo', 'reverse-geocode', 60.17, 24.94])

    reverseGeocodeLocationMock.mockResolvedValue(null)
    await runQueryFn(result)
    expect(reverseGeocodeLocationMock).toHaveBeenCalledWith(60.17, 24.94)

    useReverseGeocodeLocation(undefined, 24.94)
    const disabled = getLastQueryOptions()
    expect(disabled.enabled).toBe(false)
  })

  it('useHourlyPreview forwards params and explicit enabled flag', async () => {
    useHourlyPreview({ latitude: 1, longitude: 2, units, enabled: false })
    const result = getLastQueryOptions()
    expect(result.enabled).toBe(false)
    expect(result.queryKey).toEqual(['open-meteo', 'hourly-preview', 1, 2, 'celsius'])

    fetchHourlyPreviewMock.mockResolvedValue(null)
    await runQueryFn(result)
    expect(fetchHourlyPreviewMock).toHaveBeenCalledWith({ latitude: 1, longitude: 2, units })
  })

  it('useWeatherSnapshot and useWeatherOverview guard missing coordinates', async () => {
    useWeatherSnapshot({ latitude: 1, longitude: 2, units })
    const snapshot = getLastQueryOptions()
    expect(snapshot.enabled).toBe(true)

    fetchWeatherSnapshotMock.mockResolvedValue({ timezone: 'UTC', current: {} as never })
    await runQueryFn(snapshot)
    expect(fetchWeatherSnapshotMock).toHaveBeenCalledWith({ latitude: 1, longitude: 2, units })

    useWeatherSnapshot({ latitude: undefined, longitude: 2, units })
    const disabledSnapshot = getLastQueryOptions()
    expect(disabledSnapshot.enabled).toBe(false)

    useWeatherOverview({ latitude: 5, longitude: 6, units })
    const overview = getLastQueryOptions()
    expect(overview.enabled).toBe(true)

    fetchWeatherOverviewMock.mockResolvedValue({} as never)
    await runQueryFn(overview)
    expect(fetchWeatherOverviewMock).toHaveBeenCalledWith({ latitude: 5, longitude: 6, units })

    useWeatherOverview({ latitude: 5, longitude: undefined, units })
    const disabledOverview = getLastQueryOptions()
    expect(disabledOverview.enabled).toBe(false)
  })

  it('calls useQuery for each hook', () => {
    useLocationSearch('he')
    useLocationPreviews({ locations: [], units, scope: 'watchlist' })
    useReverseGeocodeLocation(1, 2)
    useHourlyPreview({ latitude: 1, longitude: 2, units })
    useWeatherSnapshot({ latitude: 1, longitude: 2, units })
    useWeatherOverview({ latitude: 1, longitude: 2, units })

    expect(useQueryMock).toHaveBeenCalledTimes(6)
  })
})
