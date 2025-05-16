import { getInitialHour, getStartAndEndTime } from '@/utils/helper'
import { create } from 'zustand'

const { startDateTime, endDateTime } = getStartAndEndTime(new Date())

export const useMapStore = create((set) => ({
  currentHourIndex: getInitialHour(),
  setCurrentHourIndex: (index) => set({ currentHourIndex: index })
}))

export const useFilterStore = create((set) => ({
  startDateTime,
  endDateTime,
  region: null,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () => set({ startDateTime, endDateTime, region: null })
}))
