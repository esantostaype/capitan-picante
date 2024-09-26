import { create } from 'zustand'

interface GlobalState {
  updateTrigger: boolean
  toggleUpdateTrigger: () => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  updateTrigger: false,
  toggleUpdateTrigger: () => set((state) => ({ updateTrigger: !state.updateTrigger }))
}))