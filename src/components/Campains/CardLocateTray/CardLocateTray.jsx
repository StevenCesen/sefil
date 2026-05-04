import { useState } from "react";
import sendpush from "../../../helpers/sendpush";
import "./CardLocateTray.css";

const TRAY_OPTIONS = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'GESTIONADO', label: 'GESTIONADO' },
    { value: 'EN PROCESO', label: 'EN PROCESO' },
    { value: 'NO CONTACTABLES', label: 'NO CONTACTABLES' },
];

export default function CardLocateTray({ campain_id }) {
    const [raw_ids, setRawIds] = useState('');
    const [target_tray, setTargetTray] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const parseSyncIds = () =>
        raw_ids
            .split(/[\n,;]+/)
            .map(s => s.trim())
            .filter(Boolean);

    const handleSubmit = async () => {
        const sync_ids = parseSyncIds();

        if (sync_ids.length === 0) {
            sendpush({ title: 'Error', message: 'Ingrese al menos un sync_id', type: 'Push--warning', timeout: 3000 });
            return;
        }
        if (!target_tray) {
            sendpush({ title: 'Error', message: 'Seleccione una bandeja destino', type: 'Push--warning', timeout: 3000 });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/credits/bulk-update-tray`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ management_tray: target_tray, sync_ids })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '#/login';
                return;
            }

            const { result } = await response.json();
            setResult(result);

            sendpush({
                title: 'Bandeja actualizada',
                message: `${result.updated} crédito(s) ubicados en ${target_tray}`,
                type: 'Push--sucessful',
                timeout: 5000
            });
        } catch {
            sendpush({ title: 'Error', message: 'Error al actualizar la bandeja', type: 'Push--warning', timeout: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const syncIdCount = parseSyncIds().length;

    return (
        <div className="CardLocateTray">
            <p className="CardAssignCampain__head">
                Ubicar en bandeja
            </p>

            <div className="CardLocateTray__body">
                <label className="CardLocateTray__field">
                    Créditos (sync_id){syncIdCount > 0 && <span className="CardLocateTray__count"> — {syncIdCount} ingresados</span>}
                    <textarea
                        className="CardLocateTray__textarea"
                        value={raw_ids}
                        onChange={e => { setRawIds(e.target.value); setResult(null); }}
                        placeholder={"SEFIL_1-82729202\nSEFIL_3-S3-2927288383"}
                        rows={8}
                    />
                    <span className="CardLocateTray__hint">Un sync_id por línea, o separados por coma</span>
                </label>

                <label className="CardLocateTray__field">
                    Bandeja destino
                    <select value={target_tray} onChange={e => setTargetTray(e.target.value)}>
                        <option value="">-- Seleccionar --</option>
                        {TRAY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </label>

                <button
                    className="CardLocateTray__btn"
                    onClick={handleSubmit}
                    disabled={loading || !target_tray || syncIdCount === 0}
                >
                    {loading ? 'Actualizando...' : 'Confirmar'}
                </button>

                {result && (
                    <div className="CardLocateTray__result">
                        <p>Actualizados: <strong>{result.updated}</strong></p>
                        {result.not_found?.length > 0 && (
                            <p>No encontrados (<strong>{result.not_found.length}</strong>):{' '}
                                <span className="CardLocateTray__notFound">{result.not_found.join(', ')}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
