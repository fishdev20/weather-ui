export type WeatherVisual = {
  label: string
  dayIcon: string
  nightIcon: string
}

export const OPEN_METEO_WEATHER_CODE_MAP: Record<number, WeatherVisual> = {
  0: { label: 'Clear sky', dayIcon: '☀', nightIcon: '🌙' },
  1: { label: 'Mainly clear', dayIcon: '🌤', nightIcon: '🌙' },
  2: { label: 'Partly cloudy', dayIcon: '⛅', nightIcon: '☁' },
  3: { label: 'Overcast', dayIcon: '☁', nightIcon: '☁' },
  45: { label: 'Fog', dayIcon: '🌫', nightIcon: '🌫' },
  48: { label: 'Depositing rime fog', dayIcon: '🌫', nightIcon: '🌫' },
  51: { label: 'Light drizzle', dayIcon: '🌦', nightIcon: '🌦' },
  53: { label: 'Moderate drizzle', dayIcon: '🌦', nightIcon: '🌦' },
  55: { label: 'Dense drizzle', dayIcon: '🌧', nightIcon: '🌧' },
  56: { label: 'Light freezing drizzle', dayIcon: '🌧', nightIcon: '🌧' },
  57: { label: 'Dense freezing drizzle', dayIcon: '🌧', nightIcon: '🌧' },
  61: { label: 'Slight rain', dayIcon: '🌦', nightIcon: '🌧' },
  63: { label: 'Moderate rain', dayIcon: '🌧', nightIcon: '🌧' },
  65: { label: 'Heavy rain', dayIcon: '🌧', nightIcon: '🌧' },
  66: { label: 'Light freezing rain', dayIcon: '🌧', nightIcon: '🌧' },
  67: { label: 'Heavy freezing rain', dayIcon: '🌧', nightIcon: '🌧' },
  71: { label: 'Slight snow fall', dayIcon: '🌨', nightIcon: '🌨' },
  73: { label: 'Moderate snow fall', dayIcon: '🌨', nightIcon: '🌨' },
  75: { label: 'Heavy snow fall', dayIcon: '❄', nightIcon: '❄' },
  77: { label: 'Snow grains', dayIcon: '❄', nightIcon: '❄' },
  80: { label: 'Slight rain showers', dayIcon: '🌦', nightIcon: '🌧' },
  81: { label: 'Moderate rain showers', dayIcon: '🌧', nightIcon: '🌧' },
  82: { label: 'Violent rain showers', dayIcon: '⛈', nightIcon: '⛈' },
  85: { label: 'Slight snow showers', dayIcon: '🌨', nightIcon: '🌨' },
  86: { label: 'Heavy snow showers', dayIcon: '❄', nightIcon: '❄' },
  95: { label: 'Thunderstorm', dayIcon: '⛈', nightIcon: '⛈' },
  96: { label: 'Thunderstorm with slight hail', dayIcon: '⛈', nightIcon: '⛈' },
  99: { label: 'Thunderstorm with heavy hail', dayIcon: '⛈', nightIcon: '⛈' },
}

const FALLBACK_WEATHER_VISUAL: WeatherVisual = {
  label: 'Unknown',
  dayIcon: '❔',
  nightIcon: '❔',
}

export function getWeatherVisualByCode(
  weatherCode: number,
  isDay = true,
): { label: string; icon: string } {
  const visual = OPEN_METEO_WEATHER_CODE_MAP[weatherCode] ?? FALLBACK_WEATHER_VISUAL
  return {
    label: visual.label,
    icon: isDay ? visual.dayIcon : visual.nightIcon,
  }
}
