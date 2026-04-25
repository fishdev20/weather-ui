import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_UNITS } from '../../../config/constants'
import { useSettingsStore } from './settingsStore'

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.setState({ units: DEFAULT_UNITS })
  })

  it('starts with default units', () => {
    expect(useSettingsStore.getState().units).toEqual(DEFAULT_UNITS)
  })

  it('updates each unit independently', () => {
    const store = useSettingsStore.getState()

    store.setTemperatureUnit('fahrenheit')
    store.setWindSpeedUnit('mph')
    store.setPrecipitationUnit('inch')
    store.setPressureUnit('mmhg')
    store.setDistanceUnit('mi')

    expect(useSettingsStore.getState().units).toEqual({
      temperature: 'fahrenheit',
      windSpeed: 'mph',
      precipitation: 'inch',
      pressure: 'mmhg',
      distance: 'mi',
    })
  })
})
