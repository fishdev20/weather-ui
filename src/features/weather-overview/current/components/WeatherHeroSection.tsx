import { Clock, MapPin, Plus, Sun, Wind } from '@phosphor-icons/react'
import { getWeatherVisualByCode } from '../../../../lib/openMeteoWeather'
import { Button } from '../../../../components/ui/Button'
import type { LocationSummary } from '../../../../types/location'
import type { WeatherOverview } from '../../../../types/weather'
import styles from './WeatherHeroSection.module.scss'

type WeatherVisual = {
  icon: string
  label: string
}

type WeatherHeroSectionProps = {
  selectedLocation: LocationSummary
  selectedLocationSubtitle: string
  isCurrentLocationSelected: boolean
  canAddToWatchlist: boolean
  isInWatchlist: boolean
  onAddToWatchlist: () => void
  overview: WeatherOverview
  weatherVisual: WeatherVisual
  temperatureUnit: string
  windUnit: string
}

export function WeatherHeroSection({
  selectedLocation,
  selectedLocationSubtitle,
  isCurrentLocationSelected,
  canAddToWatchlist,
  isInWatchlist,
  onAddToWatchlist,
  overview,
  weatherVisual,
  temperatureUnit,
  windUnit,
}: WeatherHeroSectionProps) {
  return (
    <>
      <section className={styles.currentCard}>
        <header className={styles.currentHeader}>
          <div>
            <h2 className={styles.currentTitle}>
              {isCurrentLocationSelected && (
                <span className={styles.currentLocationIcon} aria-label="Current location">
                  <MapPin weight="duotone" />
                </span>
              )}
              <span>{selectedLocation.name}</span>
            </h2>
            <p className={styles.currentSub}>{selectedLocationSubtitle}</p>
          </div>
          <Button
            variant="outline"
            className={styles.favoriteButton}
            onClick={onAddToWatchlist}
            aria-label={isInWatchlist ? 'Already in watch list' : 'Add to watch list'}
            title={isInWatchlist ? 'Already in watch list' : 'Add to watch list'}
            disabled={!canAddToWatchlist || isInWatchlist}
          >
            <Plus weight="bold" />
          </Button>
        </header>

        <p className={styles.temperatureValue}>
          {Math.round(overview.current.temperature)}
          {temperatureUnit}
        </p>
        <p className={styles.weatherSummaryLine}>
          {weatherVisual.label} · Feels like {Math.round(overview.current.apparentTemperature)}
          {temperatureUnit}
        </p>

        <div className={styles.quickStats}>
          <article className={styles.quickStatCard}>
            <Wind weight="duotone" />
            <span>Wind</span>
            <strong>
              {overview.current.windSpeed.toFixed(1)} {windUnit}
            </strong>
          </article>
          <article className={styles.quickStatCard}>
            <Clock weight="duotone" />
            <span>Local time</span>
            <strong>{overview.localTime}</strong>
          </article>
          <article className={styles.quickStatCard}>
            <Sun weight="duotone" />
            <span>Daylight</span>
            <strong>{overview.current.isDay ? 'Day' : 'Night'}</strong>
          </article>
        </div>
      </section>

      <section className={styles.hourForcast}>
        <h3 className={styles.chartTitle}>24-hour forecast</h3>
        <div className={styles.hourlyScroll} role="list" aria-label="24-hour forecast">
          {overview.hourlyTrend24h.map((point) => {
            const hourlyVisual = getWeatherVisualByCode(point.weatherCode, point.isDay)
            return (
              <article key={point.time} className={styles.hourlyItem} role="listitem">
                <p className={styles.hourlyTime}>{point.label}</p>
                <p className={styles.hourlyIcon}>{hourlyVisual.icon}</p>
                <p className={styles.hourlyTemp}>
                  {Math.round(point.temperature)}
                  {temperatureUnit}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
