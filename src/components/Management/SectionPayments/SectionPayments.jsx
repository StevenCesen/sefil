import { Ban, Printer } from "lucide-react";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./SectionPayments.css";
import sendpush from "../../../helpers/sendpush";
import { useState, useMemo } from "react";
import { useStoreLoader } from "../../../stores/useStoreLoader";
import revertPayment from "../../../helpers/revertPayment";
import PaymentVoucherModal from "../../PaymentVoucherModal/PaymentVoucherModal";

export default function SectionPayments({ payments, credit, view_complete_info = false, is_admin = false }) {
    const [showPDF, setShowPDF] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showReverseModal, setShowReverseModal] = useState(false);
    const [paymentToReverse, setPaymentToReverse] = useState(null);
    const loader = useStoreLoader();

    const showTwoRows = view_complete_info && is_admin;

    const { headersRow1, detailFields } = useMemo(() => {
        const baseHeaders = ['Comprobante', 'Fecha pago', 'Tipo de pago'];
        const detailHeaders = ['Capital', 'Interes', 'Mora', 'Seguro', 'Judicial', 'Gastos Cobr.', 'Otros valores'];

        if (showTwoRows) {
            return {
                headersRow1: [...baseHeaders, ...detailHeaders],
                detailFields: ['capital', 'interest', 'mora', 'safe', 'legal_expenses', 'collection_expenses', 'other_values']
            };
        }

        return {
            headersRow1: [...baseHeaders, 'Monto'],
            detailFields: []
        };
    }, [showTwoRows]);

    const getDetailValue = (payment, field) => {
        return payment[field] || 0;
    };

    const handlePrintClick = (payment) => {
        if (payment.payment_reference === 'FACES' || payment.payment_reference === 'Gasto Cob.' || payment.id === 'FACES' || payment.id === 'Gasto Cob.') {
            sendpush({
                title: 'No disponible',
                message: 'No se puede reimprimir este pago, debido a que fue generado por fuente externa.',
                type: 'Push--warning',
                timeout: 3000
            });
            return;
        }

        if ((payment.payment_prints || payment.status_print) >= 2) {
            sendpush({
                title: 'Límite superado',
                message: 'Se ha superado la cantidad de reimpresiones permitidas.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        setSelectedPayment(payment);
        setShowPDF(true);
    };

    const handleClosePDF = () => {
        setShowPDF(false);
        setSelectedPayment(null);
    };

    const handleReverseClick = (payment) => {
        if (payment.payment_reference === 'FACES' || payment.payment_reference === 'Gasto Cob.' || payment.id === 'FACES' || payment.id === 'Gasto Cob.') {
            sendpush({
                title: 'No disponible',
                message: 'No se puede anular un comprobante externo.',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        const hoursDifference = (new Date() - new Date(payment.payment_date || payment.fecha)) / (1000 * 60 * 60);
        if (hoursDifference > 24) {
            sendpush({
                title: 'Tiempo excedido',
                message: 'Ya no se puede anular el pago, han transcurrido más de 24 horas.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        setPaymentToReverse(payment);
        setShowReverseModal(true);
    };

    const handleConfirmReverse = async () => {
        loader.viewOn(true);
        try {
            const result = await revertPayment({ paymentId: paymentToReverse.id });

            if(result.code===1){
                sendpush({
                    title:'Comprobante anulado',
                    message: 'El comprobante se ha anulado correctamente.',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                window.location.reload();
            }else{
                sendpush({
                    title:'Error',
                    message: result.message || 'No se pudo anular el comprobante.',
                    type:'Push--danger',
                    timeout:5000
                });
            }
        } catch (error) {
            sendpush({
                title: 'Error',
                message: error.message || 'No se pudo anular el comprobante.',
                type: 'Push--danger',
                timeout: 5000
            });
        } finally {
            loader.viewOn(false);
            setShowReverseModal(false);
            setPaymentToReverse(null);
        }
    };

    const handleCancelReverse = () => {
        setShowReverseModal(false);
        setPaymentToReverse(null);
    };

    return (
        <>
            <div className={`SectionPayments ${showTwoRows ? 'SectionPayments--twoRows' : ''}`}>
                {/* Header Row 1 */}
                <div className="SectionPayments__header SectionPayments__header--row1">
                    {headersRow1.map(header => <label key={header}>{header}</label>)}
                </div>

                {payments.data.map((payment, n) => (
                    <div key={n} className="SectionPayments__itemGroup">
                        {/* Fila 1: Datos principales */}
                        <div className="SectionPayments__item SectionPayments__item--row1">
                            <label>{(payment.payment_number !== null) ? payment.payment_number : 'FACES'}</label>
                            <label>{payment.payment_date || payment.fecha}</label>
                            <label>{payment.payment_type || payment.forma_pago}</label>

                            {showTwoRows ? (
                                // Mostrar detalles de rubros
                                detailFields.map(field => (
                                    <label key={field}>
                                        {useFormatterNumber({ value: getDetailValue(payment, field), currency: 'USD' })}
                                    </label>
                                ))
                            ) : (
                                // Solo mostrar monto
                                <label>
                                    {useFormatterNumber({ value: payment.payment_value || payment.valor_recibido, currency: 'USD' })}
                                </label>
                            )}
                        </div>

                        {/* Fila 2: Monto, Estado, Acciones (solo para admin con info completa) */}
                        {showTwoRows && (
                            <div className="SectionPayments__item SectionPayments__item--row2">
                                <div className="SectionPayments__cell">
                                    <span className="SectionPayments__cellHeader">Monto</span>
                                    <label>
                                        {useFormatterNumber({ value: payment.payment_value || payment.valor_recibido, currency: 'USD' })}
                                    </label>
                                </div>
                                <div className="SectionPayments__cell">
                                    <span className="SectionPayments__cellHeader">Estado</span>
                                    <label>
                                        {(payment.payment_status === 'ERROR_SUM' || payment.status === 'ERROR_SUM')
                                            ? 'PENDIENTE DE PROCESAR'
                                            : (payment.payment_status || payment.status)}
                                    </label>
                                </div>
                                <div className="SectionPayments__cell">
                                    <span className="SectionPayments__cellHeader">Acciones</span>
                                    <div className="SectionPayments__actions">
                                        <button onClick={() => handlePrintClick(payment)} title="Reimprimir comprobante">
                                            <Printer size={16} />
                                        </button>
                                        <button onClick={() => handleReverseClick(payment)} title="Anular comprobante">
                                            <Ban size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showReverseModal && paymentToReverse && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        <h3>Confirmar Anulación</h3>
                        <p>¿Está seguro que desea anular el comprobante #{paymentToReverse.payment_reference || paymentToReverse.id}?</p>

                        {credit && credit.collection_state === 'CONVENIO DE PAGO' && (
                            <p style={{ color: 'orange', fontWeight: 'bold', marginTop: '15px' }}>
                                ADVERTENCIA: Al anular este pago, el pago en el convenio también se revertirá.
                            </p>
                        )}

                        <div style={{ marginTop: '20px' }}>
                            <button
                                onClick={handleConfirmReverse}
                                style={{
                                    background: 'red',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                Sí, Anular
                            </button>
                            <button
                                onClick={handleCancelReverse}
                                style={{
                                    background: '#ccc',
                                    color: 'black',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PaymentVoucherModal
                isOpen={showPDF}
                onClose={handleClosePDF}
                payment={selectedPayment}
                creditInfo={credit}
                reprint={true}
            />
        </>
    );
}
