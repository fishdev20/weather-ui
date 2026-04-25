import { Drop, Gauge, Ruler, Thermometer, Wind } from '@phosphor-icons/react'
import { SettingGroup } from '../../features/unit-preferences/components/SettingGroup'
import { useUnitPreferences } from '../../features/unit-preferences/hooks/useUnitPreferences'
import styles from './SettingsPage.module.scss'

export function SettingsPage() {
  const {
    units,
    setTemperatureUnit,
    setWindSpeedUnit,
    setPrecipitationUnit,
    setPressureUnit,
    setDistanceUnit,
  } = useUnitPreferences()

  return (
    <section className={styles.settingsPage}>
      <h2 className={styles.unitsTitle}>Units</h2>

      <div className={styles.settingsGrid}>
        <SettingGroup
          label="Temperature"
          icon={Thermometer}
          value={units.temperature}
          onChange={setTemperatureUnit}
          options={[
            { value: 'celsius', label: 'Celsius' },
            { value: 'fahrenheit', label: 'Fahrenheit' },
          ]}
        />

        <SettingGroup
          label="Wind Speed"
          icon={Wind}
          value={units.windSpeed}
          onChange={setWindSpeedUnit}
          options={[
            { value: 'kmh', label: 'km/h' },
            { value: 'ms', label: 'm/s' },
            { value: 'mph', label: 'mph' },
            { value: 'kn', label: 'Knots' },
          ]}
        />

        <SettingGroup
          label="Pressure"
          icon={Gauge}
          value={units.pressure}
          onChange={setPressureUnit}
          options={[
            { value: 'hpa', label: 'hPa' },
            { value: 'inhg', label: 'Inches' },
            { value: 'mmhg', label: 'mm' },
          ]}
        />

        <SettingGroup
          label="Precipitation"
          icon={Drop}
          value={units.precipitation}
          onChange={setPrecipitationUnit}
          options={[
            { value: 'mm', label: 'Milimeters' },
            { value: 'inch', label: 'Inches' },
          ]}
        />

        <SettingGroup
          label="Distance"
          icon={Ruler}
          value={units.distance}
          onChange={setDistanceUnit}
          options={[
            { value: 'km', label: 'Kilometers' },
            { value: 'mi', label: 'Miles' },
          ]}
        />
      </div>
    </section>
  )
}
