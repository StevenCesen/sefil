import { useRef } from "react";
import "./CardAssignCampain.css";
import useFetch from "../../../hooks/useFetch";
import useSearchCreditInDistribution from "../../../hooks/useSearchCreditInDistribution";

// Custom hooks
import { useCampaignData } from "../../../helpers/Campains/useCampaignData";
import { useAssignmentState } from "../../../helpers/Campains/useAssignmentState";
import { useSearchHandlers } from "../../../helpers/Campains/useSearchHandlers";
import { useAgentHandlers } from "../../../helpers/Campains/useAgentHandlers";
import { useFilterHandlers } from "../../../helpers/Campains/useFilterHandlers";
import { useTransferHandler } from "../../../helpers/Campains/useTransferHandler";

// Components
import AgentSelector from "../../AgentSelector/AgentSelector";
import FilterRangeContainer from "../../FilterRangeContainer/FilterRangeContainer";
import SelectCollectionState from "../../SelectCollectionState/SelectCollectionState";
import SelectManagementStates from "../../SelectManagementStates/SelectManagementStates";
import SelectAgencies from "../../SelectAgencies/SelectAgencies";
import CreditDetailsModal from "../../CreditDetailsModal/CreditDetailsModal";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";

export default function CardAssignCampain({ campain_id }) {
    const { fetchWithAuth } = useFetch();

    // Refs
    const ref_origin = useRef();
    const ref_destino = useRef();

    // Campaign data
    const { data, credits, setCredits, businessIdRef } = useCampaignData(campain_id, fetchWithAuth);

    // Assignment state
    const { state, setState, updateState, updateFilter } = useAssignmentState();

    // Search handlers
    const { performSearch, handleSearchTextChange, handleCoincidenceChange } = useSearchHandlers(
        state,
        credits,
        setCredits,
        updateState,
        businessIdRef,
        campain_id
    );

    // Agent handlers
    const { handleAgentSelect, handleAgentGroup } = useAgentHandlers(
        updateState,
        setCredits,
        performSearch,
        fetchWithAuth
    );

    // Filter handlers
    const { handleRangeUpdate, handleAgencyFilter } = useFilterHandlers(
        updateState,
        updateFilter,
        performSearch
    );

    // Transfer handler
    const { handleTransfer } = useTransferHandler(
        state,
        updateState,
        data,
        campain_id,
        fetchWithAuth,
        setCredits,
        credits
    );

    // Credit search handler
    const handleCreditSearch = async (e) => {
        const creditId = e.target.value.split('-')[1];
        if (creditId?.length > 7 && data) {
            await useSearchCreditInDistribution({
                value: creditId,
                distribution: data,
                setAgent: (agent) => updateState({ agent }),
                setCredit: setCredits
            });
        }
    };

    // Agent group wrapper to pass refs
    const onAgentGroup = (agent, isOrigin) => {
        const refElement = isOrigin ? ref_origin : ref_destino;
        setState(currentState => ({
            ...currentState,
            ...handleAgentGroup(agent, isOrigin, currentState, refElement)
        }));
    };

    // Loading state
    if (!data) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="CardAssignCampain">
            {/* Header */}
            <p className="CardAssignCampain__head">
                Asignación de campaña | {data.name} ({data.totals} CRÉDITOS)
            </p>

            {/* Search Credit */}
            <label className="CardAssignCampain__searchCredit">
                <strong>Buscar crédito</strong>
                <input
                    onChange={handleCreditSearch}
                    type="search"
                    placeholder="Número de crédito"
                />
            </label>

            {/* Agents Section */}
            <div className="CardAssignCampain__agents">
                <AgentSelector
                    agents={data.agents}
                    selectedAgent={state.agent}
                    selectedAgents={state.agents_origin}
                    isOpen={state.view_agents}
                    onToggle={() => updateState({ view_agents: !state.view_agents })}
                    onAgentSelect={handleAgentSelect}
                    onAgentGroup={onAgentGroup}
                    refElement={ref_origin}
                    title="Agente origen"
                    isOrigin={true}
                />

                {state.transfer && (
                    <>
                        <p>a</p>
                        <AgentSelector
                            agents={data.agents}
                            selectedAgent={state.agent_dtsn}
                            selectedAgents={state.agents_dtsn}
                            isOpen={state.view_dtns}
                            onToggle={() => updateState({ view_dtns: !state.view_dtns })}
                            onAgentSelect={() => {}}
                            onAgentGroup={(agent) => onAgentGroup(agent, false)}
                            refElement={ref_destino}
                            title="Agente destino"
                            isOrigin={false}
                        />
                    </>
                )}
            </div>

            {/* Transfer Mode */}
            <span><strong>Forma de asignación</strong></span>

            <div className="CardAssignCampain__radius">
                <label>
                    <input
                        type="checkbox"
                        checked={state.transfer}
                        onChange={(e) => updateState({ transfer: e.target.checked })}
                    />
                    Transferir carga
                </label>
            </div>

            {/* Load Data */}
            <label className="CardAssignCampain__file">
                Cargar datos (<strong>{credits.total || 0}</strong>)
                <input
                    onChange={handleSearchTextChange}
                    value={state.searchText}
                    type="text"
                    placeholder="Ingrese nombre o creditos"
                />
                <button onClick={() => updateState({ view_details: true })}>
                    Ver detalle cred.
                </button>
            </label>

            {/* Filter Section */}
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

            {/* Filters */}
            <div className="CardAssignCampain__filters">
                <FilterRangeContainer onFilterChange={handleRangeUpdate} />

                <div className="CardAssignCampain__selects">
                    <SelectCollectionState
                        value={state.item_filter.estado}
                        onChange={handleRangeUpdate}
                        typeAssign={data.type_assign}
                    />

                    <SelectManagementStates
                        value={state.item_filter.estado_gestion}
                        onChange={handleRangeUpdate}
                    />

                    <SelectAgencies
                        selectedAgencies={state.prev_agencies}
                        onAgencyChange={handleAgencyFilter}
                    />
                </div>
            </div>

            {/* Errors Display */}
            <ErrorDisplay errors={state.errors} />

            {/* Footer */}
            <div className="CardAssignCampain__footer">
                {state.transfer ? (
                    <div>
                        <label>
                            Total (<strong>{credits.total || 0}</strong>)
                            <input
                                type="number"
                                min="0"
                                max={credits.total || 0}
                                value={state.total_assign}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= (credits.total || 0)) {
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
                        Total (<strong>{credits.total || 0}</strong>)
                    </label>
                )}
            </div>

            {/* Modals */}
            <CreditDetailsModal
                isOpen={state.view_details}
                onClose={() => updateState({ view_details: false })}
                credits={credits.data}
            />
        </div>
    );
}
