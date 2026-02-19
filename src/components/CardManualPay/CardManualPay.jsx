import { useEffect, useState } from "react";
import "./CardManualPay.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import sendpush from "../../helpers/sendpush";

export default function CardManualPay({callback,pays,cartera,setUpdate}){

    const [pagos,setPays]=useState();
    const [isEditing,setIsEditing]=useState(false);
    const [editValues,setEditValues]=useState(null);
    const [editError,setEditError]=useState('');

    const toNum=(v)=>parseFloat(v)||0;

    const getTotalPagado=(p)=>{
        return parseFloat((
            toNum(p.saldo_capital_actual)
          + toNum(p.interes_actual)
          + toNum(p.mora_actual)
          + toNum(p.seguro_actual)
          + toNum(p.otros_valores_actual)
        ).toFixed(2));
    };

    const getEditSum=(vals)=>{
        return parseFloat((
            toNum(vals.saldo_capital_actual)
          + toNum(vals.interes_actual)
          + toNum(vals.mora_actual)
          + toNum(vals.seguro_actual)
          + toNum(vals.otros_valores_actual)
        ).toFixed(2));
    };

    const startEditing=()=>{
        setEditValues({
            saldo_capital_actual: pagos.saldo_capital_actual,
            interes_actual:       pagos.interes_actual,
            mora_actual:          pagos.mora_actual,
            seguro_actual:        pagos.seguro_actual,
            otros_valores_actual: pagos.otros_valores_actual,
        });
        setEditError('');
        setIsEditing(true);
    };

    const cancelEditing=()=>{
        setEditValues(null);
        setEditError('');
        setIsEditing(false);
    };

    const handleEditChange=(field,value)=>{
        const updated={...editValues,[field]:value};
        const total=getTotalPagado(pagos);
        const newSum=getEditSum({
            saldo_capital_actual: toNum(updated.saldo_capital_actual),
            interes_actual:       toNum(updated.interes_actual),
            mora_actual:          toNum(updated.mora_actual),
            seguro_actual:        toNum(updated.seguro_actual),
            otros_valores_actual: toNum(updated.otros_valores_actual),
        });
        setEditError(newSum > total
            ? `La suma ($${newSum.toFixed(2)}) supera el total pagado ($${total.toFixed(2)})`
            : ''
        );
        setEditValues(updated);
    };

    const getApiErrorMessage=(data)=>{
        if(!data.result) return data.message||'Error al guardar los rubros';
        if(data.result.rubros && data.result.rubros.length > 0) return data.result.rubros[0];
        const firstKey=Object.keys(data.result)[0];
        if(firstKey && Array.isArray(data.result[firstKey])) return data.result[firstKey][0];
        return data.message||'Error al guardar los rubros';
    };

    const saveEditing=(e)=>{
        e.target.textContent='Guardando...';
        e.target.disabled=true;

        fetch(`${import.meta.env.VITE_URL_BASE}/payments/${pagos.id}`,{
            method:'PUT',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                capital:                        toNum(editValues.saldo_capital_actual),
                interest:                       toNum(editValues.interes_actual),
                mora:                           toNum(editValues.mora_actual),
                safe:                           toNum(editValues.seguro_actual),
                management_collection_expenses: toNum(pagos.gastos_gestion_actual),
                collection_expenses:            toNum(pagos.gastos_cobranza_actual),
                legal_expenses:                 toNum(pagos.gastos_legales_actual),
                other_values:                   toNum(editValues.otros_valores_actual),
            })
        })
            .then((response)=>response.json())
            .then((data)=>{
                if(data.code===1){
                    setPays({
                        ...pagos,
                        saldo_capital_actual: toNum(editValues.saldo_capital_actual),
                        interes_actual:       toNum(editValues.interes_actual),
                        mora_actual:          toNum(editValues.mora_actual),
                        seguro_actual:        toNum(editValues.seguro_actual),
                        otros_valores_actual: toNum(editValues.otros_valores_actual),
                    });
                    sendpush({title:'Éxito',message:data.message||'Rubros actualizados correctamente',type:'Push--sucessful',timeout:3000});
                    setIsEditing(false);
                    setEditValues(null);
                    setEditError('');
                } else {
                    setEditError(getApiErrorMessage(data));
                    e.target.textContent='Guardar edición';
                    e.target.disabled=false;
                }
            })
            .catch(()=>{
                setEditError('Error de conexión al guardar');
                e.target.textContent='Guardar edición';
                e.target.disabled=false;
            });
    };

    const buildPayState=(payment,currentRubros,paymentRubros)=>({
        ...payment,
        name:                   payment.client_name,
        ci:                     payment.client_ci,
        credito:                payment.credit_id,
        estado:                 currentRubros?.collection_state || payment.management_prev || 'VENCIDO',
        paymentDay_actual:      payment.payment_date,
        saldo_capital_actual:   payment.capital,
        interes_actual:         payment.interest,
        mora_actual:            payment.mora,
        seguro_actual:          payment.safe,
        gastos_gestion_actual:  payment.management_collection_expenses || 0,
        gastos_cobranza_actual: payment.collection_expenses || 0,
        gastos_legales_actual:  payment.legal_expenses || 0,
        otros_valores_actual:   payment.other_values,
        saldo_capital_previo:   currentRubros?.capital || 0,
        interes_previo:         currentRubros?.interest || 0,
        mora_previo:            currentRubros?.mora || 0,
        seguro_previo:          currentRubros?.safe || 0,
        otros_valores_previo:   currentRubros?.other_values || 0,
        payment_rubros_to_subtract: paymentRubros
    });

    useEffect(()=>{
        if(pays.data && pays.data[0] && pays.data[0].credit_current_rubros){
            const payment=pays.data[0];
            setPays(buildPayState(payment,payment.credit_current_rubros,payment.payment_rubros_to_subtract));
        } else if(pays.data && pays.data[0] && pays.data[0].id){
            fetch(`${import.meta.env.VITE_URL_BASE}/payments/${pays.data[0].id}`,{
                headers:{
                    Accept:'application/json',
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response)=>response.json())
                .then((data)=>{
                    if(data && data.result && data.result.payment){
                        setPays(buildPayState(data.result.payment,data.result.credit_current_rubros,data.result.payment_rubros_to_subtract));
                    } else {
                        setPays(pays.data[0]);
                    }
                })
                .catch(()=>{ setPays(pays.data[0]); });
        } else {
            if(pays && pays.result && pays.result[0]) {
                setPays(pays.result[0]);
            }
        }
    },[]);

    if(!pagos) return <div className="CardManualPay">
        <div className="CardManualPay__content">
            <button className="CardManualPay__close" onClick={()=>{ callback(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
            <p>Cargando información del pago...</p>
        </div>
    </div>

    const editSumOk = isEditing && getEditSum({
        saldo_capital_actual: toNum(editValues.saldo_capital_actual),
        interes_actual:       toNum(editValues.interes_actual),
        mora_actual:          toNum(editValues.mora_actual),
        seguro_actual:        toNum(editValues.seguro_actual),
        otros_valores_actual: toNum(editValues.otros_valores_actual),
    }) === getTotalPagado(pagos);

    return (
        <div className="CardManualPay">
            <div className="CardManualPay__content">
                <button className="CardManualPay__close" onClick={()=>{ callback(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                </button>
                <div className="CardManualPay__data">
                    <div className="CardManualPay__head">
                        <p><strong>TITULAR:</strong> {pagos.name}</p>
                        <p><strong>CÉDULA:</strong> {pagos.ci}</p>
                        <p><strong>CRÉDITO:</strong> {pagos.credito}</p>
                        <p>
                            <strong>ESTADO:</strong>
                            <select
                                value={pagos.estado}
                                onChange={(e)=>{ setPays({...pagos,estado:e.target.value}); }}
                            >
                                <option value={"Vencido"}>Vencido</option>
                                <option value={"Castigado"}>Castigado</option>
                                <option value={"Judicial"}>Judicial</option>
                                <option value={"Prejudicial"}>Prejudicial</option>
                                <option value={"Cancelado"}>Cancelado</option>
                            </select>
                        </p>
                        <p><strong>FECHA DE PAGO:</strong>{pagos.paymentDay_actual ? pagos.paymentDay_actual.split(' ')[0] : 'N/A'}</p>
                    </div>

                    {isEditing && (
                        <div className="CardManualPay__edit-info">
                            <span>Total pagado: <strong>${getTotalPagado(pagos).toFixed(2)}</strong></span>
                            <span style={{marginLeft:16}}>
                                Suma actual:{' '}
                                <strong style={{color: editSumOk ? 'green' : 'orange'}}>
                                    ${getEditSum({
                                        saldo_capital_actual: toNum(editValues.saldo_capital_actual),
                                        interes_actual:       toNum(editValues.interes_actual),
                                        mora_actual:          toNum(editValues.mora_actual),
                                        seguro_actual:        toNum(editValues.seguro_actual),
                                        otros_valores_actual: toNum(editValues.otros_valores_actual),
                                    }).toFixed(2)}
                                </strong>
                            </span>
                            {editError && <p className="CardManualPay__edit-error">{editError}</p>}
                        </div>
                    )}

                    <div className="CardManualPay__cards">

                        <div className="CardManualPay__card">
                            <div>
                                <p>Saldo capital pagado</p>
                                {isEditing
                                    ? <input className="CardManualPay__edit-input" type="number" step="0.01" min="0"
                                        value={editValues.saldo_capital_actual}
                                        onChange={(e)=>handleEditChange('saldo_capital_actual',e.target.value)}/>
                                    : <p>{useFormatterNumber({value:pagos.saldo_capital_actual,currency:'USD'})}</p>
                                }
                            </div>
                            <div>
                                <p>Saldo capital adeudado</p>
                                <p>{useFormatterNumber({value:pagos.saldo_capital_previo,currency:'USD'})}</p>
                            </div>
                        </div>

                        <div className="CardManualPay__card">
                            <div>
                                <p>Intéres pagado</p>
                                {isEditing
                                    ? <input className="CardManualPay__edit-input" type="number" step="0.01" min="0"
                                        value={editValues.interes_actual}
                                        onChange={(e)=>handleEditChange('interes_actual',e.target.value)}/>
                                    : <p>{useFormatterNumber({value:pagos.interes_actual,currency:'USD'})}</p>
                                }
                            </div>
                            <div>
                                <p>Intéres adeudado</p>
                                <p>{useFormatterNumber({value:pagos.interes_previo,currency:'USD'})}</p>
                            </div>
                        </div>

                        <div className="CardManualPay__card">
                            <div>
                                <p>Mora pagado</p>
                                {isEditing
                                    ? <input className="CardManualPay__edit-input" type="number" step="0.01" min="0"
                                        value={editValues.mora_actual}
                                        onChange={(e)=>handleEditChange('mora_actual',e.target.value)}/>
                                    : <p>{useFormatterNumber({value:pagos.mora_actual,currency:'USD'})}</p>
                                }
                            </div>
                            <div>
                                <p>Mora adeudada</p>
                                <p>{useFormatterNumber({value:pagos.mora_previo,currency:'USD'})}</p>
                            </div>
                        </div>

                        <div className="CardManualPay__card">
                            <div>
                                <p>Seguro pagado</p>
                                {isEditing
                                    ? <input className="CardManualPay__edit-input" type="number" step="0.01" min="0"
                                        value={editValues.seguro_actual}
                                        onChange={(e)=>handleEditChange('seguro_actual',e.target.value)}/>
                                    : <p>{useFormatterNumber({value:pagos.seguro_actual,currency:'USD'})}</p>
                                }
                            </div>
                            <div>
                                <p>Seguro adeudado</p>
                                <p>{useFormatterNumber({value:pagos.seguro_previo,currency:'USD'})}</p>
                            </div>
                        </div>

                        <div className="CardManualPay__card">
                            <div>
                                <p>Otros valores pagado</p>
                                {isEditing
                                    ? <input className="CardManualPay__edit-input" type="number" step="0.01" min="0"
                                        value={editValues.otros_valores_actual}
                                        onChange={(e)=>handleEditChange('otros_valores_actual',e.target.value)}/>
                                    : <p>{useFormatterNumber({value:pagos.otros_valores_actual,currency:'USD'})}</p>
                                }
                            </div>
                            <div>
                                <p>Otros valores adeudado</p>
                                <p>{useFormatterNumber({value:pagos.otros_valores_previo,currency:'USD'})}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="CardManualPay__footer">

                    {!isEditing && (pays.prev_page_url!==null) &&
                        <button style={{marginRight:10,border:'1px solid',color:'var(--color-1)',backgroundColor:"inherit"}}
                            onClick={(e)=>{
                                e.target.textContent="Cargando...";
                                fetch(`${pays.prev_page_url}&cartera=${cartera}`,{headers:{Accept:'application/json'}})
                                    .then((r)=>r.json())
                                    .then((data)=>{
                                        e.target.textContent="Anterior";
                                        setUpdate(data);
                                        setPays(data.data[0]);
                                    });
                            }}
                        >Anterior</button>
                    }

                    {!isEditing && (pays.next_page_url!==null) &&
                        <button style={{marginRight:10,border:'1px solid',color:'var(--color-1)',backgroundColor:"inherit"}}
                            onClick={(e)=>{
                                e.target.textContent="Cargando...";
                                fetch(`${pays.next_page_url}&cartera=${cartera}`,{headers:{Accept:'application/json'}})
                                    .then((r)=>r.json())
                                    .then((data)=>{
                                        e.target.textContent="Siguiente";
                                        setUpdate(data);
                                        setPays(data.data[0]);
                                    });
                            }}
                        >Siguiente</button>
                    }

                    {!isEditing && (
                        <button className="CardManualPay__btn-edit" onClick={startEditing}>Editar</button>
                    )}

                    {isEditing && (
                        <>
                            <button className="CardManualPay__btn-cancel" onClick={cancelEditing}>Cancelar</button>
                            <button
                                className="CardManualPay__btn-save-edit"
                                onClick={saveEditing}
                                disabled={!editSumOk}
                            >Guardar edición</button>
                        </>
                    )}

                    {!isEditing && (
                        <button
                            onClick={(e)=>{
                                e.target.textContent="Aplicando...";
                                e.target.disabled=true;

                                fetch(`${import.meta.env.VITE_URL_BASE}/payments/apply/${pagos.id}`,{
                                    method:'POST',
                                    headers:{
                                        Accept:'application/json',
                                        'Content-Type':'application/json',
                                        Authorization:`Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response)=>response.json())
                                    .then((data)=>{
                                        if(data.code===1){
                                            e.target.textContent="Aplicado correctamente";
                                            sendpush({
                                                title:'Éxito',
                                                message:data.message||'Pago aplicado correctamente al crédito',
                                                type:'Push--sucessful',
                                                timeout:3000
                                            });

                                            fetch(`${import.meta.env.VITE_URL_BASE}/payments?payment_status=ERROR_SUM&business_id=${pagos.business_id}`,{
                                                headers:{
                                                    Accept:'application/json',
                                                    Authorization:`Bearer ${localStorage.getItem('token')}`
                                                }
                                            })
                                                .then((r)=>r.json())
                                                .then((data)=>{
                                                    if(data && data.result){
                                                        setUpdate({result:data.result,data:data.result,total:data.result.length});

                                                        if(data.result.length > 0){
                                                            fetch(`${import.meta.env.VITE_URL_BASE}/payments/${data.result[0].id}`,{
                                                                headers:{
                                                                    Accept:'application/json',
                                                                    Authorization:`Bearer ${localStorage.getItem('token')}`
                                                                }
                                                            })
                                                                .then((r)=>r.json())
                                                                .then((nextData)=>{
                                                                    if(nextData && nextData.result && nextData.result.payment){
                                                                        setPays(buildPayState(nextData.result.payment,nextData.result.credit_current_rubros,nextData.result.payment_rubros_to_subtract));
                                                                        e.target.textContent="Guardar con diferencia";
                                                                        e.target.disabled=false;
                                                                    }
                                                                });
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                });
                                        } else {
                                            e.target.textContent="Error - Reintentar";
                                            e.target.disabled=false;
                                        }
                                    })
                                    .catch(()=>{
                                        e.target.textContent="Error - Reintentar";
                                        e.target.disabled=false;
                                    });
                            }}
                        >Guardar con diferencia</button>
                    )}
                </div>
            </div>
        </div>
    );

}
