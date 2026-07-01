import { create } from 'zustand'

interface VaultStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useVaultStore = create<VaultStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
