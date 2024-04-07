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
                                <p>Judicial pagado</p>
                                <p>{useFormatterNumber({value:pagos.judicial_actual,currency:'USD'})}</p>
                            </div>
                            <div>
                                <p>Judicial adeudado</p>
                                <p>{useFormatterNumber({value:pagos.judicial_previo,currency:'USD'})}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="CardManualPay__footer">
                    
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

                                fetch(`https://sefil.softsen.space/public/api/pays/edit`,{
                                    method:'POST',
                                    headers: {
                                        Accept: 'application/json',
                                    },
                                    body:pay_denied
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        
                                        if(data.state===200){
                                            console.log(data)
                                            //Devuelvo el siguiente pago
                                            fetch(`https://sefil.softsen.space/public/api/pays/denied?page=${(pays.from)-1}&cartera=${cartera}`,{
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

                                fetch(`https://sefil.softsen.space/public/api/pays/edit`,{
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