import { Trash } from '@phosphor-icons/react'
import { getWeatherVisualByCode } from '../../../lib/openMeteoWeather'
import { Button } from '../../../components/ui/Button'
import { Skeleton } from '../../../components/ui/Skeleton'
import { locationLabel } from '../../../lib/location'
import type { LocationSummary } from '../../../types/location'
import type { HourlyForecastPoint } from '../../../types/weather'
import styles from './RecentSearchItem.module.scss'

type RecentSearchItemProps = {
  location: LocationSummary
  preview: HourlyForecastPoint | null
  isLoadingPreview: boolean
  onDelete: (locationId: number) => void
  onSelect: (location: LocationSummary) => void
}

export function RecentSearchItem({
  location,
  preview,
  isLoadingPreview,
  onDelete,
  onSelect,
}: RecentSearchItemProps) {
  const weatherVisual = preview ? getWeatherVisualByCode(preview.weatherCode, preview.isDay) : null

  return (
    <div className={styles.recentRow}>
      <Button className={styles.dropdownItem} onClick={() => onSelect(location)}>
        <span className={styles.dropdownItemLine}>
          <span className={styles.dropdownItemName}>{locationLabel(location)}</span>
          {isLoadingPreview && (
            <Skeleton className={styles.previewLoadingSkeleton} aria-label="Loading recent preview" />
          )}
          {!isLoadingPreview && !preview && (
            <span className={styles.previewLoading}>--:-- • --°</span>
          )}
          {!isLoadingPreview && preview && (
            <span className={styles.dropdownItemMeta}>
              <span>{preview.displayTime}</span>
              <span>{weatherVisual?.icon}</span>
              <span>{Math.round(preview.temperature)}°</span>
            </span>
          )}
        </span>
      </Button>
      <Button
        className={styles.deleteRecentButton}
        size="icon"
        aria-label={`Delete ${locationLabel(location)} from recent searches`}
        title="Delete recent item"
        onClick={() => onDelete(location.id)}
      >
        <Trash weight="bold" />
      </Button>
    </div>
  )
}
