import { useState, useEffect } from "react";
import "./CardEditAgreement.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import { useStoreStructure } from "../../stores/useStoreStructure";
import { useStoreLoader } from "../../stores/useStoreLoader";
import sendpush from "../../helpers/sendpush";
import updateAgreement from "../../helpers/Credits/updateAgreement";

export default function CardEditAgreement(){
    const store_structure = useStoreStructure();
    const loader = useStoreLoader();
    const [fees, setFees] = useState([]);
    const [originalTotal, setOriginalTotal] = useState(0);

    useEffect(() => {
        if(store_structure.existing_fees?.length > 0) {
            // Cargar cuotas existentes
            const loadedFees = store_structure.existing_fees.map((fee, index) => ({
                id: index + 1,
                fecha_pago: fee.fecha_pago,
                valor: parseFloat(parseFloat(fee.valor).toFixed(2)),
                editable: true
            }));
            setFees(loadedFees);
        }
        setOriginalTotal(parseFloat(parseFloat(store_structure.total_amount).toFixed(2)));
    }, [store_structure]);

    const getCurrentTotal = () => {
        const total = fees.reduce((sum, fee) => sum + (parseFloat(fee.valor) || 0), 0);
        return parseFloat(total.toFixed(2));
    };

    const handleAddFee = () => {
        const newId = fees.length > 0 ? Math.max(...fees.map(f => f.id)) + 1 : 1;
        const lastDate = fees.length > 0 ? fees[fees.length - 1].fecha_pago : new Date().toISOString().split('T')[0];
        
        setFees([...fees, {
            id: newId,
            fecha_pago: lastDate,
            valor: 0.00,
            editable: true
        }]);
    };

    const handleRemoveFee = (id) => {
        if(fees.length <= 1) {
            sendpush({
                title: 'Error',
                message: 'Debe haber al menos una cuota',
                type: 'Push--danger',
                timeout: 3000
            });
            return;
        }
        setFees(fees.filter(fee => fee.id !== id));
    };

    const handleUpdateFee = (id, field, value) => {
        setFees(fees.map(fee => 
            fee.id === id ? { ...fee, [field]: value } : fee
        ));
    };

    const handleSave = async (e) => {
        e.target.setAttribute('disabled', true);
        e.target.textContent = "Guardando...";

        const currentTotal = getCurrentTotal();
        const difference = Math.abs(currentTotal - originalTotal);

        // Validar que la suma sea igual al total original (con tolerancia de 0.01 por redondeos)
        if(difference > 0.01) {
            sendpush({
                title: 'Error de validación',
                message: `El total de cuotas ($${currentTotal.toFixed(2)}) debe ser igual al monto original ($${originalTotal.toFixed(2)})`,
                type: 'Push--danger',
                timeout: 5000
            });
            e.target.textContent = "Guardar cambios";
            e.target.removeAttribute('disabled');
            return;
        }

        // Validar que todas las cuotas tengan fecha y valor válido
        const invalidFees = fees.filter(fee => !fee.fecha_pago || parseFloat(fee.valor) <= 0);
        if(invalidFees.length > 0) {
            sendpush({
                title: 'Error de validación',
                message: 'Todas las cuotas deben tener fecha y valor mayor a 0',
                type: 'Push--danger',
                timeout: 5000
            });
            e.target.textContent = "Guardar cambios";
            e.target.removeAttribute('disabled');
            return;
        }

        loader.viewOn(true);

        const fee_detail = fees.map(fee => ({
            payment_date: fee.fecha_pago,
            payment_value: 0,
            payment_amount: parseFloat(fee.valor),
            payment_status: "PENDIENTE"
        }));

        const data = {
            credit_id: parseInt(store_structure.credit_id),
            total_amount: originalTotal,
            fee_amount: parseFloat(fees[0].valor),
            fee_detail: fee_detail
        };

        try {
            const result = await updateAgreement(store_structure.agreement_id, data);
            loader.viewOn(false);

            if(result.code === 1) {
                sendpush({
                    title: 'Éxito',
                    message: 'Convenio de pago actualizado exitosamente',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                e.target.textContent = "Cambios guardados";
                
                setTimeout(() => {
                    store_structure.viewOn(false);
                }, 2000);
            } else {
                sendpush({
                    title: 'Error',
                    message: result.message || 'Error al actualizar convenio de pago',
                    type: 'Push--danger',
                    timeout: 5000
                });
                e.target.textContent = "Inténtalo de nuevo";
                e.target.removeAttribute('disabled');
            }
        } catch (error) {
            console.error('Error:', error);
            loader.viewOn(false);
            sendpush({
                title: 'Error',
                message: 'Error al actualizar convenio de pago',
                type: 'Push--danger',
                timeout: 5000
            });
            e.target.textContent = "Inténtalo de nuevo";
            e.target.removeAttribute('disabled');
        }
    };

    if(!store_structure.isViewOn) return <></>;

    const currentTotal = getCurrentTotal();
    const difference = currentTotal - originalTotal;
    const isValid = Math.abs(difference) <= 0.01;

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={() => store_structure.viewOn(false)}>
                Volver
            </button>
            <div className="CardEditAgreement">
                <h3>Editar convenio de pago</h3>
                
                <div className="CardEditAgreement__summary">
                    <div className="summary-row">
                        <span>Cliente:</span>
                        <span>{store_structure.name} - {store_structure.ci}</span>
                    </div>
                    <div className="summary-row">
                        <span>Total original:</span>
                        <span className="total-original">{useFormatterNumber({value: originalTotal, currency: 'USD'})}</span>
                    </div>
                    <div className="summary-row">
                        <span>Total actual:</span>
                        <span className={isValid ? 'total-valid' : 'total-invalid'}>
                            {useFormatterNumber({value: currentTotal, currency: 'USD'})}
                        </span>
                    </div>
                    {!isValid && (
                        <div className="summary-row error">
                            <span>Diferencia:</span>
                            <span>{difference > 0 ? '+' : ''}{useFormatterNumber({value: difference, currency: 'USD'})}</span>
                        </div>
                    )}
                </div>

                <div className="CardEditAgreement__table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nro.</th>
                                <th>Valor</th>
                                <th>Fecha pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.map((fee, index) => (
                                <tr key={fee.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={fee.valor}
                                            onChange={(e) => handleUpdateFee(fee.id, 'valor', e.target.value)}
                                            className="input-valor"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={fee.fecha_pago}
                                            onChange={(e) => handleUpdateFee(fee.id, 'fecha_pago', e.target.value)}
                                            className="input-fecha"
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className="btn-remove"
                                            onClick={() => handleRemoveFee(fee.id)}
                                            title="Eliminar cuota"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className="btn-add-fee" onClick={handleAddFee}>
                    + Agregar cuota
                </button>

                <div className="CardEditAgreement__actions">
                    <button
                        className={`btn-save ${!isValid ? 'btn-save--disabled' : ''}`}
                        onClick={handleSave}
                        disabled={!isValid}
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
