import { useState, useEffect } from "react";
import "./pages.css";
import downloadExport from "../helpers/Exports/downloadExport";
import sendpush from "../helpers/sendpush";

export default function ReportJudicial(){
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [business_id, setBusinessId] = useState("");
    const [user_id, setUserId] = useState("");

    const [business, setBusiness] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL_BASE}/businesses`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(r => r.json())
            .then(data => setBusiness(data.result?.data || []))
            .catch(() => setBusiness([]));

        fetch(`${import.meta.env.VITE_URL_BASE}/users`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(r => r.json())
            .then(data => setAgents(data.result?.data || []))
            .catch(() => setAgents([]));
    }, []);

    const handleDownload = async () => {
        if (!start_date || !end_date) {
            sendpush({
                title: 'Fechas requeridas',
                message: 'Ingrese fecha de inicio y fecha de corte.',
                type: 'Push--danger',
                timeout: 3000
            });
            return;
        }

        setLoading(true);
        try {
            await downloadExport({
                endpoint: 'exports/legal-expenses',
                params: { start_date, end_date, business_id, user_id },
                filename: 'gastos_judiciales.xlsx'
            });
        } catch {
            sendpush({
                title: 'Error al generar reporte',
                message: 'No se pudo descargar el archivo.',
                type: 'Push--danger',
                timeout: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Reports">
            <div className="Reports__content">
                <h4 className="Reports__title">Gastos judiciales cargados</h4>
                <div className="Reports__filters Reports__filters--columns-5">

                    <label className="Reports__filter">
                        Fecha de inicio
                        <input type="date" value={start_date} onChange={e => setStartDate(e.target.value)} />
                    </label>

                    <label className="Reports__filter">
                        Fecha de corte
                        <input type="date" value={end_date} onChange={e => setEndDate(e.target.value)} />
                    </label>

                    <label className="Reports__filter">
                        Empresa
                        <select value={business_id} onChange={e => setBusinessId(e.target.value)}>
                            <option value="">--Todos--</option>
                            {business.map((bus, i) => (
                                <option key={i} value={bus.id}>{bus.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </label>

                    <label className="Reports__filter">
                        Agente
                        <select value={user_id} onChange={e => setUserId(e.target.value)}>
                            <option value="">--Todos--</option>
                            {agents.map((agent, i) => (
                                <option key={i} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </label>

                    <button className="Reports__button" onClick={handleDownload} disabled={loading}>
                        {loading ? 'Generando...' : 'Generar EXCEL'}
                    </button>

                </div>
            </div>
        </div>
    );
}
