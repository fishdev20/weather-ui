import { Skeleton } from '../../../components/ui/Skeleton'
import styles from './WatchlistDropdownItem.module.scss'

type WatchlistDropdownSkeletonProps = {
  count?: number
}

export function WatchlistDropdownSkeleton({ count = 3 }: WatchlistDropdownSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div className={styles.watchlistRow} key={`watchlist-skeleton-${index}`} aria-hidden="true">
          <div className={styles.watchlistItemMain}>
            <span className={styles.watchlistItemTop}>
              <Skeleton className={styles.watchlistItemNameLoading} />
              <Skeleton className={styles.watchlistItemMetaLoading} />
            </span>
            <Skeleton className={styles.watchlistItemSubLoading} />
          </div>
          <Skeleton className={styles.watchlistRemoveLoading} />
        </div>
      ))}
    </>
  )
}
