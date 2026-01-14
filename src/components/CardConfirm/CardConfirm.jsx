import { useEffect, useState } from "react";
import "./CardConfirm.css";
import { useStoreLoader } from "../../stores/useStoreLoader";
import { useStoreBilling } from "../../stores/useStoreBilling";
import sendpush from "../../helpers/sendpush";

export default function CardConfirm({id,cartera,value,email,name,ci,direccion,telefono,setView}){
    const [dates,setDates]                  =   useState();
    const [cuentas_bancarias,setCuentas]    =   useState();
    const [metodos,setMetodos]              =   useState();
    const [formas,setFormas]                =   useState();
    const [isProcessing, setIsProcessing]   =   useState(false);
    const loader                            =   useStoreLoader();
    const store_billing                     =   useStoreBilling();

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_URL_BASE}/sofiaconfig`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const cuentas = data?.contribuyentes?.contrib?.[0]?.cuentasBancarias?.cuenta || [];
                const formas_pago = data?.formasPago?.formaPago || [];
                const metodos_pago=['ANTICIPO', 'CHEQUE', 'EFECTIVO', 'OTROS', 'TARJETA_CREDITO', 'TRANSFERENCIA', 'DEPOSITO'];
                setCuentas(cuentas);
                setFormas(formas_pago);
                setMetodos(metodos_pago);
                loader.viewOn(false);
            })
            .catch((error) => {
                console.error('Error loading sofiaconfig:', error);
                // Valores por defecto en caso de error
                setCuentas([]);
                setFormas([]);
                setMetodos(['ANTICIPO', 'CHEQUE', 'EFECTIVO', 'OTROS', 'TARJETA_CREDITO', 'TRANSFERENCIA', 'DEPOSITO']);
                loader.viewOn(false);
            });

        if(id){
            setDates({
                name:name,
                ci:ci,
                direccion:direccion,
                telefono:telefono,
                email:email,
                value:(value || 0).toFixed(2),
                id:id,
                cartera:cartera,
                formaPago:"",
                metodo:"",
                referencia:"",
                idBanco:""
            });
        }
    },[]);

    const handleProcessInvoice = async () => {
        if(isProcessing) return;

        // Validaciones
        if(dates.formaPago === ""){
            sendpush({
                title: 'Error',
                message: 'Ingrese una forma de pago',
                type: 'Push--warning',
                timeout: 3000
            });
            return;
        }

        if(dates.formaPago === 'EFECTIVO' && (dates.metodo === '' || dates.metodo !== 'EFECTIVO')){
            sendpush({
                title: 'Error',
                message: 'Forma de pago y método no corresponden',
                type: 'Push--warning',
                timeout: 3000
            });
            return;
        }

        if(dates.formaPago !== 'EFECTIVO' && (dates.metodo === '' || dates.metodo === 'EFECTIVO' || dates.referencia === '' || dates.idBanco === '')){
            sendpush({
                title: 'Error',
                message: 'Forma de pago y método no corresponden o falta información de banco',
                type: 'Push--warning',
                timeout: 3000
            });
            return;
        }

        setIsProcessing(true);
        loader.viewOn(true);

        try {
            // Preparar el body según el nuevo endpoint
            const requestBody = {
                credit_id: parseInt(dates.id),
                value: parseFloat(dates.value),
                payment_method: dates.metodo.toLowerCase(),
                financial_institution: dates.idBanco,
                payment_reference: dates.referencia,
                ci: dates.ci,
                name: dates.name,
                telefono: dates.telefono,
                email: dates.email,
                cartera: dates.cartera,
                formaPago: dates.formaPago
            };

            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/payments/process-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if(data.code === 1){
                sendpush({
                    title: 'Factura generada',
                    message: data.message || 'Factura procesada correctamente',
                    type: 'sucessful',
                    timeout: 3000
                });

                store_billing.setInfo({
                    ci: data.result?.ci,
                    name: data.result?.name,
                    direction: data.result?.direction,
                    access_key: data.result?.access_key,
                    date: data.result?.date,
                    value: data.result?.value,
                    subtotal_sin_iva: data.result?.subtotal_sin_iva,
                    valor_iva: data.result?.valor_iva,
                    total_con_iva: data.result?.total_con_iva
                });

                setView(false);
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'Error al procesar factura',
                    type: 'Push--warning',
                    timeout: 3000
                });
            }
        } catch (error) {
            console.error('Error processing invoice:', error);
            sendpush({
                title: 'Error',
                message: 'Error al procesar la factura, inténtalo de nuevo',
                type: 'Push--warning',
                timeout: 3000
            });
        } finally {
            setIsProcessing(false);
            loader.viewOn(false);
        }
    };

    if(!dates)              return <></>
    if(!cuentas_bancarias)  return <></>
    if(!formas)             return <></>
    if(!metodos)            return <></>

    return (
        <div className="CardConfirm__background">
            <button onClick={()=>{setView(false)}}>Volver</button>
            <div className="CardConfirm">
                <p>Gastos de cobranza</p>
                <label>
                    Total:
                    <input
                        type="number"
                        onChange={(e)=>{
                            setDates({
                                ...dates,
                                value:Number(e.target.value)
                            })
                        }}
                        min={0}
                        value={dates.value}
                    />
                </label>

                <label>
                    Email:
                    <input
                        type="text"
                        placeholder="Correo electrónico"
                        onChange={(e)=>{
                            setDates({
                                ...dates,
                                email:e.target.value
                            });
                        }}
                        value={dates.email}
                    />
                </label>

                <label>
                    Forma de pago:
                    <select
                        value={dates.formaPago}
                        onChange={(e)=>{
                            setDates({
                                ...dates,
                                formaPago:e.target.value
                            });
                        }}
                    >
                        <option value={""}>-- Seleccionar forma --</option>
                        <option value={"EFECTIVO"}>EFECTIVO</option>
                        <option value={"TARJETA_DEBITO"}>TARJETA DÉBITO</option>
                        <option value={"OTROS_FINANCIERO"}>OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
                    </select>
                </label>

                <label>
                    Métodos de pago:
                    <select
                        value={dates.metodo}
                        onChange={(e)=>{
                            setDates({
                                ...dates,
                                metodo:e.target.value
                            });
                        }}
                    >
                        <option value={""}>-- Seleccionar método --</option>
                        {
                            metodos.map((metodo, index)=>(
                                <option key={index} value={metodo}>{metodo}</option>
                            ))
                        }
                    </select>
                </label>

                {
                    (dates.metodo!=='EFECTIVO' && dates.metodo!=='')
                    ?
                        <div className="CardConfirm__cuentas">
                            <label>
                                Institución financiera:
                                <select
                                    value={dates.idBanco}
                                    onChange={(e)=>{
                                        setDates({
                                            ...dates,
                                            idBanco:e.target.value
                                        });
                                    }}
                                >
                                    <option value={""}>-- Seleccionar cuenta bancaria --</option>
                                    {
                                        cuentas_bancarias.map((cuenta, index)=>(
                                            <option key={index} value={cuenta.id}>{cuenta.nombre}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <label>
                                Referencia
                                <input
                                    type="text"
                                    value={dates.referencia}
                                    onChange={(e)=>{
                                        setDates({
                                            ...dates,
                                            referencia:e.target.value
                                        });
                                    }}
                                />
                            </label>

                        </div>
                    :   <></>
                }

                <div>
                    <button
                        onClick={handleProcessInvoice}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Procesando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
