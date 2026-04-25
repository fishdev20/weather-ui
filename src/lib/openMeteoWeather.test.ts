import { describe, expect, it } from 'vitest'
import { getWeatherVisualByCode } from './openMeteoWeather'

describe('getWeatherVisualByCode', () => {
  it('returns known weather metadata for daytime', () => {
    expect(getWeatherVisualByCode(0, true)).toEqual({
      label: 'Clear sky',
      icon: '🌞',
    })
  })

  it('returns known weather metadata for nighttime', () => {
    expect(getWeatherVisualByCode(1, false)).toEqual({
      label: 'Mainly clear',
      icon: '🌙',
    })
  })

  it('returns fallback metadata for unknown codes', () => {
    expect(getWeatherVisualByCode(999, true)).toEqual({
      label: 'Unknown',
      icon: '❔',
    })
  })
})
