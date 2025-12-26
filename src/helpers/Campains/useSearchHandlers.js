import { useCallback } from 'react';
import useAssignSearch from '../../hooks/useAssignSearch';

export const useSearchHandlers = (state, credits, setCredits, updateState, businessIdRef, campain_id) => {

    const performSearch = useCallback((filters = {}) => {
        const searchValue = filters.searchValue ?? state.searchText;
        const filter = searchValue.length === 0;
        const coincidence = filters.coincidence ?? state.coincidence;
        const mora = filters.mora ?? state.item_filter.mora;
        const cuota = filters.cuota ?? state.item_filter.cuota;
        const monto = filters.monto ?? state.item_filter.monto;
        const estado = filters.estado ?? state.item_filter.estado;
        const agencies = filters.agencies ?? state.prev_agencies;
        const estado_gestion = filters.estado_gestion ?? state.item_filter.estado_gestion;
        const agents = filters.agents ?? (state.agents_origin.length > 0 ? state.agents_origin : state.agent.id);

        useAssignSearch(
            credits,
            searchValue,
            setCredits,
            filter,
            coincidence,
            mora,
            cuota,
            monto,
            estado,
            agencies,
            estado_gestion,
            agents,
            businessIdRef.current || campain_id,
            (creditos) => updateState({ creditos })
        );
    }, [state, credits, setCredits, updateState, businessIdRef, campain_id]);

    const handleSearchTextChange = useCallback((e) => {
        const searchValue = e.target.value;
        updateState({ searchText: searchValue });
        performSearch({ searchValue });
    }, [updateState, performSearch]);

    const handleCoincidenceChange = useCallback((e) => {
        if (!e.target.checked) return;

        const newCoincidence = e.target.value;
        const updatedData = credits.data?.map(item => ({ ...item, search: true })) || [];

        setCredits({ ...credits, data: updatedData });
        updateState({ coincidence: newCoincidence });
        performSearch({ coincidence: newCoincidence });
    }, [credits, setCredits, updateState, performSearch]);

    return {
        performSearch,
        handleSearchTextChange,
        handleCoincidenceChange
    };
};