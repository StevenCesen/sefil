import { useState } from "react";
import "./CardLegalPayment.css";
import { X } from "lucide-react";
import sendpush from "../../helpers/sendpush";

export default function CardLegalPayment({ creditId, syncId, businessName, clientName, onClose, onSuccess }) {
    const [form, setForm] = useState({
        payment_date: '',
        total_paid: '',
        capital: '',
        interest: '',
        mora: '',
        others: '',
        closing_date: '',
    });
    const [saving, setSaving] = useState(false);
    const [distributionError, setDistributionError] = useState('');

    const toNum = (v) => parseFloat(v) || 0;

    const totalPaid = toNum(form.total_paid);
    const distributionSum = toNum(form.capital) + toNum(form.interest) + toNum(form.mora) + toNum(form.others);

    const handleChange = (field, value) => {
        const updated = { ...form, [field]: value };
        setForm(updated);

        if (['capital', 'interest', 'mora', 'others', 'total_paid'].includes(field)) {
            const sum = toNum(updated.capital) + toNum(updated.interest) + toNum(updated.mora) + toNum(updated.others);
            const total = toNum(updated.total_paid);
            setDistributionError(sum > total && total > 0
                ? `La suma distribuida ($${sum.toFixed(2)}) supera el total pagado ($${total.toFixed(2)})`
                : ''
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.payment_date || !form.total_paid) {
            sendpush({ title: 'Error', message: 'Fecha de pago y total pagado son obligatorios', type: 'Push--warning', timeout: 3000 });
            return;
        }

        if (distributionError) {
            sendpush({ title: 'Error', message: distributionError, type: 'Push--warning', timeout: 3000 });
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/legal-payments`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    credit_id: creditId,
                    payment_date: form.payment_date,
                    total_paid: totalPaid,
                    capital: toNum(form.capital),
                    interest: toNum(form.interest),
                    mora: toNum(form.mora),
                    others: toNum(form.others),
                    closing_date: form.closing_date || null,
                })
            });
            const data = await response.json();
            if (data.code === 1) {
                sendpush({ title: 'Pago registrado', message: data.message || 'El pago se registró correctamente', type: 'Push--sucessful', timeout: 3000 });
                onSuccess?.();
                onClose();
            } else {
                sendpush({ title: 'Error', message: data.message || 'No se pudo registrar el pago', type: 'Push--danger', timeout: 3000 });
            }
        } catch {
            sendpush({ title: 'Error', message: 'Error al registrar el pago', type: 'Push--danger', timeout: 3000 });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="CardLegalPayment__background">
            <div className="CardLegalPayment">
                <div className="CardLegalPayment__header">
                    <p>Registrar Pago — Proceso Legal</p>
                    <button className="CardLegalPayment__closeBtn" onClick={onClose} type="button">
                        <X size={20} />
                    </button>
                </div>

                <div className="CardLegalPayment__creditInfo">
                    <span className="CardLegalPayment__creditId">{businessName}-{syncId}</span>
                    {clientName && <span className="CardLegalPayment__clientName">{clientName}</span>}
                </div>

                <form onSubmit={handleSubmit} className="CardLegalPayment__form">
                    <div className="CardLegalPayment__row">
                        <label>
                            Fecha de pago *
                            <input
                                type="date"
                                value={form.payment_date}
                                onChange={e => handleChange('payment_date', e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Total pagado *
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.total_paid}
                                onChange={e => handleChange('total_paid', e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </label>
                    </div>

                    <div className="CardLegalPayment__section">
                        <p className="CardLegalPayment__sectionTitle">Distribución del pago <span>(opcional)</span></p>
                        <div className="CardLegalPayment__distribution">
                            <label>
                                Capital
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.capital}
                                    onChange={e => handleChange('capital', e.target.value)}
                                    placeholder="0.00"
                                />
                            </label>
                            <label>
                                Interés
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.interest}
                                    onChange={e => handleChange('interest', e.target.value)}
                                    placeholder="0.00"
                                />
                            </label>
                            <label>
                                Mora
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.mora}
                                    onChange={e => handleChange('mora', e.target.value)}
                                    placeholder="0.00"
                                />
                            </label>
                            <label>
                                Otros
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.others}
                                    onChange={e => handleChange('others', e.target.value)}
                                    placeholder="0.00"
                                />
                            </label>
                        </div>

                        {distributionError && (
                            <p className="CardLegalPayment__error">{distributionError}</p>
                        )}

                        {totalPaid > 0 && (
                            <div className="CardLegalPayment__summary">
                                <span>Distribuido: <strong>${distributionSum.toFixed(2)}</strong></span>
                                <span>Restante: <strong>${Math.max(0, totalPaid - distributionSum).toFixed(2)}</strong></span>
                            </div>
                        )}
                    </div>

                    <div className="CardLegalPayment__row">
                        <label className="CardLegalPayment__fullWidth">
                            Fecha de cierre de proceso
                            <input
                                type="date"
                                value={form.closing_date}
                                onChange={e => handleChange('closing_date', e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="CardLegalPayment__footer">
                        <button type="button" className="CardLegalPayment__btnCancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="CardLegalPayment__btnSave"
                            disabled={saving || !!distributionError}
                        >
                            {saving ? 'Guardando...' : 'Guardar pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
