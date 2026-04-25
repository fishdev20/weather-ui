import {
  CalendarBlank,
  Compass,
  Drop,
  Snowflake,
  Sun,
  SunHorizon,
  Thermometer,
  Waves,
  Wind,
} from '@phosphor-icons/react'
import type { WeatherOverview } from '../../../../types/weather'
import styles from './ConditionsDetailsSection.module.scss'

type ConditionsDetailsSectionProps = {
  overview: WeatherOverview
  temperatureUnit: string
  windUnit: string
  pressureUnit: string
  distanceUnit: string
  precipitationUnit: string
  feelsLikeProgress: number
  feelsLikeDeltaLabel: string
  uvProgress: number
  uvLabel: string
}

export function ConditionsDetailsSection({
  overview,
  temperatureUnit,
  windUnit,
  pressureUnit,
  distanceUnit,
  precipitationUnit,
  feelsLikeProgress,
  feelsLikeDeltaLabel,
  uvProgress,
  uvLabel,
}: ConditionsDetailsSectionProps) {
  return (
    <section className={styles.detailsCard}>
      <h3 className={styles.detailsTitle}>Conditions details</h3>
      <div className={styles.detailsGrid}>
        <article className={styles.detailItem}>
          <p>
            <CalendarBlank weight="duotone" /> Updated
          </p>
          <strong>{overview.updatedDate}</strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Thermometer weight="duotone" /> Today high/low
          </p>
          <strong>
            {Math.round(overview.daily.high)}
            {temperatureUnit} / {Math.round(overview.daily.low)}
            {temperatureUnit}
          </strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Drop weight="duotone" /> Precipitation chance
          </p>
          <strong>{overview.daily.precipitationChance}%</strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Wind weight="duotone" /> Wind gust
          </p>
          <strong>
            {overview.current.windGust.toFixed(1)} {windUnit}
          </strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Thermometer weight="duotone" /> Feels like
          </p>
          <strong className={styles.metricBigValue}>
            {Math.round(overview.current.apparentTemperature)}
            {temperatureUnit}
          </strong>
          <span className={styles.metricSubText}>
            Actual: {Math.round(overview.current.temperature)}
            {temperatureUnit}
          </span>
          <div className={styles.metricBar} aria-hidden="true">
            <span className={styles.metricBarTrack} />
            <span
              className={styles.metricBarFill}
              style={{
                left: `${feelsLikeProgress}%`,
                width: `${100 - feelsLikeProgress}%`,
              }}
            />
            <span className={styles.metricBarEnd} />
            <span
              className={styles.metricBarThumb}
              style={{ left: `clamp(1.5rem, ${feelsLikeProgress}%, calc(100% - 1.5rem))` }}
            >
              {feelsLikeDeltaLabel}
            </span>
          </div>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Sun weight="duotone" /> UV index now / max
          </p>
          <strong className={styles.metricBigValue}>{Math.round(overview.current.uvIndex)}</strong>
          <span className={styles.metricSubText}>{uvLabel}</span>
          <div className={styles.uvBar} aria-hidden="true">
            <span className={styles.uvBarTrack} />
            <span className={styles.uvBarFill} style={{ width: `${uvProgress}%` }} />
          </div>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Drop weight="duotone" /> Humidity
          </p>
          <strong>{overview.current.humidity}%</strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Compass weight="duotone" /> Pressure
          </p>
          <strong>
            {Math.round(overview.current.pressure)} {pressureUnit}
          </strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Waves weight="duotone" /> Visibility
          </p>
          <strong>
            {overview.current.visibility.toFixed(1)} {distanceUnit}
          </strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <Snowflake weight="duotone" /> Precip / Rain / Snow
          </p>
          <strong>
            {overview.current.precipitation.toFixed(1)} / {overview.current.rain.toFixed(1)} /{' '}
            {overview.current.snowfall.toFixed(1)} {precipitationUnit}
          </strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <SunHorizon weight="duotone" /> Sunrise
          </p>
          <strong>{overview.daily.sunrise}</strong>
        </article>
        <article className={styles.detailItem}>
          <p>
            <SunHorizon weight="duotone" /> Sunset
          </p>
          <strong>{overview.daily.sunset}</strong>
        </article>
      </div>
    </section>
  )
}
