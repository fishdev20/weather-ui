import type { LocationSummary, OpenMeteoGeocodeResponse } from '../types/location'
import type {
  ApiUnitParams,
  DayHourlyPoint,
  HourlyForecastPoint,
  OpenMeteoCurrentResponse,
  OpenMeteoHourlyPreviewResponse,
  OpenMeteoWeatherOverviewResponse,
  UnitPreferences,
  WeatherOverview,
  WeatherSnapshot,
} from '../types/weather'
import { fetchJson } from './http'

const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const OPENSTREETMAP_REVERSE_GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse'
const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

type WeatherRequestInput = {
  latitude: number
  longitude: number
  units: UnitPreferences
}

type HourlyPreviewBatchRequestInput = {
  locations: LocationSummary[]
  units: UnitPreferences
}

function toApiUnitParams(units: UnitPreferences): ApiUnitParams {
  const pressureUnitMap: Record<UnitPreferences['pressure'], ApiUnitParams['pressure_msl_unit']> = {
    hpa: 'hPa',
    mmhg: 'mmHg',
    inhg: 'inHg',
  }

  const visibilityUnitMap: Record<UnitPreferences['distance'], ApiUnitParams['visibility_unit']> = {
    km: 'km',
    mi: 'mile',
  }

  return {
    temperature_unit: units.temperature,
    wind_speed_unit: units.windSpeed,
    precipitation_unit: units.precipitation,
    pressure_msl_unit: pressureUnitMap[units.pressure],
    visibility_unit: visibilityUnitMap[units.distance],
  }
}

export async function searchLocations(query: string, count = 7): Promise<LocationSummary[]> {
  const data = await fetchJson<OpenMeteoGeocodeResponse>(OPEN_METEO_GEOCODING_URL, {
    name: query.trim(),
    count,
    language: 'en',
    format: 'json',
  })

  return (data.results ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    country: item.country,
    region: item.admin1,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
  }))
}

export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number,
): Promise<LocationSummary | null> {
  type ReverseGeocodeResponse = {
    place_id?: number
    lat?: string
    lon?: string
    address?: {
      city?: string
      town?: string
      village?: string
      municipality?: string
      county?: string
      state?: string
      country?: string
    }
  }

  const data = await fetchJson<ReverseGeocodeResponse>(OPENSTREETMAP_REVERSE_GEOCODING_URL, {
    lat: latitude,
    lon: longitude,
    format: 'jsonv2',
    'accept-language': 'en',
  })

  if (!data.address) {
    return null
  }

  const name =
    data.address.city ??
    data.address.town ??
    data.address.village ??
    data.address.municipality ??
    data.address.county ??
    data.address.state ??
    data.address.country

  if (!name) {
    return null
  }

  return {
    id: data.place_id ?? Date.now(),
    name,
    country: data.address.country,
    region: data.address.state ?? data.address.county,
    latitude: Number(data.lat ?? latitude),
    longitude: Number(data.lon ?? longitude),
  }
}

export async function fetchWeatherSnapshot({
  latitude,
  longitude,
  units,
}: WeatherRequestInput): Promise<WeatherSnapshot> {
  const data = await fetchJson<OpenMeteoCurrentResponse>(OPEN_METEO_FORECAST_URL, {
    latitude,
    longitude,
    current:
      'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,relative_humidity_2m,is_day',
    timezone: 'auto',
    ...toApiUnitParams(units),
  })

  return {
    timezone: data.timezone,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      pressure: data.current.pressure_msl,
      humidity: data.current.relative_humidity_2m,
      isDay: data.current.is_day === 1,
    },
  }
}

export async function fetchHourlyPreview({
  latitude,
  longitude,
  units,
}: WeatherRequestInput): Promise<HourlyForecastPoint | null> {
  const data = await fetchJson<OpenMeteoHourlyPreviewResponse>(OPEN_METEO_FORECAST_URL, {
    latitude,
    longitude,
    hourly: 'temperature_2m,weather_code,is_day',
    forecast_days: 1,
    timezone: 'auto',
    temperature_unit: units.temperature,
  })

  return toClosestHourlyPoint(data)
}

