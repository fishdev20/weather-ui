import { beforeEach, describe, expect, it } from 'vitest'
import { useRecentSearchStore } from './recentSearchStore'

const location = (id: number) => ({
  id,
  name: `Location ${id}`,
  latitude: id,
  longitude: id,
})

describe('useRecentSearchStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useRecentSearchStore.setState({ recentSearches: [] })
  })

  it('adds locations to the front', () => {
    useRecentSearchStore.getState().addRecentSearch(location(1))
    useRecentSearchStore.getState().addRecentSearch(location(2))

    expect(useRecentSearchStore.getState().recentSearches.map((item) => item.id)).toEqual([2, 1])
  })

  it('deduplicates an existing location and keeps most recent first', () => {
    const store = useRecentSearchStore.getState()

    store.addRecentSearch(location(1))
    store.addRecentSearch(location(2))
    store.addRecentSearch(location(1))

    expect(useRecentSearchStore.getState().recentSearches.map((item) => item.id)).toEqual([1, 2])
  })

  it('caps recent searches to 5 items', () => {
    const store = useRecentSearchStore.getState()

    for (let id = 1; id <= 7; id += 1) {
      store.addRecentSearch(location(id))
    }

    expect(useRecentSearchStore.getState().recentSearches).toHaveLength(5)
    expect(useRecentSearchStore.getState().recentSearches.map((item) => item.id)).toEqual([7, 6, 5, 4, 3])
  })

  it('removes a location by id', () => {
    const store = useRecentSearchStore.getState()

    store.addRecentSearch(location(1))
    store.addRecentSearch(location(2))
    store.deleteRecentSearch(1)

    expect(useRecentSearchStore.getState().recentSearches.map((item) => item.id)).toEqual([2])
  })
})
