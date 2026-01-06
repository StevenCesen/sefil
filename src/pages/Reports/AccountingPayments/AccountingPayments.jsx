import { useState, useEffect } from "react";
import "./AccountingPayments.css";
import BackButton from "../../../components/BackButton/BackButton";
import sendpush from "../../../helpers/sendpush";
import getBusinesses from "../../../helpers/getBusinesses";
import exportAccountingPayments from "../../../helpers/Reports/exportAccountingPayments";
import ReportProgressBar from "../../../components/ReportProgressBar/ReportProgressBar";

export default function AccountingPayments() {
    const [formData, setFormData] = useState({
        business_id: '',
        group: 'true',
        filterType: 'range',
        start_date: '',
        end_date: '',
        month_name: ''
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

        if (formData.filterType === 'range') {
            if (!formData.start_date || !formData.end_date) {
                sendpush({
                    title: 'Error',
                    message: 'Debe seleccionar el rango de fechas',
                    type: 'Push--error',
                    timeout: 3000
                });
                return;
            }
        } else {
            if (!formData.month_name) {
                sendpush({
                    title: 'Error',
                    message: 'Debe seleccionar un mes',
                    type: 'Push--error',
                    timeout: 3000
                });
                return;
            }
        }

        setLoading(true);
        setProgress(0);

        try {
            setProgress(30);

            const blob = await exportAccountingPayments(formData);

            setProgress(60);

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const businessName = businesses.find(b => b.id === parseInt(formData.business_id))?.name || 'EMPRESA';
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                              'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
            const month = monthNames[today.getMonth()];

            link.download = `Contabilidad-dia_${day}-${month}-${businessName}.xlsx`;
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
            console.error('Error exporting accounting:', error);
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

    const months = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];

    return (
        <div className="AccountingPayments">
            <BackButton />

            <div className="AccountingPayments__container">
                <h1 className="AccountingPayments__title">Pagos contabilidad</h1>

                <form onSubmit={handleExport} className="AccountingPayments__form">
                    <div className="AccountingPayments__field">
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

                    <div className="AccountingPayments__field">
                        <label htmlFor="group">Agrupar datos</label>
                        <select
                            id="group"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="AccountingPayments__field">
                        <label>Tipo de filtro</label>
                        <div className="AccountingPayments__radioGroup">
                            <label className="AccountingPayments__radioOption">
                                <input
                                    type="radio"
                                    name="filterType"
                                    value="range"
                                    checked={formData.filterType === 'range'}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <span>Rango de fechas</span>
                            </label>
                            <label className="AccountingPayments__radioOption">
                                <input
                                    type="radio"
                                    name="filterType"
                                    value="month"
                                    checked={formData.filterType === 'month'}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <span>Por mes</span>
                            </label>
                        </div>
                    </div>

                    {formData.filterType === 'range' ? (
                        <div className="AccountingPayments__dateRange">
                            <div className="AccountingPayments__field">
                                <label htmlFor="start_date">Fecha inicio *</label>
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="AccountingPayments__field">
                                <label htmlFor="end_date">Fecha fin *</label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="AccountingPayments__field">
                            <label htmlFor="month_name">Mes *</label>
                            <select
                                id="month_name"
                                name="month_name"
                                value={formData.month_name}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            >
                                <option value="">-- Seleccionar mes --</option>
                                {months.map(month => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <ReportProgressBar progress={progress} />

                    <button
                        type="submit"
                        className="AccountingPayments__button"
                        disabled={loading || loadingBusinesses}
                    >
                        {loading ? 'Generando...' : 'Descargar reporte'}
                    </button>
                </form>
            </div>
        </div>
    );
}
