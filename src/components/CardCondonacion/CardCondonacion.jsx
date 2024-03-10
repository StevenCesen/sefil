import { useEffect, useState } from "react";
import "./CardCondonacion.css";
import useCondonation from "../../hooks/useCondonation";

export default function CardCondonacion({total,capital,mora,interes,seguro_desgravamen,gastos_judiciales,gastos_cobranza,set,id,cartera}){

    const [credit,setValues]=useState();
    const [totalCondonado,setTotal]=useState(0);
    
    useEffect(()=>{
        setValues({
            capital:capital,
            mora:mora,
            interes:interes,
            seguro_desgravamen:seguro_desgravamen,
            gastos_judiciales:gastos_judiciales,
            gastos_cobranza:gastos_cobranza
        });
    },[]);

    if(!credit) return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{set()}}>Volver</button>
            <div className="CardCondonacion">
                <div className="CardCondonacion__content">
                    <div className="CardCondonacion__head">
                        <p>Detalle</p>
                        <p>Valor actual</p>
                        <p>Valor condonado</p> 
                        <p>Valor a cancelar</p>
                    </div>

                    <div>
                        <p>Capital</p>
                        <p>$ {capital} USD</p>
                        <input type="number" onChange={(e)=>{setValues({
                            ...credit,
                            capital:(Number(capital)-Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                        })}} placeholder="0.00" min={0} step={0.1}/>
                        <p>$ {credit.capital} USD</p>
                    </div>
                    <div>
                        <p>Mora</p>
                        <p>$ {mora} USD</p>
                        <input type="number" onChange={(e)=>{setValues({
                            ...credit,
                            mora:(Number(mora)-Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                        })}} placeholder="0.00" min={0} step={0.1}/>
                        <p>$ {credit.mora} USD</p>
                    </div>
                    <div>
                        <p>Interés</p>
                        <p>$ {interes} USD</p>
                        <input type="number" onChange={(e)=>{setValues({
                            ...credit,
                            interes:(Number(interes)-Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                        })}} placeholder="0.00" min={0} step={0.1}/>
                        <p>$ {credit.interes} USD</p>
                    </div>
                    <div>
                        <p>Seguro desgravamen</p>
                        <p>$ {seguro_desgravamen} USD</p>
                        <input type="number" onChange={(e)=>{setValues({
                            ...credit,
                            seguro_desgravamen:(Number(seguro_desgravamen)-Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                        })}} placeholder="0.00" min={0} step={0.1}/>
                        <p>$ {credit.seguro_desgravamen} USD</p>
                    </div>
                    <div>
                        <p>Gastos judiciales</p>
                        <p>$ {gastos_judiciales} USD</p>
                        <input type="number" onChange={(e)=>{setValues({
                            ...credit,
                            gastos_judiciales:(Number(gastos_judiciales)-Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                        })}} placeholder="0.00" min={0} step={0.1}/>
                        <p>$ {credit.gastos_judiciales} USD</p>
                    </div>
                    <div>
                        <p>Gastos de cobranza</p>
                        <p>$ {gastos_cobranza} USD</p>
                        <input type="number" onChange={(e)=>{setValues({
                            ...credit,
                            gastos_cobranza:(Number(gastos_cobranza)-Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                        })}} placeholder="0.00" min={0} step={0.1}/>
                        <p>$ {credit.gastos_cobranza} USD</p>
                    </div>
                </div>

                <div className="CardCondonacion__result">
                    <p>Total condonado</p>
                    <p>$ {(total-(Number(credit.capital)+Number(credit.mora)+Number(credit.interes)+Number(credit.seguro_desgravamen)+Number(credit.gastos_cobranza)+Number(credit.gastos_judiciales))).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}</p>
                </div>

                <div className="CardCondonacion__result">
                    <p>Total a cancelar</p>
                    <p>$ {(Number(credit.capital)+Number(credit.mora)+Number(credit.interes)+Number(credit.seguro_desgravamen)+Number(credit.gastos_cobranza)+Number(credit.gastos_judiciales)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}</p>
                </div>

                <button className="CardCondonacion__save" 
                    onClick={(e)=>{
                        e.target.textContent='Guardando...';
                        const data={
                            prevDates:JSON.stringify({
                                mora:mora,
                                interes:interes,
                                capital:capital,
                                seguro_desgravamen:seguro_desgravamen,
                                gastos_cobranza:gastos_cobranza,
                                gastos_judiciales:gastos_judiciales
                            }),
                            postDates:JSON.stringify(credit),
                            totalAmount:String(Number(credit.capital)+Number(credit.mora)+Number(credit.interes)+Number(credit.seguro_desgravamen)+Number(credit.gastos_cobranza)+Number(credit.gastos_judiciales)),
                            saldo_capital:credit.capital,
                            interes:credit.interes,
                            mora:credit.mora,
                            seguro_desgravamen:credit.seguro_desgravamen,
                            gastos_cobranza:credit.gastos_cobranza,
                            gastos_judiciales:credit.gastos_judiciales,
                            otros_valores:'0',
                            credito:Number(id),
                            cartera:cartera
                        }
                        
                        /*
                        ================================ AUTORIZACIÓN ==================================
                        => Si lo hace un usuario administrador, la condonación se aplica directamente
                        => Si lo hace un agente de cobranza o gestión, la condonación se aplica cuando un usuario administrador la autorice
                        */

                        useCondonation(data,e.target,id);
                        
                    }}
                >Guardar condonación</button>
            </div>
        </div>
    );
}