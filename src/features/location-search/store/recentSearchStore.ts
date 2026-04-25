import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LOCAL_STORAGE_KEYS } from '../../../config/constants'
import type { LocationSummary } from '../../../types/location'

type RecentSearchState = {
  recentSearches: LocationSummary[]
  addRecentSearch: (location: LocationSummary) => void
  deleteRecentSearch: (locationId: number) => void
}

export const useRecentSearchStore = create<RecentSearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (location) =>
        set((state) => {
          const deduped = state.recentSearches.filter((item) => item.id !== location.id)
          return { recentSearches: [location, ...deduped].slice(0, 5) }
        }),
      deleteRecentSearch: (locationId) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((location) => location.id !== locationId),
        })),
    }),
    {
      name: LOCAL_STORAGE_KEYS.recentSearches,
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    },
  ),
)
