import { beforeEach, describe, expect, it } from 'vitest'
import { useWatchlistStore } from './watchlistStore'

const location = (id: number) => ({
  id,
  name: `Location ${id}`,
  latitude: id,
  longitude: id,
})

describe('useWatchlistStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useWatchlistStore.setState({ watchlist: [] })
  })

  it('adds locations to the front', () => {
    useWatchlistStore.getState().addToWatchlist(location(1))
    useWatchlistStore.getState().addToWatchlist(location(2))

    expect(useWatchlistStore.getState().watchlist.map((item) => item.id)).toEqual([2, 1])
  })

  it('deduplicates location by id', () => {
    const store = useWatchlistStore.getState()

    store.addToWatchlist(location(1))
    store.addToWatchlist(location(2))
    store.addToWatchlist(location(1))

    expect(useWatchlistStore.getState().watchlist.map((item) => item.id)).toEqual([1, 2])
  })

  it('caps watchlist to 20 items', () => {
    const store = useWatchlistStore.getState()

    for (let id = 1; id <= 25; id += 1) {
      store.addToWatchlist(location(id))
    }

    expect(useWatchlistStore.getState().watchlist).toHaveLength(20)
    expect(useWatchlistStore.getState().watchlist[0].id).toBe(25)
    expect(useWatchlistStore.getState().watchlist.at(-1)?.id).toBe(6)
  })

  it('removes location by id', () => {
    const store = useWatchlistStore.getState()

    store.addToWatchlist(location(1))
    store.addToWatchlist(location(2))
    store.removeFromWatchlist(1)

    expect(useWatchlistStore.getState().watchlist.map((item) => item.id)).toEqual([2])
  })
})
