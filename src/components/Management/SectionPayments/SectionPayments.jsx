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

    const { headers, detailFields } = useMemo(() => {
        const baseHeaders = ['Comprobante', 'Fecha pago', 'Tipo de pago'];
        const detailHeaders = (view_complete_info && is_admin) ? ['Capital', 'Interes', 'Mora', 'Seguro', 'Judicial', 'Gastos Cobranza', 'Otros valores'] : [];
        const endHeaders = is_admin
            ? ['Monto','Estado','Acciones']
            : ['Monto'];

        return {
            headers: [...baseHeaders, ...detailHeaders, ...endHeaders],
            detailFields: (view_complete_info && is_admin) ? ['capital', 'interest', 'mora', 'safe', 'legal_expenses', 'collection_expenses', 'other_values'] : [],

        };
    }, [view_complete_info, is_admin]);

    const getDetailValue = (payment, field) => {
        return payment[field] || 0;
    };

    const renderPaymentCells = (payment) => {
        const baseCells = [
            payment.payment_reference || payment.id,
            payment.payment_date || payment.fecha,
            payment.payment_type || payment.forma_pago
        ];

        const detailCells = detailFields.map(field =>
            useFormatterNumber({ value: getDetailValue(payment, field), currency: 'USD' })
        );

        const endCells = [
            useFormatterNumber({ value: payment.payment_value || payment.valor_recibido, currency: 'USD' }),
            payment.payment_status || payment.status,
        ];

        return [...baseCells, ...detailCells, ...endCells];
    };

    const handlePrintClick = (payment) => {
        console.log(payment)
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
            <div className="SectionPayments">
                <div className="SectionPayments__header">
                    {headers.map(header => <label key={header}>{header}</label>)}
                </div>
                
                {payments.data.map((payment, n) => {
                    const cells = renderPaymentCells(payment);
                    
                    return (
                        <div key={n} className="SectionPayments__item">
                            {cells.map((cell, index) => (
                                <label key={index}>{cell}</label>
                            ))}
                            
                            {
                                (view_complete_info && is_admin) && (
                                    <div className="SectionPayments__actions">
                                        <button onClick={() => handlePrintClick(payment)} title="Reimprimir comprobante">
                                            <Printer size={16} />
                                        </button>
                                        <button onClick={() => handleReverseClick(payment)} title="Anular comprobante">
                                            <Ban size={16} />
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    );
                })}
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