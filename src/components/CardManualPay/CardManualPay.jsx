import { useEffect, useState } from "react";
import "./CardManualPay.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";

export default function CardManualPay({callback,pays,cartera,setUpdate}){

    const [pagos,setPays]=useState();

    useEffect(()=>{
        setPays(pays.data[0]);
    },[]);

    if(!pagos) return <></>

    return (
        <div className="CardManualPay">

            <button className="CardManualPay__close" onClick={()=>{
                callback()
            }}>Volver</button>

            <div className="CardManualPay__content">
                <div className="CardManualPay__data">
                    <div className="CardManualPay__head">
                        <p><strong>TITULAR:</strong> {pagos.name}</p>
                        <p><strong>CÉDULA:</strong> {pagos.ci}</p>
                        <p><strong>CRÉDITO:</strong> {pagos.credito}</p>
                        <p><strong>ESTADO:</strong> {pagos.estado}</p>
                        <p><strong>FECHA DE PAGO:</strong>{pagos.paymentDay_actual.split(' ')[0]}</p>
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
                                        
                                            setUpdate(data)
                                            setPays(data.data[0])

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
                            e.target.textContent="Cargando...";

                            if(pays.to<pays.last_page){
                                //Actualizo el crédito

                                const pay_denied=new URLSearchParams({
                                    cartera:cartera,
                                    credito:pagos.credito,
                                    saldo_capital_actual:pagos.saldo_capital_actual,
                                    interes_actual:pagos.interes_actual,
                                    mora_actual:pagos.mora_actual,
                                    seguro_actual:pagos.seguro_actual,
                                    judicial_actual:pagos.judicial_actual
                                });

                                fetch(`${import.meta.env.VITE_URL_BASE}/pays/edit`,{
                                    method:'POST',
                                    headers: {
                                        Accept: 'application/json',
                                    },
                                    body:pay_denied
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        
                                        if(data.state===200){
                                            //Devuelvo el siguiente pago
                                            fetch(`${import.meta.env.VITE_URL_BASE}/pays/denied?page=${(pays.from)-1}&cartera=${cartera}`,{
                                                headers: {
                                                    Accept: 'application/json',
                                                }
                                            })
                                                .then((response) => response.json())  
                                                .then((data) => {
                                                    e.target.textContent="Guardar con diferencia";
                                                    
                                                    setUpdate(data)
                                                    setPays(data.data[0])

                                                });
                                        }

                                    });
                            }else{

                                const pay_denied=new URLSearchParams({
                                    cartera:cartera,
                                    credito:pagos.credito,
                                    saldo_capital_actual:pagos.saldo_capital_actual,
                                    interes_actual:pagos.interes_actual,
                                    mora_actual:pagos.mora_actual,
                                    seguro_actual:pagos.seguro_actual,
                                    judicial_actual:pagos.judicial_actual
                                });
                                

                                fetch(`${import.meta.env.VITE_URL_BASE}/pays/edit`,{
                                    method:'POST',
                                    headers: {
                                        Accept: 'application/json',
                                    },
                                    body:pay_denied
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        if(data.state===200){
                                            //Actualizamos el pago
                                            e.target.textContent="Terminado";
                                            setUpdate({
                                                total:0
                                            });
                                            callback();
                                        }
                                    })
                            }
                            
                        }}
                    >Guardar con diferencia</button>
                </div>
            </div>

        </div>
    );

}