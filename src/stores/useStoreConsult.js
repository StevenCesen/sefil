import { create } from 'zustand'

export const useStoreConsult = create((set, get) => ({
    searchType: 'ci',
    searchValue: '',
    results: [],
    loading: false,
    searched: false,
    lastVisitedPath: null,

    setSearchType: (type) => set({ searchType: type }),
    setSearchValue: (value) => set({ searchValue: value }),
    setResults: (results) => set({ results }),
    setLoading: (loading) => set({ loading }),
    setSearched: (searched) => set({ searched }),
    setLastVisitedPath: (path) => set({ lastVisitedPath: path }),

    clearSearch: () => set({
        searchType: 'ci',
        searchValue: '',
        results: [],
        loading: false,
        searched: false
    })
}));
