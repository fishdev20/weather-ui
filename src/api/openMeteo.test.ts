import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_UNITS } from '../config/constants'
import {
  fetchHourlyPreview,
  fetchHourlyPreviewBatch,
  fetchWeatherOverview,
  fetchWeatherSnapshot,
  reverseGeocodeLocation,
  searchLocations,
} from './openMeteo'
import { fetchJson } from './http'

vi.mock('./http', () => ({
  fetchJson: vi.fn(),
}))

const fetchJsonMock = vi.mocked(fetchJson)

describe('openMeteo API helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:15:00.000Z'))
    fetchJsonMock.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('searchLocations trims input and maps API results', async () => {
    fetchJsonMock.mockResolvedValue({
      results: [
        {
          id: 1,
          name: 'Helsinki',
          country: 'Finland',
          admin1: 'Uusimaa',
          latitude: 60.17,
          longitude: 24.94,
          timezone: 'Europe/Helsinki',
        },
      ],
    })

    await expect(searchLocations('  helsinki  ', 3)).resolves.toEqual([
      {
        id: 1,
        name: 'Helsinki',
        country: 'Finland',
        region: 'Uusimaa',
        latitude: 60.17,
        longitude: 24.94,
        timezone: 'Europe/Helsinki',
      },
    ])

    expect(fetchJsonMock).toHaveBeenCalledWith('https://geocoding-api.open-meteo.com/v1/search', {
      name: 'helsinki',
      count: 3,
      language: 'en',
      format: 'json',
    })
  })

  it('searchLocations returns empty array when API has no results', async () => {
    fetchJsonMock.mockResolvedValue({})
    await expect(searchLocations('x')).resolves.toEqual([])
  })

  it('reverseGeocodeLocation returns null when address is missing', async () => {
    fetchJsonMock.mockResolvedValue({})

    await expect(reverseGeocodeLocation(60.17, 24.94)).resolves.toBeNull()
  })

  it('reverseGeocodeLocation derives name and falls back place_id to Date.now', async () => {
    fetchJsonMock.mockResolvedValue({
      lat: '60.175',
      lon: '24.931',
      address: {
        town: 'Helsinki',
        state: 'Uusimaa',
        country: 'Finland',
      },
    })

    await expect(reverseGeocodeLocation(1, 2)).resolves.toEqual({
      id: Date.now(),
      name: 'Helsinki',
      country: 'Finland',
      region: 'Uusimaa',
      latitude: 60.175,
      longitude: 24.931,
    })
  })

  it('fetchWeatherSnapshot maps request params and transforms response', async () => {
    fetchJsonMock.mockResolvedValue({
      timezone: 'UTC',
      current: {
        time: '2026-01-01T10:00:00Z',
        temperature_2m: 4,
        apparent_temperature: 1,
        weather_code: 3,
        wind_speed_10m: 11,
        pressure_msl: 1015,
        relative_humidity_2m: 75,
        is_day: 1,
      },
    })

    await expect(
      fetchWeatherSnapshot({ latitude: 60.17, longitude: 24.94, units: DEFAULT_UNITS }),
    ).resolves.toEqual({
      timezone: 'UTC',
      current: {
        time: '2026-01-01T10:00:00Z',
        temperature: 4,
        apparentTemperature: 1,
        weatherCode: 3,
        windSpeed: 11,
        pressure: 1015,
        humidity: 75,
        isDay: true,
      },
    })

    expect(fetchJsonMock).toHaveBeenCalledWith('https://api.open-meteo.com/v1/forecast', {
      latitude: 60.17,
      longitude: 24.94,
      current:
        'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,relative_humidity_2m,is_day',
      timezone: 'auto',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      pressure_msl_unit: 'hPa',
      visibility_unit: 'km',
    })
  })

  it('fetchHourlyPreview returns null for empty hourly data', async () => {
    fetchJsonMock.mockResolvedValue({
      timezone: 'UTC',
      hourly: {
        time: [],
        temperature_2m: [],
        weather_code: [],
        is_day: [],
      },
    })

    await expect(
      fetchHourlyPreview({ latitude: 60.17, longitude: 24.94, units: DEFAULT_UNITS }),
    ).resolves.toBeNull()
  })

  it('fetchHourlyPreview selects closest hour and maps fields', async () => {
    fetchJsonMock.mockResolvedValue({
      timezone: 'UTC',
      hourly: {
        time: ['2026-01-01T09:00:00Z', '2026-01-01T10:00:00Z', '2026-01-01T11:00:00Z'],
        temperature_2m: [1, 2, 3],
        weather_code: [45, 46, 47],
        is_day: [0, 1, 0],
      },
    })

    await expect(
      fetchHourlyPreview({ latitude: 60.17, longitude: 24.94, units: DEFAULT_UNITS }),
    ).resolves.toEqual({
      time: '2026-01-01T10:00:00Z',
      displayTime: '10:15',
      temperature: 2,
      weatherCode: 46,
      isDay: true,
    })
  })

  it('fetchHourlyPreviewBatch short-circuits empty input', async () => {
    await expect(fetchHourlyPreviewBatch({ locations: [], units: DEFAULT_UNITS })).resolves.toEqual({})
    expect(fetchJsonMock).not.toHaveBeenCalled()
  })

  it('fetchHourlyPreviewBatch maps payloads to location ids and handles missing payload', async () => {
    fetchJsonMock.mockResolvedValue([
      {
        timezone: 'UTC',
        hourly: {
          time: ['2026-01-01T10:00:00Z'],
          temperature_2m: [2],
          weather_code: [1],
          is_day: [1],
        },
      },
    ])

    const locations = [
      { id: 100, name: 'A', latitude: 1, longitude: 2 },
      { id: 200, name: 'B', latitude: 3, longitude: 4 },
    ]

    await expect(fetchHourlyPreviewBatch({ locations, units: DEFAULT_UNITS })).resolves.toEqual({
      100: {
        time: '2026-01-01T10:00:00Z',
        displayTime: '10:15',
        temperature: 2,
        weatherCode: 1,
        isDay: true,
      },
      200: null,
    })

    expect(fetchJsonMock).toHaveBeenCalledWith('https://api.open-meteo.com/v1/forecast', {
      latitude: '1,3',
      longitude: '2,4',
      hourly: 'temperature_2m,weather_code,is_day',
      forecast_days: 1,
      timezone: 'auto',
      temperature_unit: 'celsius',
    })
  })

  it('fetchWeatherOverview maps weather, hourly, and daily sections', async () => {
    fetchJsonMock.mockResolvedValue({
      timezone: 'UTC',
      current: {
        time: '2026-01-01T10:00:00Z',
        temperature_2m: 5,
        apparent_temperature: 2,
        weather_code: 3,
        wind_speed_10m: 11,
        wind_gusts_10m: 22,
        pressure_msl: 1013,
        relative_humidity_2m: 70,
        is_day: 1,
        precipitation: 1,
        rain: 0.5,
        showers: 0,
        snowfall: 0,
        uv_index: 1,
        visibility: 8,
      },
      hourly: {
        time: [
          '2026-01-01T09:00:00Z',
          '2026-01-01T10:00:00Z',
          '2026-01-01T11:00:00Z',
          '2026-01-02T01:00:00Z',
        ],
        temperature_2m: [1, 2, 3, 4],
        uv_index: [0, 2, 3, 4],
        weather_code: [10, 20, 30, 40],
        is_day: [0, 1, 1, 0],
        relative_humidity_2m: [60, 61, 62, 63],
        wind_speed_10m: [7, 8, 9, 10],
        pressure_msl: [1000, 1001, 1002, 1003],
        visibility: [5, 6, 7, 8],
      },
      daily: {
        time: ['2026-01-01', '2026-01-02'],
        temperature_2m_max: [6, 7],
        temperature_2m_min: [-1, 0],
        precipitation_probability_max: [40, 50],
        weather_code: [55, 66],
        sunrise: ['2026-01-01T08:00:00Z', '2026-01-02T08:10:00Z'],
        sunset: ['2026-01-01T16:00:00Z', '2026-01-02T15:50:00Z'],
      },
    })

    const result = await fetchWeatherOverview({ latitude: 60.17, longitude: 24.94, units: DEFAULT_UNITS })

    expect(result.timezone).toBe('UTC')
    expect(result.localTime).toBe('10:15')
    expect(result.current).toEqual({
      temperature: 5,
      apparentTemperature: 2,
      weatherCode: 3,
      windSpeed: 11,
      windGust: 22,
      pressure: 1013,
      humidity: 70,
      visibility: 8,
      uvIndex: 1,
      precipitation: 1,
      rain: 0.5,
      showers: 0,
      snowfall: 0,
      isDay: true,
    })
    expect(result.daily).toEqual({
      high: 6,
      low: -1,
      precipitationChance: 40,
      sunrise: '08:00',
      sunset: '16:00',
    })

    expect(result.uvIndexMax24h).toBe(4)
    expect(result.hourlyTrend24h).toEqual([
      {
        time: '2026-01-01T10:00:00Z',
        label: '10:00',
        temperature: 2,
        weatherCode: 20,
        isDay: true,
      },
      {
        time: '2026-01-01T11:00:00Z',
        label: '11:00',
        temperature: 3,
        weatherCode: 30,
        isDay: true,
      },
      {
        time: '2026-01-02T01:00:00Z',
        label: '01:00',
        temperature: 4,
        weatherCode: 40,
        isDay: false,
      },
    ])

    expect(result.hourlyByDate['2026-01-01']).toHaveLength(3)
    expect(result.hourlyByDate['2026-01-02']).toHaveLength(1)
    expect(result.hourlyByDate['2026-01-02'][0]).toEqual({
      time: '2026-01-02T01:00:00Z',
      label: '01:00',
      temperature: 4,
      uvIndex: 4,
      humidity: 63,
      windSpeed: 10,
      pressure: 1003,
      visibility: 8,
    })

    expect(result.tenDayForecast).toEqual([
      {
        date: '2026-01-01',
        dayLabel: 'Today',
        min: -1,
        max: 6,
        weatherCode: 55,
        precipitationChance: 40,
        sunrise: '08:00',
        sunset: '16:00',
      },
      {
        date: '2026-01-02',
        dayLabel: 'Fri',
        min: 0,
        max: 7,
        weatherCode: 66,
        precipitationChance: 50,
        sunrise: '08:10',
        sunset: '15:50',
      },
    ])
  })
})
