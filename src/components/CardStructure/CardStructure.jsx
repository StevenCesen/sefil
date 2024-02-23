import { useEffect, useState } from "react";
import "./CardStructure.css";
import useFadeArray from "../../hooks/useFadeArray";
import useStruct from "../../hooks/useStruct";

export default function CardStructure({total,id,set}){

    const [tipo_desgloce,setDesgloce]=useState();
    const [nro_cuotas,setNumber]=useState();
    const [date,setDate]=useState();

    useEffect(()=>{
        setDesgloce('automatico');
        setNumber(1);
    },[]);

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{set()}}>Volver</button>
            <div className="CardStructure">

                <div className="CardCondonacion__select">
                    <label>Desgloce:</label>
                    <select value={tipo_desgloce} onChange={(e)=>{setDesgloce(e.target.value)}}>
                        <option value="automatico">Cuotas iguales</option>
                        <option value="manual">Cuotas diferentes</option>
                    </select>
                </div>

                <div className="CardCondonacion__select">
                    <label>Número de cuotas:</label>
                    <input type="number" value={nro_cuotas} onChange={(e)=>{ (e.target.value>=0) ? setNumber(e.target.value) : setNumber(0) }} min={1} step={1}/>
                </div>

                <div className="CardCondonacion__select">
                    <label>Fecha de pago:</label>
                    <input type="date" onChange={(e)=>{setDate(e.target.value)}}/>
                </div>
                
                {
                    (tipo_desgloce==='automatico') ?
                        <div className="CardCondonacion__quotes">
                            {
                               useFadeArray(nro_cuotas).map((cuota,index)=>(
                                    <div key={index}>
                                        <label>{index+1}</label>
                                        <input type="number" disabled value={(total/nro_cuotas).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}/>
                                    </div>
                               )) 
                            }
                        </div>
                    : 
                        <div className="CardCondonacion__quotes">
                            {
                               useFadeArray(nro_cuotas).map((cuota,index)=>(
                                    <div key={index}>
                                        <label>{index+1}</label>
                                        <input type="number" placeholder="0.00"/>
                                    </div>
                               )) 
                            }
                        </div>
                }
                <button onClick={(e)=>{

                    e.target.textContent="Guardando...";
                    const data={
                        totalAmount:total,
                        saldo_capital:total,
                        cuota:(total/nro_cuotas).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                        nro_cuotas:nro_cuotas,
                        payment_date:date,
                        credito:id,
                        postDates:JSON.stringify({
                            totalAmount:total,
                            saldo_capital:total,
                            monthlyFeeAmount:(total/nro_cuotas).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                            totalFees:nro_cuotas,
                            paymentDate:date,
                            paidFees:0,
                            pendingFees:0,
                            dueDate:0,
                            interes:0.00,
                            mora:0.00,
                            seguro_desgravamen:0.00,
                            gastos_cobranza:0.00,
                            gastos_judiciales:0.00,
                            otros_valores:0.00,
                            dias_vencidos:0
                        })
                    }

                    useStruct(data,e.target,id);

                }}>Guardar cambios</button>
            </div>
        </div>
    );
}