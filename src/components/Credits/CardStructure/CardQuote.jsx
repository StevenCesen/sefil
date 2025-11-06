import sendpush from "../../../helpers/sendpush";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./CardQuote.css";

export default function CardQuote({ status, quote, n, restruct, onOpenPayment, onOpenGastoCobranza }) {

    const handlePaymentClick = () => {
        const date = new Date().toLocaleString().split(',')[0];
        const date_comparative = date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0];

        // Validación de datos antes de acceder
        if (!restruct || !restruct.detail) {
            sendpush({
                title: 'ERR: Datos.',
                message: 'No se encontraron los datos de la reestructuración.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        const details = JSON.parse(restruct.detail);
        const previousQuote = details[n - 1];

        if (date_comparative === quote.fecha_pago || (previousQuote && previousQuote.estado === 'PAGADO')) {
            // Abrir el modal de pago
            onOpenPayment({
                amount: quote.valor,
                quoteNumber: quote.cuota,
                paymentDate: quote.fecha_pago
            });
        } else {
            sendpush({
                title: 'ERR: Pago.',
                message: 'Existe una cuota anterior sin pago o aún no es la fecha de pago.',
                type: 'Push--danger',
                timeout: 5000
            });
        }
    };

    const handleGastoCobranzaClick = () => {
        if (onOpenGastoCobranza) {
            onOpenGastoCobranza();
        }
    };

    return (
        <div className="CardQuote">
            <p>{quote.cuota}</p>
            <p>{useFormatterNumber({ value: quote.valor, currency: 'USD' })}</p>
            <p>{('fecha_pago' in quote) ? quote.fecha_pago : ""}</p>
            {
                (quote.estado === 'PENDIENTE' && status === 'autorizado')
                    ?
                    (n === 0)
                        ?
                        <button onClick={handleGastoCobranzaClick}>
                            Gasto de cobranza
                        </button>
                        :
                        <button onClick={handlePaymentClick}>Pago</button>
                    : <p>{(status === 'autorizado') ? quote.estado : 'N/A'}</p>
            }
        </div>
    );
}