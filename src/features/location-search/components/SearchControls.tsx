import { Crosshair, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { SegmentedControl } from '../../../components/ui/SegmentedControl'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { useLocationPreviews } from '../hooks/useLocationPreviews'
import { locationLabel } from '../../../lib/location'
import { useLocationSearch } from '../hooks/useLocationSearch'
import type { LocationSummary } from '../../../types/location'
import type { UnitPreferences } from '../../../types/weather'
import { RecentSearchItem } from './RecentSearchItem'
import styles from './SearchControls.module.scss'

type SearchControlsProps = {
  recentSearches: LocationSummary[]
  units: UnitPreferences
  onSelectLocation: (location: LocationSummary) => void
  onSelectCurrentLocation: () => void
  canSelectCurrentLocation: boolean
  isCurrentLocationSelected: boolean
  onDeleteRecent: (locationId: number) => void
  onSetTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void
}

export function SearchControls({
  recentSearches,
  units,
  onSelectLocation,
  onSelectCurrentLocation,
  canSelectCurrentLocation,
  isCurrentLocationSelected,
  onDeleteRecent,
  onSetTemperatureUnit,
}: SearchControlsProps) {
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebouncedValue(query, 350)
  const locationSearch = useLocationSearch(debouncedQuery)
  const locations = useMemo(() => locationSearch.data ?? [], [locationSearch.data])
  const isTyping = query.trim().length > 0
  const recentPreviewsQuery = useLocationPreviews({
    locations: recentSearches,
    units,
    enabled: isDropdownOpen && !isTyping,
    scope: 'recent-searches',
  })
  const recentPreviewMap = recentPreviewsQuery.data ?? {}

  function handleClearQuery() {
    setQuery('')
    inputRef.current?.focus()
  }

  function handleSelectLocation(location: LocationSummary) {
    onSelectLocation(location)
    setQuery(locationLabel(location))
    setIsDropdownOpen(false)
  }

  return (
    <section className={styles.controls}>
      <form className={styles.searchBar} onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="location-search" className={styles.srOnly}>
          Search location
        </label>
        <div
          ref={wrapperRef}
          className={`${styles.searchDropdownWrapper} ${isDropdownOpen ? styles.searchDropdownWrapperOpen : ''}`}
          onFocusCapture={() => setIsDropdownOpen(true)}
          onBlurCapture={(event) => {
            const nextFocusedElement = event.relatedTarget as Node | null
            if (wrapperRef.current?.contains(nextFocusedElement)) {
              return
            }

            setIsDropdownOpen(false)
          }}
        >
          <Button
            className={styles.iconButton}
            aria-label="Search location"
            title="Search location"
            size="icon"
          >
            <MagnifyingGlass weight="bold" />
          </Button>
          <input
            ref={inputRef}
            id="location-search"
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query.length > 0 && (
            <Button
              className={styles.clearInputButton}
              aria-label="Clear search input"
              title="Clear input"
              size="icon"
              onClick={handleClearQuery}
            >
              <X weight="bold" />
            </Button>
          )}

          <div
            className={`${styles.searchDropdown} ${isDropdownOpen ? styles.searchDropdownOpen : ''}`}
            role="listbox"
            aria-label="Search suggestions"
          >
            {!isTyping && (
              <>
                <p className={styles.dropdownLabel}>Recent Searches</p>
                {recentSearches.length === 0 && (
                  <p className={styles.dropdownEmpty}>No recent searches yet.</p>
                )}
                {recentSearches.map((location) => (
                  <RecentSearchItem
                    key={`recent-${location.id}`}
                    location={location}
                    preview={recentPreviewMap[location.id] ?? null}
                    isLoadingPreview={
                      recentPreviewsQuery.isLoading && recentPreviewMap[location.id] === undefined
                    }
                    onDelete={onDeleteRecent}
                    onSelect={handleSelectLocation}
                  />
                ))}
              </>
            )}

            {isTyping && debouncedQuery.trim().length < 2 && (
              <p className={styles.dropdownEmpty}>Keep typing to search locations.</p>
            )}

            {isTyping && debouncedQuery.trim().length >= 2 && locationSearch.isLoading && (
              <div className={styles.dropdownLoading} aria-hidden="true">
                <Skeleton className={styles.dropdownLoadingLine} />
                <Skeleton className={styles.dropdownLoadingLine} />
                <Skeleton className={styles.dropdownLoadingLine} />
              </div>
            )}

            {isTyping && debouncedQuery.trim().length >= 2 && locationSearch.isError && (
              <p className={styles.dropdownEmpty}>Failed to search. Try again.</p>
            )}

            {isTyping &&
              debouncedQuery.trim().length >= 2 &&
              !locationSearch.isLoading &&
              !locationSearch.isError &&
              locations.length === 0 && <p className={styles.dropdownEmpty}>No locations found.</p>}

            {isTyping &&
              debouncedQuery.trim().length >= 2 &&
              locations.map((location) => (
                <Button
                  key={location.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelectLocation(location)}
                >
                  {locationLabel(location)}
                </Button>
              ))}
          </div>
        </div>
      </form>

      <div className={styles.rightControls}>
        <Button
          className={`${styles.currentLocationButton} ${isCurrentLocationSelected ? styles.currentLocationButtonActive : ''}`}
          aria-label="Show current location weather"
          title="Show current location weather"
          size="icon"
          onClick={onSelectCurrentLocation}
          disabled={!canSelectCurrentLocation}
        >
          <Crosshair weight="bold" />
        </Button>

        <SegmentedControl
          className={styles.unitToggle}
          ariaLabel="Temperature unit"
          value={units.temperature}
          onChange={onSetTemperatureUnit}
          options={[
            { value: 'celsius', label: 'deg C' },
            { value: 'fahrenheit', label: 'deg F' },
          ]}
        />
      </div>
    </section>
  )
}
