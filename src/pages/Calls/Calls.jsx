import { useState, useEffect } from "react";
import "./Calls.css";

const BASE = import.meta.env.VITE_URL_BASE;
const FILES_BASE = BASE.replace(/\/api$/, '/files');

const authHeaders = () => ({
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

function buildUrl(filters) {
    const params = new URLSearchParams({ page: 1 });
    if (filters.state)        params.append('state', filters.state);
    if (filters.phone_number) params.append('phone_number', filters.phone_number);
    if (filters.sync_id)      params.append('sync_id', filters.sync_id);
    if (filters.start_date)   params.append('start_date', filters.start_date);
    if (filters.end_date)     params.append('end_date', filters.end_date);
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
        state: '', phone_number: '', sync_id: '', start_date: '', end_date: ''
    });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = (url) => {
        setLoading(true);
        fetch(url, { headers: authHeaders() })
            .then(r => {
                if (r.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
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
                        Fecha inicio
                        <input type="date" value={filters.start_date}
                            onChange={e => handleFilterChange('start_date', e.target.value)} />
                    </label>
                    <label>
                        Fecha fin
                        <input type="date" value={filters.end_date}
                            onChange={e => handleFilterChange('end_date', e.target.value)} />
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
                    <div key={call.id} className="Calls__row">
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
                            <button disabled={!data.prev_page_url}
                                onClick={() => fetchData(data.prev_page_url)}>Anterior</button>
                            <span className="Calls__page">Página {currentPage} / {data.last_page}</span>
                            <button disabled={!data.next_page_url}
                                onClick={() => fetchData(data.next_page_url)}>Siguiente</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
