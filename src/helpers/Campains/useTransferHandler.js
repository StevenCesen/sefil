import { useCallback } from 'react';
import { transferCampaignLoad, fetchCreditsData } from '../campaignHelpers';
import sendpush from '../sendpush';

const buildTransferFilters = (state) => {
    const filters = {
        sync_status: 'ACTIVE'
    };

    // Filtros de mora
    if (state.item_filter.mora?.min && Number(state.item_filter.mora.min) !== 0) {
        filters.days_past_due_min = Number(state.item_filter.mora.min);
    }
    if (state.item_filter.mora?.max && Number(state.item_filter.mora.max) !== 0) {
        filters.days_past_due_max = Number(state.item_filter.mora.max);
    }

    // Filtros de monto
    if (state.item_filter.monto?.min && Number(state.item_filter.monto.min) !== 0) {
        filters.total_amount_min = Number(state.item_filter.monto.min);
    }
    if (state.item_filter.monto?.max && Number(state.item_filter.monto.max) !== 0) {
        filters.total_amount_max = Number(state.item_filter.monto.max);
    }

    // Filtros de cuotas
    if (state.item_filter.cuota?.min && Number(state.item_filter.cuota.min) !== 0) {
        filters.total_fees_min = Number(state.item_filter.cuota.min);
    }
    if (state.item_filter.cuota?.max && Number(state.item_filter.cuota.max) !== 0) {
        filters.total_fees_max = Number(state.item_filter.cuota.max);
    }

    // Estados de gestión
    if (state.item_filter.estado_gestion) {
        filters.status_management = Array.isArray(state.item_filter.estado_gestion)
            ? state.item_filter.estado_gestion
            : [state.item_filter.estado_gestion];
    }

    // Estados de cobranza
    if (state.item_filter.estado) {
        filters.collection_state = Array.isArray(state.item_filter.estado)
            ? state.item_filter.estado
            : [state.item_filter.estado];
    }

    // Agencias
    if (state.prev_agencies.length > 0) {
        filters.agencies = state.prev_agencies;
    }

    // Usuarios origen
    if (state.agents_origin.length > 0) {
        filters.user_origin = state.agents_origin;
    } else if (state.agent.id) {
        filters.user_origin = [state.agent.id];
    }

    // Usuarios destino
    if (state.agents_dtsn.length > 0) {
        filters.user_dstn = state.agents_dtsn;
    }

    // Límite de asignación
    if (state.total_assign > 0) {
        filters.limit = Number(state.total_assign);
    }

    // Créditos específicos
    if (state.creditos.length > 0) {
        filters.credits = state.creditos;
    }

    return filters;
};

export const useTransferHandler = (state, updateState, data, campain_id, fetchWithAuth, setCredits, credits) => {

    const handleTransfer = useCallback(async (e) => {
        // Validations
        if (state.agents_dtsn.length === 0) {
            sendpush({
                title: 'ERR: Sin agente destino.',
                message: 'No hay un agente de destino para transferir la carga.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        // Validar créditos inactivos
        if (state.creditos.length > 0 && credits?.data) {
            const inactiveCredits = credits.data.filter(credit =>
                state.creditos.includes(credit.credit_number || credit.id) &&
                credit.sync_status === 'INACTIVE'
            );

            if (inactiveCredits.length > 0) {
                sendpush({
                    title: 'ERR: Créditos inactivos.',
                    message: `No se puede transferir créditos con estado INACTIVE: ${inactiveCredits.map(c => c.credit_number || c.id).join(', ')}`,
                    type: 'Push--danger',
                    timeout: 5000
                });
                return;
            }
        }

        const originalText = e.target.textContent;
        e.target.textContent = "Transfiriendo...";
        updateState({ errors: [], loading: true });

        try {
            const transferData = buildTransferFilters(state);
            const responseData = await transferCampaignLoad(data.id, transferData, fetchWithAuth);

            if (responseData.errors?.length > 0) {
                updateState({ errors: responseData.errors });
                sendpush({
                    title: 'ERR: Cruce.',
                    message: 'Existen créditos ya asignados a otro agente.',
                    type: 'Push--danger',
                    timeout: 5000
                });
            } else {
                sendpush({
                    title: 'Éxito.',
                    message: 'Carga transferida correctamente.',
                    type: 'Push--sucessful',
                    timeout: 3000
                });

                // Reload credits data
                if (campain_id) {
                    const creditsResponse = await fetchCreditsData(campain_id, fetchWithAuth);
                    const newCredits = creditsResponse?.result?.data || creditsResponse?.data || creditsResponse;
                    if (newCredits) {
                        setCredits(newCredits);
                    }
                }
            }
        } catch (error) {
            console.error('Error al transferir:', error);
            sendpush({
                title: 'Error.',
                message: 'Error al transferir la carga.',
                type: 'Push--danger',
                timeout: 5000
            });
        } finally {
            e.target.textContent = originalText;
            updateState({ loading: false });
        }
    }, [state, updateState, data, campain_id, fetchWithAuth, setCredits, credits]);

    return { handleTransfer };
};