import { useEffect, useState, useCallback } from "react";
import "./CardAssignCampain.css";
import { fetchCampaignData } from "../../../helpers/Campains/fetchCampaignData";
import { fetchCreditsData } from "../../../helpers/Campains/fetchCreditsData";
import AgentSelector from "../../AgentSelector/AgentSelector";
import CreditLoader from "./CreditLoader";
import CreditFilters from "./CreditFilters";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";
import TransferFooter from "./TransferFooter";
import sendpush from "../../../helpers/sendpush";

export default function CardAssignCampain({ campain_id }) {
    const [data_campain, setDataCampain] = useState();
    const [is_transfer, setIsTransfer] = useState(false);
    const [agents_origin, setAgentsOrigin] = useState([]);
    const [agents_destino, setAgentsDestino] = useState([]);
    const [credits, setCredits] = useState({ total: 0, data: [] });
    const [filters, setFilters] = useState({});
    const [errors, setErrors] = useState([]);
    const [total_assign, setTotalAssign] = useState(0);
    const [loading, setLoading] = useState(false);
    const [credits_from_search, setCreditsFromSearch] = useState(false);

    const handleGetDataCampain = async (campain_id) => {
        const data = await fetchCampaignData(campain_id);
        setDataCampain(data.result);
    }

    const handleAgentsOriginChange = (selectedAgents) => {
        setAgentsOrigin(selectedAgents);
        setCreditsFromSearch(false);

        if (selectedAgents.length === 0) {
            setCredits({ total: 0, data: [] });
        }
    }

    const handleAgentsDestinoChange = (selectedAgents) => {
        setAgentsDestino(selectedAgents);
    }

    const handleCreditsChange = (newCredits, fromSearch = false) => {
        setCredits(newCredits);
        setCreditsFromSearch(fromSearch);
    }

    const fetchCreditsWithFilters = useCallback(async () => {
        if (!data_campain) return;

        const queryFilters = {
            business_id: data_campain.business_id
        };
        
        if (agents_origin.length > 0) {
            const agentIds = agents_origin.map(a => a.id);
            queryFilters.user_ids = agentIds;
        }

        if (filters.mora?.min != null && filters.mora.min > 0) {
            queryFilters.days_past_due_min = filters.mora.min;
        }
        if (filters.mora?.max != null && filters.mora.max > 0) {
            queryFilters.days_past_due_max = filters.mora.max;
        }

        if (filters.cuota?.min != null && filters.cuota.min > 0) {
            queryFilters.pending_fees_min = filters.cuota.min;
        }
        if (filters.cuota?.max != null && filters.cuota.max > 0) {
            queryFilters.pending_fees_max = filters.cuota.max;
        }

        if (filters.monto?.min != null && filters.monto.min > 0) {
            queryFilters.total_amount_min = filters.monto.min;
        }
        if (filters.monto?.max != null && filters.monto.max > 0) {
            queryFilters.total_amount_max = filters.monto.max;
        }

        if (filters.estado) {
            queryFilters.collection_state = [filters.estado];
        }

        if (filters.estado_gestion) {
            queryFilters.management_status = filters.estado_gestion;
        }

        if (filters.agencies?.length > 0) {
            queryFilters.agency = filters.agencies;
        }

        queryFilters.sync_status = 'ACTIVE';

        const data = await fetchCreditsData(queryFilters);

        if (data && data.code === 1 && data.result) {
            const newCredits = {
                total: data.result.meta?.total || 0,
                data: data.result.data || []
            };
            setCredits(newCredits);
        }
    }, [agents_origin, data_campain, filters])

    const handleFiltersChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setCreditsFromSearch(false);
    }, [])

    const handleTransfer = async () => {
        if (agents_destino.length === 0) {
            sendpush({
                title: 'Error de validación',
                message: 'Debe seleccionar al menos un agente destino',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        const originIds = agents_origin.map(a => a.id);
        const destinoIds = agents_destino.map(a => a.id);
        const duplicates = originIds.filter(id => destinoIds.includes(id));

        if (duplicates.length > 0) {
            sendpush({
                title: 'Error de validación',
                message: 'Un agente no puede ser origen y destino al mismo tiempo',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        const hasInactiveCredits = credits.data.some(credit => credit.sync_status === 'INACTIVE');
        if (hasInactiveCredits) {
            sendpush({
                title: 'Error de validación',
                message: 'No se puede transferir créditos inactivos',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        setLoading(true);

        try {
            const transferData = {
                business_id: data_campain.business_id,
                user_origin: originIds.length > 0 ? originIds : undefined,
                user_dstn: destinoIds,
                sync_status: 'ACTIVE'
            };

            if (credits_from_search && credits.data.length > 0) {
                transferData.sync_ids = credits.data.map(credit => credit.sync_id);
            } else {
                if (filters.mora?.min != null && filters.mora.min > 0) {
                    transferData.days_past_due_min = filters.mora.min;
                }
                if (filters.mora?.max != null && filters.mora.max > 0) {
                    transferData.days_past_due_max = filters.mora.max;
                }

                if (filters.cuota?.min != null && filters.cuota.min > 0) {
                    transferData.pending_fees_min = filters.cuota.min;
                }
                if (filters.cuota?.max != null && filters.cuota.max > 0) {
                    transferData.pending_fees_max = filters.cuota.max;
                }

                if (filters.monto?.min != null && filters.monto.min > 0) {
                    transferData.total_amount_min = filters.monto.min;
                }
                if (filters.monto?.max != null && filters.monto.max > 0) {
                    transferData.total_amount_max = filters.monto.max;
                }

                if (filters.estado) {
                    transferData.collection_state = [filters.estado];
                }

                if (filters.estado_gestion) {
                    transferData.management_status = filters.estado_gestion;
                }

                if (filters.agencies?.length > 0) {
                    transferData.agency = filters.agencies;
                }
            }

            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/campains/transfer/${data_campain.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(transferData)
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (data.code === 1) {
                sendpush({
                    title: 'Transferencia exitosa',
                    message: 'Transferencia realizada exitosamente',
                    type: 'Push--sucessful',
                    timeout: 5000
                });
                fetchCreditsWithFilters();
            } else {
                sendpush({
                    title: 'Error en transferencia',
                    message: data.message || 'Error al transferir créditos',
                    type: 'Push--warning',
                    timeout: 5000
                });
            }
        } catch (error) {
            console.error('Error en transferencia:', error);
            sendpush({
                title: 'Error en transferencia',
                message: 'Error al transferir créditos',
                type: 'Push--warning',
                timeout: 5000
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetDataCampain(campain_id);
    }, [campain_id]);

    useEffect(() => {
        if (data_campain && !credits_from_search) {
            fetchCreditsWithFilters();
        }
    }, [fetchCreditsWithFilters, data_campain, credits_from_search])

    if (!data_campain) return <></>

    return (
        <div className="CardAssignCampain">
            <p className="CardAssignCampain__head">
                Asignación de campaña | {data_campain.name}
            </p>

            <span>Créditos activos: <strong>{data_campain.total_credits}</strong></span>
            <span>Cartera: <strong>{data_campain.business_name || 0}</strong></span>

            <label className="CardAssignCampain__searchCredit">
                <strong>Buscar crédito</strong>
                <input
                    onChange={()=>{}}
                    type="search"
                    placeholder="Número de crédito"
                />
            </label>

            <div className="CardAssignCampain__agents">
                <AgentSelector
                    agents_details={data_campain.agents_details || []}
                    onChange={handleAgentsOriginChange}
                    title="Agente origen"
                    multiSelect={true}
                />

                {is_transfer && (
                    <>
                        <p>a</p>
                        <AgentSelector
                            agents_details={data_campain.agents_details || []}
                            onChange={handleAgentsDestinoChange}
                            title="Agente destino"
                            multiSelect={true}
                        />
                    </>
                )}
            </div>

            <label
                className="CardAssignCampain__transferLabel"
            >
                <input
                    type="checkbox"
                    checked={is_transfer}
                    onChange={(e) => setIsTransfer(e.target.checked)}
                />
                Transferir carga
            </label>

            <CreditLoader
                onCreditsChange={handleCreditsChange}
                credits={credits}
            />

            <CreditFilters
                onFiltersChange={handleFiltersChange}
                typeAssign={data_campain.type_assign}
            />

            <ErrorDisplay errors={errors} />

            <TransferFooter
                isTransfer={is_transfer}
                credits={credits}
                totalAssign={total_assign}
                setTotalAssign={setTotalAssign}
                loading={loading}
                agentsDestinoLength={agents_destino.length}
                onTransfer={handleTransfer}
            />
        </div>
    );
}
