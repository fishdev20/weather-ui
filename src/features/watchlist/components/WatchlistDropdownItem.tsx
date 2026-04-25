import { Trash } from '@phosphor-icons/react'
import { getWeatherVisualByCode } from '../../../lib/openMeteoWeather'
import { locationLabel } from '../../../lib/location'
import { Button } from '../../../components/ui/Button'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { LocationSummary } from '../../../types/location'
import type { HourlyForecastPoint } from '../../../types/weather'
import styles from './WatchlistDropdownItem.module.scss'

type WatchlistDropdownItemProps = {
  location: LocationSummary
  preview: HourlyForecastPoint | null
  isLoadingPreview: boolean
  onSelect: () => void
  onRemove: () => void
}

export function WatchlistDropdownItem({
  location,
  preview,
  isLoadingPreview,
  onSelect,
  onRemove,
}: WatchlistDropdownItemProps) {
  const weatherVisual = preview
    ? getWeatherVisualByCode(preview.weatherCode, preview.isDay)
    : null
  return (
    <div className={styles.watchlistRow}>
      <Button className={styles.watchlistItemMain} onClick={onSelect} role="menuitem">
        <span className={styles.watchlistItemTop}>
          <span className={styles.watchlistItemName}>{location.name}</span>
          {isLoadingPreview ? (
            <Skeleton className={styles.watchlistItemMetaLoading} />
          ) : preview ? (
            <span className={styles.watchlistItemMeta}>
              <span>{preview.displayTime}</span>
              <span>{weatherVisual?.icon}</span>
              <span>{Math.round(preview.temperature)}°</span>
            </span>
          ) : (
            <span className={styles.watchlistItemMeta}>--:-- • --°</span>
          )}
        </span>
        <span className={styles.watchlistItemSub}>
          {weatherVisual ? `${weatherVisual.label} · ${locationLabel(location)}` : locationLabel(location)}
        </span>
      </Button>
      <Button
        className={styles.watchlistRemove}
        size="icon"
        aria-label={`Remove ${locationLabel(location)} from watch list`}
        title="Remove from watch list"
        onClick={onRemove}
      >
        <Trash weight="bold" />
      </Button>
    </div>
  )
}
