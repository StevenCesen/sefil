import sendpush from "../../../helpers/sendpush";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./CardQuote.css";

export default function CardQuote({ status, quote, n }) {
    return (
        <div className="CardQuote">
            <p>{quote.cuota}</p>
            <p>{useFormatterNumber({ value: quote.valor, currency: 'USD' })}</p>
            <p>{('fecha_pago' in quote) ? quote.fecha_pago : ""}</p>
            {
                (quote.estado === 'PENDIENTE' & status==='autorizado')
                    ?
                    (n == 0)
                        ?
                        <button
                            onClick={(e) => {
                                
                            }}
                        >Gasto de cobranza</button>
                        :
                        <button
                            onClick={() => {
                                const date = new Date().toLocaleString().split(',')[0];
                                const date_comparative = date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0];

                                if (date_comparative === quote.fecha_pago || JSON.parse(restruct.detail)[n - 1].estado === 'PAGADO') {

                                } else {
                                    sendpush({
                                        title: 'ERR: Pago.',
                                        message: 'Existe una cuota anterior sin pago o aún no es la fecha de pago.',
                                        type: 'Push--danger',
                                        timeout: 5000
                                    });
                                }
                            }}
                        >Pago</button>
                    : <p>{(status==='autorizado') ? quote.estado : 'N/A'}</p>
            }
        </div>
    );
}