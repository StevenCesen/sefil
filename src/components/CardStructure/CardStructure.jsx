import { useEffect, useState } from "react";
import "./CardStructure.css";
import useFadeArray from "../../hooks/useFadeArray";
import useStruct from "../../hooks/useStruct";
import useFormatterNumber from "../../hooks/useFormatterNumber";

export default function CardStructure({original_dates,total,id,set,cartera,cobranza,status_cobranza}){

    const [tipo_desgloce,setDesgloce]=useState();
    const [nro_cuotas,setNumber]=useState();
    const [totalAmount,setTotalAmount]=useState();
    const [totalSum,setTotalSum]=useState();
    const [monto_cuota,setMonto]=useState();
    const [value_cuotas,setValueCuotas]=useState();
    
    useEffect(()=>{
        setDesgloce('automatico');
        setNumber(1);
        setTotalAmount(Number(total)+Number((status_cobranza!=='pay' | status_cobranza==true) ? cobranza : 0));
        setTotalSum(0);
        setMonto(0);
        setValueCuotas([]);
    },[]);

    if(!totalAmount) return <></>
    if(!value_cuotas) return <></>

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

                <h4>Calcular por número de cuotas</h4>

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
                
                <h4>Calcular número de cuotas por monto</h4>

                <div className="CardCondonacion__selectThree">
                    <label>Monto:</label>
                    <input type="number" value={monto_cuota} onChange={(e)=>{ 
                        if(e.target.value>=0){
                            setMonto(e.target.value);
                        }else{
                            setMonto(0);
                        }
                    }} min={1} step={1}/>
                    <button
                        onClick={(e)=>{
                            const nro_by_monto=(totalAmount)/monto_cuota;
                            const cuotas_prev=[];

                            useFadeArray(Math.round(nro_by_monto)).map((cuota,index)=>{
                                if(index===(Math.round(nro_by_monto)-1)){
                                    const last_quote=totalAmount-monto_cuota*(index);
                                    cuotas_prev.push(last_quote);
                                }else{
                                    cuotas_prev.push(monto_cuota);
                                }
                            });
                            setValueCuotas(cuotas_prev);
                            setNumber(Math.round(nro_by_monto));
                        }}
                    >Calcular</button>
                </div>

                {
                    (tipo_desgloce==='automatico') ?
                        <div className="CardCondonacion__quotes">

                            <div>
                                <label>1</label>
                                <label>{useFormatterNumber({value:(status_cobranza!=='pay' ? cobranza : 0),currency:'USD'})}</label>
                                <label>Gastos de cobranza</label>
                            </div>

                            {
                               useFadeArray(nro_cuotas).map((cuota,index)=>(

                                    (monto_cuota>0 & value_cuotas.length>0
                                    )
                                    ?
                                        <div key={index}>
                                            <label>{index+2}</label>
                                            <input className="desgloce_inputs" type="number" disabled value={ Number((value_cuotas[index])).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}/>
                                            <input type="date"/>
                                        </div>
                                    : 
                                        <div key={index}>
                                            <label>{index+2}</label>
                                            <input className="desgloce_inputs" type="number" disabled value={(totalAmount/nro_cuotas).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}/>
                                            <input type="date"/>
                                        </div>
                               )) 
                            }
                        </div>
                    : 
                        <div className="CardCondonacion__quotes">
                            <div>
                                <label>1</label>
                                <label>{useFormatterNumber({value:(status_cobranza!=='pay' ? cobranza : 0),currency:'USD'})}</label>
                                <label>Gastos de cobranza</label>
                            </div>

                            {
                               useFadeArray(nro_cuotas).map((cuota,index)=>(
                                    <div key={index}>
                                        <label>{index+2}</label>
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

                                                if(val_prev>(totalAmount)){

                                                    e.target.value=(diferencia-Number((status_cobranza!=='pay' ? cobranza : 0))).toFixed(2);
                                                    
                                                    setTotalSum(totalAmount);

                                                    sendpush({
                                                        title:'ERR: sumatoria incorrecta.',
                                                        message:'Se sobrepaso el valor total del desgloce.',
                                                        type:'Push--danger',
                                                        timeout:3000
                                                    });

                                                }else{
                                                    setTotalSum(val_prev);
                                                }
                                            }}
                                        />
                                        <input type="date"/>
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

                    const detalle=[];

                    let inputs=document.getElementsByClassName('desgloce_inputs');
                    inputs=[].slice.call(inputs);

                    let valor_cuota=0,errors=0;

                    detalle.push({
                        cuota:1,
                        valor:(status_cobranza!=='pay' ? cobranza : 0),
                        estado:(status_cobranza!=='pay' ? 'PENDIENTE' : 'PAGADO'),
                        fecha_pago:inputs[0].nextElementSibling.value
                    });
                    
                    inputs.map((input,index)=>{
                        if(index===0){
                            valor_cuota=input.value;
                        }

                        if(input.nextElementSibling.value===''){
                            errors++;
                        }

                        detalle.push({
                            cuota:index+1,
                            valor:input.value,
                            estado:'PENDIENTE',
                            fecha_pago:input.nextElementSibling.value
                        });
                    });

                    const data={
                        valor_cuota:valor_cuota,
                        cuotas_pendientes:nro_cuotas-1,
                        cuota:1,
                        fecha:detalle[0].fecha_pago,
                        credito:id,
                        cartera:cartera,
                        status:"",
                        detail:JSON.stringify(detalle),
                        original_dates:JSON.stringify(original_dates),
                        totalAmount:totalAmount
                    }
                    
                    if(errors>0){
                        e.target.textContent="Guardar cambios";

                        sendpush({
                            title:'ERR: no hay fecha.',
                            message:'Existen cuotas que no tienen fecha.',
                            type:'Push--danger',
                            timeout:3000
                        });
                        
                    }else if(tipo_desgloce==='automatico' | tipo_desgloce==='manual'){
                        
                        useStruct(data,e.target,id);

                    }else{
                        e.target.textContent="Guardar cambios";

                        sendpush({
                            title:'ERR: sumatoria incorrecta.',
                            message:'Se sobrepaso el valor total del desgloce.',
                            type:'Push--danger',
                            timeout:3000
                        });
                    }

                }}>Guardar cambios</button>
            </div>
        </div>
    );
}