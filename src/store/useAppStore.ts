import { create } from 'zustand';

export type AppMode = 'city' | 'national';

interface AppState {
  mode: AppMode;
  selectedConstituency: string | null;
  setMode: (mode: AppMode) => void;
  setSelectedConstituency: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'city',
  selectedConstituency: null,
  setMode: (mode) => set({ mode, selectedConstituency: null }),
  setSelectedConstituency: (id) => set({ selectedConstituency: id }),
}));