function toClosestHourlyPoint(data: OpenMeteoHourlyPreviewResponse): HourlyForecastPoint | null {
  if (data.hourly.time.length === 0) {
    return null
  }

  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: data.timezone,
  })

  const now = Date.now()
  let closestIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY

  data.hourly.time.forEach((time, index) => {
    const distance = Math.abs(new Date(time).getTime() - now)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  return {
    time: data.hourly.time[closestIndex],
    displayTime: timeFormatter.format(now),
    temperature: data.hourly.temperature_2m[closestIndex],
    weatherCode: data.hourly.weather_code[closestIndex],
    isDay: data.hourly.is_day[closestIndex] === 1,
  }
}

export async function fetchHourlyPreviewBatch({
  locations,
  units,
}: HourlyPreviewBatchRequestInput): Promise<Record<number, HourlyForecastPoint | null>> {
  if (locations.length === 0) {
    return {}
  }

  const latitudes = locations.map((location) => location.latitude).join(',')
  const longitudes = locations.map((location) => location.longitude).join(',')

  const response = await fetchJson<OpenMeteoHourlyPreviewResponse | OpenMeteoHourlyPreviewResponse[]>(
    OPEN_METEO_FORECAST_URL,
    {
      latitude: latitudes,
      longitude: longitudes,
      hourly: 'temperature_2m,weather_code,is_day',
      forecast_days: 1,
      timezone: 'auto',
      temperature_unit: units.temperature,
    },
  )

  const payloads = Array.isArray(response) ? response : [response]
  const previewMap: Record<number, HourlyForecastPoint | null> = {}

  locations.forEach((location, index) => {
    const payload = payloads[index]
    previewMap[location.id] = payload ? toClosestHourlyPoint(payload) : null
  })

  return previewMap
}

export async function fetchWeatherOverview({
  latitude,
  longitude,
  units,
}: WeatherRequestInput): Promise<WeatherOverview> {
  const data = await fetchJson<OpenMeteoWeatherOverviewResponse>(OPEN_METEO_FORECAST_URL, {
    latitude,
    longitude,
    current:
      'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,pressure_msl,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,uv_index,visibility',
    hourly:
      'temperature_2m,uv_index,weather_code,is_day,relative_humidity_2m,wind_speed_10m,pressure_msl,visibility',
    daily:
      'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,sunrise,sunset',
    forecast_days: 10,
    timezone: 'auto',
    ...toApiUnitParams(units),
  })

  const now = Date.now()
  const updatedDateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: data.timezone,
  })
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: data.timezone,
  })
  const hourFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: data.timezone,
  })
  const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: data.timezone,
  })
  const todayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: data.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)

  let closestHourlyIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY

  data.hourly.time.forEach((value, index) => {
    const distance = Math.abs(new Date(value).getTime() - now)
    if (distance < closestDistance) {
      closestDistance = distance
      closestHourlyIndex = index
    }
  })

  const hourlySlice = data.hourly.time.slice(closestHourlyIndex, closestHourlyIndex + 24)
  const hourlyTrend24h = hourlySlice.map((time, index) => {
    const dataIndex = closestHourlyIndex + index
    return {
      time,
      label: hourFormatter.format(new Date(time)),
      temperature: data.hourly.temperature_2m[dataIndex],
      weatherCode: data.hourly.weather_code[dataIndex],
      isDay: data.hourly.is_day[dataIndex] === 1,
    }
  })

  const uvIndexMax24h = data.hourly.uv_index
    .slice(closestHourlyIndex, closestHourlyIndex + 24)
    .reduce((max, value) => Math.max(max, value), data.current.uv_index)

  const hourlyByDate: Record<string, DayHourlyPoint[]> = {}
  const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: data.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  data.hourly.time.forEach((time, index) => {
    const dayKey = dayKeyFormatter.format(new Date(time))
    const point: DayHourlyPoint = {
      time,
      label: hourFormatter.format(new Date(time)),
      temperature: data.hourly.temperature_2m[index],
      uvIndex: data.hourly.uv_index[index],
      humidity: data.hourly.relative_humidity_2m[index],
      windSpeed: data.hourly.wind_speed_10m[index],
      pressure: data.hourly.pressure_msl[index],
      visibility: data.hourly.visibility[index],
    }

    if (!hourlyByDate[dayKey]) {
      hourlyByDate[dayKey] = []
    }

    hourlyByDate[dayKey].push(point)
  })

  const tenDayForecast = data.daily.time.slice(0, 10).map((date, index) => {
    const dayKey = new Intl.DateTimeFormat('en-CA', {
      timeZone: data.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date))

    return {
      date,
      dayLabel: dayKey === todayKey ? 'Today' : weekdayFormatter.format(new Date(date)),
      min: data.daily.temperature_2m_min[index],
      max: data.daily.temperature_2m_max[index],
      weatherCode: data.daily.weather_code[index],
      precipitationChance: data.daily.precipitation_probability_max[index],
      sunrise: timeFormatter.format(new Date(data.daily.sunrise[index])),
      sunset: timeFormatter.format(new Date(data.daily.sunset[index])),
    }
  })

  return {
    timezone: data.timezone,
    updatedDate: updatedDateFormatter.format(new Date(data.current.time)),
    localTime: timeFormatter.format(now),
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windGust: data.current.wind_gusts_10m,
      pressure: data.current.pressure_msl,
      humidity: data.current.relative_humidity_2m,
      visibility: data.current.visibility,
      uvIndex: data.current.uv_index,
      precipitation: data.current.precipitation,
      rain: data.current.rain,
      showers: data.current.showers,
      snowfall: data.current.snowfall,
      isDay: data.current.is_day === 1,
    },
    daily: {
      high: data.daily.temperature_2m_max[0],
      low: data.daily.temperature_2m_min[0],
      precipitationChance: data.daily.precipitation_probability_max[0],
      sunrise: timeFormatter.format(new Date(data.daily.sunrise[0])),
      sunset: timeFormatter.format(new Date(data.daily.sunset[0])),
    },
    tenDayForecast,
    uvIndexMax24h,
    hourlyTrend24h,
    hourlyByDate,
  }
}
