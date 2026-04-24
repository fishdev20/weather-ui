import { MagnifyingGlass } from '@phosphor-icons/react'
import { useState } from 'react'
import { useUnitPreferences } from '../../features/unit-toggle/useUnitPreferences'
import { Button } from '../../shared/components/ui/Button'
import styles from './SearchPage.module.scss'

export function SearchPage() {
  const { units, setTemperatureUnit } = useUnitPreferences()
  const [query, setQuery] = useState('')

  return (
    <>
      <section className={styles.controls}>
        <form className={styles.searchBar} onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="location-search" className={styles.srOnly}>
            Search location
          </label>
          <Button
            className={styles.iconButton}
            aria-label="Search location"
            title="Search location"
            size="icon"
          >
            <MagnifyingGlass weight="bold" />
          </Button>
          <input
            id="location-search"
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>

        <div className={styles.unitToggle} role="group" aria-label="Temperature unit">
          <Button
            className={units.temperature === 'celsius' ? styles.activeUnit : undefined}
            onClick={() => setTemperatureUnit('celsius')}
          >
            deg C
          </Button>
          <Button
            className={units.temperature === 'fahrenheit' ? styles.activeUnit : undefined}
            onClick={() => setTemperatureUnit('fahrenheit')}
          >
            deg F
          </Button>
        </div>
      </section>

      <section className={styles.placeholder}>
        <p className={styles.kicker}>Starter Scope</p>
        <p className={styles.helperText}>
          Search and unit toggle are ready for Open-Meteo wiring next.
        </p>
        <p className={styles.helperText}>Current query: {query || 'none'}</p>
        <p className={styles.helperText}>
          Current unit: {units.temperature === 'celsius' ? 'Celsius' : 'Fahrenheit'}
        </p>
      </section>
    </>
  )
}
