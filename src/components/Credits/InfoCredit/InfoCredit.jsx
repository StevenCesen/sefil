import { useState } from "react";
import "./InfoCredit.css";
import sendpush from "../../../helpers/sendpush";

const COLLECTION_STATES = [
    'Vigente', 'Vencido', 'Cancelado', 'Castigado', 'CONVENIO DE PAGO',
    'Vencido en trámite judicial', 'JUDICIAL'
];

export default function InfoCredit({ business, sync_id, agency, frequency, due_date, collection_state, monthly_fee_amount, info_extra, canEdit, creditId, startDateProcess, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [newState, setNewState] = useState(collection_state);
    const [startDate, setStartDate] = useState(startDateProcess || '');
    const [saving, setSaving] = useState(false);

    const isJudicial = newState?.toUpperCase() === 'JUDICIAL';

    const handleSave = async () => {
        if (isJudicial && !startDate && !startDateProcess) {
            sendpush({
                title: 'Campo requerido',
                message: 'La fecha de inicio de proceso es obligatoria para estado JUDICIAL.',
                type: 'Push--danger',
                timeout: 4000
            });
            return;
        }

        setSaving(true);
        try {
            const body = { collection_state: newState };
            if (isJudicial && startDate) body.start_date_process = startDate;

            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/credits/${creditId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(body)
                }
            );
            const data = await response.json();
            if (data.code === 1) {
                sendpush({
                    title: 'Estado actualizado',
                    message: 'El estado del crédito se actualizó correctamente.',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                setEditing(false);
                if (onSaved) onSaved();
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'No se pudo actualizar el estado.',
                    type: 'Push--danger',
                    timeout: 4000
                });
            }
        } catch {
            sendpush({
                title: 'Error',
                message: 'Error de conexión.',
                type: 'Push--danger',
                timeout: 4000
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setNewState(collection_state);
        setStartDate(startDateProcess || '');
        setEditing(false);
    };

    return (
        <div className="InfoCredit">
            <h4>📓 Información del crédito</h4>
            <div>
                <h4>Crédito/Contrato:</h4>
                <p>{business}-{sync_id}</p>
            </div>
            <div>
                <h4>Agencia:</h4>
                <p>{agency}</p>
            </div>
            <div>
                <h4>Frecuencia:</h4>
                <p>{frequency}</p>
            </div>

            <div style={{ flexDirection: editing ? 'column' : 'row', alignItems: editing ? 'flex-start' : 'center', gap: editing ? '8px' : '0' }}>
                <h4>Estado del crédito:</h4>
                {editing ? (
                    <div className="InfoCredit__edit-state">
                        <select value={newState} onChange={e => setNewState(e.target.value)}>
                            {COLLECTION_STATES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {isJudicial && (
                            <label className="InfoCredit__date-label">
                                Fecha inicio proceso {!startDateProcess && <span style={{color:'red'}}>*</span>}
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </label>
                        )}
                        <div className="InfoCredit__edit-actions">
                            <button className="InfoCredit__btn-cancel" onClick={handleCancel} disabled={saving}>
                                Cancelar
                            </button>
                            <button className="InfoCredit__btn-save" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="InfoCredit__state-row">
                        <p>{collection_state}</p>
                        {canEdit && (
                            <button className="InfoCredit__btn-edit" onClick={() => setEditing(true)}>
                                Editar
                            </button>
                        )}
                    </div>
                )}
            </div>

            {
                (info_extra)
                ?
                    <>
                        <div>
                            <h4>Estado en campaña:</h4>
                            <p>{info_extra.sync_status}</p>
                        </div>
                        <div>
                            <h4>Agente asignado:</h4>
                            <p>{info_extra.agent}</p>
                        </div>
                    </>
                :   <></>
            }
            {
                (business!=='SEFIL_1' && business!=='SEFIL_2')
                ?
                    <>
                        <div>
                            <h4>Valor cuota:</h4>
                            <p>{monthly_fee_amount}</p>
                        </div>
                        <div>
                            <h4>Fecha de terminación:</h4>
                            <p>{due_date}</p>
                        </div>
                    </>
                :   <></>
            }
        </div>
    );
}
