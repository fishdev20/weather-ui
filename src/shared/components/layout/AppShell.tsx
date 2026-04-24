import { CloudSun, Gear, Heart, Moon, Sun } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../../../theme/useTheme'
import { Button } from '../ui/Button'
import styles from './AppShell.module.scss'

export function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const [isFavorite, setIsFavorite] = useState(false)

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
          <Button
            className={`${styles.iconButton} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            size="icon"
          >
            <Heart weight={isFavorite ? 'fill' : 'regular'} />
          </Button>
        </div>
      </header>

      <Outlet />
    </main>
  )
}
