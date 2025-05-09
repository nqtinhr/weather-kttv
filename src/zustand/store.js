import { getInitialHour } from '@/utils/helper'
import { create } from 'zustand'

export const useMapStore = create((set) => ({
  currentHourIndex: getInitialHour(),
  setCurrentHourIndex: (index) => set({ currentHourIndex: index })
}))
