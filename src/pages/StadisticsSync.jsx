import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import useFormatterNumber from "../hooks/useFormatterNumber.js";
import Loader from "../components/Loader/loader.jsx";
import { useStoreLoader } from "../stores/useStoreLoader.js";

// Constantes
const INITIAL_CREDITS_STATE = {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 1,
    last_page: 0,
    last_page_url: '',
    links: [],
    next_page_url: '',
    path: '',
    per_page: 0,
    prev_page_url: '',
    to: 0,
    total: 0,
    acumulado: 0,
};

const INITIAL_FILTER_STATE = {
    mora: {
        min: 0,
        max: 0
    },
    estado: "",
    agente: "",
    con_gestion: "SI"
};

const INITIAL_STATS_STATE = {
    total: 0,
    nroCredits: 0,
    totalGeneral: 0,
    totalCampain: 0,
    totalCastigado: 0,
    totalVencido: 0,
    nroCreditsTotal: 0
};

const ESTADO_CREDITO_OPTIONS = [
    { value: "", label: "-- Selecionar --" },
    { value: "vigente", label: "Vigente" },
    { value: "vencido", label: "Vencido" },
    { value: "Cancelado", label: "Cancelado" },
    { value: "Castigado", label: "Castigado" },
    { value: "CONVENIO DE PAGO", label: "Convenio" }
];

const GESTION_EFECTIVA_OPTIONS = [
    { value: "", label: "-- Seleccionar --" },
    { value: "SI", label: "Con gestión" }
];

