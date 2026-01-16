import { PDFViewer } from "@react-pdf/renderer";
import PDF from "../PDF";

export default function PaymentVoucherModal({
    isOpen,
    onClose,
    payment,
    creditInfo,
    reprint = false
}) {
    if (!isOpen || !payment) return null;

    const getDetailValue = (payment, field) => {
        return payment[field] || 0;
    };

    const creditName = creditInfo?.name || payment?.client_name || "N/A";
    const creditCI = creditInfo?.ci || payment?.client_ci || "N/A";
    const creditCode = creditInfo?.sync || creditInfo?.codigo || payment?.sync_id || "N/A";

    const agentName = localStorage.getItem('name') || 'N/A';
    const agentInitials = agentName !== 'N/A'
        ? agentName.substring(0, 1) + (agentName.split(' ')[1]?.substring(0, 1) || '')
        : 'N/A';

    const printType = (reprint && payment.status !== 'revertido') ? 'COPIA' : payment.status.toUpperCase();
    const paymentMethod = (payment.payment_method || payment.payment_type || payment.forma_pago || 'efectivo').toLowerCase();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        zIndex: 1001
                    }}
                >
                    Cerrar
                </button>

                <PDFViewer
                    width={'500px'}
                    height={'500px'}
                >
                    <PDF
                        nro_voucher={payment.payment_number || payment.nro_voucher || payment.voucher_number || payment.id || ''}
                        type_print={printType}
                        tipo_transaccion={payment.payment_way || payment.tipo_transaccion || 'total'}
                        forma_pago={paymentMethod}
                        insitucion_financiera={payment.financial_institution || payment.institucion_financiera || ''}
                        codigo_deposito={payment.payment_reference || ''}
                        name={creditName}
                        ci={creditCI}
                        credito={creditCode}

                        mora={payment.mora || 0}
                        interes={payment.interes || payment.interest || 0}
                        seguro_desgravamen={payment.seguro_desgravamen || payment.safe || 0}
                        gastos_judiciales={payment.gastos_judiciales || payment.legal_expenses || 0}
                        saldo_capital={payment.saldo_capital || payment.capital || 0}
                        gastos_cobranza={payment.gastos_cobranza || payment.collection_expenses || 0}
                        otros_valores={payment.otros_valores || payment.other_values || 0}

                        valor_recibido={payment.valor_recibido || payment.payment_value || 0}
                        valor_devuelto={payment.valor_devuelto || payment.payment_difference || 0}

                        fecha={payment.fecha || payment.payment_date || new Date().toLocaleDateString()}
                        agente={agentInitials}
                    />
                </PDFViewer>
            </div>
        </div>
    );
}
