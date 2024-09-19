import { useEffect, useState } from "react";
import "./CardStructure.css";
import useFadeArray from "../../hooks/useFadeArray";
import useStruct from "../../hooks/useStruct";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import addNotification from "react-push-notification";

export default function CardStructure({original_dates,total,id,set,cartera}){

    const [tipo_desgloce,setDesgloce]=useState();
    const [nro_cuotas,setNumber]=useState();
    const [date,setDate]=useState();
    const [totalAmount,setTotalAmount]=useState();
    const [totalSum,setTotalSum]=useState();

    useEffect(()=>{
        setDesgloce('automatico');
        setNumber(1);
        setTotalAmount(total);
        setTotalSum(0);
    },[]);

    if(!totalAmount) return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{set()}}>Volver</button>
            <div className="CardStructure">

                <p>Convenio de pago</p>

                <div className="CardCondonacion__select">
                    <label>Saldo a desglozar:</label>
                    <label>{useFormatterNumber({value:totalAmount,currency:'USD'})}</label>
                </div>

                <div className="CardCondonacion__select">
                    <label>Desgloce:</label>
                    <select value={tipo_desgloce} onChange={(e)=>{
                        setDesgloce(e.target.value);
                        if(e.target.value==='manual'){
                            setTotalSum(totalAmount)
                            setNumber(0);
                        }
                    }}>
                        <option value="automatico">Cuotas iguales</option>
                        <option value="manual">Cuotas diferentes</option>
                    </select>
                </div>

                <div className="CardCondonacion__select">
                    <label>Número de cuotas:</label>
                    <input type="number" value={nro_cuotas} onChange={(e)=>{ 
                        if(e.target.value>=0){
                            setNumber(e.target.value)
                        }else{
                            setNumber(0);
                        }

                    }} min={1} step={1}/>
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
                                        <input className="desgloce_inputs" type="number" disabled value={(totalAmount/nro_cuotas).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}/>
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
                                        <input 
                                            type="number"
                                            className="desgloce_inputs"
                                            placeholder="0.00"
                                            step={0.01}
                                            onChange={(e)=>{
                                                let inputs=document.getElementsByClassName('desgloce_inputs');
                                                inputs=[].slice.call(inputs);
                                                
                                                let val_prev=0,diferencia=0;

                                                inputs.map((input)=>{
                                                    diferencia=totalAmount-val_prev;
                                                    val_prev+=Number(input.value);
                                                });

                                                if(val_prev>totalAmount){

                                                    e.target.value=diferencia.toFixed(2);
                                                    
                                                    setTotalSum(totalAmount);

                                                    addNotification({
                                                        title: 'ERROR SUMATORIA',
                                                        subtitle: 'Se sobrepaso el valor total del desgloce',
                                                        message: 'Por favor, revise los valores',
                                                        native: false,
                                                        backgroundTop: '#FF9619',
                                                        backgroundBottom: '#fdb864',
                                                        colorTop: 'white',
                                                        colorBottom: 'white',
                                                        closeButton: 'Cerrar',
                                                        duration: 3500
                                                    });
                                                }else{
                                                    setTotalSum(val_prev);
                                                }
                                            }}
                                        />
                                    </div>
                               )) 
                            }
                        </div>
                }

                {
                    (tipo_desgloce==='manual')
                    ?   
                        <div className="CardCondonacion__select">
                            <label>Suman:</label>
                            <label>{useFormatterNumber({value:totalSum,currency:'USD'})}</label>
                        </div>
                    :   <></>
                }

                <button onClick={(e)=>{

                    e.target.textContent="Guardando...";

                    // 1) Creamos el detalle
                    const detalle=[];

                    let inputs=document.getElementsByClassName('desgloce_inputs');
                    inputs=[].slice.call(inputs);

                    let valor_cuota=0;

                    inputs.map((input,index)=>{
                        if(index===0){
                            valor_cuota=input.value;
                        }
                        detalle.push({
                            cuota:index+1,
                            valor:input.value,
                            estado:'PENDIENTE'
                        });
                    });

                    const data={
                        valor_cuota:valor_cuota,
                        cuotas_pendientes:nro_cuotas-1,
                        cuota:1,
                        fecha:date,
                        credito:id,
                        cartera:cartera,
                        status:"",
                        detail:JSON.stringify(detalle),
                        original_dates:JSON.stringify(original_dates),
                        totalAmount:totalAmount
                    }

                    useStruct(data,e.target,id);

                }}>Guardar cambios</button>
            </div>
        </div>
    );
}