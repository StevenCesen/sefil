import { useEffect, useRef, useState } from "react";
import CardUpdatePay from "../../components/CardUpdatePay/CardUpdatePay";
import BackButton from "../../components/BackButton/BackButton";
import sendpush from "../../helpers/sendpush";
import "../pages.css";
import "./ImportPayments.css";

export default function ImportPayments() {
    const [carteras, setCarteras] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [errorSumByBusiness, setErrorSumByBusiness] = useState({});

    const fileRef = useRef();
    const fileNameRef = useRef();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL_BASE}/businesses`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.result || !data.result.data) {
                    setCarteras([]);
                    return;
                }
                setCarteras(data.result.data);
            })
            .catch(() => { setCarteras([]); });
    }, []);

    const handleUpload = () => {
        const file = fileRef.current?.files[0];

        if (!file) {
            sendpush({
                title: 'ERR: formato de archivo inválido.',
                message: 'Por favor, elige un archivo en formato EXCEL e intenta de nuevo.',
                type: 'Push--danger',
                timeout: 3000
            });
            return;
        }

        setUploading(true);
        setImportResult(null);

        const formData = new FormData();
        formData.append('file', file);

        fetch(`${import.meta.env.VITE_URL_BASE}/ImportPayments`, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setUploading(false);

                if (data.imported >= 0 || data.success) {
                    setImportResult(data);

                    const grouped = {};
                    (data.error_sum_payments || []).forEach((p) => {
                        if (!grouped[p.business_id]) grouped[p.business_id] = [];
                        grouped[p.business_id].push(p);
                    });
                    setErrorSumByBusiness(grouped);

                    if (data.skipped > 0) {
                        sendpush({
                            title: 'Importación completada.',
                            message: `${data.imported} importados, ${data.skipped} omitidos.${data.error_sum_count > 0 ? ` ${data.error_sum_count} con error de suma.` : ''}`,
                            type: 'Push--warning',
                            timeout: 5000
                        });
                    } else if (data.error_sum_count > 0) {
                        sendpush({
                            title: 'Importación completada.',
                            message: `${data.imported} importados. ${data.error_sum_count} marcados con error de suma.`,
                            type: 'Push--warning',
                            timeout: 5000
                        });
                    } else {
                        sendpush({
                            title: 'Éxito.',
                            message: `${data.imported} pagos importados correctamente.`,
                            type: 'Push--sucessful',
                            timeout: 3000
                        });
                    }
                } else if (data.failures) {
                    sendpush({
                        title: 'ERR: Errores en validación',
                        message: 'El archivo contiene errores de validación.',
                        type: 'Push--danger',
                        timeout: 3000
                    });
                } else {
                    sendpush({
                        title: 'ERR: Error en importación',
                        message: data.message || 'Error al importar pagos.',
                        type: 'Push--danger',
                        timeout: 3000
                    });
                }
            })
            .catch(() => {
                setUploading(false);
                sendpush({
                    title: 'ERR: Error de red',
                    message: 'No se pudo conectar con el servidor.',
                    type: 'Push--danger',
                    timeout: 3000
                });
            });
    };

    if (!carteras) return <></>;

    return (
        <div className="pageConsulta">
            <BackButton />

            <div className="DetailCredit__sections">
                <div>
                    <p>Subir pagos</p>
                    <label>Formato de archivo .xlsx (EXCEL)</label>
                </div>
            </div>

            {/* ── Sección única de carga ── */}
            <div className="ImportPayments__upload">
                <label className="ImportPayments__file-label" htmlFor="global-pays-file">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                    <span ref={fileNameRef}>Elegir archivo .xlsx</span>
                    <input
                        ref={fileRef}
                        type="file"
                        id="global-pays-file"
                        accept=".xlsx"
                        onChange={() => {
                            const name = fileRef.current?.files[0]?.name;
                            if (fileNameRef.current) fileNameRef.current.textContent = name || 'Elegir archivo .xlsx';
                        }}
                    />
                </label>

                <button
                    className="ImportPayments__upload-btn"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Importando...' : 'Subir'}
                </button>
            </div>

            {/* ── Resumen del resultado ── */}
            {importResult && (
                <div className="ImportPayments__result">
                    <div className="ImportPayments__result-stats">
                        <span className="ImportPayments__stat ImportPayments__stat--ok">
                            ✓ {importResult.imported} importados
                        </span>
                        <span className="ImportPayments__stat">
                            Total: {importResult.total}
                        </span>
                        {importResult.skipped > 0 && (
                            <span className="ImportPayments__stat ImportPayments__stat--warn">
                                ⚠ {importResult.skipped} omitidos
                            </span>
                        )}
                        {importResult.error_sum_count > 0 && (
                            <span className="ImportPayments__stat ImportPayments__stat--warn">
                                ⚠ {importResult.error_sum_count} con error de suma
                            </span>
                        )}
                    </div>

                    {importResult.skipped_details?.length > 0 && (
                        <div className="ImportPayments__skipped">
                            <p>Pagos omitidos:</p>
                            <div className="ImportPayments__skipped-head">
                                <span>Crédito</span>
                                <span>Razón</span>
                            </div>
                            {importResult.skipped_details.map((s, i) => (
                                <div key={i} className="ImportPayments__skipped-row">
                                    <span>{s.credito}</span>
                                    <span>{s.razon}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Sección por cartera (ERROR_SUM) ── */}
            <div className="CardListUpdate__container">
                <div className="CardListUpdate__head">
                    <label>Cartera</label>
                    <label>Estado</label>
                    <label>Última carga</label>
                    <label>Por procesar</label>
                    <label>Créditos sin pagos</label>
                </div>

                {carteras.map((cartera, index) => (
                    <CardUpdatePay
                        key={index}
                        fecha_carga={cartera.fecha_carga}
                        name={cartera.name}
                        state={cartera.status}
                        business_id={cartera.id}
                        importedPayments={errorSumByBusiness[cartera.id] ?? null}
                    />
                ))}
            </div>
        </div>
    );
}
