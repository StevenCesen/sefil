import { useCallback } from 'react';
import { ALL_AGENCIES } from '../../components/SelectAgencies/SelectAgencies';

export const useFilterHandlers = (updateState, updateFilter, performSearch) => {

    const handleRangeUpdate = useCallback((key, value) => {
        updateFilter(key, value);
        performSearch({ [key]: value });
    }, [updateFilter, performSearch]);

    const handleAgencyFilter = useCallback((agencia, checked) => {
        let newAgencies;

        if (agencia === "-- Todas --") {
            newAgencies = checked ? [...ALL_AGENCIES] : [];
            updateState({ prev_agencies: newAgencies });
        } else {
            // Get current agencies from state using callback
            newAgencies = null;
            updateState((prevState) => {
                newAgencies = checked
                    ? [...prevState.prev_agencies, agencia]
                    : prevState.prev_agencies.filter(agency => agency !== agencia);
                return { prev_agencies: newAgencies };
            });

            // Wait for state update, then perform search
            setTimeout(() => {
                if (newAgencies) {
                    performSearch({ agencies: newAgencies });
                }
            }, 0);
            return;
        }

        performSearch({ agencies: newAgencies });
    }, [updateState, performSearch]);

    return {
        handleRangeUpdate,
        handleAgencyFilter
    };
};