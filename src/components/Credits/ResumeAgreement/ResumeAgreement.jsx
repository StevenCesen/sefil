import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./ResumeAgreement.css";
import { useState } from "react";
import { useStoreLoader } from "../../../stores/useStoreLoader";
import { useStoreStructure } from "../../../stores/useStoreStructure";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog";
import authorizeAgreement from "../../../helpers/Credits/authorizeAgreement";
import denyAgreement from "../../../helpers/Credits/denyAgreement";
import revertAgreement from "../../../helpers/Credits/revertAgreement";
import sendpush from "../../../helpers/sendpush";
import CardPay from "../../CardPay/CardPay";
import CardConfirm from "../../CardConfirm/CardConfirm";

export default function ResumeAgreement({agreement, onActionComplete}){
    const loader = useStoreLoader();
    const store_structure = useStoreStructure();
    const store_management = useStoreManagement();
    const [showDetails, setShowDetails] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showGastoCobranzaModal, setShowGastoCobranzaModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null
    });

    const userRole = localStorage.getItem('role');

    const business_id = store_management.credit?.business_id || agreement.credit?.business_id;
    const campain_id = store_management.campain_id;

    const handleEdit = () => {
        const credit = store_management.credit;
        const existingFees = agreement.fee_detail?.map(fee => ({
            fecha_pago: fee.payment_date,
            valor: parseFloat(fee.payment_amount),
            estado: fee.payment_status || 'PENDIENTE'
        })) || [];
        
        store_structure.viewOn(true);
        store_structure.setInfoCredit({
            ci: agreement.client_ci,
            name: agreement.client_name,
            total_amount: parseFloat(agreement.total_amount),
            cartera: credit.portfolio || '',
            credit_id: agreement.credit_id,
            gasto_cobranza: parseFloat(credit.management_collection_expenses || 0),
            agreement_id: agreement.id,
            view: 'edit',
            existing_fees: existingFees
        });
    };

    const handlePayFee = (fee, index) => {
        if (index > 0) {
            const previousFee = agreement.fee_detail[index - 1];
            if (previousFee && previousFee.payment_status !== 'PAGADO' && previousFee.payment_status !== 'PAGADA') {
                sendpush({
                    title: 'Error de pago',
                    message: 'Debe pagar la cuota anterior antes de continuar.',
                    type: 'Push--danger',
                    timeout: 3000
                });
                return;
            }
        }

        if (index === 0) {
            setShowGastoCobranzaModal(true);
        } else {
            const payData = {
                amount: parseFloat(fee.payment_amount),
                quoteNumber: index + 1,
                paymentDate: fee.payment_date
            };

            setPaymentData(payData);
            setShowPayModal(true);
        }
    };

    const handleAuthorize = async () => {
        setConfirmDialog({
            isOpen: true,
            title: '¿Autorizar convenio de pago?',
            message: '¿Está seguro que desea autorizar este convenio de pago?',
            action: async () => {
                loader.viewOn(true);
                setConfirmDialog({...confirmDialog, isOpen: false});
                try {
                    const result = await authorizeAgreement(agreement.id);
                    loader.viewOn(false);
                    if (result.code === 1) {
                        sendpush({
                            title: 'Éxito',
                            message: 'Convenio de pago autorizado exitosamente',
                            type: 'sucessful',
                            timeout: 3000
                        });
                        setTimeout(() => {
                            if (onActionComplete) onActionComplete();
                        }, 3000);
                    } else {
                        sendpush({
                            title: 'Error',
                            message: result.message || 'Error al autorizar convenio de pago',
                            type: 'Push--danger',
                            timeout: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    loader.viewOn(false);
                    sendpush({
                        title: 'Error',
                        message: 'Error al autorizar convenio de pago',
                        type: 'Push--danger',
                        timeout: 3000
                    });
                }
            }
        });
    };

    const handleDeny = async () => {
        setConfirmDialog({
            isOpen: true,
            title: '¿Denegar convenio de pago?',
            message: '¿Está seguro que desea denegar este convenio de pago?',
            action: async () => {
                loader.viewOn(true);
                setConfirmDialog({...confirmDialog, isOpen: false});
                try {
                    const result = await denyAgreement(agreement.id);
                    loader.viewOn(false);
                    if (result.code === 1) {
                        sendpush({
                            title: 'Éxito',
                            message: 'Convenio de pago denegado exitosamente',
                            type: 'sucessful',
                            timeout: 3000
                        });
                        setTimeout(() => {
                            if (onActionComplete) onActionComplete();
                        }, 3000);
                    } else {
                        sendpush({
                            title: 'Error',
                            message: result.message || 'Error al denegar convenio de pago',
                            type: 'Push--danger',
                            timeout: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    loader.viewOn(false);
                    sendpush({
                        title: 'Error',
                        message: 'Error al denegar convenio de pago',
                        type: 'Push--danger',
                        timeout: 3000
                    });
                }
            }
        });
    };

    const handleRevert = async () => {
        setConfirmDialog({
            isOpen: true,
            title: '¿Revertir convenio de pago?',
            message: '¿Está seguro que desea revertir este convenio de pago?',
            action: async () => {
                loader.viewOn(true);
                setConfirmDialog({...confirmDialog, isOpen: false});
                try {
                    const result = await revertAgreement(agreement.id);
                    loader.viewOn(false);
                    if (result.code === 1) {
                        sendpush({
                            title: 'Éxito',
                            message: 'Convenio de pago revertido exitosamente',
                            type: 'Push--sucessful',
                            timeout: 3000
                        });
                        setTimeout(() => {
                            if (onActionComplete) onActionComplete();
                        }, 3000);
                    } else {
                        sendpush({
                            title: 'Error',
                            message: result.message || 'Error al revertir convenio de pago',
                            type: 'Push--danger',
                            timeout: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    loader.viewOn(false);
                    sendpush({
                        title: 'Error',
                        message: 'Error al revertir convenio de pago',
                        type: 'Push--danger',
                        timeout: 3000
                    });
                }
            }
        });
    };

    return (
        <>
            <div className="ResumeAgreement">
            <div className="ResumeAgreement__header">
                <h4>Convenio de pago #{agreement.id}</h4>
                <span className={`status status--${agreement.status?.toLowerCase()}`}>
                    {agreement.status}
                </span>
            </div>
            <p>Solicitado por: {agreement.created_by}</p>
            <p>Cliente: {agreement.client_name} - {agreement.client_ci}</p>
            <p>Fecha: {agreement.created_at}</p>
            <span>DETALLE CONVENIO:</span>

            <div className="ResumeAgreement__detail">
                <p>Monto total: {useFormatterNumber({currency:'USD', value: parseFloat(agreement.total_amount)})}</p>
                <p>Monto por cuota: {useFormatterNumber({currency:'USD', value: parseFloat(agreement.fee_amount)})}</p>
                <p>Número de cuotas: {agreement.fee_detail?.length || 0}</p>
            </div>

            {agreement.fee_detail && agreement.fee_detail.length > 0 && (
                <button 
                    className="btn-show-details"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Ocultar cuotas' : 'Ver cuotas'}
                </button>
            )}

            {showDetails && agreement.fee_detail && (
                <div className="ResumeAgreement__fees">
                    <table>
                        <thead>
                            <tr>
                                <th>Nro.</th>
                                <th>Valor</th>
                                <th>Fecha pago</th>
                                <th>Estado</th>
                                {(userRole === 'admin' || userRole === 'superadmin') && <th>Acción</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {agreement.fee_detail.map((fee, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{useFormatterNumber({currency:'USD', value: parseFloat(fee.payment_amount)})}</td>
                                    <td>{fee.payment_date}</td>
                                    <td>
                                        <span>
                                            {fee.payment_status}
                                        </span>
                                    </td>
                                    {(userRole === 'admin' || userRole === 'superadmin') && (
                                        <td>
                                            {fee.payment_status === 'PENDIENTE' && (agreement.status === 'APLICADA' || agreement.status === 'AUTORIZADO') && (
                                                <button className="btn-pay" onClick={() => handlePayFee(fee, index)}>
                                                    Pago
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="ResumeAgreement__actions">
                {agreement.status === 'PENDIENTE' && (
                    <>
                        <button className="btn btn--success" onClick={handleAuthorize}>
                            Autorizar
                        </button>
                        <button className="btn btn--warning" onClick={handleEdit}>
                            Editar
                        </button>
                        <button className="btn btn--danger" onClick={handleDeny}>
                            Denegar
                        </button>
                    </>
                )}
                {(agreement.status === 'APLICADA' || agreement.status === 'AUTORIZADA' || agreement.status === 'AUTORIZADO') && (
                    <button className="btn btn--danger" onClick={handleRevert}>
                        Revertir
                    </button>
                )}
            </div>
            
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.action}
                onCancel={() => setConfirmDialog({...confirmDialog, isOpen: false})}
            />
        </div>

        {showPayModal && paymentData && (
            <CardPay
                setView={() => setShowPayModal(false)}
                cartera={business_id}
                campain_id={campain_id}
                credit={{
                    id: store_management.credit.id,
                    totalAmount: store_management.credit.total_amount,
                    saldo_capital: store_management.credit.capital,
                    interes: store_management.credit.interest,
                    mora: store_management.credit.mora,
                    seguro_desgravamen: store_management.credit.safe,
                    gastos_cobranza: store_management.credit.collection_expenses,
                    gastos_judiciales: store_management.credit.legal_expenses,
                    otros_valores: store_management.credit.other_values,
                    ci: store_management.credit.client_ci,
                    name: store_management.credit.client_name
                }}
                updateInfoValues={(newValues) => {
                    // Actualizar crédito y recargar actividad
                    if (onActionComplete) onActionComplete();
                    setShowPayModal(false);
                }}
                amount={paymentData.amount}
                quoteNumber={paymentData.quoteNumber}
                paymentDate={paymentData.paymentDate}
            />
        )}

        {showGastoCobranzaModal && (
            <CardConfirm
                id={store_management.credit.id}
                cartera={business_id}
                value={store_management.credit.management_collection_expenses || 0}
                email={''}
                name={store_management.credit.client_name}
                ci={store_management.credit.client_ci}
                direccion={''}
                telefono={''}
                setGastos={() => {}}
                setView={(value) => {
                    setShowGastoCobranzaModal(value);
                    // Actualizar crédito y recargar actividad
                    if (!value && onActionComplete) {
                        onActionComplete();
                    }
                }}
                setPDF={() => {}}
            />
        )}
        </>
    );
}
