import { useEffect, useState } from "react";
import "./fieldTrip.css";

export default function FieldTrip() {
    const [credits, setCredits] = useState([]);
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterApproved, setFilterApproved] = useState("pending"); // all, approved, pending
    const [filterAgent, setFilterAgent] = useState("all"); // all, agent_id
    const [agents, setAgents] = useState([]);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        fetchCredits();
    }, [filterApproved, filterAgent]);

    // Agregar debounce para la búsqueda
    useEffect(() => {
        console.log('useEffect búsqueda disparado, searchTerm:', searchTerm);
        
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
                let baseUrl = `${import.meta.env.VITE_URL_BASE}/credits?management_status=VISITA CAMPO`;
                
                if (filterApproved === "pending") {
                    baseUrl += `&approve_field_trip=0`;
                } else if (filterApproved === "approved") {
                    baseUrl += `&approve_field_trip=1`;
                }

                if (filterAgent !== "all") {
                    baseUrl += `&user_id=${filterAgent}`;
                }

                // Agregar búsqueda
                if (searchTerm.trim()) {
                    baseUrl += `&search=${encodeURIComponent(searchTerm.trim())}`;
                }

                endpoint = baseUrl;
            }

            console.log('=== FETCH CREDITS DEBUG ===');
            console.log('URL completa:', endpoint);
            console.log('filterApproved:', filterApproved);
            console.log('filterAgent:', filterAgent);
            console.log('searchTerm:', searchTerm);
            console.log('========================');

            const response = await fetch(endpoint, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            console.log('Respuesta del servidor:', data);
            console.log('Total de créditos recibidos:', data.result?.data?.length);
            
            if (data.code === 1) {
                setCredits(data.result?.data || []);
                setPagination({
                    current_page: data.result?.current_page,
                    last_page: data.result?.last_page,
                    next_page_url: data.result?.next_page_url,
                    prev_page_url: data.result?.prev_page_url,
                    total: data.result?.total
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

    const handleApprovalToggle = async (creditId, currentStatus) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/credits/${creditId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        approve_field_trip: !currentStatus
                    })
                }
            );
            const data = await response.json();
            
            if (data.code === 1) {
                // Actualizar la lista de créditos
                setCredits(credits.map(credit => 
                    credit.id === creditId 
                        ? { ...credit, approve_field_trip: !currentStatus }
                        : credit
                ));

                // Si hay un crédito seleccionado, actualizarlo también
                if (selectedCredit && selectedCredit.id === creditId) {
                    setSelectedCredit({
                        ...selectedCredit,
                        approve_field_trip: !currentStatus
                    });
                }

                // Refrescar la lista si cambiamos de estado
                if (filterApproved !== "all") {
                    fetchCredits();
                }

                alert(data.message || 'Estado actualizado correctamente');
            } else {
                alert('Error al actualizar el estado');
            }
        } catch (error) {
            console.error("Error toggling approval:", error);
            alert('Error al actualizar el estado');
        }
    };

    const handleCreditClick = (credit) => {
        fetchCreditDetails(credit.id);
    };

    // Eliminar el filtro en el frontend
    const filteredCredits = credits;

    const handlePageChange = (url) => {
        if (url) {
            fetchCredits(url);
        }
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
                            <input
                                type="text"
                                placeholder="Buscar por ID, cliente o documento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />

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
                                onChange={(e) => {
                                    console.log('Agente seleccionado:', e.target.value);
                                    setFilterAgent(e.target.value);
                                }}
                                className="filter-select"
                            >
                                <option value="all">Todos los agentes</option>
                                {agents.map(agent => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name}
                                    </option>
                                ))}
                            </select>
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
                                    <h3>{credit.sync_id}</h3>
                                    <div className="approval-toggle">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={credit.approve_field_trip || false}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleApprovalToggle(credit.id, credit.approve_field_trip);
                                                }}
                                            />
                                            <span className="slider"></span>
                                        </label>
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