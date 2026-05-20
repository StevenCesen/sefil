import { useRef, useState } from "react";
import BackButton from "../../components/BackButton/BackButton";
import sendpush from "../../helpers/sendpush";
import "./ActualizacionCartera.css";

export default function ActualizacionCartera() {
    const fileRef = useRef();
    const fileNameRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = async () => {
        const file = fileRef.current?.files[0];
        if (!file) {
            sendpush({
                title: 'Archivo requerido',
                message: 'Selecciona un archivo .xlsx antes de continuar.',
                type: 'Push--danger',
                timeout: 3000
            });
            return;
        }

        setUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/credits/update-from-excel`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                }
            );
            const data = await response.json();

            if (data.code === 1) {
                setResult(data.result);
                sendpush({
                    title: 'Actualización completada',
                    message: data.message,
                    type: data.result?.skipped > 0 ? 'Push--warning' : 'Push--sucessful',
                    timeout: 4000
                });
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'No se pudo procesar el archivo.',
                    type: 'Push--danger',
                    timeout: 4000
                });
            }
        } catch {
            sendpush({
                title: 'Error de conexión',
                message: 'No se pudo conectar con el servidor.',
                type: 'Push--danger',
                timeout: 4000
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="ActualizacionCartera">
            <BackButton />
            <h2 className="ActualizacionCartera__title">Actualización de cartera</h2>
            <p className="ActualizacionCartera__subtitle">
                Carga un archivo Excel para actualizar masivamente los créditos por número de crédito.
            </p>

            <div className="ActualizacionCartera__card">
                <h3>Subir archivo</h3>
                <p className="ActualizacionCartera__hint">
                    Formato requerido: <strong>.xlsx / .xls / .csv</strong>
                </p>

                <div className="ActualizacionCartera__upload-row">
                    <label className="ActualizacionCartera__file-label" htmlFor="cartera-file">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                        <span ref={fileNameRef}>Elegir archivo</span>
                        <input
                            ref={fileRef}
                            id="cartera-file"
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={() => {
                                const name = fileRef.current?.files[0]?.name;
                                if (fileNameRef.current) fileNameRef.current.textContent = name || 'Elegir archivo';
                            }}
                        />
                    </label>
                    <button
                        className="ActualizacionCartera__btn"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? 'Procesando...' : 'Actualizar'}
                    </button>
                </div>
            </div>

            {result && (
                <div className="ActualizacionCartera__result">
                    <div className="ActualizacionCartera__stats">
                        <div className="ActualizacionCartera__stat ok">
                            <strong>{result.updated}</strong>
                            <span>Actualizados</span>
                        </div>
                        <div className="ActualizacionCartera__stat warn">
                            <strong>{result.skipped}</strong>
                            <span>Omitidos</span>
                        </div>
                    </div>

                    {result.skipped_details?.length > 0 && (
                        <div className="ActualizacionCartera__skipped">
                            <h4>Registros omitidos</h4>
                            <div className="ActualizacionCartera__skipped-head">
                                <span>Crédito</span>
                                <span>Razón</span>
                            </div>
                            {result.skipped_details.map((row, i) => (
                                <div key={i} className="ActualizacionCartera__skipped-row">
                                    <span>{row.credito}</span>
                                    <span>{row.razon}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
