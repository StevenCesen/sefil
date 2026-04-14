import { create } from 'zustand'

export const useStoreRecaudacion = create((set) => ({
    searchType: 'ci',
    searchValue: '',
    results: [],
    loading: false,
    searched: false,

    // Para búsqueda de comprobantes
    voucherResult: null,
    voucherLoading: false,
    showVoucherModal: false,

    setSearchType: (type) => set({ searchType: type }),
    setSearchValue: (value) => set({ searchValue: value }),
    setResults: (results) => set({ results }),
    setLoading: (loading) => set({ loading }),
    setSearched: (searched) => set({ searched }),

    setVoucherResult: (voucherResult) => set({ voucherResult }),
    setVoucherLoading: (voucherLoading) => set({ voucherLoading }),
    setShowVoucherModal: (showVoucherModal) => set({ showVoucherModal }),

    clearSearch: () => set({
        searchType: 'ci',
        searchValue: '',
        results: [],
        loading: false,
        searched: false,
        voucherResult: null,
        voucherLoading: false,
        showVoucherModal: false,
    })
}));
