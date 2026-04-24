import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_UNITS, LOCAL_STORAGE_KEYS } from '../shared/config/constants'
import type {
  DistanceUnit,
  PrecipitationUnit,
  PressureUnit,
  TemperatureUnit,
  UnitPreferences,
  WindSpeedUnit,
} from '../shared/types/weather'

type SettingsState = {
  units: UnitPreferences
  setTemperatureUnit: (temperature: TemperatureUnit) => void
  setWindSpeedUnit: (windSpeed: WindSpeedUnit) => void
  setPrecipitationUnit: (precipitation: PrecipitationUnit) => void
  setPressureUnit: (pressure: PressureUnit) => void
  setDistanceUnit: (distance: DistanceUnit) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      units: DEFAULT_UNITS,
      setTemperatureUnit: (temperature) =>
        set((state) => ({ units: { ...state.units, temperature } })),
      setWindSpeedUnit: (windSpeed) => set((state) => ({ units: { ...state.units, windSpeed } })),
      setPrecipitationUnit: (precipitation) =>
        set((state) => ({ units: { ...state.units, precipitation } })),
      setPressureUnit: (pressure) => set((state) => ({ units: { ...state.units, pressure } })),
      setDistanceUnit: (distance) => set((state) => ({ units: { ...state.units, distance } })),
    }),
    {
      name: LOCAL_STORAGE_KEYS.units,
      partialize: (state) => ({ units: state.units }),
    },
  ),
)
