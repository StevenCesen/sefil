import { Ban, Printer } from "lucide-react";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./SectionPayments.css";
import sendpush from "../../../helpers/sendpush";
import { useState, useMemo } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PDF from "../../PDF";
import { useStoreLoader } from "../../../stores/useStoreLoader";

export default function SectionPayments({ payments, credit, view_complete_info = false }) {
    const [showPDF, setShowPDF] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showReverseModal, setShowReverseModal] = useState(false);
    const [paymentToReverse, setPaymentToReverse] = useState(null);
    const loader = useStoreLoader();

    const { headers, detailFields } = useMemo(() => {
        const baseHeaders = ['Comprobante', 'Fecha pago', 'Tipo de pago'];
        const endHeaders = ['Monto', 'Estado', 'Acciones'];
        const detailHeaders = view_complete_info 
            ? ['Capital', 'Interes', 'Mora', 'Seguro', 'Judicial', 'Cobranza', 'Otros valores']
            : [];
        
        return {
            headers: [...baseHeaders, ...detailHeaders, ...endHeaders],
            detailFields: view_complete_info 
                ? ['saldo_capital', 'interes', 'mora', 'seguro_desgravamen', 'gastos_judiciales', 'gastos_cobranza', 'otros_valores']
                : []
        };
    }, [view_complete_info]);

    const getDetailValue = (payment, field) => {
        try {
            return payment.detalle ? JSON.parse(payment.detalle)[field] || 0 : 0;
        } catch {
            return 0;
        }
    };

    const renderPaymentCells = (payment) => {
        const baseCells = [
            payment.id,
            payment.fecha,
            payment.forma_pago
        ];

        const detailCells = detailFields.map(field => 
            useFormatterNumber({ value: getDetailValue(payment, field), currency: 'USD' })
        );

        const endCells = [
            useFormatterNumber({ value: payment.valor_recibido, currency: 'USD' }),
            payment.status === 'guardado' ? 'Guardado' : 'Revertido'
        ];

        return [...baseCells, ...detailCells, ...endCells];
    };

    const handlePrintClick = (payment) => {
        if (payment.id === 'FACES' || payment.id === 'Gasto Cob.') {
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
        if (payment.id === 'FACES' || payment.id === 'Gasto Cob.') {
            sendpush({
                title: 'No disponible',
                message: 'No se puede anular un comprobante externo.',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        const hoursDifference = (new Date() - new Date(payment.fecha)) / (1000 * 60 * 60);
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

            const message = response.ok
                ? { title: 'Comprobante anulado', message: 'El comprobante se ha anulado correctamente.', type: 'Push--successful', timeout: 3000 }
                : { title: 'Error', message: 'No se pudo anular el comprobante.', type: 'Push--danger', timeout: 5000 };
            
            sendpush(message);
            if (response.ok) window.location.reload();
        } catch {
            sendpush({
                title: 'Error',
                message: 'No se pudo anular el comprobante.',
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
                
                {payments.map((payment, n) => {
                    const cells = renderPaymentCells(payment);
                    
                    return (
                        <div key={n} className="SectionPayments__item">
                            {cells.map((cell, index) => (
                                <label key={index}>{cell}</label>
                            ))}
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
                                
                                mora={getDetailValue(selectedPayment, 'mora')}
                                interes={getDetailValue(selectedPayment, 'interes')}
                                seguro_desgravamen={getDetailValue(selectedPayment, 'seguro_desgravamen')}
                                gastos_judiciales={getDetailValue(selectedPayment, 'gastos_judiciales')}
                                saldo_capital={getDetailValue(selectedPayment, 'saldo_capital')}
                                gastos_cobranza={getDetailValue(selectedPayment, 'gastos_cobranza')}
                                otros_valores={getDetailValue(selectedPayment, 'otros_valores')}
                                
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