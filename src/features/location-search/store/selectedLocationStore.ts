import { create } from 'zustand'
import type { LocationSummary } from '../../../types/location'

type SelectedLocationState = {
  selectedLocation: LocationSummary | null
  setSelectedLocation: (location: LocationSummary | null) => void
}

export const useSelectedLocationStore = create<SelectedLocationState>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}))
