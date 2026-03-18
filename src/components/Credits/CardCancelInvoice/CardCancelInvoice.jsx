import { useState } from "react";
import { BanknoteArrowDownIcon } from "lucide-react";
import cancelInvoice from "../../../helpers/Credits/cancelInvoice";
import sendpush from "../../../helpers/sendpush";
import "./CardCancelInvoice.css";

export default function CardCancelInvoice({ credit_id, invoice_value, onSuccess, onClose }) {
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        const data = await cancelInvoice({ credit_id });
        setLoading(false);

        if (data?.code === 1) {
            sendpush({
                title: 'Gasto cancelado',
                message: data.message || 'Gasto de cobranza cancelado correctamente',
                type: 'Push--sucessful',
                timeout: 3000
            });
            onSuccess();
        } else {
            sendpush({
                title: 'Error',
                message: data?.message || 'No se pudo cancelar el gasto de cobranza',
                type: 'Push--danger',
                timeout: 4000
            });
        }
    };

    return (
        <div className="CardCancelInvoice__overlay">
            <div className="CardCancelInvoice">
                <div className="CardCancelInvoice__header">
                    <BanknoteArrowDownIcon size={24} />
                    <h3>Cancelar gasto de cobranza</h3>
                </div>

                <p className="CardCancelInvoice__info">
                    Esta acción cambiará el estado del gasto a <strong>NO COBRADO</strong>.
                </p>

                {invoice_value > 0 && (
                    <p className="CardCancelInvoice__value">
                        Valor del gasto: <strong>${Number(invoice_value).toFixed(2)}</strong>
                    </p>
                )}

                <p className="CardCancelInvoice__warning">
                    Esta acción no se puede deshacer. ¿Deseas continuar?
                </p>

                <div className="CardCancelInvoice__actions">
                    <button
                        className="CardCancelInvoice__btn CardCancelInvoice__btn--cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Volver
                    </button>
                    <button
                        className="CardCancelInvoice__btn CardCancelInvoice__btn--confirm"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {loading ? 'Cancelando...' : 'Confirmar cancelación'}
                    </button>
                </div>
            </div>
        </div>
    );
}
