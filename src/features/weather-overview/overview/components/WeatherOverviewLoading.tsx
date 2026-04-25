import { Skeleton } from '../../../../components/ui/Skeleton'
import styles from './WeatherOverviewLoading.module.scss'

export function WeatherOverviewLoading() {
  return (
    <div className={styles.overviewLoading} aria-label="Loading weather overview">
      <section className={styles.loadingMain}>
        <Skeleton className={styles.loadingHeaderLine} />
        <Skeleton className={styles.loadingSubLine} />
        <Skeleton className={styles.loadingTempValue} />
        <Skeleton className={styles.loadingSummaryLine} />
        <div className={styles.loadingQuickStats}>
          <Skeleton className={styles.loadingQuickStatItem} />
          <Skeleton className={styles.loadingQuickStatItem} />
          <Skeleton className={styles.loadingQuickStatItem} />
        </div>
      </section>

      <section className={styles.loadingSide}>
        <Skeleton className={styles.loadingPanelTitle} />
        <div className={styles.loadingTenDayRows}>
          <Skeleton className={styles.loadingTenDayRow} />
          <Skeleton className={styles.loadingTenDayRow} />
          <Skeleton className={styles.loadingTenDayRow} />
          <Skeleton className={styles.loadingTenDayRow} />
          <Skeleton className={styles.loadingTenDayRow} />
        </div>
      </section>

      <section className={styles.loadingChart}>
        <Skeleton className={styles.loadingPanelTitle} />
        <div className={styles.loadingHourlyRow}>
          <Skeleton className={styles.loadingHourlyItem} />
          <Skeleton className={styles.loadingHourlyItem} />
          <Skeleton className={styles.loadingHourlyItem} />
          <Skeleton className={styles.loadingHourlyItem} />
          <Skeleton className={styles.loadingHourlyItem} />
          <Skeleton className={styles.loadingHourlyItem} />
        </div>
        <div className={styles.loadingDetailsGrid}>
          <Skeleton className={styles.loadingDetailCell} />
          <Skeleton className={styles.loadingDetailCell} />
          <Skeleton className={styles.loadingDetailCell} />
          <Skeleton className={styles.loadingDetailCell} />
        </div>
      </section>
    </div>
  )
}
