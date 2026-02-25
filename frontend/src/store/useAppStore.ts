'use client';

import { create } from 'zustand';

export type ElectionMode = 'city' | 'national';

type AppState = {
  mode: ElectionMode;
  searchQuery: string;
  selectedConstituency: string | null;
  setMode: (mode: ElectionMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedConstituency: (name: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  mode: 'city',
  searchQuery: '',
  selectedConstituency: null,
  setMode: (mode) => set({ mode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedConstituency: (selectedConstituency) => set({ selectedConstituency }),
}));
