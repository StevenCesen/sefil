import { useEffect, useState } from "react";
import "./CardStructure.css";
import useFadeArray from "../../hooks/useFadeArray";
import useStruct from "../../hooks/useStruct";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import { useStoreStructure } from "../../stores/useStoreStructure";

export default function CardStructure({credit_id,cartera,total_amount,gasto_cobranza}){
    const [monto_cuota,setMonto]=useState();
    
    const store_structure=useStoreStructure();

    if(!store_structure.isViewOn) return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{store_structure.viewOn(false)}}>Volver</button>
            <div className="CardStructure">

                <p>Convenio de pago</p>

                <div className="CardCondonacion__select">
                    <label>Saldo a desglozar:</label>
                    <label>{useFormatterNumber({value:store_structure.total_amount,currency:'USD'})}</label>
                </div>

                <div className="CardCondonacion__select">
                    <label>Desgloce:</label>
                    <select value={store_structure.type} onChange={(e)=>{
                        store_structure.setType(e.target.value);

                        if(e.target.value==='manual'){
                            store_structure.setChecksum(store_structure.total_amount)
                            store_structure.setTotalFees(0);
                        }
                    }}>
                        <option value="automatico">Cuotas iguales</option>
                        <option value="manual">Cuotas diferentes</option>
                    </select>
                </div>

                <h4>Calcular por número de cuotas</h4>

                <div className="CardCondonacion__select">
                    <label>Número de cuotas:</label>
                    <input type="number" value={store_structure.total_fees} onChange={(e)=>{ 
                        if(e.target.value>=0){
                            store_structure.setTotalFees(e.target.value)
                        }else{
                            store_structure.setTotalFees(0);
                        }

                    }} min={1} step={1}/>
                </div>
                
                <h4>Calcular número de cuotas por monto</h4>

                <div className="CardCondonacion__selectThree">
                    <label>Monto:</label>
                    <input type="number" value={store_structure.amount_fee} onChange={(e)=>{ 
                        if(e.target.value>=0){
                            store_structure.setAmountFee(e.target.value);
                        }else{
                            store_structure.setAmountFee(0);
                        }
                    }} min={1} step={1}/>

                    <button
                        onClick={(e)=>{
                            const nro_by_monto=(store_structure.total_amount)/store_structure.amount_fee;
                            const cuotas_prev=[];

                            useFadeArray(Math.round(nro_by_monto)).map((cuota,index)=>{
                                if(index===(Math.round(nro_by_monto)-1)){
                                    const last_quote=store_structure.total_amount-store_structure.amount_fee*(index);
                                    cuotas_prev.push(last_quote);
                                }else{
                                    cuotas_prev.push(store_structure.amount_fee);
                                }
                            });
                            store_structure.setFees(cuotas_prev);
                            store_structure.setTotalFees(Math.round(nro_by_monto));
                        }}
                    >Calcular</button>
                </div>
                
                {
                    (store_structure.type==='automatico') ?
                        <div className="CardCondonacion__quotes">

                            <div>
                                <label>1</label>
                                <label>{useFormatterNumber({value:store_structure.gasto_cobranza,currency:'USD'})}</label>
                                <label>Gastos de cobranza</label>
                            </div>

                            {
                               useFadeArray(store_structure.total_fees).map((cuota,index)=>(

                                    (store_structure.amount_fee>0 & store_structure.fees.length>0)
                                    ?
                                        <div key={index}>
                                            <label>{index+2}</label>
                                            <input className="desgloce_inputs" type="number" disabled value={ Number((store_structure.fees[index])).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}/>
                                            <input type="date"/>
                                        </div>
                                    : 
                                        <div key={index}>
                                            <label>{index+2}</label>
                                            <input className="desgloce_inputs" type="number" disabled value={(store_structure.total_amount/store_structure.total_fees).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}/>
                                            <input type="date"/>
                                        </div>
                               )) 
                            }
                        </div>
                    : 
                        <div className="CardCondonacion__quotes">
                            <div>
                                <label>1</label>
                                <label>{useFormatterNumber({value:store_structure.gasto_cobranza,currency:'USD'})}</label>
                                <label>Gastos de cobranza</label>
                            </div>

                            {
                               useFadeArray(store_structure.fees).map((cuota,index)=>(
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
                                                    diferencia=store_structure.total_amount-val_prev;
                                                    val_prev+=Number(input.value);
                                                });

                                                if(val_prev>(store_structure.total_amount)){

                                                    e.target.value=(diferencia-Number(store_structure.gasto_cobranza)).toFixed(2);
                                                    
                                                    store_structure.setChecksum(store_structure.total_amount);

                                                    sendpush({
                                                        title:'ERR: sumatoria incorrecta.',
                                                        message:'Se sobrepaso el valor total del desgloce.',
                                                        type:'Push--danger',
                                                        timeout:3000
                                                    });

                                                }else{
                                                    store_structure.setChecksum(val_prev);
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
                    (store_structure.type==='manual')
                    ?   
                        <div className="CardCondonacion__select">
                            <label>Suman:</label>
                            <label>{useFormatterNumber({value:store_structure.checksum,currency:'USD'})}</label>
                        </div>
                    :   <></>
                }

                <button onClick={(e)=>{

                    // e.target.textContent="Guardando...";

                    // const detalle=[];

                    // let inputs=document.getElementsByClassName('desgloce_inputs');
                    // inputs=[].slice.call(inputs);

                    // let valor_cuota=0,errors=0;

                    // detalle.push({
                    //     cuota:1,
                    //     valor:(status_cobranza!=='pay' ? cobranza : 0),
                    //     estado:(status_cobranza!=='pay' ? 'PENDIENTE' : 'PAGADO'),
                    //     fecha_pago:inputs[0].nextElementSibling.value
                    // });
                    
                    // inputs.map((input,index)=>{
                    //     if(index===0){
                    //         valor_cuota=input.value;
                    //     }

                    //     if(input.nextElementSibling.value===''){
                    //         errors++;
                    //     }

                    //     detalle.push({
                    //         cuota:index+1,
                    //         valor:input.value,
                    //         estado:'PENDIENTE',
                    //         fecha_pago:input.nextElementSibling.value
                    //     });
                    // });

                    // const data={
                    //     valor_cuota:valor_cuota,
                    //     cuotas_pendientes:nro_cuotas-1,
                    //     cuota:1,
                    //     fecha:detalle[0].fecha_pago,
                    //     credito:id,
                    //     cartera:cartera,
                    //     status:"",
                    //     detail:JSON.stringify(detalle),
                    //     original_dates:JSON.stringify(original_dates),
                    //     totalAmount:totalAmount
                    // }
                    
                    // if(errors>0){
                    //     e.target.textContent="Guardar cambios";

                    //     sendpush({
                    //         title:'ERR: no hay fecha.',
                    //         message:'Existen cuotas que no tienen fecha.',
                    //         type:'Push--danger',
                    //         timeout:3000
                    //     });
                        
                    // }else if(tipo_desgloce==='automatico' | tipo_desgloce==='manual'){
                        
                    //     useStruct(data,e.target,id);

                    // }else{
                    //     e.target.textContent="Guardar cambios";

                    //     sendpush({
                    //         title:'ERR: sumatoria incorrecta.',
                    //         message:'Se sobrepaso el valor total del desgloce.',
                    //         type:'Push--danger',
                    //         timeout:3000
                    //     });
                    // }

                }}>Guardar cambios</button>
            </div>
        </div>
    );
}