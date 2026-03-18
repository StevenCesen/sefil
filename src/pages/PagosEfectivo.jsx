import { useState, useEffect } from "react";
import "./ReportExport.css";
import downloadExport from "../helpers/Exports/downloadExport";
import sendpush from "../helpers/sendpush";

export default function PagosEfectivo(){
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [business_id, setBusinessId] = useState("");
    const [campain_id, setCampainId] = useState("");
    const [business, setBusiness] = useState([]);
    const [campains, setCampains] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL_BASE}/businesses`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(r => r.json())
            .then(data => setBusiness(data.result?.data || []))
            .catch(() => setBusiness([]));

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(r => r.json())
            .then(data => setCampains(data.result?.data || data.data || []))
            .catch(() => setCampains([]));
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
                endpoint: 'exports/cash-closing',
                params: { start_date, end_date, business_id, campain_id },
                filename: 'pagos_efectivo.xlsx'
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
        <div className="ReportExport">
            <div className="ReportExport__container">
                <div className="ReportExport__header">
                    <h2 className="ReportExport__title">Pagos en efectivo</h2>
                    <p className="ReportExport__subtitle">Exportar cierre de caja por rango de fechas</p>
                </div>

                <div className="ReportExport__grid ReportExport__grid--3">

                    <div className="ReportExport__field">
                        <span className="ReportExport__label">Fecha de inicio *</span>
                        <input type="date" value={start_date} onChange={e => setStartDate(e.target.value)} />
                    </div>

                    <div className="ReportExport__field">
                        <span className="ReportExport__label">Fecha de corte *</span>
                        <input type="date" value={end_date} onChange={e => setEndDate(e.target.value)} />
                    </div>

                    <div className="ReportExport__field">
                        <span className="ReportExport__label">Empresa</span>
                        <select value={business_id} onChange={e => setBusinessId(e.target.value)}>
                            <option value="">-- Todas --</option>
                            {business.map((bus, i) => (
                                <option key={i} value={bus.id}>{bus.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ReportExport__field">
                        <span className="ReportExport__label">Campaña</span>
                        <select value={campain_id} onChange={e => setCampainId(e.target.value)}>
                            <option value="">-- Todas --</option>
                            {campains.map((camp, i) => (
                                <option key={i} value={camp.id}>{camp.name}</option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="ReportExport__actions">
                    <button className="ReportExport__button" onClick={handleDownload} disabled={loading}>
                        {loading ? 'Generando...' : 'Generar EXCEL'}
                    </button>
                </div>
            </div>
        </div>
    );
}
