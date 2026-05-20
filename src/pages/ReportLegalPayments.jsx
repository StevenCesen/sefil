import { useState, useEffect } from "react";
import "./ReportExport.css";
import downloadExport from "../helpers/Exports/downloadExport";
import sendpush from "../helpers/sendpush";

export default function ReportLegalPayments() {
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [business_id, setBusinessId] = useState("");
    const [business, setBusiness] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL_BASE}/businesses`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(r => r.json())
            .then(data => setBusiness(data.result?.data || []))
            .catch(() => setBusiness([]));
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
                endpoint: 'exports/legal-payments',
                params: { start_date, end_date, business_id },
                filename: `PagosLegal-${start_date}_${end_date}.xlsx`
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
                    <h2 className="ReportExport__title">Pagos proceso legal</h2>
                    <p className="ReportExport__subtitle">Exportar pagos de créditos en proceso legal por rango de fechas</p>
                </div>

                <div className="ReportExport__grid">

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
