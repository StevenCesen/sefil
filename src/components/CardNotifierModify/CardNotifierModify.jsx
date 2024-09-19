import { useContext, useEffect, useState } from "react";
import "./CardNotifierModify.css";
import { NotifierContext } from "../../contexts/notifierContext";
import addNotification from "react-push-notification";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useFadeArray from "../../hooks/useFadeArray";

export default function CardNotifierModify({title,message,credito,cartera,fecha_pago,user_generate,prev_data,total,current_data,id,name,ci}){

    const [condonation,setCondonation]=useState({});
    const [number,setNumber]=useState(0);
    const [total_sum,setTotal]=useState(total);
    const [fecha,setPago]=useState(fecha_pago);
    const [restruct,setRestruct]=useState({
        cuotas:[]
    });
    const dataContext=useContext(NotifierContext);

    const updateCuota=({cuota,valor})=>{
        let copy=restruct.cuotas;

        copy.map((item)=>{
            if(Number(cuota)===Number(item.cuota)){
                item.valor=valor
            }
        });

        setRestruct({
            ...restruct,
            cuotas:copy
        });
    }

    useEffect(()=>{
        
        if(title.toLowerCase()==='condonación'){
            setCondonation({
                capital:(Number(prev_data.capital)-Number(current_data.capital)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                mora:(Number(prev_data.mora)-Number(current_data.mora)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                interes:(Number(prev_data.interes)-Number(current_data.interes)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                seguro_desgravamen:(Number(prev_data.seguro_desgravamen)-Number(current_data.seguro_desgravamen)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                gastos_cobranza:(Number(prev_data.gastos_cobranza)-Number(current_data.gastos_cobranza)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                gastos_judiciales:(Number(prev_data.gastos_judiciales)-Number(current_data.gastos_judiciales)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                otros_valores:(Number(prev_data.otros_valores)-Number(current_data.otros_valores)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
            });
        }else if(title.toLowerCase()==='reestructuración'){
            setNumber(current_data.length);
            setRestruct({
                cuotas:current_data
            });
        }
    },[]);

    return (
        <div className="CardNotifierModify">

            <span>{title}</span>

            <p className="CardNotifierModify__title">{message} | Generado por: {user_generate}</p>
            
            <p className="CardNotifierModify__title">Datos generados por el agente: </p>

            <p className="CardNotifierModify__title">CLIENTE: {name}</p>

            <p className="CardNotifierModify__title">CÉDULA: {ci}</p>

            <div className="CardNotifierModify__subhead">
                <p>Nro. crédito: {credito}</p>
                <p>Cartera: {cartera}</p>
            </div>

            {
                (title.toLowerCase()==='condonación')
                ?
                    <div className="CardNotifierModify__dates">
                        <div className="CardNotifierModify__datesCondonacion--head">
                            <label>Detalle</label>
                            <label>Original</label>
                            <label>Condonado</label>
                        </div>
                        
                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Saldo capital</label>
                            <label>$ {prev_data.capital} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.capital}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            capital:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Mora</label>
                            <label>$ {prev_data.mora} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.mora}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            mora:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Interes</label>
                            <label>$ {prev_data.interes} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.interes}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            interes:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Seguro desgravamen</label>
                            <label>$ {prev_data.seguro_desgravamen} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.seguro_desgravamen}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            seguro_desgravamen:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Gastos de cobranza</label>
                            <label>$ {prev_data.gastos_cobranza} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.gastos_cobranza}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            gastos_cobranza:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Gastos judiciales</label>
                            <label>$ {prev_data.gastos_judiciales} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.gastos_judiciales}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            gastos_judiciales:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Otros valores</label>
                            <label>$ {prev_data.otros_valores} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.otros_valores}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            otros_valores:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion" style={{marginTop:"10px"}}>
                            <label><strong>Total condonado:</strong></label>
                            <label>$ {((Number(condonation.capital)+Number(condonation.mora)+Number(condonation.interes)+Number(condonation.seguro_desgravamen)+Number(condonation.gastos_cobranza)+Number(condonation.gastos_judiciales))).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}</label>
                        </div>

                        <div className="CardNotifierModify__buttons">
                            <button 
                                className="CardNotifierModify__button--success"
                                onClick={(e)=>{
                                    e.target.textContent="Autorizando...";

                                    const data={
                                        postDates:JSON.stringify({
                                            capital:(Number(prev_data.capital)-Number(condonation.capital)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            interes:(Number(prev_data.interes)-Number(condonation.interes)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            mora:(Number(prev_data.mora)-Number(condonation.mora)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            seguro_desgravamen:(Number(prev_data.seguro_desgravamen)-Number(condonation.seguro_desgravamen)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            gastos_cobranza:(Number(prev_data.gastos_cobranza)-Number(condonation.gastos_cobranza)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            gastos_judiciales:(Number(prev_data.gastos_judiciales)-Number(condonation.gastos_judiciales)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            otros_valores:(Number(prev_data.otros_valores)-Number(condonation.otros_valores)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                                        }),
                                        updateCredit:JSON.stringify({
                                            totalAmount:((
                                                Number(prev_data.capital)+
                                                Number(prev_data.interes)+
                                                Number(prev_data.mora)+
                                                Number(prev_data.seguro_desgravamen)+
                                                Number(prev_data.gastos_cobranza)+
                                                Number(prev_data.gastos_judiciales)+
                                                Number(prev_data.otros_valores)
                                            )-(
                                                Number(condonation.capital)+
                                                Number(condonation.interes)+
                                                Number(condonation.mora)+
                                                Number(condonation.seguro_desgravamen)+
                                                Number(condonation.gastos_cobranza)+
                                                Number(condonation.gastos_judiciales)+
                                                Number(condonation.otros_valores)
                                            )).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            saldo_capital:(Number(prev_data.capital)-Number(condonation.capital)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            interes:(Number(prev_data.interes)-Number(condonation.interes)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            mora:(Number(prev_data.mora)-Number(condonation.mora)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            seguro_desgravamen:(Number(prev_data.seguro_desgravamen)-Number(condonation.seguro_desgravamen)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            gastos_cobranza:(Number(prev_data.gastos_cobranza)-Number(condonation.gastos_cobranza)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            gastos_judiciales:(Number(prev_data.gastos_judiciales)-Number(condonation.gastos_judiciales)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                                            otros_valores:(Number(prev_data.otros_valores)-Number(condonation.otros_valores)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                                        }),
                                        status:'autorizado',
                                        credito:credito,
                                        cartera:cartera
                                    }
                                    
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/condonar/${id}`,{
                                        method:'PUT',
                                        body:new URLSearchParams(data),
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            dataContext.removePush(id);
                                        });
                                }}
                            >Guardar y autorizar</button>

                            <button 
                                className="CardNotifierModify__button--failed"
                                onClick={(e)=>{
                                    e.target.textContent="Rechazando...";

                                    const data={
                                        status:'rechazado',
                                        credito:credito,
                                        cartera:cartera
                                    }
                                    
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/condonar/${id}`,{
                                        method:'PUT',
                                        body:new URLSearchParams(data),
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            dataContext.removePush(id);
                                        });
                                }}
                            >Rechazar</button>
                        </div>

                    </div>
                :
                    <div className="CardNotifierModify__dates">
                        <div className="CardNotifierModify__datesRestruct">
                            <label>
                                Fecha de pago:
                            </label>
                            <input type="date" value={fecha} 
                                onChange={(e)=>{
                                    setPago(e.target.value);
                                }} 
                            />
                        </div>

                        <div className="CardNotifierModify__datesRestruct">
                            <label>
                                Número de cuotas:
                            </label>
                            <input 
                                type="number" 
                                style={{textAlign:"center"}} 
                                value={number}
                                onChange={(e)=>{
                                    if(e.target.value>=0){
                                        setNumber(Number(e.target.value));
                                        
                                        let new_cuotas=[];

                                        useFadeArray(Number(e.target.value)).map((cuota,index)=>{
                                            new_cuotas.push({
                                                cuota:index+1,
                                                estado:'PENDIENTE',
                                                valor:(restruct.cuotas[index]!==undefined) ? restruct.cuotas[index].valor : 0
                                            });
                                        });

                                        setRestruct({
                                            ...restruct,
                                            cuotas:new_cuotas
                                        });

                                    }else{
                                        setNumber(0);
                                    }
                                }}
                                min={1}
                                step={1}
                            />
                        </div>

                        {
                            restruct.cuotas.map((cuota,index)=>(
                                <div key={index} style={{marginBottom:"5px"}}>
                                    <label style={{marginRight:"10px"}}>{index+1}</label>
                                    <input 
                                        type="number"
                                        className={`desgloce_inputs-${credito}`}
                                        style={{width:"100px"}}
                                        step={0.01}
                                        value={cuota.valor}
                                        onChange={(e)=>{
                                            
                                            updateCuota({
                                                cuota:cuota.cuota,
                                                valor:e.target.value
                                            });

                                            let inputs=document.getElementsByClassName(`desgloce_inputs-${credito}`);
                                            inputs=[].slice.call(inputs);
                                            
                                            let val_prev=0,diferencia=0;

                                            inputs.map((input)=>{
                                                diferencia=total-val_prev
                                                val_prev+=Number(input.value);
                                            });
                                            
                                            console.log(`Diferencia ${diferencia}`)
                                            console.log(`SUMA ${val_prev}`)

                                            if(val_prev>total){

                                                if(diferencia>0){
                                                    updateCuota({
                                                        cuota:cuota.cuota,
                                                        valor:diferencia.toFixed(2)
                                                    });
                                                    setTotal(total);
                                                }else{
                                                    updateCuota({
                                                        cuota:cuota.cuota,
                                                        valor:0
                                                    });
                                                }

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
                                                setTotal(val_prev);
                                            }
                                        }}
                                    />
                                </div>
                           ))
                        }

                        <div className="CardNotifierModify__datesRestruct">
                            <label>Total:</label>
                            <label>{useFormatterNumber({value:total_sum,currency:'USD'})}</label>
                        </div>
                        
                        <div className="CardNotifierModify__buttons">
                            <button 
                                className="CardNotifierModify__button--success"
                                onClick={(e)=>{
                                    e.target.textContent="Autorizando...";

                                    const data={
                                        detail:JSON.stringify(restruct.cuotas),
                                        fecha_pago:fecha,
                                        status:'autorizado',
                                        cuota:1,
                                        cuotas_pendientes:restruct.cuotas.length-1,
                                        valor_cuota:restruct.cuotas[0].valor,
                                        credito:credito,
                                        cartera:cartera
                                    }
                                    
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/estructurar/${id}`,{
                                        method:'PUT',
                                        body:new URLSearchParams(data),
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            dataContext.removePush(id);
                                        });
                                }}
                            >Guardar y autorizar</button>

                            <button 
                                className="CardNotifierModify__button--failed"
                                onClick={(e)=>{
                                    e.target.textContent="Rechazando...";

                                    const data={
                                        status:'rechazado'
                                    }
                                    
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/estructurar/${id}`,{
                                        method:'PUT',
                                        body:new URLSearchParams(data),
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            dataContext.removePush(id);
                                        });
                                }}
                            >Rechazar</button>
                        </div>

                    </div>
            }
        </div>
    );
}