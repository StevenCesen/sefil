import { useEffect, useState, useRef } from "react";
import { useStoreFilterCredits } from "../../../stores/useStoreCredits";
import useAgencies from "../../../hooks/useAgencies";
import "./FilterCredits.css";

export default function FilterCredits(){
    const filter_credits = useStoreFilterCredits();
    const [activeFilter, setActiveFilter] = useState(null);
    const { agencies, loading: loadingAgencies } = useAgencies();

    const minDaysRef = useRef(null);
    const maxDaysRef = useRef(null);
    const carteraSelectRef = useRef(null);
    const agencySelectRef = useRef(null);
    const provinciaRef = useRef(null);
    const cantonRef = useRef(null);
    const syncStatusSelectRef = useRef(null);
    const collectionStateSelectRef = useRef(null);
    const agentSelectRef = useRef(null);

    const [creditValue, setCreditValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [ciValue, setCiValue] = useState('');

    const hasActiveFilters = () => {
        return (
            filter_credits.sync_id.length >= 3 ||
            filter_credits.client_name.length >= 3 ||
            filter_credits.client_ci.length >= 3 ||
            filter_credits.days_past_due_min !== '' ||
            filter_credits.days_past_due_max !== '' ||
            filter_credits.agency !== '' ||
            filter_credits.provincia !== '' ||
            filter_credits.canton !== '' ||
            filter_credits.sync_status !== '' ||
            filter_credits.collection_state !== '' ||
            filter_credits.agent !== ''
        );
    };

    const applyFilters = () => {
        filter_credits.filterCredits(filter_credits.getFilterString());
    };

    const handlePrimaryFilterChange = (filterType, value) => {
        if (!value || value.length < 3) {
            if (filterType === 'credit') {
                filter_credits.setSyncID('');
                setCreditValue(value);
                if (activeFilter === 'credit') setActiveFilter(null);
            } else if (filterType === 'name') {
                filter_credits.setName('');
                setNameValue(value);
                if (activeFilter === 'name') setActiveFilter(null);
            } else if (filterType === 'ci') {
                filter_credits.setCI('');
                setCiValue(value);
                if (activeFilter === 'ci') setActiveFilter(null);
            }
        } else {
            if (filterType === 'credit') {
                filter_credits.setName('');
                filter_credits.setCI('');
                setNameValue('');
                setCiValue('');
                filter_credits.setSyncID(value);
                setCreditValue(value);
                setActiveFilter('credit');
            } else if (filterType === 'name') {
                filter_credits.setSyncID('');
                filter_credits.setCI('');
                setCreditValue('');
                setCiValue('');
                filter_credits.setName(value);
                setNameValue(value);
                setActiveFilter('name');
            } else if (filterType === 'ci') {
                filter_credits.setSyncID('');
                filter_credits.setName('');
                setCreditValue('');
                setNameValue('');
                filter_credits.setCI(value);
                setCiValue(value);
                setActiveFilter('ci');
            }
        }

        applyFilters();
    };

    const clearAllFilters = () => {
        filter_credits.clearAllFilters();

        setCreditValue('');
        setNameValue('');
        setCiValue('');
        setActiveFilter(null);

        if (minDaysRef.current) minDaysRef.current.value = '';
        if (maxDaysRef.current) maxDaysRef.current.value = '';
        if (carteraSelectRef.current) carteraSelectRef.current.value = '';
        if (agencySelectRef.current) agencySelectRef.current.value = '';
        if (provinciaRef.current) provinciaRef.current.value = '';
        if (cantonRef.current) cantonRef.current.value = '';
        if (syncStatusSelectRef.current) syncStatusSelectRef.current.value = '';
        if (collectionStateSelectRef.current) collectionStateSelectRef.current.value = '';
        if (agentSelectRef.current) agentSelectRef.current.value = '';

        applyFilters();
    };

    useEffect(() => {
        filter_credits.getAgents();
    }, []);

    // Sincronizar los valores locales cuando el store se limpie desde fuera
    useEffect(() => {
        if (filter_credits.sync_id === '' && filter_credits.client_name === '' && filter_credits.client_ci === '') {
            setCreditValue('');
            setNameValue('');
            setCiValue('');
            setActiveFilter(null);

            if (minDaysRef.current) minDaysRef.current.value = '';
            if (maxDaysRef.current) maxDaysRef.current.value = '';
            if (carteraSelectRef.current) carteraSelectRef.current.value = '';
            if (agencySelectRef.current) agencySelectRef.current.value = '';
            if (provinciaRef.current) provinciaRef.current.value = '';
            if (cantonRef.current) cantonRef.current.value = '';
            if (syncStatusSelectRef.current) syncStatusSelectRef.current.value = '';
            if (collectionStateSelectRef.current) collectionStateSelectRef.current.value = '';
            if (agentSelectRef.current) agentSelectRef.current.value = '';
        }
    }, [
        filter_credits.sync_id,
        filter_credits.client_name,
        filter_credits.client_ci,
        filter_credits.days_past_due_min,
        filter_credits.days_past_due_max,
        filter_credits.cartera,
        filter_credits.agency,
        filter_credits.provincia,
        filter_credits.canton,
        filter_credits.sync_status,
        filter_credits.collection_state,
        filter_credits.agent
    ]);

    return(
        <div className="FilterCredits">
            <div></div>

            <label className="FilterCredits__label">
                Crédito
                <input
                    value={creditValue}
                    disabled={activeFilter === 'name' || activeFilter === 'ci'}
                    onChange={(e) => handlePrimaryFilterChange('credit', e.target.value)}
                    placeholder={
                        activeFilter === 'name' ? 'Deshabilitado (filtrando por nombre)' :
                        activeFilter === 'ci' ? 'Deshabilitado (filtrando por cédula)' :
                        'Crédito (min 3 caracteres)'
                    }
                    style={{
                        backgroundColor: (activeFilter === 'name' || activeFilter === 'ci') ? '#f5f5f5' : 'white',
                        cursor: (activeFilter === 'name' || activeFilter === 'ci') ? 'not-allowed' : 'text'
                    }}
                />
            </label>

            <label className="FilterCredits__label">
                Nombre
                <input
                    value={nameValue}
                    disabled={activeFilter === 'credit' || activeFilter === 'ci'}
                    onChange={(e) => handlePrimaryFilterChange('name', e.target.value)}
                    placeholder={
                        activeFilter === 'credit' ? 'Deshabilitado (filtrando por crédito)' :
                        activeFilter === 'ci' ? 'Deshabilitado (filtrando por cédula)' :
                        'Nombre del titular o garante (min 3 caracteres)'
                    }
                    style={{
                        backgroundColor: (activeFilter === 'credit' || activeFilter === 'ci') ? '#f5f5f5' : 'white',
                        cursor: (activeFilter === 'credit' || activeFilter === 'ci') ? 'not-allowed' : 'text'
                    }}
                />
            </label>

            <label className="FilterCredits__label">
                Cédula
                <input
                    value={ciValue}
                    disabled={activeFilter === 'credit' || activeFilter === 'name'}
                    onChange={(e) => handlePrimaryFilterChange('ci', e.target.value)}
                    placeholder={
                        activeFilter === 'credit' ? 'Deshabilitado (filtrando por crédito)' :
                        activeFilter === 'name' ? 'Deshabilitado (filtrando por nombre)' :
                        'Cédula del titular o garante (min 3 caracteres)'
                    }
                    style={{
                        backgroundColor: (activeFilter === 'credit' || activeFilter === 'name') ? '#f5f5f5' : 'white',
                        cursor: (activeFilter === 'credit' || activeFilter === 'name') ? 'not-allowed' : 'text'
                    }}
                />
            </label>

            <label className="FilterCredits__label">Monto</label>

            <div className="FilterCredits__range">
                <label>Días de mora</label>
                <div>
                    <label>
                        Min
                        <input
                            ref={minDaysRef}
                            type="number"
                            min="0"
                            placeholder="Min"
                            onChange={(e) => {
                                filter_credits.setMinDays(e.target.value);
                                applyFilters();
                            }}
                        />
                    </label>
                    <label>
                        Max
                        <input
                            ref={maxDaysRef}
                            type="number"
                            min="0"
                            placeholder="Max"
                            onChange={(e) => {
                                filter_credits.setMaxDays(e.target.value);
                                applyFilters();
                            }}
                        />
                    </label>
                </div>
            </div>

            <label className="FilterCredits__label">
                Cartera
                <select
                    ref={carteraSelectRef}
                    className="FilterCredits__select"
                    defaultValue={''}
                    onChange={(e) => {
                        filter_credits.setCartera(e.target.value);
                        filter_credits.getAgents();
                        applyFilters();
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"SEFIL_1"}>SEFIL-1</option>
                    <option value={"SEFIL_2"}>SEFIL-2</option>
                    <option value={"syncs"}>FACES</option>
                </select>
            </label>

            <label>
                Agencia
                <select
                    ref={agencySelectRef}
                    className="FilterCredits__select"
                    defaultValue={''}
                    onChange={(e) => {
                        filter_credits.setAgency(e.target.value);
                        applyFilters();
                    }}
                    disabled={loadingAgencies}
                >
                    <option value={''}>
                        {loadingAgencies ? '--Cargando--' : '--Todos--'}
                    </option>
                    {agencies.map(agency => (
                        <option key={agency} value={agency}>
                            {agency.toUpperCase()}
                        </option>
                    ))}
                </select>
            </label>

            <label className="FilterCredits__label">Cuotas</label>

            <label className="FilterCredits__label">
                Provincia
                <input
                    ref={provinciaRef}
                    onChange={(e) => {
                        filter_credits.setProvincia(e.target.value);
                        applyFilters();
                    }}
                    placeholder="Provincia"
                />
            </label>

            <label className="FilterCredits__label">
                Canton
                <input
                    ref={cantonRef}
                    onChange={(e) => {
                        filter_credits.setCanton(e.target.value);
                        applyFilters();
                    }}
                    placeholder="Canton"
                />
            </label>

            <label className="FilterCredits__label">
                Estado campaña
                <select
                    ref={syncStatusSelectRef}
                    className="FilterCredits__select"
                    defaultValue={''}
                    onChange={(e) => {
                        filter_credits.setSyncStatus(e.target.value);
                        applyFilters();
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"ACTIVE"}>ACTIVO</option>
                    <option value={"INACTIVE"}>INACTIVO</option>
                </select>
            </label>

            <label className="FilterCredits__label">
                Estado crédito
                <select
                    ref={collectionStateSelectRef}
                    className="FilterCredits__select"
                    defaultValue={''}
                    onChange={(e) => {
                        filter_credits.setCollectionState(e.target.value);
                        applyFilters();
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"Vigente"}>Vigente</option>
                    <option value={"Vencido"}>Vencido</option>
                    <option value={"Vencido en tramite judicial"}>Vencido en tramite judicial</option>
                    <option value={"Castigado"}>Castigado</option>
                    <option value={"CONVENIO DE PAGO"}>Convenio de pago</option>
                    <option value={"Cancelado"}>Cancelado</option>
                </select>
            </label>

            <label className="FilterCredits__label">
                Agente
                <select
                    ref={agentSelectRef}
                    className="FilterCredits__select"
                    defaultValue={''}
                    onChange={(e) => {
                        filter_credits.setAgent(e.target.value);
                        applyFilters();
                    }}
                >
                    <option value={''}>--Todos--</option>
                    {
                        filter_credits.agents.map(agent => (
                            <option key={agent.name} value={agent.id}>{agent.name}</option>
                        ))
                    }
                </select>
            </label>

            {activeFilter && (
                <div style={{
                    padding: '4px 8px',
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196f3',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#1976d2',
                    marginTop: '10px',
                    textAlign: 'center',
                    position: 'absolute',
                    left: '20px',
                    bottom: '-10px',
                }}>
                    📌 Filtrando por: {
                        activeFilter === 'credit' ? 'Crédito' :
                        activeFilter === 'name' ? 'Nombre' : 'Cédula'
                    }
                </div>
            )}

            {hasActiveFilters() && (
                <button
                    onClick={clearAllFilters}
                    style={{
                        marginTop: '10px',
                        padding: '8px 8px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        position: 'absolute',
                        right: '20px',
                        bottom: '-10px',
                        fontWeight: 'bold'
                    }}
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}