import { useState, useCallback } from 'react';

const createInitialState = () => ({
    transfer: false,
    view_agencies: false,
    view_agents: false,
    view_dtns: false,
    view_details: false,
    agent: { id: '', name: '-- Seleccionar --' },
    agents_origin: [],
    agent_dtsn: { id: '', name: '-- Seleccionar --' },
    agents_dtsn: [],
    creditos: [],
    coincidence: '1',
    prev_agencies: [],
    errors: [],
    total_assign: 0,
    loading: false,
    searchText: '',
    item_filter: {
        mora: { min: '', max: '' },
        cuota: { min: '', max: '' },
        monto: { min: '', max: '' },
        estado: '',
        estado_gestion: '',
        agencia: []
    }
});

export const useAssignmentState = () => {
    const [state, setState] = useState(createInitialState);

    const updateState = useCallback((updates) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);

    const updateFilter = useCallback((key, value) => {
        setState(currentState => {
            const updatedFilter = { ...currentState.item_filter, [key]: value };
            return { ...currentState, item_filter: updatedFilter };
        });
    }, []);

    return { state, setState, updateState, updateFilter };
};