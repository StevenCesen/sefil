import { useState, useEffect } from "react";
import "./ReportPaymentsWithManagement.css";
import AgentPaymentSummary from "../../../components/AgentPaymentSummary/AgentPaymentSummary";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import useAgencies from "../../../hooks/useAgencies";

export default function ReportPaymentsWithManagement() {
    const [agents, setAgents] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [lastUpdate, setLastUpdate] = useState("");
    const { agencies, loading: loadingAgencies } = useAgencies();
    
    // Detalle de créditos
    const [credits, setCredits] = useState([]);
    const [loadingCredits, setLoadingCredits] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15
    });

    // Filtros
    const [credito, setCredito] = useState("");
    const [cedula, setCedula] = useState("");
    const [agencia, setAgencia] = useState("");
    const [estado, setEstado] = useState("");
    const [diasMoraMin, setDiasMoraMin] = useState("");
    const [diasMoraMax, setDiasMoraMax] = useState("");
    const [tipoGestion, setTipoGestion] = useState("");
    const [totalConGestion, setTotalConGestion] = useState("");
    const [totalSinGestion, setTotalSinGestion] = useState("");
    const [agente, setAgente] = useState("");
    
    // Contadores
    const [counters, setCounters] = useState({
        total_general: 0,
        total_general_con_gestion: 0,
        total_campain: 0,
        total_pagos: 0,
        total_castigado: 0,
        total_vencido: 0
    });

    useEffect(() => {
        fetchData();
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch(`${import.meta.env.VITE_URL_BASE}/users?agents=true&is_active=1`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const usersData = Array.isArray(data) ? data : (data.result?.data || []);
                setUsers(usersData);
            })
            .catch(() => {
                setUsers([]);
            });
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return "Desconocida";
        
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return "Hace un momento";
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
        return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    };

    const fetchData = () => {
        setLoading(true);

        fetch(`${import.meta.env.VITE_URL_BASE}/statistics/payments-with-management`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 1) {
                    console.log(data)
                    setAgents(data.result.agents || []);
                    setLastUpdate(data.result.last_update || "");
                    setCounters({
                        total_general: data.result.total_general || 0,
                        total_general_con_gestion: data.result.total_general_with_management || 0,
                        total_campain: data.result.total_with_management_in_campain || 0,
                        total_pagos: data.result.total_credits_with_payment || 0,
                        total_castigado: data.result.total_general_punished || 0,
                        total_vencido: data.result.total_general_overdue || 0
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const fetchCreditsDetails = (page = 1) => {
        setLoadingCredits(true);

        const params = new URLSearchParams();
        params.append("page", page);
        if (credito.length >= 3) params.append("credit_name", credito);
        if (cedula.length >= 3) params.append("client_ci", cedula);
        if (agencia) params.append("agency", agencia);
        if (estado) params.append("collection_state", estado);
        if (diasMoraMin) params.append("days_past_due_min", diasMoraMin);
        if (diasMoraMax) params.append("days_past_due_max", diasMoraMax);
        if (tipoGestion) params.append("management_type", tipoGestion);
        if (agente) params.append("agent_id", agente);

        fetch(`${import.meta.env.VITE_URL_BASE}/statistics/payments-with-management-details?${params.toString()}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.code === 1) {
                    setCredits(data.result.data || []);
                    setPagination({
                        currentPage: data.result.current_page || 1,
                        lastPage: data.result.last_page || 1,
                        total: data.result.total || 0,
                        perPage: data.result.per_page || 15
                    });
                }
                setLoadingCredits(false);
            })
            .catch(() => {
                setLoadingCredits(false);
            });
    };

    const handleFilter = () => {
        fetchCreditsDetails();
    };

    const handleClearFilters = () => {
        setCredito("");
        setCedula("");
        setAgencia("");
        setEstado("");
        setDiasMoraMin("");
        setDiasMoraMax("");
        setTipoGestion("");
        setTotalConGestion("");
        setTotalSinGestion("");
        setAgente("");
        setCredits([]);
        setPagination({
            currentPage: 1,
            lastPage: 1,
            total: 0,
            perPage: 15
        });
    };

    return (
        <div className="PaymentsWithManagement">
            <div className="PaymentsWithManagement__header">
                <div className="PaymentsWithManagement__title-section">
                    <div className="title-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                    </div>
                    <div>
                        <h1 className="PaymentsWithManagement__title">Pagos con Gestión</h1>
                        <p className="PaymentsWithManagement__subtitle">Resumen de cobranza y gestiones</p>
                    </div>
                </div>
                <div className="PaymentsWithManagement__update">
                    <span>Última actualización: {getTimeAgo(lastUpdate)}</span>
                    <span className="status-dot"></span>
                </div>
            </div>

            {/* Contadores principales */}
            <div className="PaymentsWithManagement__cards">
                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Total General</span>
                        <div className="stat-card__icon stat-card__icon--cyan">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                <line x1="2" y1="10" x2="22" y2="10"></line>
                            </svg>
                        </div>
                    </div>
                    <h3 className="stat-card__value">{useFormatterNumber({ value: counters.total_general, currency: 'USD' })}</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Total General con Gestión</span>
                        <div className="stat-card__icon stat-card__icon--green">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                    </div>
                    <h3 className="stat-card__value">{useFormatterNumber({ value: counters.total_general_con_gestion, currency: 'USD' })}</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Total con Gestión en Campaña</span>
                        <div className="stat-card__icon stat-card__icon--cyan">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <h3 className="stat-card__value">{useFormatterNumber({ value: counters.total_campain, currency: 'USD' })}</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Total Créditos con Pago</span>
                        <div className="stat-card__icon stat-card__icon--cyan">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                        </div>
                    </div>
                    <h3 className="stat-card__value">{counters.total_pagos}</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Total General Castigado</span>
                        <div className="stat-card__icon stat-card__icon--red">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                    </div>
                    <h3 className="stat-card__value">{useFormatterNumber({ value: counters.total_castigado, currency: 'USD' })}</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Total General Vencido</span>
                        <div className="stat-card__icon stat-card__icon--yellow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <h3 className="stat-card__value">{useFormatterNumber({ value: counters.total_vencido, currency: 'USD' })}</h3>
                </div>
            </div>

            {/* Resumen por Agente */}
            <AgentPaymentSummary agents={agents} />

            {/* Botón Ver Detalles */}
            <div className="PaymentsWithManagement__toggle">
                <button
                    className="btn-toggle-details"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points={showDetails ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                    </svg>
                    Ver Detalles
                </button>
            </div>

            {/* Sección de Detalles (colapsable) */}
            {showDetails && (
                <div className="PaymentsWithManagement__details">
                    <h4 style={{color: "var(--color-1)", marginBottom: "20px"}}>Detalle de Créditos</h4>
                    
                    {/* Filtros */}
                    <div className="PaymentsWithManagement__filters">
                        <label>
                            Nombre/Crédito
                            <input
                                type="text"
                                value={credito}
                                onChange={(e) => setCredito(e.target.value)}
                                placeholder="Nombre o crédito (min 3 caracteres)"
                            />
                        </label>

                        <label>
                            Cédula
                            <input
                                type="text"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                placeholder="Cédula (min 3 caracteres)"
                            />
                        </label>

                        <label>
                            Agencia
                            <select 
                                value={agencia}
                                onChange={(e) => setAgencia(e.target.value)}
                                disabled={loadingAgencies}
                            >
                                <option value="">--Todos--</option>
                                {agencies.map((agency) => (
                                    <option key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Estado Crédito
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">-- Seleccionar --</option>
                                <option value="VIGENTE">VIGENTE</option>
                                <option value="VENCIDO">VENCIDO</option>
                                <option value="CASTIGADO">CASTIGADO</option>
                            </select>
                        </label>

                        <label>
                            Días de mora
                            <div className="PaymentsWithManagement__filters-range">
                                <input
                                    type="number"
                                    value={diasMoraMin}
                                    onChange={(e) => setDiasMoraMin(e.target.value)}
                                    placeholder="Min"
                                />
                                <input
                                    type="number"
                                    value={diasMoraMax}
                                    onChange={(e) => setDiasMoraMax(e.target.value)}
                                    placeholder="Max"
                                />
                            </div>
                        </label>

                        <label>
                            Tipo gestión
                            <select
                                value={tipoGestion}
                                onChange={(e) => setTipoGestion(e.target.value)}
                            >
                                <option value="">-- Seleccionar --</option>
                                <option value="SI">CON GESTIÓN</option>
                                <option value="NO">SIN GESTIÓN</option>
                            </select>
                        </label>

                        <label>
                            Agente
                            <select
                                value={agente}
                                onChange={(e) => setAgente(e.target.value)}
                            >
                                <option value="">-- Seleccionar --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="PaymentsWithManagement__filters-actions">
                            <button
                                className="btn-filter"
                                onClick={handleFilter}
                                disabled={loadingCredits}
                            >
                                {loadingCredits ? "Buscando..." : "Buscar"}
                            </button>
                            <button
                                className="btn-clear"
                                onClick={handleClearFilters}
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>

                    {/* Tabla de créditos */}
                    {loadingCredits && (
                        <div style={{textAlign: "center", padding: "40px", color: "var(--color-texts)"}}>
                            Cargando datos...
                        </div>
                    )}

                    {!loadingCredits && credits.length === 0 && (
                        <div style={{textAlign: "center", padding: "40px", color: "var(--color-texts)"}}>
                            Aplica filtros para ver el detalle de créditos
                        </div>
                    )}

                    {!loadingCredits && credits.length > 0 && (
                        <div className="PaymentsWithManagement__table-container">
                            <table className="PaymentsWithManagement__table">
                                <thead>
                                    <tr>
                                        <th>ID Pago</th>
                                        <th>Nombre</th>
                                        <th>Crédito</th>
                                        <th>Cédula</th>
                                        <th>Agencia</th>
                                        <th>Estado</th>
                                        <th>Días mora</th>
                                        <th>Gestiones efectivas</th>
                                        <th>Gestiones no efectivas</th>
                                        <th>Pagado con gestión</th>
                                        <th>Pagado sin gestión</th>
                                        <th>Valor pago</th>
                                        <th>Fecha pago</th>
                                        <th>Agente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {credits.map((credit, index) => (
                                        <tr key={credit.payment_id || index}>
                                            <td>{credit.payment_id}</td>
                                            <td>{credit.credit_name}</td>
                                            <td>{credit.credit_sync_id}</td>
                                            <td>{credit.client_ci}</td>
                                            <td>{credit.agency}</td>
                                            <td>{credit.collection_state}</td>
                                            <td>{credit.days_past_due}</td>
                                            <td>{credit.effective_managements_count}</td>
                                            <td>{credit.non_effective_managements_count}</td>
                                            <td>{useFormatterNumber({ value: credit.total_paid_with_management, currency: 'USD' })}</td>
                                            <td>{useFormatterNumber({ value: credit.total_paid_without_management, currency: 'USD' })}</td>
                                            <td>{useFormatterNumber({ value: credit.payment_value, currency: 'USD' })}</td>
                                            <td>{new Date(credit.payment_date).toLocaleString('es-EC', { 
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}</td>
                                            <td>{credit.agent}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Controles de paginación */}
                            {pagination.lastPage > 1 && (
                                <div className="PaymentsWithManagement__pagination">
                                    <button
                                        onClick={() => fetchCreditsDetails(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1 || loadingCredits}
                                        className="pagination-btn"
                                    >
                                        ← Anterior
                                    </button>
                                    <span className="pagination-info">
                                        Página {pagination.currentPage} de {pagination.lastPage} ({pagination.total} registros)
                                    </span>
                                    <button
                                        onClick={() => fetchCreditsDetails(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.lastPage || loadingCredits}
                                        className="pagination-btn"
                                    >
                                        Siguiente →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