export default function StadisticsSync() {
    const param = useParams();
    const loader = useStoreLoader();

    // Estados principales
    const [data_credit, setCredit] = useState(null);
    const [agents, setAgents] = useState(null);
    const [credits, setCredits] = useState(INITIAL_CREDITS_STATE);
    const [filter, setFilter] = useState(INITIAL_FILTER_STATE);
    const [stats, setStats] = useState(INITIAL_STATS_STATE);
    const [message, setMessage] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [agent, setAgent] = useState("all");
    const fetchData = async (url, options = {}) => {
        const defaultOptions = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const getFilters = ({ mora, estado, agente, con_gestion }) => {
        let filter_apply = "";

        if (Number(mora.min) !== 0 && mora.min !== "") {
            filter_apply += `&mora_min=${mora.min}`;
        }

        if (Number(mora.max) !== 0 && mora.max !== "") {
            filter_apply += `&mora_max=${mora.max}`;
        }

        if (estado !== "") {
            filter_apply += `&estado=${estado}`;
        }

        if (agente !== "") {
            filter_apply += `&agente=${agente}`;
        }

        if (con_gestion !== "") {
            filter_apply += `&con_gestion=${con_gestion}`;
        }

        return filter_apply;
    };

    const updateData = async (url) => {
        try {
            loader.viewOn(true);
            
            const complemento = getFilters({
                mora: filter.mora,
                estado: filter.estado,
                agente: filter.agente,
                con_gestion: filter.con_gestion
            });

            const finalUrl = `${url}&campain=29&cartera=syncs${complemento}`;
            const data = await fetchData(finalUrl);

            setStats(prev => ({ ...prev, total: data.total }));
            setCredits(data.info);
        } catch (error) {
            console.error('Error updating data:', error);
            setMessage("Error al cargar los datos");
        } finally {
            loader.viewOn(false);
        }
    };

    const setFilters = async (filterParams) => {
        try {
            loader.viewOn(true);

            const filter_apply = getFilters(filterParams);
            const url = `${import.meta.env.VITE_URL_BASE}/campains/stadistics?campain=29&cartera=syncs${filter_apply}`;
            
            const data = await fetchData(url);
            
            if (data.total) {
                setStats({
                    total: data.total.total,
                    nroCredits: data.total.nro_credits,
                    totalGeneral: data.total.total_general,
                    totalCampain: data.total.total_campain,
                    totalCastigado: data.total.total_castigado,
                    totalVencido: data.total.total_vencido,
                    nroCreditsTotal: data.total.nro_credits_total
                });
                setCredits(data.info);
                setMessage("");
            }
        } catch (error) {
            console.error('Error setting filters:', error);
            setMessage("Error al aplicar filtros");
        } finally {
            loader.viewOn(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        let newFilter;
        
        if (filterType === 'mora_min') {
            newFilter = {
                ...filter,
                mora: { ...filter.mora, min: value }
            };
        } else if (filterType === 'mora_max') {
            newFilter = {
                ...filter,
                mora: { ...filter.mora, max: value }
            };
        } else {
            newFilter = {
                ...filter,
                [filterType]: value
            };
        }

        setFilter(newFilter);
        setFilters(newFilter);
    };

    const handleMoraKeyDown = (e, type) => {
        if (e.key === 'Enter') {
            handleFilterChange(type, e.target.value);
        }
    };

    const navigateToCredit = async (creditId) => {
        try {
            loader.viewOn(true);
            
            const data = await fetchData(
                `${import.meta.env.VITE_URL_BASE}/campains/gestionwithpays?campain=29&id_credito=${creditId}&cartera=syncs`
            );
            
            setCredit(data);
            window.location.hash = `/dashboard/stadistics/${creditId}`;
        } catch (error) {
            console.error('Error loading credit detail:', error);
        } finally {
            loader.viewOn(false);
        }
    };

    useEffect(() => {
        const initializeComponent = async () => {
            try {
                setInput('');
                setAgent("all");
                setCredits(INITIAL_CREDITS_STATE);
                setMessage("");
                setFilter(INITIAL_FILTER_STATE);
                setStats(INITIAL_STATS_STATE);
                
                localStorage.setItem('cartera', 'syncs');
                setAux(localStorage.getItem('cartera'));
                
                loader.viewOn(true);

                const cartera = localStorage.getItem('cartera');
                if (cartera && cartera !== '' && cartera !== null && param.ci === undefined) {
                    setAux(cartera);

                    const statsData = await fetchData(
                        `${import.meta.env.VITE_URL_BASE}/campains/stadistics?campain=33`
                    );
                    
                    if (statsData.total) {
                        setStats({
                            total: statsData.total.total,
                            nroCredits: statsData.total.nro_credits,
                            totalGeneral: statsData.total.total_general,
                            totalCampain: statsData.total.total_campain,
                            totalCastigado: statsData.total.total_castigado,
                            totalVencido: statsData.total.total_vencido,
                            nroCreditsTotal: statsData.total.nro_credits_total
                        });
                        setCredits(statsData.info);
                    }

                    const agentsData = await fetchData(
                        `${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=syncs`
                    );
                    
                    setAgents(agentsData);
                    setCredit([]);
                } else if (param.ci) {
                    setAgents([]);
                    setAgent([]);

                    const creditData = await fetchData(
                        `${import.meta.env.VITE_URL_BASE}/campains/gestionwithpays?campain=28&id_credito=${param.ci}&cartera=syncs`
                    );
                    
                    setCredit(creditData);
                }

                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing component:', error);
                setMessage("Error al cargar la página");
                setAgents([]);
                setAgent([]);
                setCredit([]);
            } finally {
                loader.viewOn(false);
            }
        };

        initializeComponent();
    }, [param.ci]);

    if (!isInitialized) {
        return <Loader />;
    }

    if (!agents && !param.ci) return <Loader />;
    if (!data_credit && param.ci) return <Loader />;

    return (
        <div className="pageConsulta">
            {param.ci ? (
                <>
                    <div className="DetailCredit__head">
                        <NavLink 
                            to="" 
                            onClick={(e) => {
                                e.preventDefault();
                                history.go(-1);
                            }}
                        >
                            Regresar
                        </NavLink>
                    </div>

                    <div>
                        <p><strong>Contrato:</strong> {data_credit?.contrato}</p>
                    </div>

                    <div className="DetailCredit__stadisticCredit">
                        <div className="DetailCredit__stadisticGestiones">
                            <div className="DetailCredit__stadisticGestionesHead">
                                <label>Fecha gestión</label>
                                <label>Agente</label>
                                <label>Contacto</label>
                                <label>Cédula</label>
                                <label>Cliente tipo</label>
                                <label>Estado</label>
                                <label>Fecha compromiso</label>
                                <label>Observaciones</label>
                            </div>

                            {data_credit?.gestiones?.map((gestion, index) => (
                                <div key={index} className="DetailCredit__stadisticGestionesItem">
                                    <label>{gestion.fecha}</label>
                                    <label>{gestion.byUser}</label>
                                    <label>{gestion.client_name}</label>
                                    <label>{gestion.client_ci}</label>
                                    <label>{gestion.type}</label>
                                    <label>{gestion.substate_gestion}</label>
                                    <label>{gestion.date_promise}</label>
                                    <label>{gestion.observation}</label>
                                </div>
                            ))}
                        </div>
                        
                        <div className="DetailCredit__stadisticPagos">
                            <div className="DetailCredit__stadisticPagosHead">
                                <label>Fecha pago</label>
                                <label>Código</label>
                                <label>Con gestión</label>
                                <label>Cuota</label>
                                <label>Tipo</label>
                                <label>Monto</label>
                            </div>
                            
                            {data_credit?.pagos?.map((pago, index) => (
                                <div key={index} className="DetailCredit__stadisticPagosItem">
                                    <label>{pago.payment_date}</label>
                                    <label>{pago.payment_id}</label>
                                    <label>
                                        {pago.con_gestion ? (
                                            <span className="DetailCredit__stadisticPagosItem--successful">SI</span>
                                        ) : (
                                            <span className="DetailCredit__stadisticPagosItem--non">NO</span>
                                        )}
                                    </label>
                                    <label>{pago.fee_id}</label>
                                    <label>{pago.payment_type}</label>
                                    <label>
                                        {useFormatterNumber({ value: pago.payment_value, currency: 'USD' })}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* <div className="pageConsulta__search">
                        <h4 className="Reports__title">Pagos con gestión</h4>
                        <label>
                            Cartera
                            <select>
                                <option>SEFIL 1</option>
                                <option>SEFIL 2</option>
                                <option>FACES</option>
                            </select>
                        </label>
                    </div> */}

                    <div className="pageConsulta__search" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', gap: '50px' }}>
                        <div>
                            <h4 className="Reports__title" style={{ color: "black" }}>
                                Total general con gestión: {useFormatterNumber({ value: stats.totalGeneral, currency: 'USD' })}
                            </h4>
                            <h4 className="Reports__title" style={{ color: "black" }}>
                                Total con gestión en campaña: {useFormatterNumber({ value: stats.totalCampain, currency: 'USD' })}
                            </h4>
                            <h4 className="Reports__title" style={{ color: "black" }}>
                                Total de créditos con pago: {stats.nroCreditsTotal}
                            </h4>
                        </div>
                        <div>
                            <h4 className="Reports__title" style={{ color: "black" }}>
                                Total general Castigado en campaña: {useFormatterNumber({ value: stats.totalCastigado, currency: 'USD' })}
                            </h4>
                            <h4 className="Reports__title" style={{ color: "black" }}>
                                Total general Vencido en campaña: {useFormatterNumber({ value: stats.totalVencido, currency: 'USD' })}
                            </h4>
                        </div>
                    </div>

                    <div className="pageConsulta__results">
                        <div className="DetailCredit__stadistics">
                            <div className="DetailCredit__stadisticsHead">
                                <p>ID</p>
                                <p>Crédito</p>
                                <p>Agencia</p>
                                <p>Nombre</p>
                                <p>Cédula</p>

                                <label>
                                    Estado crédito
                                    <select onChange={(e) => handleFilterChange('estado', e.target.value)}>
                                        {ESTADO_CREDITO_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <p>Campaña</p>
                                <p>Número de cuotas pagadas</p>

                                <label>
                                    Días de mora
                                    <div className="DetailCredit__pays--filter">
                                        <div>
                                            <label>Min</label>
                                            <input 
                                                type="number"
                                                min="0"
                                                onChange={(e) => setFilter(prev => ({
                                                    ...prev,
                                                    mora: { ...prev.mora, min: e.target.value }
                                                }))}
                                                onKeyDown={(e) => handleMoraKeyDown(e, 'mora_min')}
                                            />
                                        </div>
                                        <div>
                                            <label>Max</label>
                                            <input 
                                                type="number"
                                                min="0"
                                                onChange={(e) => setFilter(prev => ({
                                                    ...prev,
                                                    mora: { ...prev.mora, max: e.target.value }
                                                }))}
                                                onKeyDown={(e) => handleMoraKeyDown(e, 'mora_max')}
                                            />
                                        </div>
                                    </div>
                                </label>
                                
                                <label>
                                    Gestiones efectivas
                                    <select
                                        value={filter.con_gestion}
                                        onChange={(e) => handleFilterChange('con_gestion', e.target.value)}
                                    >
                                        {GESTION_EFECTIVA_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <p>Gestiones no efectivas</p>
                                
                                <div>
                                    <label>Total pagado con gestión</label>
                                    <div style={{ marginTop: "10px", color: "white", fontSize: "16px" }}>
                                        Créditos {stats.nroCredits} - {useFormatterNumber({ value: stats.total, currency: 'USD' })}
                                    </div>
                                </div>
                                
                                <p>Total pagado sin gestión</p>
                                <p>Total pagado</p>

                                <label>
                                    Agente
                                    <select onChange={(e) => handleFilterChange('agente', e.target.value)}>
                                        <option value="">-- Seleccionar agente --</option>
                                        {agents?.map((agent) => (
                                            <option key={agent.id} value={agent.id}>
                                                {agent.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {message && <strong>{message}</strong>}

                            {credits.data.map((credit, index) => (
                                <div key={index} className="DetailCredit__stadisticsItems">
                                    <NavLink 
                                        to={`/dashboard/stadistics/${credit.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateToCredit(credit.id);
                                        }}
                                    >
                                        {credit.id}
                                    </NavLink>
                                    <p>{credit.agency}</p>
                                    <p>syncs-{credit.credito}</p>
                                        
                                    <div>
                                        {credit.nombre} <strong style={{ fontWeight: 'bold' }}>{credit.tipo}</strong>
                                    </div>
                                    
                                    <p>{credit.ci}</p>
                                    <p>{credit.estado}</p>
                                    <p>FACES MAYO 2025</p>
                                    <p>{credit.cuotas_pagadas}</p>
                                    <p>{credit.dias_vencidos}</p>
                                    
                                    {credit.con_gestion === "SI" ? (
                                        <div className="DetailCredit__stadisticsItems--successful">
                                            {credit.id_gestion_previa > 0 ? 2 : 1}
                                        </div>
                                    ) : (
                                        <p>0</p>
                                    )}
                                    
                                    <p>0</p>
                                    
                                    {credit.payment_value > 0 && credit.con_gestion === "SI" ? (
                                        <div className="DetailCredit__stadisticsItems--successful">
                                            {useFormatterNumber({ value: credit.payment_value, currency: 'USD' })}
                                        </div>
                                    ) : (
                                        <p>{useFormatterNumber({ value: 0, currency: 'USD' })}</p>
                                    )}
                                    
                                    {credit.total_amount > 0 && credit.con_gestion === "NO" ? (
                                        <p>{useFormatterNumber({ value: credit.payment_value, currency: 'USD' })}</p>
                                    ) : (
                                        <p>{useFormatterNumber({ value: 0, currency: 'USD' })}</p>
                                    )}
                                    
                                    <p>{useFormatterNumber({ value: credit.payment_value, currency: 'USD' })}</p>
                                    <p>{credit.user_id === "" ? "N/D" : credit.user_id}</p>
                                </div>
                            ))}
                        </div>

                        {agent === "all" && (
                            <div className="DetailCredit__access" style={{ marginBottom: "20px" }}>
                                <p>Registros del {credits.from}-{credits.to} de {credits.total}</p>
                                <div>
                                    {credits.links.map((button, index) => {
                                        if (index === 0) {
                                            return (
                                                <button 
                                                    key={index} 
                                                    onClick={() => updateData(button.url)}
                                                    disabled={!button.url}
                                                    style={{
                                                        padding: '8px 16px',
                                                        margin: '0 5px 10px',
                                                        backgroundColor: button.url ? 'var(--bg-alert-error)' : '#6c757d',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: button.url ? 'pointer' : 'not-allowed'
                                                    }}
                                                >
                                                    Anterior
                                                </button>
                                            );
                                        } else if (index === credits.links.length - 1) {
                                            return (
                                                <button 
                                                    key={index} 
                                                    onClick={() => updateData(button.url)}
                                                    disabled={!button.url}
                                                    style={{
                                                        padding: '8px 16px',
                                                        margin: '0 5px 10px',
                                                        backgroundColor: button.url ? 'var(--bg-alert-error)' : '#6c757d',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: button.url ? 'pointer' : 'not-allowed'
                                                    }}
                                                >
                                                    Siguiente
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}