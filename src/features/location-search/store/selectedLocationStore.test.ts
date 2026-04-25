import { beforeEach, describe, expect, it } from 'vitest'
import { useSelectedLocationStore } from './selectedLocationStore'

const helsinki = {
  id: 1,
  name: 'Helsinki',
  latitude: 60.17,
  longitude: 24.94,
}

describe('useSelectedLocationStore', () => {
  beforeEach(() => {
    useSelectedLocationStore.setState({ selectedLocation: null })
  })

  it('sets selected location', () => {
    useSelectedLocationStore.getState().setSelectedLocation(helsinki)
    expect(useSelectedLocationStore.getState().selectedLocation).toEqual(helsinki)
  })

  it('clears selected location', () => {
    const store = useSelectedLocationStore.getState()
    store.setSelectedLocation(helsinki)
    store.setSelectedLocation(null)

    expect(useSelectedLocationStore.getState().selectedLocation).toBeNull()
  })
})
