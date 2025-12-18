import { useRef, useState, useEffect, useCallback } from "react";
import "./CardAssignCampain.css";
import useAssignSearch from "../../../hooks/useAssignSearch";
import useSearchCreditInDistribution from "../../../hooks/useSearchCreditInDistribution";
import sendpush from "../../../helpers/sendpush";
import { fetchBusinessData, fetchCreditsData, transferCampaignLoad } from "../../../helpers/campaignHelpers";
import AgentSelector from "../../AgentSelector/AgentSelector";
import FilterRangeContainer from "../../FilterRangeContainer/FilterRangeContainer";
import SelectCollectionState from "../../SelectCollectionState/SelectCollectionState";
import SelectManagementStates from "../../SelectManagementStates/SelectManagementStates";
import SelectAgencies from "../../SelectAgencies/SelectAgencies";
import CreditDetailsModal from "../../CreditDetailsModal/CreditDetailsModal";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";

const createInitialState = (distributions = []) => ({
    transfer: false,
    mode: 'manual',
    view_agencies: false,
    view_agents: false,
    view_dtns: false,
    view_details: false,
    business: null,
    charge: { data: [], total: 0 },
    agent: { id: '', name: '-- Seleccionar --' },
    agents_origin: [],
    agent_dtsn: { id: '', name: '-- Seleccionar --' },
    agents_dtsn: [],
    creditos: [],
    distributions,
    coincidence: '1',
    prev_agencies: [],
    errors: [],
    total_assign: 0,
    loading: false,
    item_filter: {
        filter: false,
        mode: '',
        mora: '',
        cuota: '',
        monto: '',
        estado: '',
        estado_gestion: '',
        agencia: []
    }
});

