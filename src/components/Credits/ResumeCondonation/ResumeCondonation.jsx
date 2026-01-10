import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./ResumeCondonation.css";
import { useStoreCondonation } from "../../../stores/useStoreCondonation";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import { useStoreLoader } from "../../../stores/useStoreLoader";
import { useState } from "react";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog";
import authorizeCondonation from "../../../helpers/Credits/authorizeCondonation";
import denyCondonation from "../../../helpers/Credits/denyCondonation";
import revertCondonation from "../../../helpers/Credits/revertCondonation";
import sendpush from "../../../helpers/sendpush";

export default function ResumeCondonation({condonation, onActionComplete}){
    const store_condonation = useStoreCondonation();
    const store_management = useStoreManagement();
    const loader = useStoreLoader();
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null
    });

    const handleEdit = () => {
        // Obtener valores actuales del crédito
        const credit = store_management.credit;
        const managementExpenses = credit.management_collection_expenses || 0;
        
        // En el store: los campos principales son los valores ACTUALES del crédito
        // Los inputs mostrarán cuánto se condonó (que ya está guardado en condonation)
        store_condonation.setInfoCredit({
            ci: condonation.client_ci,
            name: condonation.client_name,
            total: parseFloat(credit.total_amount - managementExpenses),
            // Valores ACTUALES del crédito (se muestran en columna "Valor actual")
            capital: parseFloat(credit.capital),
            interes: parseFloat(credit.interest),
            mora: parseFloat(credit.mora),
            seguro_desgravamen: parseFloat(credit.safe),
            gastos_judiciales: parseFloat(credit.legal_expenses),
            gastos_cobranza: parseFloat(credit.collection_expenses),
            gastos_cobranza_sefil: parseFloat(credit.management_collection_expenses),
            otros_valores: parseFloat(credit.other_values),
            id: condonation.credit_id,
            cartera: '',
            setData: '',
            view: 'edit',
            update: condonation.id,
            // Valores CONDONADOS previamente (se pre-llenan en los inputs)
            condonated_capital: parseFloat(condonation.capital || 0),
            condonated_interes: parseFloat(condonation.interest || 0),
            condonated_mora: parseFloat(condonation.mora || 0),
            condonated_seguro_desgravamen: parseFloat(condonation.safe || 0),
            condonated_gastos_judiciales: parseFloat(condonation.legal_expenses || 0),
            condonated_gastos_cobranza: parseFloat(condonation.collection_expenses || 0),
            condonated_otros_valores: parseFloat(condonation.other_values || 0)
        });
    };

    const handleAuthorize = async () => {
        setConfirmDialog({
            isOpen: true,
            title: '¿Autorizar condonación?',
            message: '¿Está seguro que desea autorizar esta condonación?',
            action: async () => {
                loader.viewOn(true);
                setConfirmDialog({...confirmDialog, isOpen: false});
                try {
                    const result = await authorizeCondonation(condonation.id);
                    loader.viewOn(false);
                    if (result.code === 1) {
                        sendpush({
                            title: 'Éxito',
                            message: 'Condonación autorizada exitosamente',
                            type: 'sucessful',
                            timeout: 3000
                        });
                        setTimeout(() => {
                            if (onActionComplete) onActionComplete();
                        }, 3000);
                    } else {
                        sendpush({
                            title: 'Error',
                            message: result.message || 'Error al autorizar condonación',
                            type: 'Push--warning',
                            timeout: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    loader.viewOn(false);
                    sendpush({
                        title: 'Error',
                        message: 'Error al autorizar condonación',
                        type: 'Push--warning',
                        timeout: 3000
                    });
                }
            }
        });
    };

    const handleDeny = async () => {
        setConfirmDialog({
            isOpen: true,
            title: '¿Denegar condonación?',
            message: '¿Está seguro que desea denegar esta condonación?',
            action: async () => {
                loader.viewOn(true);
                setConfirmDialog({...confirmDialog, isOpen: false});
                try {
                    const result = await denyCondonation(condonation.id);
                    loader.viewOn(false);
                    if (result.code === 1) {
                        sendpush({
                            title: 'Éxito',
                            message: 'Condonación denegada exitosamente',
                            type: 'Push--sucessful',
                            timeout: 3000
                        });
                        setTimeout(() => {
                            if (onActionComplete) onActionComplete();
                        }, 3000);
                    } else {
                        sendpush({
                            title: 'Error',
                            message: result.message || 'Error al denegar condonación',
                            type: 'Push--warning',
                            timeout: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    loader.viewOn(false);
                    sendpush({
                        title: 'Error',
                        message: 'Error al denegar condonación',
                        type: 'Push--warning',
                        timeout: 3000
                    });
                }
            }
        });
    };

    const handleRevert = async () => {
        setConfirmDialog({
            isOpen: true,
            title: '¿Revertir condonación?',
            message: '¿Está seguro que desea revertir esta condonación?',
            action: async () => {
                loader.viewOn(true);
                setConfirmDialog({...confirmDialog, isOpen: false});
                try {
                    const result = await revertCondonation(condonation.id);
                    loader.viewOn(false);
                    if (result.code === 1) {
                        sendpush({
                            title: 'Éxito',
                            message: 'Condonación revertida exitosamente',
                            type: 'Push--sucessful',
                            timeout: 3000
                        });
                        setTimeout(() => {
                            if (onActionComplete) onActionComplete();
                        }, 3000);
                    } else {
                        sendpush({
                            title: 'Error',
                            message: result.message || 'Error al revertir condonación',
                            type: 'Push--warning',
                            timeout: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    loader.viewOn(false);
                    sendpush({
                        title: 'Error',
                        message: 'Error al revertir condonación',
                        type: 'Push--warning',
                        timeout: 3000
                    });
                }
            }
        });
    };

    return (
        <div className="ResumeCondonation">
            <div className="ResumeCondonation__header">
                <h4>Condonación #{condonation.id}</h4>
                <span className={`status status--${condonation.status.toLowerCase()}`}>
                    {condonation.status}
                </span>
            </div>
            <p>Solicitado por: {condonation.created_by}</p>
            <p>Cliente: {condonation.client_name} - {condonation.client_ci}</p>
            <p>Fecha: {condonation.created_at}</p>
            <span>DETALLE CONDONADO:</span>

            <div className="ResumeCondonation__detail">
                <p>Capital: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.capital)})}</p>
                <p>Interés: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.interest)})}</p>
                <p>Mora: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.mora)})}</p>
                <p>Seguro desgravamen: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.safe)})}</p>
                <p>Gastos judiciales: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.legal_expenses)})}</p>
                <p>Gastos de cobranza: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.collection_expenses)})}</p>
                <p>Gastos gestión: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.management_collection_expenses)})}</p>
                <p>Otros valores: {useFormatterNumber({currency:'USD', value: parseFloat(condonation.other_values)})}</p>
            </div>
            <span className="ResumeCondonation__total">
                TOTAL CONDONADO: {useFormatterNumber({ currency:'USD', value: parseFloat(condonation.amount)})}
            </span>

            <div className="ResumeCondonation__actions">
                {condonation.status === 'PENDIENTE' && (
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
                {condonation.status === 'AUTORIZADA' && (
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
    );
}