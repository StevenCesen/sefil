import { useEffect, useState, useRef } from "react";
import { useStoreFilterCredits } from "../../../stores/useStoreCredits";
import "./FilterCredits.css";

export default function FilterCredits(){
    const filter_credits = useStoreFilterCredits();
    const [activeFilter, setActiveFilter] = useState(null);
    
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
    };
    
    const clearAllFilters = () => {
        filter_credits.setSyncID('');
        filter_credits.setName('');
        filter_credits.setCI('');
        filter_credits.setMinDays('');
        filter_credits.setMaxDays('');
        filter_credits.setAgency('');
        filter_credits.setProvincia('');
        filter_credits.setCanton('');
        filter_credits.setSyncStatus('');
        filter_credits.setCollectionState('');
        filter_credits.setAgent('');
        
        setCreditValue('');
        setNameValue('');
        setCiValue('');
        setActiveFilter(null);

        filter_credits.filterCredits(filter_credits.getFilterString());

        if (minDaysRef.current) minDaysRef.current.value = '';
        if (maxDaysRef.current) maxDaysRef.current.value = '';
        if (carteraSelectRef.current) carteraSelectRef.current.value = '';
        if (agencySelectRef.current) agencySelectRef.current.value = '';
        if (provinciaRef.current) provinciaRef.current.value = '';
        if (cantonRef.current) cantonRef.current.value = '';
        if (syncStatusSelectRef.current) syncStatusSelectRef.current.value = '';
        if (collectionStateSelectRef.current) collectionStateSelectRef.current.value = '';
        if (agentSelectRef.current) agentSelectRef.current.value = '';
    };

    useEffect(() => {
        filter_credits.getAgents();
    }, []);
    
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
                            onChange={(e)=>{
                                filter_credits.setMinDays(e.target.value);
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
                            onChange={(e)=>{
                                filter_credits.setMaxDays(e.target.value);
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
                    onChange={(e)=>{
                        filter_credits.setCartera(e.target.value);
                        filter_credits.getAgents();
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
                    onChange={(e)=>{
                        filter_credits.setAgency(e.target.value);
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"catacocha"}>CATACOCHA</option>
                    <option value={"palanda"}>PALANDA</option>
                    <option value={"cariamanga"}>CARIAMANGA</option>
                    <option value={"zamora"}>ZAMORA</option>
                    <option value={"zumba"}>ZUMBA</option>
                    <option value={"piñas"}>PIÑAS</option>
                    <option value={"celica"}>CELICA</option>
                    <option value={"catamayo"}>CATAMAYO</option>
                    <option value={"malacatos"}>MALACATOS</option>
                    <option value={"santa rosa"}>SANTA ROSA</option>
                    <option value={"oficina las pitas"}>OFICINA LAS PITAS</option>
                    <option value={"oficina centro"}>OFICINA CENTRO</option>
                    <option value={"oficina norte"}>OFICINA NORTE</option>
                    <option value={"san miguel de los bancos"}>SAN MIGUEL DE LOS BANCOS</option>
                    <option value={"milagro"}>MILAGRO</option>
                    <option value={"santo domingo"}>SANTO DOMINGO</option>
                    <option value={"el carmen"}>EL CARMEN</option>
                    <option value={"cayambe"}>CAYAMBE</option>
                    <option value={"pasaje"}>PASAJE</option>
                    <option value={"tumbaco"}>TUMBACO</option>
                    <option value={"la troncal"}>LA TRONCAL</option>
                    <option value={"amaguaña"}>AMAGUAÑA</option>
                    <option value={"naranjal"}>NARANJAL</option>
                    <option value={"quinche"}>QUINCHE</option>
                    <option value={"quininde"}>QUININDE</option>
                </select>
            </label>

            <label className="FilterCredits__label">Cuotas</label>

            <label className="FilterCredits__label">
                Provincia
                <input
                    ref={provinciaRef}
                    onChange={(e)=>{
                        filter_credits.setProvincia(e.target.value);
                    }}
                    placeholder="Provincia"
                />
            </label>

            <label className="FilterCredits__label">
                Canton
                <input
                    ref={cantonRef}
                    onChange={(e)=>{
                        filter_credits.setCanton(e.target.value);
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
                    onChange={(e)=>{
                        filter_credits.setSyncStatus(e.target.value);
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
                    onChange={(e)=>{
                        filter_credits.setCollectionState(e.target.value);
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
                    onChange={(e)=>{
                        filter_credits.setAgent(e.target.value);
                    }}
                >
                    <option value={''}>--Todos--</option>
                    {
                        filter_credits.agents.map(agent=>(
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
        </div>
    );
}