export default function CardAssignCampain({ data, updateCredits }) {
    const [state, setState] = useState(() => createInitialState(data?.distributions));
    
    const ref_origin = useRef();
    const ref_destino = useRef();
    const busc = useRef();

    const updateState = useCallback((updates) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);

    const updateCharge = useCallback((newCharge) => {
        updateState({ charge: newCharge });
    }, [updateState]);

    const performAssignSearch = useCallback((searchParams = {}) => {
        const {
            charge = state.charge,
            searchValue = '',
            filter = true,
            coincidence = state.coincidence,
            mora = state.item_filter.mora,
            cuota = state.item_filter.cuota,
            monto = state.item_filter.monto,
            estado = state.item_filter.estado,
            agencies = state.prev_agencies,
            estado_gestion = state.item_filter.estado_gestion,
            agents = state.agents_origin.length > 0 ? state.agents_origin : state.agent.id
        } = searchParams;

        // Si hay búsqueda de texto (créditos o nombres), desactivar filtros
        if (searchValue.length > 0) {
            useAssignSearch(
                charge,
                searchValue,
                updateCharge,
                false, // Siempre false cuando hay búsqueda de texto
                coincidence,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                data.cartera,
                (creditos) => updateState({ creditos })
            );
        } else {
            // Solo aplicar filtros cuando NO hay búsqueda de texto
            useAssignSearch(
                charge,
                searchValue,
                updateCharge,
                filter,
                coincidence,
                mora,
                cuota,
                monto,
                estado,
                agencies,
                estado_gestion,
                agents,
                data.cartera,
                (creditos) => updateState({ creditos })
            );
        }
    }, [state, updateCharge, updateState, data.cartera]);

    const updateRange = useCallback((key, value) => {
        const updatedFilter = { ...state.item_filter, [key]: value };
        updateState({ item_filter: updatedFilter });
        performAssignSearch({ [key]: value });
    }, [state.item_filter, updateState, performAssignSearch]);

    const handleAgentSelect = useCallback((agent) => {
        updateState({
            agent: { id: agent.id, name: agent.name },
            view_agents: false
        });

        const agentDistribution = data.distributions.find(
            agente => Number(agente.agent_id) === Number(agent.id)
        );

        if (agentDistribution) {
            performAssignSearch({ agents: agent.id });
        }
    }, [updateState, data.distributions, performAssignSearch]);

    const updateAgentText = useCallback((refElement, agents, agentName, isOrigin) => {
        let texto = refElement.current.textContent;
        const placeholder = isOrigin ? '-- Seleccionar --' : '-- Seleccionar--';
        
        if (agents.length === 0) {
            refElement.current.textContent = placeholder;
        } else {
            texto = texto.includes(agentName) 
                ? texto.replace(agentName, '').replace(/,+/g, ',').replace(/^,|,$/g, '')
                : `${texto},${agentName}`;
            
            refElement.current.textContent = texto.replace(`${placeholder},`, '');
        }
    }, []);

    const handleAgentGroup = useCallback((agent, isOrigin = true) => {
        const currentAgents = isOrigin ? state.agents_origin : state.agents_dtsn;
        const refElement = isOrigin ? ref_origin : ref_destino;
        const updateKey = isOrigin ? 'agents_origin' : 'agents_dtsn';
        
        const newAgents = currentAgents.includes(agent.id)
            ? currentAgents.filter(id => Number(id) !== Number(agent.id))
            : [...currentAgents, agent.id];

        updateAgentText(refElement, newAgents, agent.name, isOrigin);
        updateState({ [updateKey]: newAgents });

        if (isOrigin) {
            performAssignSearch({ agents: newAgents.length > 0 ? newAgents : agent.id });
        }
    }, [state.agents_origin, state.agents_dtsn, updateAgentText, updateState, performAssignSearch]);

    const handleAgencyFilter = useCallback((agencia, checked) => {
        const ALL_AGENCIES = [
            "catacocha", "palanda", "cariamanga", "zamora", "zumba", 
            "piñas", "celica", "catamayo", "malacatos", "santa rosa",
            "oficina las pitas", "oficina centro", "oficina norte",
            "san miguel de los bancos", "milagro", "santo domingo",
            "el carmen", "cayambe", "pasaje", "tumbaco", "la troncal",
            "amaguaña", "naranjal", "quinche", "quininde"
        ];
        
        if (agencia === "-- Todas --") {
            // Si se marca "Todas", seleccionar todas las agencias individuales
            // Si se desmarca "Todas", limpiar todas las agencias
            const newAgencies = checked ? [...ALL_AGENCIES] : [];
            updateState({ prev_agencies: newAgencies });
            performAssignSearch({ agencies: newAgencies });
        } else {
            // Toggle de agencia individual
            const newAgencies = checked 
                ? [...state.prev_agencies, agencia]
                : state.prev_agencies.filter(agency => agency !== agencia);

            updateState({ prev_agencies: newAgencies });
            performAssignSearch({ agencies: newAgencies });
        }
    }, [state.prev_agencies, updateState, performAssignSearch]);

    const buildFilters = useCallback(() => {
        const params = new URLSearchParams();

        if (state.item_filter.mora?.min && Number(state.item_filter.mora.min) !== 0) {
            params.append('mora_min', state.item_filter.mora.min);
        }
        if (state.item_filter.mora?.max && Number(state.item_filter.mora.max) !== 0) {
            params.append('mora_max', state.item_filter.mora.max);
        }
        if (state.item_filter.monto?.min && Number(state.item_filter.monto.min) !== 0) {
            params.append('monto_min', state.item_filter.monto.min);
        }
        if (state.item_filter.monto?.max && Number(state.item_filter.monto.max) !== 0) {
            params.append('monto_max', state.item_filter.monto.max);
        }
        if (state.item_filter.cuota?.min && Number(state.item_filter.cuota.min) !== 0) {
            params.append('cuotas_min', state.item_filter.cuota.min);
        }
        if (state.item_filter.cuota?.max && Number(state.item_filter.cuota.max) !== 0) {
            params.append('cuotas_max', state.item_filter.cuota.max);
        }
        if (state.item_filter.estado_gestion) {
            params.append('management', state.item_filter.estado_gestion);
        }
        if (state.item_filter.estado) {
            params.append('state', state.item_filter.estado);
        }
        if (state.prev_agencies.length > 0) {
            params.append('agencias', JSON.stringify(state.prev_agencies));
        }
        if (state.agents_origin.length > 0) {
            params.append('users', JSON.stringify(state.agents_origin));
        } else if (state.agent.id) {
            params.append('user', state.agent.id);
        }
        if (state.agents_dtsn.length > 1) {
            params.append('destinos', JSON.stringify(state.agents_dtsn));
        } else if (state.agents_dtsn.length === 1) {
            params.append('destino', state.agents_dtsn[0]);
        }
        if (state.total_assign > 0) {
            params.append('limite', state.total_assign);
        }
        if (state.creditos.length > 0) {
            // Construir el array con comillas: ["2021045721","2021045722"]
            const creditosString = `[${state.creditos.map(c => `"${c}"`).join(',')}]`;
            params.append('creditos', creditosString);
        }

        return params.toString();
    }, [state]);

    const handleTransfer = useCallback(async (e) => {
        if (state.agents_dtsn.length === 0) {
            sendpush({
                title: 'ERR: Sin agente destino.',
                message: 'No hay un agente de destino para transferir la carga.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        const originalText = e.target.textContent;
        e.target.textContent = "Transfiriendo...";
        updateState({ errors: [], loading: true });

        try {
            const filters = buildFilters();
            const formData = new URLSearchParams({
                agent_origin: state.agent.id,
                agent_destino: state.agent_dtsn.id,
                carga: JSON.stringify([]),
                cartera: data.cartera
            });
            
            const responseData = await transferCampaignLoad(data.id, filters, formData);

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
                updateCredits(responseData);
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
    }, [state, updateState, buildFilters, data, updateCredits]);

    const handleCreditSearch = useCallback(async (e) => {
        const creditId = e.target.value.split('-')[1];
        if (creditId?.length > 7) {
            await useSearchCreditInDistribution({
                value: creditId,
                distribution: data,
                cartera: data.cartera,
                setAgent: (agent) => updateState({ agent }),
                setCredit: updateCharge
            });
        }
    }, [data, updateState, updateCharge]);

    const handleCoincidenceChange = useCallback((e) => {
        if (!e.target.checked) return;
        
        const copy = state.charge.data?.map(item => ({ ...item, search: true })) || [];
        updateState({ charge: { ...state.charge, data: copy }, coincidence: e.target.value });
        performAssignSearch({ coincidence: e.target.value });
    }, [state.charge, updateState, performAssignSearch]);

    useEffect(() => {
        setState(createInitialState(data.distributions));

        const fetchInitialData = async () => {
            try {
                const [businessData, creditsData] = await Promise.all([
                    fetchBusinessData(),
                    data.type_assign !== 'api' ? fetchCreditsData(data.cartera) : Promise.resolve(null)
                ]);
                
                updateState({ business: businessData.data });

                if (creditsData) {
                    updateState({ 
                        charge: creditsData, 
                        mode: 'assoc' 
                    });
                    localStorage.setItem('filt', JSON.stringify(creditsData));
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                sendpush({
                    title: 'Error.',
                    message: 'Error al cargar datos iniciales.',
                    type: 'Push--danger',
                    timeout: 5000
                });
            }
        };

        fetchInitialData();
    }, [data, updateState]);

    if (!state.business || !state.charge || !state.distributions) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="CardAssignCampain">
            <p className="CardAssignCampain__head">
                Asignación de campaña | {data.name} ({data.totals} CRÉDITOS)
            </p>

            <label className="CardAssignCampain__searchCredit">
                <strong>Buscar crédito</strong>
                <input 
                    onChange={handleCreditSearch}
                    type="search" 
                    placeholder="Número de crédito"
                />
            </label>

            <div className="CardAssignCampain__agents">
                <AgentSelector
                    agents={data.agents}
                    selectedAgent={state.agent}
                    selectedAgents={state.agents_origin}
                    isOpen={state.view_agents}
                    onToggle={() => updateState({ view_agents: !state.view_agents })}
                    onAgentSelect={handleAgentSelect}
                    onAgentGroup={handleAgentGroup}
                    refElement={ref_origin}
                    title="Agente origen"
                    isOrigin={true}
                />

                {state.transfer && state.mode !== 'assoc' && (
                    <>
                        <p>a</p>
                        <AgentSelector
                            agents={data.agents}
                            selectedAgent={state.agent_dtsn}
                            selectedAgents={state.agents_dtsn}
                            isOpen={state.view_dtns}
                            onToggle={() => updateState({ view_dtns: !state.view_dtns })}
                            onAgentSelect={() => {}}
                            onAgentGroup={handleAgentGroup}
                            refElement={ref_destino}
                            title="Agente destino"
                            isOrigin={false}
                        />
                    </>
                )}
            </div>
            
            <span><strong>Forma de asignación</strong></span>
            
            <div className="CardAssignCampain__radius">
                <label>
                    <input 
                        type="checkbox"
                        name="mode"
                        value="transfer"
                        checked={state.transfer}
                        onChange={(e) => {
                            updateState({
                                mode: e.target.checked ? e.target.value : 'assoc',
                                transfer: e.target.checked
                            });
                        }}
                    />
                    Transferir carga
                </label>
            </div>
            
            <label className="CardAssignCampain__file">
                Cargar datos (<strong>{state.charge.total || 0}</strong>)
                <input 
                    ref={busc}
                    onChange={(e) => {  
                        performAssignSearch({ searchValue: e.target.value });
                    }}
                    type="text" 
                    placeholder="Ingrese nombre o creditos"
                />
                <button onClick={() => updateState({ view_details: true })}>
                    Ver detalle cred.
                </button>
            </label>

            <span style={{marginTop:"10px"}}>
                <strong>Filtrado de datos</strong>
            </span>

            <div className="CardAssignCampain__radius">
                <label>
                    <input 
                        type="radio"
                        name="coincidence"
                        value="1"
                        checked={state.coincidence === '1'}
                        onChange={handleCoincidenceChange}
                    />
                    Coincidir
                </label>
            </div>

            <div className="CardAssignCampain__filters">
                <FilterRangeContainer onFilterChange={updateRange} />
                
                <div className="CardAssignCampain__selects">
                    <SelectCollectionState
                        value={state.item_filter.estado}
                        onChange={updateRange}
                        typeAssign={data.type_assign}
                    />

                    <SelectManagementStates
                        value={state.item_filter.estado_gestion}
                        onChange={updateRange}
                    />

                    <SelectAgencies
                        selectedAgencies={state.prev_agencies}
                        onAgencyChange={handleAgencyFilter}
                    />
                </div>
            </div>

            <ErrorDisplay errors={state.errors} />

            <div className="CardAssignCampain__footer">
                {state.transfer ? (
                    <div>
                        <label>
                            Total (<strong>{state.charge.total || 0}</strong>)
                            <input 
                                type="number"
                                min="0"
                                max={state.charge.total || 0}
                                value={state.total_assign}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= (state.charge.total || 0)) {
                                        updateState({ total_assign: value });
                                    }
                                }}
                            />
                        </label>
                        <button 
                            onClick={handleTransfer}
                            disabled={state.loading || state.agents_dtsn.length === 0}
                        >
                            {state.loading ? 'Transfiriendo...' : 'Transferir carga'}
                        </button>
                    </div>
                ) : (
                    <label>
                        Total (<strong>{state.charge.total || 0}</strong>)
                    </label>
                )}
            </div>

            <CreditDetailsModal
                isOpen={state.view_details}
                onClose={() => updateState({ view_details: false })}
                credits={state.charge.data}
            />
        </div>
    );
}