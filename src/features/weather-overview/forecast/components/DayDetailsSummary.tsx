import { CloudRain, SunHorizon, Thermometer } from '@phosphor-icons/react'
import type { DailyForecastPoint } from '../../../../types/weather'
import styles from './DayDetailsSummary.module.scss'

type DayDetailsSummaryProps = {
  day: DailyForecastPoint
  temperatureUnit: string
}

export function DayDetailsSummary({ day, temperatureUnit }: DayDetailsSummaryProps) {
  return (
    <div className={styles.tenDayDetailsGrid}>
      <article>
        <p>
          <Thermometer weight="duotone" /> High / low
        </p>
        <strong>
          {Math.round(day.max)}
          {temperatureUnit} / {Math.round(day.min)}
          {temperatureUnit}
        </strong>
      </article>
      <article>
        <p>
          <CloudRain weight="duotone" /> Precipitation chance
        </p>
        <strong>{day.precipitationChance}%</strong>
      </article>
      <article>
        <p>
          <SunHorizon weight="duotone" /> Sunrise
        </p>
        <strong>{day.sunrise}</strong>
      </article>
      <article>
        <p>
          <SunHorizon weight="duotone" /> Sunset
        </p>
        <strong>{day.sunset}</strong>
      </article>
    </div>
  )
}
