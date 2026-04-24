import { useMemo, useState } from 'react'
import { CloudSun, Heart, Moon, Sun } from '@phosphor-icons/react'
import styles from './styles/App.module.scss'
import { getWeatherVisualByCode } from './lib/openMeteoWeather'
import { useTheme } from './theme/useTheme'

const weekForecast = [
  { day: 'Mon', weatherCode: 0, high: 24, low: 15, rain: 3 },
  { day: 'Tue', weatherCode: 2, high: 22, low: 14, rain: 12 },
  { day: 'Wed', weatherCode: 63, high: 19, low: 13, rain: 66 },
  { day: 'Thu', weatherCode: 80, high: 20, low: 14, rain: 48 },
  { day: 'Fri', weatherCode: 1, high: 21, low: 13, rain: 20 },
  { day: 'Sat', weatherCode: 81, high: 18, low: 12, rain: 72 },
  { day: 'Sun', weatherCode: 0, high: 23, low: 14, rain: 6 },
]

const currentMetrics = [
  { label: 'Feels Like', value: '21deg' },
  { label: 'Humidity', value: '64%' },
  { label: 'Wind', value: '18 km/h' },
  { label: 'UV Index', value: '5 Moderate' },
  { label: 'Visibility', value: '9.8 km' },
  { label: 'Pressure', value: '1014 hPa' },
]

function App() {
  const { theme, toggleTheme } = useTheme()
  const [isFavorite, setIsFavorite] = useState(false)

  const rainSummary = useMemo(() => {
    const wetDays = weekForecast.filter((item) => item.rain >= 50).length
    return `${wetDays} / 7 wet days`
  }, [])

  return (
    <main className={styles.app}>
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <span className={styles.brandLogo} aria-hidden="true">
            <CloudSun weight="duotone" />
          </span>
          <span className={styles.brandName}>SkyScope</span>
        </div>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon weight="bold" /> : <Sun weight="bold" />}
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart weight={isFavorite ? 'fill' : 'regular'} />
          </button>
        </div>
      </header>

      <section className={styles.layoutGrid}>
        <article className={`${styles.panel} ${styles.current}`}>
          <p className={styles.kicker}>Current Conditions</p>
          <div className={styles.currentRow}>
            <div>
              <p className={styles.currentTemp}>22deg</p>
              <p className={styles.currentCondition}>Partly Cloudy in Helsinki</p>
            </div>
            <p className={styles.currentRange}>H: 24deg · L: 15deg</p>
          </div>
          <p className={styles.currentUpdated}>Updated 10 minutes ago</p>
        </article>

        <article className={`${styles.panel} ${styles.insights}`}>
          <p className={styles.kicker}>Planning Signals</p>
          <ul>
            <li>
              <span>Rain Risk</span>
              <strong>{rainSummary}</strong>
            </li>
            <li>
              <span>Best Outdoor Window</span>
              <strong>Mon 14:00 to Tue 11:00</strong>
            </li>
            <li>
              <span>Travel Friction</span>
              <strong className={styles.warn}>Moderate</strong>
            </li>
          </ul>
        </article>
      </section>

      <section className={`${styles.panel} ${styles.metrics}`}>
        <p className={styles.kicker}>Atmospheric Metrics</p>
        <div className={styles.metricsGrid}>
          {currentMetrics.map((metric) => (
            <article key={metric.label} className={styles.metricTile}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.panel} ${styles.forecast}`}>
        <div className={styles.forecastHead}>
          <p className={styles.kicker}>7-Day Forecast</p>
          <p className={styles.meta}>Localized for district-level planning</p>
        </div>
        <div className={styles.forecastGrid}>
          {weekForecast.map((item) => {
            const weatherVisual = getWeatherVisualByCode(item.weatherCode, true)
            return (
              <article key={item.day} className={styles.dayCard}>
                <p className={styles.dayCardDay}>{item.day}</p>
                <p className={styles.dayCardIcon} aria-hidden="true">
                  {weatherVisual.icon}
                </p>
                <p className={styles.dayCardCondition}>{weatherVisual.label}</p>
                <p className={styles.dayCardRange}>
                  <strong>{item.high}deg</strong>
                  <span>{item.low}deg</span>
                </p>
                <p className={styles.dayCardRain}>{item.rain}% rain</p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
