import { X } from '@phosphor-icons/react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useWeatherOverview } from '../../hooks/useWeatherOverview'
import { getWeatherVisualByCode } from '../../../../lib/openMeteoWeather'
import { Button } from '../../../../components/ui/Button'
import type { LocationSummary } from '../../../../types/location'
import type { UnitPreferences } from '../../../../types/weather'
import { ConditionsDetailsSection } from '../../conditions/components/ConditionsDetailsSection'
import { DayDetailChartsSkeleton } from '../../forecast/components/DayDetailChartsSkeleton'
import { DayDetailsSummary } from '../../forecast/components/DayDetailsSummary'
import { TenDayForecastSection } from '../../forecast/components/TenDayForecastSection'
import { WeatherHeroSection } from '../../current/components/WeatherHeroSection'
import { WeatherOverviewLoading } from './WeatherOverviewLoading'
import styles from './WeatherOverviewSection.module.scss'

const DayDetailCharts = lazy(() =>
  import('../../forecast/components/DayDetailCharts').then((module) => ({
    default: module.DayDetailCharts,
  })),
)

type WeatherOverviewSectionProps = {
  geoStatus: 'requesting' | 'granted' | 'denied'
  selectedLocation: LocationSummary | null
  isCurrentLocationSelected: boolean
  selectedLocationSubtitle: string
  canAddToWatchlist: boolean
  isInWatchlist: boolean
  onAddToWatchlist: () => void
  units: UnitPreferences
}

