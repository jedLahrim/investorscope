import { create } from 'zustand'

interface SearchState {
  selectedTypeId: string | null;
  selectedCategoryId: string | null;
  keywords: string;
  setType: (id: string | null) => void;
  setCategory: (id: string | null) => void;
  setKeywords: (keywords: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  selectedTypeId: null,
  selectedCategoryId: null,
  keywords: '',
  setType: (id) => set({ selectedTypeId: id, selectedCategoryId: null }),
  setCategory: (id) => set({ selectedCategoryId: id }),
  setKeywords: (keywords) => set({ keywords }),
}));
