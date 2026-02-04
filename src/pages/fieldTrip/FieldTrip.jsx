import { useEffect, useState } from "react";
import "./fieldTrip.css";
import { useStoreLoader } from "../../stores/useStoreLoader";
import sendpush from "../../helpers/sendpush";

// Opciones de rango basadas en días de mora
const RANGE_OPTIONS = [
    { value: "all", label: "Todos los rangos" },
    { value: "A", label: "A) Preventiva", min: null, max: 0 },
    { value: "B", label: "B) 1", min: 1, max: 1 },
    { value: "C", label: "C) 2-5", min: 2, max: 5 },
    { value: "D", label: "D) 6-15", min: 6, max: 15 },
    { value: "E", label: "E) 16-30", min: 16, max: 30 },
    { value: "F", label: "F) 31-60", min: 31, max: 60 },
    { value: "G", label: "G) 61-90", min: 61, max: 90 },
    { value: "H", label: "H) 91-120", min: 91, max: 120 },
    { value: "I", label: "I) 121-180", min: 121, max: 180 },
    { value: "J", label: "J) 181-360", min: 181, max: 360 },
    { value: "K", label: "K) 361-720", min: 361, max: 720 },
    { value: "L", label: "L) 721-1080", min: 721, max: 1080 },
    { value: "M", label: "M) Más de 1080", min: 1081, max: null }
];

// Estados de crédito
const COLLECTION_STATE_OPTIONS = [
    { value: "all", label: "Todos los estados" },
    { value: "Vigente", label: "Vigente" },
    { value: "Vencido", label: "Vencido" },
    { value: "Castigado", label: "Castigado" },
    { value: "CONVENIO DE PAGO", label: "Convenio de Pago" },
    { value: "Vencido en trámite judicial", label: "Vencido en trámite judicial" }
];

// Función para extraer el número de crédito del sync_id (parte después del guión)
const extractCreditNumber = (term) => {
    if (!term) return "";
    const trimmed = term.trim();
    if (trimmed.includes("-")) {
        return trimmed.split("-").pop();
    }
    return trimmed;
};

