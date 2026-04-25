import { useEffect, useMemo, useRef, useState } from 'react'
import { SearchControls } from '../../features/location-search/components/SearchControls'
import { useReverseGeocodeLocation } from '../../features/location-search/hooks/useReverseGeocodeLocation'
import { useRecentSearchStore } from '../../features/location-search/store/recentSearchStore'
import { useSelectedLocationStore } from '../../features/location-search/store/selectedLocationStore'
import { useUnitPreferences } from '../../features/unit-preferences/hooks/useUnitPreferences'
import { useWatchlistStore } from '../../features/watchlist/store/watchlistStore'
import { WeatherOverviewSection } from '../../features/weather-overview/overview/components/WeatherOverviewSection'
import { locationLabel } from '../../lib/location'
import type { LocationSummary } from '../../types/location'
import styles from './SearchPage.module.scss'

const CURRENT_LOCATION_ID = -1

export function SearchPage() {
  const supportsGeolocation = typeof window !== 'undefined' && 'geolocation' in navigator
  const { units, setTemperatureUnit } = useUnitPreferences()
  const [geoStatus, setGeoStatus] = useState<'requesting' | 'granted' | 'denied'>(
    supportsGeolocation ? 'requesting' : 'denied',
  )
  const [watchlistNotice, setWatchlistNotice] = useState<string | null>(null)
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(
    null,
  )
  const selectedLocationFromStore = useSelectedLocationStore((state) => state.selectedLocation)
  const setSelectedLocation = useSelectedLocationStore((state) => state.setSelectedLocation)
  const watchlist = useWatchlistStore((state) => state.watchlist)
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist)

  const recentSearches = useRecentSearchStore((state) => state.recentSearches)
  const addRecentSearch = useRecentSearchStore((state) => state.addRecentSearch)
  const deleteRecentSearch = useRecentSearchStore((state) => state.deleteRecentSearch)

  const hasRequestedGeolocationRef = useRef(false)

  const reverseGeocodeQuery = useReverseGeocodeLocation(
    currentCoords?.latitude,
    currentCoords?.longitude,
    geoStatus === 'granted',
  )

  useEffect(() => {
    if (hasRequestedGeolocationRef.current) {
      return
    }

    hasRequestedGeolocationRef.current = true

    if (!supportsGeolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoStatus('granted')
        setCurrentCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        setGeoStatus('denied')
      },
      { timeout: 10_000 },
    )
  }, [supportsGeolocation])

  useEffect(() => {
    if (!watchlistNotice) {
      return
    }

    const timer = window.setTimeout(() => {
      setWatchlistNotice(null)
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [watchlistNotice])

  const currentLocation = useMemo<LocationSummary | null>(() => {
    if (!currentCoords) {
      return null
    }

    if (reverseGeocodeQuery.data) {
      return reverseGeocodeQuery.data
    }

    return {
      id: CURRENT_LOCATION_ID,
      name: 'Current location',
      latitude: currentCoords.latitude,
      longitude: currentCoords.longitude,
    }
  }, [currentCoords, reverseGeocodeQuery.data])

  const selectedLocation = selectedLocationFromStore ?? currentLocation
  const isCurrentLocationSelected = selectedLocationFromStore === null && Boolean(currentLocation)
  const canAddToWatchlist = Boolean(selectedLocation && selectedLocation.id !== CURRENT_LOCATION_ID)
  const isInWatchlist = Boolean(
    selectedLocation && watchlist.some((location) => location.id === selectedLocation.id),
  )

  function handleSelectLocation(location: LocationSummary) {
    setSelectedLocation(location)
    addRecentSearch(location)
  }

  function handleAddToWatchlist() {
    if (!selectedLocation || selectedLocation.id === CURRENT_LOCATION_ID) {
      return
    }

    addToWatchlist(selectedLocation)
    setWatchlistNotice(`${selectedLocation.name} added to watch list`)
  }

  const selectedLocationSubtitle =
    selectedLocation && selectedLocation.id === CURRENT_LOCATION_ID
      ? 'Detecting location name...'
      : selectedLocation
        ? locationLabel(selectedLocation)
        : ''

  return (
    <>
      <SearchControls
        recentSearches={recentSearches}
        units={units}
        onSelectLocation={handleSelectLocation}
        onSelectCurrentLocation={() => setSelectedLocation(null)}
        canSelectCurrentLocation={Boolean(currentLocation)}
        isCurrentLocationSelected={isCurrentLocationSelected}
        onDeleteRecent={deleteRecentSearch}
        onSetTemperatureUnit={setTemperatureUnit}
      />

      <WeatherOverviewSection
        geoStatus={geoStatus}
        selectedLocation={selectedLocation}
        isCurrentLocationSelected={isCurrentLocationSelected}
        selectedLocationSubtitle={selectedLocationSubtitle}
        canAddToWatchlist={canAddToWatchlist}
        isInWatchlist={isInWatchlist}
        onAddToWatchlist={handleAddToWatchlist}
        units={units}
      />

      {watchlistNotice && (
        <div className={styles.toastSuccess} role="status" aria-live="polite">
          {watchlistNotice}
        </div>
      )}
    </>
  )
}
