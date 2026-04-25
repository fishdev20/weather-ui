import { Skeleton } from '../../../../components/ui/Skeleton'
import styles from './DayDetailCharts.module.scss'

export function DayDetailChartsSkeleton() {
  return (
    <div className={styles.dayCharts}>
      <article className={styles.dayChartCard}>
        <Skeleton className={styles.dayChartSkeletonTitle} />
        <Skeleton className={styles.dayChartSkeletonCanvas} />
      </article>
      <article className={styles.dayChartCard}>
        <Skeleton className={styles.dayChartSkeletonTitle} />
        <Skeleton className={styles.dayChartSkeletonCanvas} />
      </article>
      <article className={styles.dayChartCard}>
        <Skeleton className={styles.dayChartSkeletonTitle} />
        <Skeleton className={styles.dayChartSkeletonCanvas} />
      </article>
    </div>
  )
}
