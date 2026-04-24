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
