import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { getWeatherVisualByCode } from '../../../../lib/openMeteoWeather'
import type { DailyForecastPoint, WeatherOverview } from '../../../../types/weather'
import { DayDetailsSummary } from './DayDetailsSummary'
import styles from './TenDayForecastSection.module.scss'

type TenDayForecastSectionProps = {
  overview: WeatherOverview
  selectedTenDay: DailyForecastPoint | null
  onSelectDay: (date: string) => void
  isSmallViewport: boolean
  temperatureUnit: string
  dayCharts: ReactNode
}

export function TenDayForecastSection({
  overview,
  selectedTenDay,
  onSelectDay,
  isSmallViewport,
  temperatureUnit,
  dayCharts,
}: TenDayForecastSectionProps) {
  const globalRange = useMemo(() => {
    if (overview.tenDayForecast.length === 0) {
      return null
    }

    const globalMin = Math.min(...overview.tenDayForecast.map((day) => day.min))
    const globalMax = Math.max(...overview.tenDayForecast.map((day) => day.max))
    return {
      globalMin,
      span: Math.max(globalMax - globalMin, 1),
    }
  }, [overview.tenDayForecast])

  return (
    <section className={styles.tenDayCard}>
      <h3 className={styles.detailsTitle}>10-day forecast</h3>
      <div className={styles.tenDayList}>
        {globalRange &&
          overview.tenDayForecast.map((day) => {
            const visual = getWeatherVisualByCode(day.weatherCode, true)
            const start = ((day.min - globalRange.globalMin) / globalRange.span) * 100
            const end = ((day.max - globalRange.globalMin) / globalRange.span) * 100
            const isActiveDay = selectedTenDay?.date === day.date

            return (
              <button
                key={day.date}
                className={`${styles.tenDayItem} ${isActiveDay ? styles.tenDayItemActive : ''}`}
                onClick={() => onSelectDay(day.date)}
                type="button"
              >
                <p className={styles.tenDayName}>{day.dayLabel}</p>
                <p className={styles.tenDayCondition}>
                  <span>{visual.icon}</span>
                </p>
                <p className={styles.tenDayMin}>
                  {Math.round(day.min)}
                  {temperatureUnit}
                </p>
                <div className={styles.tenDayTrack}>
                  <span
                    className={styles.tenDayRange}
                    style={{ left: `${start}%`, width: `${Math.max(end - start, 6)}%` }}
                  />
                </div>
                <p className={styles.tenDayMax}>
                  {Math.round(day.max)}
                  {temperatureUnit}
                </p>
              </button>
            )
          })}
      </div>

      {selectedTenDay && !isSmallViewport && (
        <section className={styles.tenDayDetails} aria-live="polite">
          <div className={styles.tenDayDetailsHeader}>
            <h4>{selectedTenDay.dayLabel} details</h4>
          </div>
          <DayDetailsSummary day={selectedTenDay} temperatureUnit={temperatureUnit} />
          {dayCharts}
        </section>
      )}
    </section>
  )
}
