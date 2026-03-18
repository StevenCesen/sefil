import { useState, useRef } from "react";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import useAgencies from "../../../hooks/useAgencies";
import SelectManagementStates from "../../SelectManagementStates/SelectManagementStates";
import "./FilterManagement.css";

export default function FilterManagement(){
    const filter_management = useStoreFilterManagement();
    const [activeFilter, setActiveFilter] = useState(null);
    const { agencies, loading: loadingAgencies } = useAgencies();

    // Referencias para limpiar elementos
    const agencySelectRef = useRef(null);
    const minDaysRef = useRef(null);
    const maxDaysRef = useRef(null);
    const sectorSelectRef = useRef(null);
    const managementStateSelectRef = useRef(null);
    const promiseDateRef = useRef(null);

    // Estados locales solo para filtros principales (exclusión mutua)
    const [nameValue, setNameValue] = useState('');
    const [ciValue, setCiValue] = useState('');

    // Función para verificar si hay filtros aplicados
    const hasActiveFilters = () => {
        return (
            filter_management.name.length >= 3 ||
            filter_management.sync_id.length >= 3 ||
            filter_management.ci.length >= 3 ||
            filter_management.agency !== '' ||
            filter_management.days_past_due_min !== '' ||
            filter_management.days_past_due_max !== '' ||
            filter_management.sector !== '' ||
            filter_management.management_state !== '' ||
            filter_management.promise_date !== ''
        );
    };

    // Función helper para aplicar filtros
    const applyFilters = () => {
        filter_management.FilteredCredits(filter_management.getFilterString());
    };

    const handlePrimaryFilterChange = (filterType, value) => {
        if (!value || value.length < 3) {
            if (filterType === 'name') {
                filter_management.setName('');
                filter_management.setSyncId('');
                setNameValue(value);
                if (activeFilter === 'name') setActiveFilter(null);
            } else if (filterType === 'ci') {
                filter_management.setCi('');
                setCiValue(value);
                if (activeFilter === 'ci') setActiveFilter(null);
            }
        } else {
            if (filterType === 'name') {
                filter_management.setCi('');
                setCiValue('');
                const hasNumbers = /\d/.test(value);
                if (hasNumbers) {
                    filter_management.setName('');
                    filter_management.setSyncId(value);
                } else {
                    filter_management.setSyncId('');
                    filter_management.setName(value);
                }
                setNameValue(value);
                setActiveFilter('name');
            } else if (filterType === 'ci') {
                filter_management.setName('');
                filter_management.setSyncId('');
                setNameValue('');
                filter_management.setCi(value);
                setCiValue(value);
                setActiveFilter('ci');
            }
        }

        applyFilters();
    };

    const clearAllFilters = () => {
        // Limpiar store
        filter_management.setName('');
        filter_management.setSyncId('');
        filter_management.setCi('');
        filter_management.setAgency('');
        filter_management.setMinDays('');
        filter_management.setMaxDays('');
        filter_management.setSector('');
        filter_management.setManagementState('');
        filter_management.setPromiseDate('');

        // Limpiar estados locales
        setNameValue('');
        setCiValue('');
        setActiveFilter(null);

        // Limpiar elementos del DOM
        if (agencySelectRef.current) agencySelectRef.current.value = '';
        if (minDaysRef.current) minDaysRef.current.value = '';
        if (maxDaysRef.current) maxDaysRef.current.value = '';
        if (sectorSelectRef.current) sectorSelectRef.current.value = '';
        if (managementStateSelectRef.current) managementStateSelectRef.current.value = '';
        if (promiseDateRef.current) promiseDateRef.current.value = '';

        applyFilters();
    };

    return(
        <div className="FilterManagement">
            <div></div>

            <label className="FilterManagement__label">
                Nombre/Crédito
                <input
                    value={nameValue}
                    disabled={activeFilter === 'ci'}
                    onChange={(e) => handlePrimaryFilterChange('name', e.target.value)}
                    placeholder={activeFilter === 'ci' ? 'Deshabilitado (filtrando por cédula)' : 'Nombre o crédito (min 3 caracteres)'}
                    style={{
                        backgroundColor: activeFilter === 'ci' ? '#f5f5f5' : 'white',
                        cursor: activeFilter === 'ci' ? 'not-allowed' : 'text'
                    }}
                />
            </label>

            <label className="FilterManagement__label">
                Cédula
                <input
                    value={ciValue}
                    disabled={activeFilter === 'name'}
                    onChange={(e) => handlePrimaryFilterChange('ci', e.target.value)}
                    placeholder={activeFilter === 'name' ? 'Deshabilitado (filtrando por nombre/crédito)' : 'Cédula (min 3 caracteres)'}
                    style={{
                        backgroundColor: activeFilter === 'name' ? '#f5f5f5' : 'white',
                        cursor: activeFilter === 'name' ? 'not-allowed' : 'text'
                    }}
                />
            </label>

            <label className="FilterManagement__label">
                Agencia
                <select
                    ref={agencySelectRef}
                    defaultValue={''}
                    onChange={(e) => {
                        filter_management.setAgency(e.target.value);
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

            <div className="FilterManagement__range">
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
                                filter_management.setMinDays(e.target.value);
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
                                filter_management.setMaxDays(e.target.value);
                                applyFilters();
                            }}
                        />
                    </label>
                </div>
            </div>

            <label className="FilterManagement__label">
                Sector Econ.
                <select
                    ref={sectorSelectRef}
                    defaultValue={''}
                    onChange={(e) => {
                        filter_management.setSector(e.target.value);
                        applyFilters();
                    }}
                >
                    <option value={""}>-- Seleccionar --</option>
                    <option value={"AGRÍCOLA"}>AGRÍCOLA</option>
                    <option value={"COMERCIO"}>COMERCIO</option>
                    <option value={"PECUARIA"}>PECUARIA</option>
                    <option value={"PESCA"}>PESCA</option>
                    <option value={"SERVICIOS"}>SERVICIOS</option>
                    <option value={"TRANSFORMACION"}>TRANSFORMACION</option>
                </select>
            </label>

            <label className="FilterManagement__label">Monto</label>

            <label className="FilterManagement__label">Cuotas</label>

            <SelectManagementStates
                className="FilterManagement__label"
                value={filter_management.management_state}
                onChange={(_, value) => {
                    filter_management.setManagementState(value);
                    applyFilters();
                }}
            />

            <label className="FilterManagement__label">
                Compromiso
                <input
                    ref={promiseDateRef}
                    type="date"
                    onChange={(e) => {
                        filter_management.setPromiseDate(e.target.value);
                        applyFilters();
                    }}
                />
            </label>

            {/* Indicador visual del filtro activo */}
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
                    position:'absolute',
                    left:'20px',
                    bottom:'0px',
                    fontWeight:'bold'
                }}>
                    📌 Filtrando por: {activeFilter === 'name' ? 'Nombre/Crédito' : 'Cédula'}
                </div>
            )}

            {/* Botón limpiar filtros - Solo visible cuando hay filtros aplicados */}
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
                        position:'absolute',
                        right:'20px',
                        bottom:'-10px',
                        fontWeight:'bold'
                    }}
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}