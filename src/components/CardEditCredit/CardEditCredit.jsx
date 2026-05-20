import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./CardEditCredit.css";
import sendpush from "../../helpers/sendpush";

const COLLECTION_STATES = [
    'Vigente', 'Vencido', 'Cancelado', 'Castigado', 'CONVENIO DE PAGO',
    'Vencido en trámite judicial', 'JUDICIAL'
];

export default function CardEditCredit({ credit, onClose, onSuccess }) {
    const [form, setForm] = useState({
        capital: credit.capital ?? '',
        interest: credit.interest ?? '',
        mora: credit.mora ?? '',
        safe: credit.safe ?? '',
        management_collection_expenses: credit.management_collection_expenses ?? '',
        legal_expenses: credit.legal_expenses ?? '',
        other_values: credit.other_values ?? '',
        days_past_due: credit.days_past_due ?? '',
        collection_state: credit.collection_state ?? '',
        start_date_process: credit.start_date_process ?? '',
        payment_date: credit.payment_date ?? '',
        due_date: credit.due_date ?? '',
        total_fees: credit.total_fees ?? '',
        paid_fees: credit.paid_fees ?? '',
        pending_fees: credit.pending_fees ?? '',
    });
    const [saving, setSaving] = useState(false);

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const calculatedTotal =
        (parseFloat(form.capital) || 0) +
        (parseFloat(form.interest) || 0) +
        (parseFloat(form.mora) || 0) +
        (parseFloat(form.safe) || 0) +
        (parseFloat(form.management_collection_expenses) || 0) +
        (parseFloat(form.legal_expenses) || 0) +
        (parseFloat(form.other_values) || 0);

    const isJudicial = form.collection_state?.toUpperCase() === 'JUDICIAL';

    const handleSave = async () => {
        if (isJudicial && !form.start_date_process && !credit.start_date_process) {
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
            const body = {
                capital: form.capital,
                interest: form.interest,
                mora: form.mora,
                safe: form.safe,
                management_collection_expenses: form.management_collection_expenses,
                legal_expenses: form.legal_expenses,
                other_values: form.other_values,
                total: calculatedTotal.toFixed(2),
                days_past_due: form.days_past_due,
                collection_state: form.collection_state,
                payment_date: form.payment_date,
                due_date: form.due_date,
                total_fees: form.total_fees,
                paid_fees: form.paid_fees,
                pending_fees: form.pending_fees,
            };

            if (isJudicial && form.start_date_process) {
                body.start_date_process = form.start_date_process;
            }

            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/credits/${credit.id}`,
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
                    title: 'Crédito actualizado',
                    message: 'Los valores del crédito se actualizaron correctamente.',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                onSuccess();
                onClose();
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'No se pudo actualizar el crédito.',
                    type: 'Push--danger',
                    timeout: 4000
                });
            }
        } catch {
            sendpush({
                title: 'Error',
                message: 'Error de conexión al actualizar el crédito.',
                type: 'Push--danger',
                timeout: 4000
            });
        } finally {
            setSaving(false);
        }
    };

    const modal = (
        <div className="CardEditCredit__overlay" onClick={onClose}>
            <div className="CardEditCredit" onClick={e => e.stopPropagation()}>
                <div className="CardEditCredit__header">
                    <span>Editar valores del crédito — {credit.sync_id}</span>
                    <button className="CardEditCredit__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="CardEditCredit__body">
                    <div>
                        <p className="CardEditCredit__section-title">Desglose financiero</p>
                        <div className="CardEditCredit__grid">
                            <div className="CardEditCredit__field">
                                <label>Capital</label>
                                <input type="number" step="0.01" min="0" value={form.capital} onChange={e => set('capital', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Interés</label>
                                <input type="number" step="0.01" min="0" value={form.interest} onChange={e => set('interest', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Mora</label>
                                <input type="number" step="0.01" min="0" value={form.mora} onChange={e => set('mora', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Seguro desgravamen</label>
                                <input type="number" step="0.01" min="0" value={form.safe} onChange={e => set('safe', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Gasto cobranza SEFIL</label>
                                <input type="number" step="0.01" min="0" value={form.management_collection_expenses} onChange={e => set('management_collection_expenses', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Gastos judiciales</label>
                                <input type="number" step="0.01" min="0" value={form.legal_expenses} onChange={e => set('legal_expenses', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Otros valores</label>
                                <input type="number" step="0.01" min="0" value={form.other_values} onChange={e => set('other_values', e.target.value)} />
                            </div>
                        </div>
                        <div className="CardEditCredit__total-preview" style={{ marginTop: 12 }}>
                            <span>Total calculado:</span>
                            <strong>${calculatedTotal.toFixed(2)}</strong>
                        </div>
                    </div>

                    <div>
                        <p className="CardEditCredit__section-title">Estado y fechas</p>
                        <div className="CardEditCredit__grid">
                            <div className="CardEditCredit__field">
                                <label>Estado de cobranza</label>
                                <select value={form.collection_state} onChange={e => set('collection_state', e.target.value)}>
                                    {COLLECTION_STATES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Días de mora</label>
                                <input type="number" min="0" value={form.days_past_due} onChange={e => set('days_past_due', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Fecha de pago</label>
                                <input type="date" value={form.payment_date} onChange={e => set('payment_date', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Fecha de vencimiento</label>
                                <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
                            </div>
                            {isJudicial && (
                                <div className="CardEditCredit__field">
                                    <label>Fecha inicio proceso judicial {!credit.start_date_process && '*'}</label>
                                    <input type="date" value={form.start_date_process} onChange={e => set('start_date_process', e.target.value)} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="CardEditCredit__section-title">Cuotas</p>
                        <div className="CardEditCredit__grid">
                            <div className="CardEditCredit__field">
                                <label>Total cuotas</label>
                                <input type="number" min="0" value={form.total_fees} onChange={e => set('total_fees', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Cuotas pagadas</label>
                                <input type="number" min="0" value={form.paid_fees} onChange={e => set('paid_fees', e.target.value)} />
                            </div>
                            <div className="CardEditCredit__field">
                                <label>Cuotas pendientes</label>
                                <input type="number" min="0" value={form.pending_fees} onChange={e => set('pending_fees', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="CardEditCredit__footer">
                    <button className="CardEditCredit__btn-cancel" onClick={onClose}>Cancelar</button>
                    <button className="CardEditCredit__btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
