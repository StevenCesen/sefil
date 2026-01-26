import { useEffect, useState } from "react";
import "./CardManualPay.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import sendpush from "../../helpers/sendpush";

export default function CardManualPay({callback,pays,cartera,setUpdate}){

    const [pagos,setPays]=useState();
    
    useEffect(()=>{
        if(pays.data && pays.data[0] && pays.data[0].credit_current_rubros){
            const payment = pays.data[0];
            const currentRubros = payment.credit_current_rubros;
            const paymentRubros = payment.payment_rubros_to_subtract;
            
            setPays({
                ...payment,
                name: payment.client_name,
                ci: payment.client_ci,
                credito: payment.credit_id,
                estado: currentRubros?.collection_state || payment.management_prev || 'VENCIDO',
                paymentDay_actual: payment.payment_date,
                saldo_capital_actual: payment.capital,
                interes_actual: payment.interest,
                mora_actual: payment.mora,
                seguro_actual: payment.safe,
                otros_valores_actual: payment.other_values,
                saldo_capital_previo: currentRubros?.capital || 0,
                interes_previo: currentRubros?.interest || 0,
                mora_previo: currentRubros?.mora || 0,
                seguro_previo: currentRubros?.safe || 0,
                otros_valores_previo: currentRubros?.other_values || 0,
                payment_rubros_to_subtract: paymentRubros
            });
        } else if(pays.data && pays.data[0] && pays.data[0].id){
            fetch(`${import.meta.env.VITE_URL_BASE}/payments/${pays.data[0].id}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    if(data && data.result && data.result.payment){
                        const payment = data.result.payment;
                        const currentRubros = data.result.credit_current_rubros;
                        const paymentRubros = data.result.payment_rubros_to_subtract;
                        
                        setPays({
                            ...payment,
                            name: payment.client_name,
                            ci: payment.client_ci,
                            credito: payment.credit_id,
                            estado: currentRubros?.collection_state || payment.management_prev || 'VENCIDO',
                            paymentDay_actual: payment.payment_date,
                            saldo_capital_actual: payment.capital,
                            interes_actual: payment.interest,
                            mora_actual: payment.mora,
                            seguro_actual: payment.safe,
                            otros_valores_actual: payment.other_values,
                            saldo_capital_previo: currentRubros?.capital || 0,
                            interes_previo: currentRubros?.interest || 0,
                            mora_previo: currentRubros?.mora || 0,
                            seguro_previo: currentRubros?.safe || 0,
                            otros_valores_previo: currentRubros?.other_values || 0,
                            payment_rubros_to_subtract: paymentRubros
                        });
                    } else {
                        setPays(pays.data[0]);
                    }
                })
                .catch((error) => {
                    setPays(pays.data[0]);
                });
        } else {
            if(pays && pays.result && pays.result[0]) {
                setPays(pays.result[0]);
            }
        }
    },[]);

    if(!pagos) return <div className="CardManualPay">
        <div className="CardManualPay__content">
            <button className="CardManualPay__close" onClick={()=>{
                callback()
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
            <p>Cargando información del pago...</p>
        </div>
    </div>

    return (
        <div className="CardManualPay">
            <div className="CardManualPay__content">
                <button className="CardManualPay__close" onClick={()=>{
                    callback()
                }}>
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
                                onChange={(e)=>{
                                    setPays({
                                        ...pagos,
                                        estado:e.target.value
                                    });
                                }}
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
                    
                    <div className="CardManualPay__cards">
                        <div className="CardManualPay__card">
                            <div>
                                <p>Saldo capital pagado</p>
                                <p>{useFormatterNumber({value:pagos.saldo_capital_actual,currency:'USD'})}</p>
                            </div>
                            <div>
                                <p>Saldo capital adeudado</p>
                                <p>{useFormatterNumber({value:pagos.saldo_capital_previo,currency:'USD'})}</p>
                            </div>
                        </div>
                        <div className="CardManualPay__card">
                            <div>
                                <p>Intéres pagado</p>
                                <p>{useFormatterNumber({value:pagos.interes_actual,currency:'USD'})}</p>
                            </div>
                            <div>
                                <p>Intéres adeudado</p>
                                <p>{useFormatterNumber({value:pagos.interes_previo,currency:'USD'})}</p>
                            </div>
                        </div>
                        <div className="CardManualPay__card">
                            <div>
                                <p>Mora pagado</p>
                                <p>{useFormatterNumber({value:pagos.mora_actual,currency:'USD'})}</p>
                            </div>
                            <div>
                                <p>Mora adeudada</p>
                                <p>{useFormatterNumber({value:pagos.mora_previo,currency:'USD'})}</p>
                            </div>
                        </div>
                        <div className="CardManualPay__card">
                            <div>
                                <p>Seguro pagado</p>
                                <p>{useFormatterNumber({value:pagos.seguro_actual,currency:'USD'})}</p>
                            </div>
                            <div>
                                <p>Seguro adeudado</p>
                                <p>{useFormatterNumber({value:pagos.seguro_previo,currency:'USD'})}</p>
                            </div>
                        </div>
                        <div className="CardManualPay__card">
                            <div>
                                <p>Otros valores pagado</p>
                                <p>{useFormatterNumber({value:pagos.otros_valores_actual,currency:'USD'})}</p>
                            </div>
                            <div>
                                <p>Otros valores adeudado</p>
                                <p>{useFormatterNumber({value:pagos.otros_valores_previo,currency:'USD'})}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="CardManualPay__footer">
                    
                    {
                        (pays.prev_page_url!==null) &&
                            <button style={{marginRight:10,border:'1px solid',color:'var(--color-1)',backgroundColor:"inherit"}}
                                onClick={(e)=>{
                                    e.target.textContent="Cargando...";

                                    fetch(`${(pays.prev_page_url)}&cartera=${cartera}`,{
                                        headers: {
                                            Accept: 'application/json',
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            e.target.textContent="Anterior";
                                            setUpdate(data);
                                            setPays(data.data[0]);
                                        });
                                }}
                            >Anterior</button>
                    }

                    {
                        (pays.next_page_url!==null) &&
                            <button style={{marginRight:10,border:'1px solid',color:'var(--color-1)',backgroundColor:"inherit"}}
                                onClick={(e)=>{
                                    e.target.textContent="Cargando...";

                                    fetch(`${(pays.next_page_url)}&cartera=${cartera}`,{
                                        headers: {
                                            Accept: 'application/json',
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            e.target.textContent="Siguiente";
                                            
                                            setUpdate(data)
                                            setPays(data.data[0])

                                        });
                                }}
                            >Siguiente</button>
                    }

                    <button
                        onClick={(e)=>{
                            e.target.textContent="Aplicando...";
                            e.target.disabled = true;

                            fetch(`${import.meta.env.VITE_URL_BASE}/payments/apply/${pagos.id}`,{
                                method:'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    if(data.code === 1){
                                        e.target.textContent="Aplicado correctamente";

                                        sendpush({
                                            title: 'Éxito',
                                            message: data.message || 'Pago aplicado correctamente al crédito',
                                            type: 'Push--sucessful',
                                            timeout: 3000
                                        });

                                        fetch(`${import.meta.env.VITE_URL_BASE}/payments?payment_status=ERROR_SUM&business_id=${pagos.business_id}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())
                                            .then((data) => {
                                                if(data && data.result){
                                                    setUpdate({ 
                                                        result: data.result,
                                                        data: data.result,
                                                        total: data.result.length 
                                                    });

                                                    if(data.result.length > 0){
                                                        fetch(`${import.meta.env.VITE_URL_BASE}/payments/${data.result[0].id}`,{
                                                            headers: {
                                                                Accept: 'application/json',
                                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                                            }
                                                        })
                                                            .then((response) => response.json())
                                                            .then((nextData) => {
                                                                if(nextData && nextData.result && nextData.result.payment){
                                                                    const payment = nextData.result.payment;
                                                                    const currentRubros = nextData.result.credit_current_rubros;
                                                                    const paymentRubros = nextData.result.payment_rubros_to_subtract;
                                                                    
                                                                    setPays({
                                                                        ...payment,
                                                                        name: payment.client_name,
                                                                        ci: payment.client_ci,
                                                                        credito: payment.credit_id,
                                                                        estado: currentRubros?.collection_state || payment.management_prev || 'VENCIDO',
                                                                        paymentDay_actual: payment.payment_date,
                                                                        saldo_capital_actual: payment.capital,
                                                                        interes_actual: payment.interest,
                                                                        mora_actual: payment.mora,
                                                                        seguro_actual: payment.safe,
                                                                        otros_valores_actual: payment.other_values,
                                                                        saldo_capital_previo: currentRubros?.capital || 0,
                                                                        interes_previo: currentRubros?.interest || 0,
                                                                        mora_previo: currentRubros?.mora || 0,
                                                                        seguro_previo: currentRubros?.safe || 0,
                                                                        otros_valores_previo: currentRubros?.other_values || 0,
                                                                        payment_rubros_to_subtract: paymentRubros
                                                                    });
                                                                    e.target.textContent="Guardar con diferencia";
                                                                    e.target.disabled = false;
                                                                }
                                                            });
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            });
                                    } else {
                                        e.target.textContent="Error - Reintentar";
                                        e.target.disabled = false;
                                    }
                                })
                                .catch((error) => {
                                    e.target.textContent="Error - Reintentar";
                                    e.target.disabled = false;
                                });
                        }}
                    >Guardar con diferencia</button>
                </div>
            </div>
        </div>
    );

}