export default function FieldTrip() {
    const [credits, setCredits] = useState([]);
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterApproved, setFilterApproved] = useState("pending"); // all, approved, pending
    const [filterAgent, setFilterAgent] = useState("all"); // all, agent_id
    const [agents, setAgents] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [filterBusiness, setFilterBusiness] = useState("all"); // all, business_id
    const [pagination, setPagination] = useState(null);

    // Nuevos filtros
    const [agencies, setAgencies] = useState([]);
    const [filterAgencies, setFilterAgencies] = useState([]); // Multi-select array
    const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
    const [filterRange, setFilterRange] = useState("all");
    const [filterCollectionState, setFilterCollectionState] = useState("all");
    const [filterMinAmount, setFilterMinAmount] = useState("");
    const [filterMaxAmount, setFilterMaxAmount] = useState("");
    const [approvalLoading, setApprovalLoading] = useState({});

    useEffect(() => {
        fetchAgents();
        fetchBusinesses();
        fetchAgencies();
    }, []);
    const fetchBusinesses = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/businesses?per_page=100&is_active=1`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.code === 1) {
                setBusinesses(data.result?.data || []);
            }
        } catch (error) {
            console.error("Error fetching businesses:", error);
        }
    };

    const fetchAgencies = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/agencies`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.code === 1) {
                setAgencies(data.result?.data || []);
            }
        } catch (error) {
            console.error("Error fetching agencies:", error);
        }
    };

    const handleAgencyChange = (agencyName, checked) => {
        if (agencyName === "-- Todas --") {
            if (checked) {
                setFilterAgencies(agencies.map(a => a.name));
            } else {
                setFilterAgencies([]);
            }
        } else {
            if (checked) {
                setFilterAgencies(prev => [...prev, agencyName]);
            } else {
                setFilterAgencies(prev => prev.filter(a => a !== agencyName));
            }
        }
    };

    useEffect(() => {
        fetchCredits();
    }, [filterApproved, filterAgent, filterBusiness, filterAgencies, filterRange, filterCollectionState, filterMinAmount, filterMaxAmount]);

    // Agregar debounce para la búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Debounce completado, ejecutando búsqueda...');
            fetchCredits();
        }, 500);

        return () => {
            console.log('Limpiando timer de debounce');
            clearTimeout(timer);
        };
    }, [searchTerm]);

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/users?role=agent&per_page=100&is_active=1`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            
            if (data.code === 1) {
                setAgents(data.result?.data || []);
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    };

    const fetchCredits = async (url = null) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            let endpoint;
            if (url) {
                endpoint = url;
            } else {
                let baseUrl = `${import.meta.env.VITE_URL_BASE}/credits?`;
                if (filterApproved === "pending") {
                    baseUrl += `&approve_field_trip=0&management_status=VISITA CAMPO`;
                } else if (filterApproved === "approved") {
                    baseUrl += `&approve_field_trip=1&management_status=VISITA APROBADA`;
                }
                if (filterAgent !== "all") {
                    baseUrl += `&user_id=${filterAgent}`;
                }
                if (filterBusiness !== "all") {
                    baseUrl += `&business_id=${filterBusiness}`;
                }
                // Filtro de agencias (multi-select)
                if (filterAgencies.length > 0) {
                    baseUrl += `&agency=${encodeURIComponent(filterAgencies.join(','))}`;
                }
                // Filtro de rango de días de mora
                if (filterRange !== "all") {
                    const rangeOption = RANGE_OPTIONS.find(r => r.value === filterRange);
                    if (rangeOption) {
                        if (rangeOption.min !== null) {
                            baseUrl += `&days_past_due_min=${rangeOption.min}`;
                        }
                        if (rangeOption.max !== null) {
                            baseUrl += `&days_past_due_max=${rangeOption.max}`;
                        }
                    }
                }
                // Filtro de estado de crédito
                if (filterCollectionState !== "all") {
                    baseUrl += `&collection_state=${encodeURIComponent(filterCollectionState)}`;
                }
                // Filtro de monto
                if (filterMinAmount) {
                    baseUrl += `&total_amount_min=${filterMinAmount}`;
                }
                if (filterMaxAmount) {
                    baseUrl += `&total_amount_max=${filterMaxAmount}`;
                }
                // Agregar búsqueda por sync_id (extrae número de crédito si viene con prefijo)
                if (searchTerm.trim()) {
                    const creditNumber = extractCreditNumber(searchTerm);
                    baseUrl += `&sync_id=${encodeURIComponent(creditNumber)}`;
                }
                endpoint = baseUrl;
            }
            
            const response = await fetch(endpoint, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.code === 1) {
                setCredits(data.result?.data || []);
                setPagination({
                    current_page: data.result?.meta?.current_page,
                    last_page: data.result?.meta?.last_page,
                    next_page_url: data.result?.links?.next,
                    prev_page_url: data.result?.links?.prev,
                    total: data.result?.meta?.total
                });
            }
        } catch (error) {
            console.error("Error fetching credits:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCreditDetails = async (creditId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/credits/${creditId}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            
            if (data.code === 1) {
                // Filtrar solo las gestiones con substate = 'VISITA CAMPO'
                const fieldTripManagements = data.result.collection_managements?.filter(
                    m => m.substate === 'VISITA CAMPO'
                ) || [];

                setSelectedCredit({
                    ...data.result,
                    managements: fieldTripManagements
                });
            }
        } catch (error) {
            console.error("Error fetching credit details:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleApprovalToggle = async (creditId, approveValue) => {
        setApprovalLoading(prev => ({ ...prev, [creditId]: true }));
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/field-trips/${creditId}/approval`,
                {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        approve: approveValue
                    })
                }
            );
            const data = await response.json();
            if (data.code === 1) {
                setCredits(credits.map(credit =>
                    credit.id === creditId
                        ? { ...credit, approve_field_trip: !!approveValue }
                        : credit
                ));
                if (selectedCredit && selectedCredit.id === creditId) {
                    setSelectedCredit({
                        ...selectedCredit,
                        approve_field_trip: !!approveValue
                    });
                }
                if (filterApproved !== "all") {
                    fetchCredits();
                }
                sendpush({
                    title: 'Visita de campo',
                    message: data.message || 'Visita de campo actualizada correctamente',
                    type: 'Push--sucessful',
                    timeout: 4000
                });
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'Error al actualizar el estado',
                    type: 'Push--danger',
                    timeout: 4000
                });
            }
        } catch (error) {
            console.error("Error toggling approval:", error);
            sendpush({
                title: 'Error',
                message: 'Error al actualizar el estado',
                type: 'Push--danger',
                timeout: 4000
            });
        } finally {
            setApprovalLoading(prev => ({ ...prev, [creditId]: false }));
        }
    };

    const handleCreditClick = (credit) => {
        fetchCreditDetails(credit.id);
    };

    const filteredCredits = credits;
    
    const handlePageChange = (url) => {
        if (!url) return;
        // Extraer solo la parte de paginación (page=...)
        const urlObj = new URL(url, window.location.origin);
        const page = urlObj.searchParams.get('page');
        // Reconstruir la URL base con los filtros actuales
        let baseUrl = `${import.meta.env.VITE_URL_BASE}/credits?`;
        if (filterApproved === "pending") {
            baseUrl += `&approve_field_trip=0&management_status=VISITA CAMPO`;
        } else if (filterApproved === "approved") {
            baseUrl += `&approve_field_trip=1&management_status=VISITA APROBADA`;
        }
        if (filterAgent !== "all") {
            baseUrl += `&user_id=${filterAgent}`;
        }
        if (filterBusiness !== "all") {
            baseUrl += `&business_id=${filterBusiness}`;
        }
        // Filtro de agencias (multi-select)
        if (filterAgencies.length > 0) {
            baseUrl += `&agency=${encodeURIComponent(filterAgencies.join(','))}`;
        }
        // Filtro de rango de días de mora
        if (filterRange !== "all") {
            const rangeOption = RANGE_OPTIONS.find(r => r.value === filterRange);
            if (rangeOption) {
                if (rangeOption.min !== null) {
                    baseUrl += `&days_past_due_min=${rangeOption.min}`;
                }
                if (rangeOption.max !== null) {
                    baseUrl += `&days_past_due_max=${rangeOption.max}`;
                }
            }
        }
        // Filtro de estado de crédito
        if (filterCollectionState !== "all") {
            baseUrl += `&collection_state=${encodeURIComponent(filterCollectionState)}`;
        }
        // Filtro de monto
        if (filterMinAmount) {
            baseUrl += `&total_amount_min=${filterMinAmount}`;
        }
        if (filterMaxAmount) {
            baseUrl += `&total_amount_max=${filterMaxAmount}`;
        }
        if (searchTerm.trim()) {
            const creditNumber = extractCreditNumber(searchTerm);
            baseUrl += `&sync_id=${encodeURIComponent(creditNumber)}`;
        }
        if (page) {
            baseUrl += `&page=${page}`;
        }
        fetchCredits(baseUrl);
    };

    return (
        <div className="field-trip-container">
            <div className="field-trip-header">
                <h1>Módulo Visita Campo</h1>
                <div className="header-stats">
                    {pagination && (
                        <span className="total-credits">
                            Total: {pagination.total} créditos
                        </span>
                    )}
                </div>
            </div>

            <div className="field-trip-content">
                {/* Panel izquierdo - Lista de créditos */}
                <div className="credits-panel">
                    <div className="credits-panel-header">
                        <h2>Créditos para Visita Campo</h2>
                        
                        <div className="search-filters">
                            {/* Barra de búsqueda */}
                            <input
                                type="text"
                                placeholder="Buscar por número de crédito (ej: FACES-009033203)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />

                            {/* Fila 1: Estado aprobación, Agentes, Empresas */}
                            <div className="filter-row">
                                <select
                                    value={filterApproved}
                                    onChange={(e) => setFilterApproved(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">Todos los estados</option>
                                    <option value="approved">Aprobados</option>
                                    <option value="pending">Pendientes</option>
                                </select>

                                <select
                                    value={filterAgent}
                                    onChange={(e) => setFilterAgent(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">Todos los agentes</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filterBusiness}
                                    onChange={e => setFilterBusiness(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">Todas las empresas</option>
                                    {businesses.map(business => (
                                        <option key={business.id} value={business.id}>
                                            {business.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fila 2: Agencias (multi-select), Rango, Estado crédito */}
                            <div className="filter-row">
                                <div className="filter-multiselect">
                                    <button
                                        type="button"
                                        className="filter-select multiselect-btn"
                                        onClick={() => setShowAgencyDropdown(!showAgencyDropdown)}
                                    >
                                        {filterAgencies.length === 0
                                            ? "Todas las agencias"
                                            : `${filterAgencies.length} agencia(s)`}
                                        <span className="dropdown-arrow">▼</span>
                                    </button>
                                    {showAgencyDropdown && (
                                        <div className="multiselect-dropdown">
                                            <label className="multiselect-option">
                                                <input
                                                    type="checkbox"
                                                    checked={filterAgencies.length === agencies.length && agencies.length > 0}
                                                    onChange={(e) => handleAgencyChange("-- Todas --", e.target.checked)}
                                                />
                                                -- Todas --
                                            </label>
                                            {agencies.map((agency, index) => (
                                                <label key={index} className="multiselect-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={filterAgencies.includes(agency.name)}
                                                        onChange={(e) => handleAgencyChange(agency.name, e.target.checked)}
                                                    />
                                                    {agency.name}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <select
                                    value={filterRange}
                                    onChange={(e) => setFilterRange(e.target.value)}
                                    className="filter-select"
                                >
                                    {RANGE_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filterCollectionState}
                                    onChange={(e) => setFilterCollectionState(e.target.value)}
                                    className="filter-select"
                                >
                                    {COLLECTION_STATE_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fila 3: Filtro de monto (min - max) */}
                            <div className="filter-row">
                                <div className="filter-amount-range">
                                    <input
                                        type="number"
                                        placeholder="Monto mínimo"
                                        value={filterMinAmount}
                                        onChange={(e) => setFilterMinAmount(e.target.value)}
                                        className="filter-input"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="amount-separator">-</span>
                                    <input
                                        type="number"
                                        placeholder="Monto máximo"
                                        value={filterMaxAmount}
                                        onChange={(e) => setFilterMaxAmount(e.target.value)}
                                        className="filter-input"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading && <div className="loading">Cargando...</div>}

                    <div className="credits-list">
                        {filteredCredits.map(credit => (
                            <div 
                                key={credit.id} 
                                className={`credit-card ${selectedCredit?.id === credit.id ? 'active' : ''}`}
                                onClick={() => handleCreditClick(credit)}
                            >
                                <div className="credit-card-header">
                                    <h3>{credit.business_name}-{credit.sync_id}</h3>
                                    <div className="approval-toggle">
                                        <button
                                            className={`approval-btn approval-btn-no${!credit.approve_field_trip ? ' active' : ''}`}
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleApprovalToggle(credit.id, 0);
                                            }}
                                        >NO</button>
                                        <button
                                            className={`approval-btn approval-btn-yes${credit.approve_field_trip ? ' active' : ''}`}
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleApprovalToggle(credit.id, 1);
                                            }}
                                        >SÍ</button>
                                        <span className={`status-label ${credit.approve_field_trip ? 'approved' : 'pending'}`}>
                                            {credit.approve_field_trip ? 'Aprobado' : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                                <div className="credit-card-body">
                                    <p><strong>Cliente:</strong> {credit.clients?.[0]?.name || 'N/A'}</p>
                                    <p><strong>Documento:</strong> {credit.clients?.[0]?.ci || 'N/A'}</p>
                                    <p><strong>Monto:</strong> ${parseFloat(credit.total_amount || 0).toFixed(2)}</p>
                                    <p><strong>Días mora:</strong> {credit.days_past_due || 0}</p>
                                </div>
                            </div>
                        ))}

                        {filteredCredits.length === 0 && !loading && (
                            <div className="no-data">No se encontraron créditos</div>
                        )}
                    </div>

                    {/* Paginación */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => handlePageChange(pagination.prev_page_url)}
                                disabled={!pagination.prev_page_url}
                                className="pagination-btn"
                            >
                                <i className="fa fa-chevron-left"></i> Anterior
                            </button>
                            <span className="page-info">
                                Página {pagination.current_page} de {pagination.last_page}
                            </span>
                            <button 
                                onClick={() => handlePageChange(pagination.next_page_url)}
                                disabled={!pagination.next_page_url}
                                className="pagination-btn"
                            >
                                Siguiente <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>

                {/* Panel derecho - Detalles del crédito */}
                <div className="credit-details-panel">
                    {selectedCredit ? (
                        <>
                            <div className="detail-section">
                                <h2>Información del Crédito</h2>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>ID Sincronización:</label>
                                        <span>{selectedCredit.sync_id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Agencia:</label>
                                        <span>{selectedCredit.agency || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Cartera:</label>
                                        <span>{selectedCredit.business_name || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Agente Asignado:</label>
                                        <span>{selectedCredit.agent_name || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Monto Total:</label>
                                        <span>${parseFloat(selectedCredit.total_amount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Capital:</label>
                                        <span>${parseFloat(selectedCredit.capital || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Cuota Mensual:</label>
                                        <span>${parseFloat(selectedCredit.monthly_fee_amount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Frecuencia:</label>
                                        <span>{selectedCredit.frequency} días</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Días de Mora:</label>
                                        <span className="badge-warning">{selectedCredit.days_past_due || 0}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Estado Cobranza:</label>
                                        <span className={`badge ${selectedCredit.collection_state === 'Vencido' ? 'pending' : 'approved'}`}>
                                            {selectedCredit.collection_state || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Estado Gestión:</label>
                                        <span className="badge">{selectedCredit.management_status || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Bandeja:</label>
                                        <span>{selectedCredit.management_tray || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Cuotas Pagadas:</label>
                                        <span>{selectedCredit.paid_fees || 0} / {selectedCredit.total_fees || 0}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Cuotas Pendientes:</label>
                                        <span>{selectedCredit.pending_fees || 0}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Fecha Vencimiento:</label>
                                        <span>{selectedCredit.due_date || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Fecha de Pago:</label>
                                        <span>{selectedCredit.payment_date || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Promesa de Pago:</label>
                                        <span>{selectedCredit.management_promise || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Aprobado Visita Campo:</label>
                                        <span className={`badge ${selectedCredit.approve_field_trip ? 'approved' : 'pending'}`}>
                                            {selectedCredit.approve_field_trip ? 'SÍ' : 'NO'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Información del Cliente */}
                            {selectedCredit.clients && selectedCredit.clients.length > 0 && (
                                <div className="detail-section">
                                    <h2>Información del Cliente{selectedCredit.clients.length > 1 ? 's' : ''}</h2>
                                    {selectedCredit.clients.map((client, idx) => (
                                        <div key={idx} className="client-info">
                                            {selectedCredit.clients.length > 1 && (
                                                <h3 className="client-title">
                                                    {client.type === 'TITULAR' ? 'Cliente Titular' : client.type || `Cliente ${idx + 1}`}
                                                </h3>
                                            )}
                                            <div className="detail-grid">
                                                <div className="detail-item">
                                                    <label>Nombre:</label>
                                                    <span>{client.name || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Documento:</label>
                                                    <span>{client.ci || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Tipo:</label>
                                                    <span className="badge">{client.type || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {/* Contactos del Cliente */}
                                            {client.collection_contacts && client.collection_contacts.length > 0 && (
                                                <div className="contacts-section">
                                                    <h4><i className="fa fa-phone"></i> Contactos</h4>
                                                    <div className="contacts-list">
                                                        {client.collection_contacts.map((contact, contactIdx) => (
                                                            <div key={contactIdx} className="contact-item">
                                                                <div className="contact-info">
                                                                    <span className="contact-phone">
                                                                        <i className={`fa ${contact.type === 'MOVIL' ? 'fa-mobile' : 'fa-phone'}`}></i>
                                                                        {contact.phone}
                                                                    </span>
                                                                    <span className={`contact-type ${contact.type?.toLowerCase()}`}>
                                                                        {contact.type}
                                                                    </span>
                                                                </div>
                                                                <div className="contact-stats">
                                                                    <span className="stat-effective">
                                                                        <i className="fa fa-check-circle"></i> 
                                                                        Efectivas: {contact.calls_effective || 0}
                                                                    </span>
                                                                    <span className="stat-not-effective">
                                                                        <i className="fa fa-times-circle"></i> 
                                                                        No efectivas: {contact.calls_not_effective || 0}
                                                                    </span>
                                                                    <span className="stat-effective">
                                                                        <i className="fa fa-phone-square"></i> 
                                                                        Contactado por whatsapp: {contact.call_by_whatsapp ? 'Sí' : 'No'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Direcciones del Cliente */}
                                            {client.directions && client.directions.length > 0 && (
                                                <div className="client-directions">
                                                    <h4><i className="fa fa-map-marker"></i> Direcciones del Cliente</h4>
                                                    <div className="addresses-list">
                                                        {client.directions.map((direction, dirIdx) => (
                                                            <div key={dirIdx} className="address-card small">
                                                                <div className="address-header">
                                                                    <i className="fa fa-map-marker"></i>
                                                                    <strong>{direction.type || 'Dirección'}</strong>
                                                                </div>
                                                                <div className="address-content">
                                                                    {direction.direction && (
                                                                        <p><strong>Dirección:</strong> {direction.direction}</p>
                                                                    )}
                                                                    
                                                                    {direction.neighborhood && (
                                                                        <p><strong>Barrio:</strong> {direction.neighborhood}</p>
                                                                    )}
                                                                    
                                                                    {direction.parish && (
                                                                        <p><strong>Parroquia:</strong> {direction.parish.trim()}</p>
                                                                    )}
                                                                    
                                                                    {direction.canton && (
                                                                        <p><strong>Cantón:</strong> {direction.canton.trim()}</p>
                                                                    )}
                                                                    
                                                                    {direction.province && (
                                                                        <p><strong>Provincia:</strong> {direction.province.trim()}</p>
                                                                    )}
                                                                    
                                                                    {(direction.latitude && direction.longitude) && (
                                                                        <p className="coordinates">
                                                                            <i className="fa fa-location-arrow"></i>
                                                                            <strong>Coordenadas:</strong> {parseFloat(direction.latitude).toFixed(6)}, {parseFloat(direction.longitude).toFixed(6)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Direcciones del Crédito (si existen adicionales) */}
                            {selectedCredit.directions && selectedCredit.directions.length > 0 && (
                                <div className="detail-section">
                                    <h2>Direcciones Adicionales del Crédito</h2>
                                    <div className="addresses-list">
                                        {selectedCredit.directions.map((direction, index) => (
                                            <div key={index} className="address-card">
                                                <div className="address-header">
                                                    <i className="fa fa-map-marker"></i>
                                                    <strong>{direction.type || 'Dirección'}</strong>
                                                    {direction.is_primary && (
                                                        <span className="badge-primary">Principal</span>
                                                    )}
                                                </div>
                                                <div className="address-content">
                                                    <p><strong>Dirección:</strong> {direction.address || 'N/A'}</p>
                                                    {direction.reference && (
                                                        <p className="reference">
                                                            <i className="fa fa-info-circle"></i> <strong>Referencia:</strong> {direction.reference}
                                                        </p>
                                                    )}
                                                    {direction.sector && (
                                                        <p><strong>Sector:</strong> {direction.sector}</p>
                                                    )}
                                                    {direction.parish && (
                                                        <p><strong>Parroquia:</strong> {direction.parish}</p>
                                                    )}
                                                    {direction.canton && (
                                                        <p><strong>Cantón:</strong> {direction.canton}</p>
                                                    )}
                                                    {direction.province && (
                                                        <p><strong>Provincia:</strong> {direction.province}</p>
                                                    )}
                                                    {(direction.latitude && direction.longitude) && (
                                                        <p className="coordinates">
                                                            <i className="fa fa-location-arrow"></i>
                                                            {direction.latitude}, {direction.longitude}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Historial de Gestiones de Visita Campo */}
                            <div className="detail-section">
                                <h2>Historial de Gestiones (Visita Campo)</h2>
                                {selectedCredit.managements && selectedCredit.managements.length > 0 ? (
                                    <div className="managements-list">
                                        {selectedCredit.managements.map((management, index) => (
                                            <div key={index} className="management-card">
                                                <div className="management-header">
                                                    <span className="management-date">
                                                        <i className="fa fa-calendar"></i> {management.created_at}
                                                    </span>
                                                    <span className="management-status-badge">
                                                        <span className={`state-badge ${management.state?.toLowerCase().replace(' ', '-')}`}>
                                                            {management.state || 'N/A'}
                                                        </span>
                                                        <span className={`substate-badge ${management.substate?.toLowerCase().replace(' ', '-')}`}>
                                                            {management.substate || 'N/A'}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="management-body">
                                                    <div className="management-info-grid">
                                                        <p><strong>Agente:</strong> {management.created_by_name || 'N/A'}</p>
                                                        <p><strong>Campaña:</strong> {management.campain_name || 'N/A'}</p>
                                                        <p><strong>Cliente:</strong> {management.client_name || 'N/A'}</p>
                                                        <p><strong>Tipo:</strong> {management.client_type || 'N/A'}</p>
                                                    </div>

                                                    <div className="management-amounts">
                                                        <div className="amount-item">
                                                            <label>Monto Gestionado:</label>
                                                            <span className="amount">${parseFloat(management.managed_amount || 0).toFixed(2)}</span>
                                                        </div>
                                                        <div className="amount-item">
                                                            <label>Cuotas Pagadas:</label>
                                                            <span>{management.paid_fees} / {management.paid_fees + management.pending_fees}</span>
                                                        </div>
                                                        <div className="amount-item">
                                                            <label>Días de Mora:</label>
                                                            <span className="badge-warning">{management.days_past_due || 0}</span>
                                                        </div>
                                                    </div>

                                                    {management.promise_date && (
                                                        <div className="promise-info">
                                                            <p>
                                                                <strong>Promesa de Pago:</strong> {' '}
                                                                <span className="commitment-date">
                                                                    {new Date(management.promise_date).toLocaleDateString('es-ES')}
                                                                </span>
                                                            </p>
                                                            {management.promise_amount > 0 && (
                                                                <p>
                                                                    <strong>Monto Prometido:</strong> {' '}
                                                                    <span className="commitment-amount">
                                                                        ${parseFloat(management.promise_amount).toFixed(2)}
                                                                    </span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {management.observation && (
                                                        <div className="observation-section">
                                                            <p><strong>Observaciones:</strong></p>
                                                            <p className="observations">{management.observation}</p>
                                                        </div>
                                                    )}

                                                    {management.nro_notification && management.nro_notification !== "0" && (
                                                        <p><strong>Nro. Notificación:</strong> {management.nro_notification}</p>
                                                    )}

                                                    <div className="management-footer">
                                                        <span className="management-time">
                                                            <i className="fa fa-clock-o"></i> Actualizado: {management.updated_at}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-data">
                                        <i className="fa fa-inbox"></i>
                                        <p>No hay gestiones de visita campo registradas para este crédito</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="no-selection">
                            <i className="fa fa-hand-pointer-o"></i>
                            <p>Seleccione un crédito para ver los detalles</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}