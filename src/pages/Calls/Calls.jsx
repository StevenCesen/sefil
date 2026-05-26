import { useState, useEffect } from "react";
import "./Calls.css";

const BASE = import.meta.env.VITE_URL_BASE;
const FILES_BASE = BASE.replace(/\/api$/, '/files');

const authHeaders = () => ({
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

function buildUrl(filters, page = 1) {
    const params = new URLSearchParams({ page });
    if (filters.state)        params.append('state', filters.state);
    if (filters.phone_number) params.append('phone_number', filters.phone_number);
    if (filters.sync_id)      params.append('sync_id', filters.sync_id);
    if (filters.date_from)    params.append('date_from', filters.date_from);
    if (filters.date_to)      params.append('date_to', filters.date_to);
    if (filters.date)         params.append('date', filters.date);
    if (filters.created_by)   params.append('created_by', filters.created_by);
    return `${BASE}/calls?${params}`;
}

const allowedRoles = ['admin', 'superadmin', 'supervisor'];

function AudioCell({ mediaPath }) {
    const [open, setOpen] = useState(false);
    if (!mediaPath) return <span className="Calls__noAudio">—</span>;
    return open
        ? <audio controls autoPlay style={{ width: '100%', height: '28px' }}>
            <source src={`${FILES_BASE}/${mediaPath}`} type="audio/webm" />
          </audio>
        : <button className="Calls__playBtn" onClick={() => setOpen(true)}>▶</button>;
}

export default function Calls() {
    const role = localStorage.getItem('role');
    if (!allowedRoles.includes(role)) return null;

    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        state: '', phone_number: '', sync_id: '', date_from: '', date_to: '', date: '', created_by: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        fetch(`${BASE}/users?agents=true&is_active=1`, { headers: authHeaders() })
            .then(r => r.json())
            .then(data => {
                const list = Array.isArray(data) ? data
                    : Array.isArray(data.result) ? data.result
                    : Array.isArray(data.result?.data) ? data.result.data
                    : Array.isArray(data.data) ? data.data
                    : [];
                setAgents(list);
            })
            .catch(() => {});
    }, []);

    const fetchData = (url) => {
        setLoading(true);
        fetch(url, { headers: authHeaders() })
            .then(r => {
                if (r.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                    return;
                }
                return r.json();
            })
            .then(res => {
                if (!res) return;
                setData(res.result);
                setCurrentPage(res.result.current_page);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(buildUrl(filters)); }, []);

    const handleFilterChange = (key, value) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        fetchData(buildUrl(next));
    };

    const formatDuration = (secs) => {
        if (!secs) return '0s';
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const formatDate = (iso) => iso ? iso.replace('T', ' ').substring(0, 16) : '';

    return (
        <div className="Calls">
            <div style={{ paddingBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-1)', marginBottom: '16px' }}>Historial de llamadas</h3>

                <div className="Calls__filters">
                    <label>
                        Fecha exacta
                        <input type="date" value={filters.date}
                            onChange={e => handleFilterChange('date', e.target.value)} />
                    </label>
                    <label>
                        Fecha desde
                        <input type="date" value={filters.date_from}
                            onChange={e => handleFilterChange('date_from', e.target.value)} />
                    </label>
                    <label>
                        Fecha hasta
                        <input type="date" value={filters.date_to}
                            onChange={e => handleFilterChange('date_to', e.target.value)} />
                    </label>
                    <label>
                        Estado
                        <select value={filters.state} onChange={e => handleFilterChange('state', e.target.value)}>
                            <option value="">-- Todos --</option>
                            <option value="CONTACTADO">CONTACTADO</option>
                            <option value="NO CONTACTADO">NO CONTACTADO</option>
                        </select>
                    </label>
                    <label>
                        Teléfono
                        <input type="text" value={filters.phone_number} placeholder="Ej: 0981021170"
                            onChange={e => handleFilterChange('phone_number', e.target.value)} />
                    </label>
                    <label>
                        Crédito
                        <input type="text" value={filters.sync_id} placeholder="Ej: 001033581"
                            onChange={e => handleFilterChange('sync_id', e.target.value)} />
                    </label>
                    <label>
                        Agente
                        <select value={filters.created_by}
                            onChange={e => handleFilterChange('created_by', e.target.value)}>
                            <option value="">-- Todos --</option>
                            {agents.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="Calls__row Calls__row--header">
                    <span>Fecha</span>
                    <span>Teléfono</span>
                    <span>Estado</span>
                    <span>Duración</span>
                    <span>Crédito</span>
                    <span>Agencia</span>
                    <span>Agente</span>
                    <span>Audio</span>
                </div>

                {loading && <p className="Calls__loading">Cargando...</p>}

                {data && !loading && data.data.map(call => (
                    <div key={call.id} className={`Calls__row ${call.channel === 'WA' ? 'Calls__row--wa' : ''}`}>
                        <span>{formatDate(call.created_at)}</span>
                        <span>{call.phone_number}</span>
                        <span>
                            <span className={`Calls__badge Calls__badge--${call.state === 'CONTACTADO' ? 'ok' : 'no'}`}>
                                {call.state}
                            </span>
                        </span>
                        <span>{formatDuration(call.duration)}</span>
                        <span>{call.credit?.sync_id || '-'}</span>
                        <span>{call.credit?.agency || '-'}</span>
                        <span>{call.creator?.name || '-'}</span>
                        <span>
                            <AudioCell mediaPath={call.media_path} />
                        </span>
                    </div>
                ))}

                {data && (
                    <div className="Calls__pagination">
                        <p>Registros {data.from}–{data.to} de {data.total}</p>
                        <div>
                            <button disabled={currentPage <= 1}
                                onClick={() => fetchData(buildUrl(filters, currentPage - 1))}>Anterior</button>
                            <span className="Calls__page">Página {currentPage} / {data.last_page}</span>
                            <button disabled={currentPage >= data.last_page}
                                onClick={() => fetchData(buildUrl(filters, currentPage + 1))}>Siguiente</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
