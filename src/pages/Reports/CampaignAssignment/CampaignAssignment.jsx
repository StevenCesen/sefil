import { useState, useEffect } from "react";
import "./CampaignAssignment.css";
import BackButton from "../../../components/BackButton/BackButton";
import sendpush from "../../../helpers/sendpush";
import getBusinesses from "../../../helpers/getBusinesses";
import exportCampaignAssignment from "../../../helpers/Reports/exportCampaignAssignment";
import ReportProgressBar from "../../../components/ReportProgressBar/ReportProgressBar";

export default function CampaignAssignment() {
    const [formData, setFormData] = useState({
        business_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [businesses, setBusinesses] = useState([]);
    const [loadingBusinesses, setLoadingBusinesses] = useState(true);

    useEffect(() => {
        const loadBusinesses = async () => {
            try {
                const data = await getBusinesses();
                setBusinesses(data.result.data);
            } catch (error) {
                console.error('Error fetching businesses:', error);
                sendpush({
                    title: 'Error',
                    message: 'Error al cargar las carteras',
                    type: 'Push--error',
                    timeout: 3000
                });
            } finally {
                setLoadingBusinesses(false);
            }
        };

        loadBusinesses();
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

        if (!formData.business_id) {
            sendpush({
                title: 'Error',
                message: 'Debe seleccionar una cartera',
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

            const businessName = businesses.find(b => b.id === parseInt(formData.business_id))?.name || 'EMPRESA';
            const today = new Date();
            const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                              'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
            const month = monthNames[today.getMonth()];

            link.download = `AsignacionCampaña-${month}-${businessName}.xlsx`;
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
                        <label htmlFor="business_id">Cartera *</label>
                        <select
                            id="business_id"
                            name="business_id"
                            value={formData.business_id}
                            onChange={handleChange}
                            disabled={loadingBusinesses || loading}
                            required
                        >
                            <option value="">-- Seleccionar cartera --</option>
                            {businesses.map(business => (
                                <option key={business.id} value={business.id}>
                                    {business.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ReportProgressBar progress={progress} />

                    <button
                        type="submit"
                        className="CampaignAssignment__button"
                        disabled={loading || loadingBusinesses}
                    >
                        {loading ? 'Generando...' : 'Descargar reporte'}
                    </button>
                </form>
            </div>
        </div>
    );
}