export function WeatherOverviewSection({
  geoStatus,
  selectedLocation,
  isCurrentLocationSelected,
  selectedLocationSubtitle,
  canAddToWatchlist,
  isInWatchlist,
  onAddToWatchlist,
  units,
}: WeatherOverviewSectionProps) {
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null)
  const [isSmallViewport, setIsSmallViewport] = useState(false)
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const query = window.matchMedia('(max-width: 42rem)')
    const update = () => setIsSmallViewport(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTimestamp(Date.now())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  const weatherOverviewQuery = useWeatherOverview({
    latitude: selectedLocation?.latitude,
    longitude: selectedLocation?.longitude,
    units,
  })

  const overview = weatherOverviewQuery.data
  const weatherVisual = overview
    ? getWeatherVisualByCode(overview.current.weatherCode, overview.current.isDay)
    : null

  const temperatureUnit = units.temperature === 'celsius' ? '°C' : '°F'
  const windUnitMap: Record<UnitPreferences['windSpeed'], string> = {
    kmh: 'km/h',
    ms: 'm/s',
    mph: 'mph',
    kn: 'kn',
  }
  const pressureUnitMap: Record<UnitPreferences['pressure'], string> = {
    hpa: 'hPa',
    mmhg: 'mmHg',
    inhg: 'inHg',
  }
  const distanceUnitMap: Record<UnitPreferences['distance'], string> = {
    km: 'km',
    mi: 'mi',
  }
  const precipitationUnit = units.precipitation === 'mm' ? 'mm' : 'in'

  const feelsLikeDelta = overview
    ? overview.current.apparentTemperature - overview.current.temperature
    : 0
  const feelsLikeProgress = Math.min(Math.max((feelsLikeDelta + 10) / 20, 0), 1) * 100
  const uvProgress = overview
    ? Math.min(Math.max((overview.current.uvIndex / 11) * 100, 0), 100)
    : 0
  const feelsLikeDeltaLabel =
    feelsLikeDelta > 0
      ? `↑${Math.round(feelsLikeDelta)}${temperatureUnit}`
      : feelsLikeDelta < 0
        ? `↓${Math.abs(Math.round(feelsLikeDelta))}${temperatureUnit}`
        : `0${temperatureUnit}`
  const uvLabel =
    !overview || overview.current.uvIndex < 3
      ? 'Low'
      : overview.current.uvIndex < 6
        ? 'Moderate'
        : overview.current.uvIndex < 8
          ? 'High'
          : overview.current.uvIndex < 11
            ? 'Very high'
            : 'Extreme'

  const selectedTenDay = useMemo(() => {
    if (!overview) {
      return null
    }

    const activeDate =
      selectedDayDate ?? (!isSmallViewport ? overview.tenDayForecast[0]?.date : null)
    if (!activeDate) {
      return null
    }

    return overview.tenDayForecast.find((day) => day.date === activeDate) ?? null
  }, [overview, selectedDayDate, isSmallViewport])

  const selectedDaySeries =
    selectedTenDay && overview ? (overview.hourlyByDate[selectedTenDay.date] ?? []) : []
  const showDayChartsSkeleton = weatherOverviewQuery.isFetching || selectedDaySeries.length === 0

  function closeDrawer() {
    setSelectedDayDate(null)
  }

  function renderDayCharts() {
    if (showDayChartsSkeleton) {
      return <DayDetailChartsSkeleton />
    }

    return (
      <Suspense fallback={<DayDetailChartsSkeleton />}>
        <DayDetailCharts
          data={selectedDaySeries}
          nowTimestamp={nowTimestamp}
          temperatureUnit={temperatureUnit}
          windUnit={windUnitMap[units.windSpeed]}
          pressureUnit={pressureUnitMap[units.pressure]}
          distanceUnit={distanceUnitMap[units.distance]}
        />
      </Suspense>
    )
  }

  return (
    <section className={styles.weatherBoard}>
      {geoStatus === 'requesting' && !selectedLocation && (
        <p className={styles.helperText}>Requesting location permission...</p>
      )}

      {!selectedLocation && (
        <p className={styles.helperText}>
          {geoStatus === 'denied'
            ? 'Location access denied. Select a city from search suggestions to load weather.'
            : 'Select a city from search suggestions to load weather.'}
        </p>
      )}

      {weatherOverviewQuery.isLoading && <WeatherOverviewLoading />}

      {weatherOverviewQuery.isError && (
        <p className={styles.errorText}>Failed to fetch weather data. Try another location.</p>
      )}

      {overview && weatherVisual && selectedLocation && (
        <div className={styles.overviewGrid}>
          <div className={styles.heroCard}>
            <WeatherHeroSection
              selectedLocation={selectedLocation}
              selectedLocationSubtitle={selectedLocationSubtitle}
              isCurrentLocationSelected={isCurrentLocationSelected}
              canAddToWatchlist={canAddToWatchlist}
              isInWatchlist={isInWatchlist}
              onAddToWatchlist={onAddToWatchlist}
              overview={overview}
              weatherVisual={weatherVisual}
              temperatureUnit={temperatureUnit}
              windUnit={windUnitMap[units.windSpeed]}
            />

            <ConditionsDetailsSection
              overview={overview}
              temperatureUnit={temperatureUnit}
              windUnit={windUnitMap[units.windSpeed]}
              pressureUnit={pressureUnitMap[units.pressure]}
              distanceUnit={distanceUnitMap[units.distance]}
              precipitationUnit={precipitationUnit}
              feelsLikeProgress={feelsLikeProgress}
              feelsLikeDeltaLabel={feelsLikeDeltaLabel}
              uvProgress={uvProgress}
              uvLabel={uvLabel}
            />
          </div>

          <TenDayForecastSection
            overview={overview}
            selectedTenDay={selectedTenDay}
            onSelectDay={setSelectedDayDate}
            isSmallViewport={isSmallViewport}
            temperatureUnit={temperatureUnit}
            dayCharts={renderDayCharts()}
          />
        </div>
      )}

      {selectedTenDay && isSmallViewport && (
        <div className={styles.dayDrawerLayer} role="presentation" onClick={closeDrawer}>
          <section
            className={styles.dayDrawer}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedTenDay.dayLabel} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.dayDrawerHeader}>
              <h4>{selectedTenDay.dayLabel} details</h4>
              <Button
                size="icon"
                className={styles.dayDrawerClose}
                aria-label="Close day details"
                onClick={closeDrawer}
              >
                <X weight="bold" />
              </Button>
            </header>
            <DayDetailsSummary day={selectedTenDay} temperatureUnit={temperatureUnit} />
            {renderDayCharts()}
          </section>
        </div>
      )}
    </section>
  )
}
