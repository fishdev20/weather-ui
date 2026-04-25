import { CloudSun, Gear, ListBullets, Moon, Sun } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSelectedLocationStore } from '../../features/location-search/store/selectedLocationStore'
import { useUnitPreferences } from '../../features/unit-preferences/hooks/useUnitPreferences'
import { WatchlistDropdownItem } from '../../features/watchlist/components/WatchlistDropdownItem'
import { WatchlistDropdownSkeleton } from '../../features/watchlist/components/WatchlistDropdownSkeleton'
import { useWatchlistPreviews } from '../../features/watchlist/hooks/useWatchlistPreviews'
import { useWatchlistStore } from '../../features/watchlist/store/watchlistStore'
import { useTheme } from '../../theme/useTheme'
import { Button } from '../ui/Button'
import styles from './AppShell.module.scss'

export function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const { units } = useUnitPreferences()
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false)
  const watchlistWrapperRef = useRef<HTMLDivElement>(null)
  const watchlist = useWatchlistStore((state) => state.watchlist)
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist)
  const setSelectedLocation = useSelectedLocationStore((state) => state.setSelectedLocation)
  const navigate = useNavigate()
  const watchlistPreviewsQuery = useWatchlistPreviews({
    locations: watchlist,
    units,
    enabled: isWatchlistOpen,
  })
  const watchlistPreviewMap = watchlistPreviewsQuery.data ?? {}
  const shouldShowWatchlistSkeleton =
    watchlist.length > 0 && watchlistPreviewsQuery.isLoading && watchlistPreviewsQuery.data === undefined

  function handleSelectWatchlistItem(index: number) {
    const location = watchlist[index]
    if (!location) {
      return
    }

    setSelectedLocation(location)
    setIsWatchlistOpen(false)
    navigate('/')
  }

  return (
    <main className={styles.app}>
      <header className={styles.navbar}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandLogo} aria-hidden="true">
            <CloudSun weight="duotone" />
          </span>
          <span className={styles.brandName}>SkyScope</span>
        </Link>

        <div className={styles.navActions}>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.iconButton} ${isActive ? styles.activeIcon : ''}`
            }
            aria-label="Open settings"
            title="Open settings"
          >
            <Gear weight="bold" />
          </NavLink>
          <Button
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            size="icon"
          >
            {theme === 'light' ? <Moon weight="bold" /> : <Sun weight="bold" />}
          </Button>
          <div
            ref={watchlistWrapperRef}
            className={styles.watchlist}
            onBlurCapture={(event) => {
              const nextFocusedElement = event.relatedTarget as Node | null
              if (watchlistWrapperRef.current?.contains(nextFocusedElement)) {
                return
              }

              setIsWatchlistOpen(false)
            }}
          >
            <Button
              className={`${styles.iconButton} ${isWatchlistOpen ? styles.activeIcon : ''}`}
              onClick={() => setIsWatchlistOpen((prev) => !prev)}
              aria-label="Open watch list"
              title="Open watch list"
              size="icon"
            >
              <ListBullets weight="bold" />
            </Button>
            {isWatchlistOpen && (
              <div className={styles.watchlistDropdown} role="menu" aria-label="Watch list">
                {watchlist.length === 0 && (
                  <p className={styles.watchlistEmpty}>No locations in watch list yet.</p>
                )}
                {shouldShowWatchlistSkeleton && (
                  <WatchlistDropdownSkeleton count={Math.min(watchlist.length, 4)} />
                )}
                {!shouldShowWatchlistSkeleton &&
                  watchlist.map((location, index) => (
                    <WatchlistDropdownItem
                      key={location.id}
                      location={location}
                      preview={watchlistPreviewMap[location.id] ?? null}
                      isLoadingPreview={
                        watchlistPreviewsQuery.isLoading && watchlistPreviewMap[location.id] === undefined
                      }
                      onSelect={() => handleSelectWatchlistItem(index)}
                      onRemove={() => removeFromWatchlist(location.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  )
}
