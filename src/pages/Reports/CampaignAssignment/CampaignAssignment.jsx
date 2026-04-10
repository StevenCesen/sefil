import { useState, useEffect } from "react";
import "./CampaignAssignment.css";
import BackButton from "../../../components/BackButton/BackButton";
import sendpush from "../../../helpers/sendpush";
import exportCampaignAssignment from "../../../helpers/Reports/exportCampaignAssignment";
import ReportProgressBar from "../../../components/ReportProgressBar/ReportProgressBar";

export default function CampaignAssignment() {
    const [formData, setFormData] = useState({
        campain_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [campaigns, setCampaigns] = useState([]);
    const [loadingCampaigns, setLoadingCampaigns] = useState(true);

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
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                sendpush({
                    title: 'Error',
                    message: 'Error al cargar las campañas',
                    type: 'Push--error',
                    timeout: 3000
                });
            } finally {
                setLoadingCampaigns(false);
            }
        };

        loadCampaigns();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExport = async (e) => {
        e.preventDefault();

        if (!formData.campain_id) {
            sendpush({
                title: 'Error',
                message: 'Debe seleccionar una campaña',
                type: 'Push--error',
                timeout: 3000
            });
            return;
        }

        setLoading(true);
        setProgress(0);

        try {
            setProgress(30);

            const blob = await exportCampaignAssignment(formData);

            setProgress(60);

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const campaignName = campaigns.find(c => c.id === parseInt(formData.campain_id))?.name || 'CAMPAÑA';
            link.download = `AsignacionCampaña-${campaignName}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setProgress(100);

            sendpush({
                title: 'Éxito',
                message: 'Reporte descargado correctamente',
                type: 'Push--sucessful',
                timeout: 3000
            });

            setTimeout(() => {
                setProgress(0);
            }, 1000);

        } catch (error) {
            console.error('Error exporting campaign assignment:', error);
            sendpush({
                title: 'Error',
                message: error.message || 'Error al generar el reporte',
                type: 'Push--error',
                timeout: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="CampaignAssignment">
            <BackButton />

            <div className="CampaignAssignment__container">
                <h1 className="CampaignAssignment__title">Asignación de campaña</h1>

                <form onSubmit={handleExport} className="CampaignAssignment__form">
                    <div className="CampaignAssignment__field">
                        <label htmlFor="campain_id">Campaña *</label>
                        <select
                            id="campain_id"
                            name="campain_id"
                            value={formData.campain_id}
                            onChange={handleChange}
                            disabled={loadingCampaigns || loading}
                            required
                        >
                            <option value="">-- Seleccionar campaña --</option>
                            {campaigns.map(campaign => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ReportProgressBar progress={progress} />

                    <button
                        type="submit"
                        className="CampaignAssignment__button"
                        disabled={loading || loadingCampaigns}
                    >
                        {loading ? 'Generando...' : 'Descargar reporte'}
                    </button>
                </form>
            </div>
        </div>
    );
}
