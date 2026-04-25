import type { UnitPreferences } from '../types/weather'

export const DEFAULT_UNITS: UnitPreferences = {
  temperature: 'celsius',
  windSpeed: 'kmh',
  precipitation: 'mm',
  pressure: 'hpa',
  distance: 'km',
}

export const LOCAL_STORAGE_KEYS = {
  units: 'units',
  theme: 'theme',
  recentSearches: 'recent-searches',
  watchlist: 'watchlist',
} as const
