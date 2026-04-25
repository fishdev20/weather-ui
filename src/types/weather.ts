export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type WindSpeedUnit = 'kmh' | 'ms' | 'mph' | 'kn'
export type PrecipitationUnit = 'mm' | 'inch'
export type PressureUnit = 'hpa' | 'mmhg' | 'inhg'
export type DistanceUnit = 'km' | 'mi'

export interface UnitPreferences {
  temperature: TemperatureUnit
  windSpeed: WindSpeedUnit
  precipitation: PrecipitationUnit
  pressure: PressureUnit
  distance: DistanceUnit
}

export interface ApiUnitParams {
  temperature_unit: TemperatureUnit
  wind_speed_unit: WindSpeedUnit
  precipitation_unit: PrecipitationUnit
  pressure_msl_unit: 'hPa' | 'mmHg' | 'inHg'
  visibility_unit: 'km' | 'mile'
}

export interface OpenMeteoCurrentResponse {
  timezone: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    wind_speed_10m: number
    pressure_msl: number
    relative_humidity_2m: number
    is_day: number
  }
}

export interface OpenMeteoHourlyPreviewResponse {
  timezone: string
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    is_day: number[]
  }
}

export interface OpenMeteoWeatherOverviewResponse {
  timezone: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    wind_speed_10m: number
    wind_gusts_10m: number
    pressure_msl: number
    relative_humidity_2m: number
    is_day: number
    precipitation: number
    rain: number
    showers: number
    snowfall: number
    uv_index: number
    visibility: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    uv_index: number[]
    weather_code: number[]
    is_day: number[]
    relative_humidity_2m: number[]
    wind_speed_10m: number[]
    pressure_msl: number[]
    visibility: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    weather_code: number[]
    sunrise: string[]
    sunset: string[]
  }
}

export interface WeatherSnapshot {
  timezone: string
  current: {
    time: string
    temperature: number
    apparentTemperature: number
    weatherCode: number
    windSpeed: number
    pressure: number
    humidity: number
    isDay: boolean
  }
}

export interface HourlyForecastPoint {
  time: string
  displayTime: string
  temperature: number
  weatherCode: number
  isDay: boolean
}

export interface WeatherTrendPoint {
  time: string
  label: string
  temperature: number
  weatherCode: number
  isDay: boolean
}

export interface DailyForecastPoint {
  date: string
  dayLabel: string
  min: number
  max: number
  weatherCode: number
  precipitationChance: number
  sunrise: string
  sunset: string
}

export interface DayHourlyPoint {
  time: string
  label: string
  temperature: number
  uvIndex: number
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
}

export interface WeatherOverview {
  timezone: string
  updatedDate: string
  localTime: string
  current: {
    temperature: number
    apparentTemperature: number
    weatherCode: number
    windSpeed: number
    windGust: number
    pressure: number
    humidity: number
    visibility: number
    uvIndex: number
    precipitation: number
    rain: number
    showers: number
    snowfall: number
    isDay: boolean
  }
  daily: {
    high: number
    low: number
    precipitationChance: number
    sunrise: string
    sunset: string
  }
  tenDayForecast: DailyForecastPoint[]
  uvIndexMax24h: number
  hourlyTrend24h: WeatherTrendPoint[]
  hourlyByDate: Record<string, DayHourlyPoint[]>
}
