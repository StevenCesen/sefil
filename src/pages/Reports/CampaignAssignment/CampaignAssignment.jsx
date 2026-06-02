import { useState, useEffect } from "react";
import "./CampaignAssignment.css";
import BackButton from "../../../components/BackButton/BackButton";
import sendpush from "../../../helpers/sendpush";
import exportCampaignAssignment from "../../../helpers/Reports/exportCampaignAssignment";
import ReportProgressBar from "../../../components/ReportProgressBar/ReportProgressBar";
import getBusinesses from "../../../helpers/getBusinesses";

export default function CampaignAssignment() {
    const [mode, setMode] = useState('campain'); // 'campain' | 'businesses'
    const [campainId, setCampainId] = useState('');
    const [selectedBusinessIds, setSelectedBusinessIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [campaigns, setCampaigns] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [loadingCampaigns, setLoadingCampaigns] = useState(true);
    const [loadingBusinesses, setLoadingBusinesses] = useState(true);

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL_BASE}/campains?state=ACTIVE`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setCampaigns(data.result?.data || data.result || []);
            } catch {
                sendpush({ title: 'Error', message: 'Error al cargar las campañas', type: 'Push--error', timeout: 3000 });
            } finally {
                setLoadingCampaigns(false);
            }
        };

        const loadBusinesses = async () => {
            try {
                const data = await getBusinesses();
                const list = data?.result?.data || data?.result || data?.data || data || [];
                setBusinesses(Array.isArray(list) ? list : []);
            } catch {
                sendpush({ title: 'Error', message: 'Error al cargar las carteras', type: 'Push--error', timeout: 3000 });
            } finally {
                setLoadingBusinesses(false);
            }
        };

        loadCampaigns();
        loadBusinesses();
    }, []);

    const toggleBusiness = (id) => {
        setSelectedBusinessIds(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    const handleExport = async (e) => {
        e.preventDefault();

        if (mode === 'campain' && !campainId) {
            sendpush({ title: 'Error', message: 'Debe seleccionar una campaña', type: 'Push--error', timeout: 3000 });
            return;
        }
        if (mode === 'businesses' && selectedBusinessIds.length === 0) {
            sendpush({ title: 'Error', message: 'Debe seleccionar al menos una cartera', type: 'Push--error', timeout: 3000 });
            return;
        }

        setLoading(true);
        setProgress(0);

        try {
            setProgress(30);

            const payload = mode === 'campain'
                ? { campain_id: campainId }
                : { business_ids: selectedBusinessIds };

            const blob = await exportCampaignAssignment(payload);
            setProgress(60);

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            let filename = 'AsignacionCampaña.xlsx';
            if (mode === 'campain') {
                const campaignName = campaigns.find(c => c.id === parseInt(campainId))?.name || 'CAMPAÑA';
                filename = `AsignacionCampaña-${campaignName}.xlsx`;
            } else {
                filename = `AsignacionCampaña-Carteras.xlsx`;
            }

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setProgress(100);
            sendpush({ title: 'Éxito', message: 'Reporte descargado correctamente', type: 'Push--sucessful', timeout: 3000 });
            setTimeout(() => setProgress(0), 1000);

        } catch (error) {
            sendpush({ title: 'Error', message: error.message || 'Error al generar el reporte', type: 'Push--error', timeout: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const isLoadingData = loadingCampaigns || loadingBusinesses;

    return (
        <div className="CampaignAssignment">
            <BackButton />

            <div className="CampaignAssignment__container">
                <h1 className="CampaignAssignment__title">Asignación de campaña</h1>

                {/* Toggle de modo */}
                <div className="CampaignAssignment__mode-toggle">
                    <button
                        type="button"
                        className={`CampaignAssignment__mode-btn ${mode === 'campain' ? 'active' : ''}`}
                        onClick={() => setMode('campain')}
                    >
                        Por campaña
                    </button>
                    <button
                        type="button"
                        className={`CampaignAssignment__mode-btn ${mode === 'businesses' ? 'active' : ''}`}
                        onClick={() => setMode('businesses')}
                    >
                        Por carteras
                    </button>
                </div>

                <form onSubmit={handleExport} className="CampaignAssignment__form">

                    {mode === 'campain' && (
                        <div className="CampaignAssignment__field">
                            <label htmlFor="campain_id">Campaña *</label>
                            <select
                                id="campain_id"
                                value={campainId}
                                onChange={e => setCampainId(e.target.value)}
                                disabled={isLoadingData || loading}
                            >
                                <option value="">-- Seleccionar campaña --</option>
                                {campaigns.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {mode === 'businesses' && (
                        <div className="CampaignAssignment__field">
                            <label>Carteras *</label>
                            {loadingBusinesses ? (
                                <p className="CampaignAssignment__loading">Cargando carteras...</p>
                            ) : (
                                <div className="CampaignAssignment__businesses">
                                    {businesses.map(b => (
                                        <label key={b.id} className="CampaignAssignment__business-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedBusinessIds.includes(b.id)}
                                                onChange={() => toggleBusiness(b.id)}
                                                disabled={loading}
                                            />
                                            {b.name}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <ReportProgressBar progress={progress} />

                    <button
                        type="submit"
                        className="CampaignAssignment__button"
                        disabled={loading || isLoadingData}
                    >
                        {loading ? 'Generando...' : 'Descargar reporte'}
                    </button>
                </form>
            </div>
        </div>
    );
}
