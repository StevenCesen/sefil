import { Ban, Printer } from "lucide-react";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./SectionPayments.css";
import sendpush from "../../../helpers/sendpush";
import { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PDF from "../../PDF";
import { useStoreLoader } from "../../../stores/useStoreLoader";

export default function SectionPayments({ payments, credit }) {
    const [showPDF, setShowPDF] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showReverseModal, setShowReverseModal] = useState(false);
    const [paymentToReverse, setPaymentToReverse] = useState(null);
    const loader = useStoreLoader();

    const handlePrintClick = (payment) => {
        if (payment.id === 'FACES') {
            sendpush({
                title: 'No disponible',
                message: 'No se puede reimprimir este pago, debido a que fue generado por fuente externa.',
                type: 'Push--warning',
                timeout: 3000
            });
            return;
        }

        if (payment.status_print >= 2) {
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
        if (payment.id === 'FACES') {
            sendpush({
                title: 'No disponible',
                message: 'No se puede anular un comprobante externo.',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        const paymentDate = new Date(payment.fecha);
        const currentDate = new Date();
        const hoursDifference = (currentDate - paymentDate) / (1000 * 60 * 60);

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
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/credit/reverse/${paymentToReverse.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                sendpush({
                    title: 'Comprobante anulado',
                    message: 'El comprobante se ha anulado correctamente.',
                    type: 'Push--successful',
                    timeout: 3000
                });
                window.location.reload();
            } else {
                throw new Error('Error al anular el comprobante');
            }
        } catch (error) {
            sendpush({
                title: 'Error',
                message: 'No se pudo anular el comprobante.',
                type: 'Push--danger',
                timeout: 5000
            });
        }
        loader.viewOn(false);
        setShowReverseModal(false);
        setPaymentToReverse(null);
    };

    const handleCancelReverse = () => {
        setShowReverseModal(false);
        setPaymentToReverse(null);
    };

    return (
        <>
            <div className="SectionPayments">
                <div className="SectionPayments__header">
                    <label>Nro.</label>
                    <label>Fecha pago</label>
                    <label>Tipo de pago</label>
                    <label>Monto</label>
                    <label>Estado</label>
                    <label>Acciones</label>
                </div>
                
                {
                    payments.map((payment, n) => (
                        <div key={n} className="SectionPayments__item">
                            <label>{payment.id}</label>
                            <label>{payment.fecha}</label>
                            <label>{payment.forma_pago}</label>
                            <label>{useFormatterNumber({ value: payment.valor_recibido, currency: 'USD' })}</label>
                            <label>{(payment.status === 'guardado') ? 'Guardado' : 'Revertido'}</label>
                            <label>
                                <Printer 
                                    onClick={() => handlePrintClick(payment)} 
                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                />
                                <Ban
                                    onClick={() => handleReverseClick(payment)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </label>
                        </div>
                    ))
                }
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
                        <p>¿Está seguro que desea anular el comprobante #{paymentToReverse.id}?</p>
                        
                        {credit.collection_state === 'CONVENIO DE PAGO' && (
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

            {showPDF && selectedPayment && (
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
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={handleClosePDF}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                cursor: 'pointer'
                            }}
                        >
                            Cerrar
                        </button>
                        
                        <PDFViewer 
                            width={'500px'} 
                            height={'500px'}
                        >
                            <PDF
                                nro_voucher={selectedPayment.id}
                                type_print={(selectedPayment.status==="guardado") ? "COPIA" : selectedPayment.status.toUpperCase()}
                                tipo_transaccion={selectedPayment.tipo_transaccion || 'total'}
                                forma_pago={selectedPayment.forma_pago}
                                insitucion_financiera={selectedPayment.institucion_financiera || ''}
                                codigo_deposito={selectedPayment.codigo_deposito || ''}
                                name={credit.name}
                                ci={credit.ci}
                                credito={credit.id}
                                
                                mora={selectedPayment.detalle ? JSON.parse(selectedPayment.detalle).mora : 0}
                                interes={selectedPayment.detalle ? JSON.parse(selectedPayment.detalle).interes : 0}
                                seguro_desgravamen={selectedPayment.detalle ? JSON.parse(selectedPayment.detalle).seguro_desgravamen : 0}
                                gastos_judiciales={selectedPayment.detalle ? JSON.parse(selectedPayment.detalle).gastos_judiciales : 0}
                                saldo_capital={selectedPayment.detalle ? JSON.parse(selectedPayment.detalle).saldo_capital : 0}
                                gastos_cobranza={selectedPayment.detalle ? JSON.parse(selectedPayment.detalle).gastos_cobranza : 0}
                                otros_valores={selectedPayment.detalle ? JSON.parse(selectedPayment.detalle).otros_valores : 0}
                                
                                valor_recibido={selectedPayment.valor_recibido}
                                valor_devuelto={selectedPayment.valor_devuelto || 0}
                                
                                fecha={selectedPayment.fecha}
                                agente={localStorage.getItem('name')?.substring(0,1) + localStorage.getItem('name')?.split(' ')[1] || 'N/A'}
                            />
                        </PDFViewer>
                    </div>
                </div>
            )}
        </>
    );
}