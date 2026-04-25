import { useSettingsStore } from '../store/settingsStore'

export function useUnitPreferences() {
  const units = useSettingsStore((state) => state.units)
  const setTemperatureUnit = useSettingsStore((state) => state.setTemperatureUnit)
  const setWindSpeedUnit = useSettingsStore((state) => state.setWindSpeedUnit)
  const setPrecipitationUnit = useSettingsStore((state) => state.setPrecipitationUnit)
  const setPressureUnit = useSettingsStore((state) => state.setPressureUnit)
  const setDistanceUnit = useSettingsStore((state) => state.setDistanceUnit)

  return {
    units,
    setTemperatureUnit,
    setWindSpeedUnit,
    setPrecipitationUnit,
    setPressureUnit,
    setDistanceUnit,
  }
}
