import { useEffect, useRef, useState } from "react";
import "./CardEditJudicial.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import { X } from "lucide-react";
import sendpush from "../../helpers/sendpush";

export default function CardEditJudicial({id, cartera, totalAmount, gastos_judiciales, setNew, close}){

    const [gastos, setGastos] = useState();
    const [judiciales, setJudiciales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const aumento = useRef();

    useEffect(() => {
        setGastos({
            actual: gastos_judiciales,
            aumento: '',
            final: gastos_judiciales,
            detail: '',
            id: id,
            cartera: cartera,
            totalAmount: totalAmount
        });

        // GET /api/legal-expenses?credit_id={id}
        fetch(`${import.meta.env.VITE_URL_BASE}/legal-expenses?credit_id=${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 1) {
                    setJudiciales(data.result || []);
                } else {
                    setJudiciales([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setJudiciales([]);
                setLoading(false);
            });

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gastos || gastos.final <= 0 || gastos.detail === '') {
            sendpush({
                title: 'Error',
                message: 'Debe completar todos los campos',
                type: 'Push--warning',
                timeout: 3000
            });
            return;
        }

        setSaving(true);

        try {
            // PATCH /api/legal-expenses/{creditId}
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/legal-expenses/${id}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    post_amount: Number(gastos.final),
                    detail: gastos.detail,
                    created_by: Number(localStorage.getItem('temp_uS'))
                })
            });

            const data = await response.json();

            if (data.code === 1) {
                sendpush({
                    title: 'Gasto judicial actualizado',
                    message: data.message || 'El gasto judicial se actualizó correctamente',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                setNew();
                close();
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'No se pudo actualizar el gasto judicial',
                    type: 'Push--danger',
                    timeout: 3000
                });
            }
        } catch (error) {
            console.error('Error updating legal expense:', error);
            sendpush({
                title: 'Error',
                message: 'Error al actualizar el gasto judicial',
                type: 'Push--danger',
                timeout: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="CardEditJudicial__background">
            <div className="CardEditJudicial">
                <div className="CardEditJudicial__header">
                    <p>Editar Gastos Judiciales</p>
                    <button className="CardEditJudicial__closeBtn" onClick={() => close()}>
                        <X size={20} />
                    </button>
                </div>

                <h3>Historial</h3>
                <div className="CardEditJudicial__prevs">
                    {loading ? (
                        <p>Cargando...</p>
                    ) : judiciales.length > 0 ? (
                        judiciales.map((judicial, index) => (
                            <div key={judicial.id || index} className="CardEditJudicial__prev">
                                <div className="CardEditJudicial__prevInfo">
                                    <span className="CardEditJudicial__prevDate">{judicial.modify_date} - {judicial.creator_name}</span>
                                    <span className="CardEditJudicial__prevDetail">{judicial.detail}</span>
                                </div>
                                <p>{useFormatterNumber({value: judicial.total_value, currency: 'USD'})}</p>
                            </div>
                        ))
                    ) : (
                        <p>Sin registros</p>
                    )}
                </div>

                <h3>Generar nuevo</h3>
                <div className="CardEditJudicial__labels">
                    <label>
                        Motivo
                        <select
                            value={gastos?.detail || ''}
                            onChange={(e) => {
                                setGastos({
                                    ...gastos,
                                    detail: e.target.value
                                });
                            }}
                        >
                            <option value="">--Seleccionar--</option>
                            <option value="NOTIFICACIÓN">NOTIFICACIÓN</option>
                            <option value="DEMANDA JUDICIAL">DEMANDA JUDICIAL</option>
                            <option value="ENTREGA DE PAGARÉ">ENTREGA DE PAGARÉ</option>
                            <option value="INICIO TRÁMITE JUDICIAL">INICIO TRÁMITE JUDICIAL</option>
                            <option value="GASTOS NOTARÍA">GASTOS NOTARÍA</option>
                            <option value="GASTOS CERTIFICADOS">GASTOS CERTIFICADOS</option>
                            <option value="GASTOS PERITAJE">GASTOS PERITAJE</option>
                            <option value="GASTOS CITACIÓN">GASTOS CITACIÓN</option>
                        </select>
                    </label>

                    <label>
                        Aumento
                        <input
                            type="number"
                            ref={aumento}
                            value={gastos?.aumento ?? ''}
                            step={0.01}
                            min={0}
                            onChange={(e) => {
                                setGastos({
                                    ...gastos,
                                    aumento: e.target.value,
                                    final: Number(gastos?.actual || 0) + Number(e.target.value)
                                });
                            }}
                        />
                    </label>
                </div>

                <div className="CardEditJudicial__details">
                    <div>
                        <p>Valor actual: </p>
                        <p>{useFormatterNumber({value: gastos?.actual || 0, currency: 'USD'})}</p>
                    </div>
                    <div>
                        <p>Valor agregado: </p>
                        <p>{useFormatterNumber({value: gastos?.aumento || 0, currency: 'USD'})}</p>
                    </div>
                    <div>
                        <p>Valor final: </p>
                        <p>{useFormatterNumber({value: gastos?.final || 0, currency: 'USD'})}</p>
                    </div>
                </div>

                <div className="CardEditJudicial__footer">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
