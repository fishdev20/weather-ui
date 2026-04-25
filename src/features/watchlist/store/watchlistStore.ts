import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LOCAL_STORAGE_KEYS } from '../../../config/constants'
import type { LocationSummary } from '../../../types/location'

type WatchlistState = {
  watchlist: LocationSummary[]
  addToWatchlist: (location: LocationSummary) => void
  removeFromWatchlist: (locationId: number) => void
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlist: [],
      addToWatchlist: (location) =>
        set((state) => {
          const deduped = state.watchlist.filter((item) => item.id !== location.id)
          return { watchlist: [location, ...deduped].slice(0, 20) }
        }),
      removeFromWatchlist: (locationId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((location) => location.id !== locationId),
        })),
    }),
    {
      name: LOCAL_STORAGE_KEYS.watchlist,
      partialize: (state) => ({ watchlist: state.watchlist }),
    },
  ),
)
