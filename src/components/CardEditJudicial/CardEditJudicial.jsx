import { useEffect, useRef, useState } from "react";
import "./CardEditJudicial.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import { X } from "lucide-react";

export default function CardEditJudicial({id,cartera,totalAmount,gastos_judiciales,setNew,close}){

    const [gastos,setGastos]=useState();
    const [judiciales,setJudiciales]=useState();

    const aumento=useRef();

    useEffect(()=>{
        setGastos({
            actual:gastos_judiciales,
            aumento:0.00,
            final:gastos_judiciales,
            detail:'',
            id:id,
            cartera:cartera,
            totalAmount:totalAmount,
            fecha:''
        });

        fetch(`${import.meta.env.VITE_URL_BASE}/judicial?cartera=${cartera}&credito=${id}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setJudiciales(data.judiciales);
            });
      
    },[]);

    if(!gastos) return <></>
    if(!judiciales) return <></>

    return (
        <div className="CardEditJudicial">
            <div>
                <p className="CardEditJudicial__header">Editar Gastos Judiciales <button><X color="white" onClick={() => close(false)}/></button></p>
            
                <h3>Historial</h3>
                <div className="CardEditJudicial__prevs">
                    
                    {
                        (judiciales.length>0)
                        ?
                            judiciales.map((judicial,index)=>(
                                <div key={index} className="CardEditJudicial__prev">
                                    <p>{judicial.detail} - {judicial.modify}</p>
                                    <p>{useFormatterNumber({value:judicial.total_value,currency:'USD'})}</p>
                                </div>
                            ))
                        :   <p>Sin registros</p>
                    }
                </div>

                <h3>Generar nuevo</h3>
                <div className="CardEditJudicial__labels">
                    
                    <label>
                        Motivo
                        <select
                            value={gastos.detail}
                            onChange={(e)=>{
                                setGastos({
                                    ...gastos,
                                    detail:e.target.value
                                });
                            }}
                        >
                            <option value={""}>--Seleccionar--</option>
                            <option value="NOTIFICACIÓN">NOTIFICACIÓN</option>
                            <option value="DEMANDA JUDICIAL">DEMANDA JUDICIAL</option>
                            <option value="ENTREGA DE PAGARÉ">ENTREGA DE PAGARÉ</option>
                            <option value="INICIO TRÁMITE JUDICIAL">INICIO TRÁMITE JUDICIAL</option>
                            <option value="GASTOS NOTARÍA">GASTOS NOTARÍA</option>
                            <option value="GASTOS CERTIFICADOS">GASTOS CERTIFICADOS</option>
                            <option value="GASTOS PERITAJE">GASTOS PERITAJE</option>
                            <option value="GASTOS CITACIÓN">GASTOS CITACIÓN</option>
                        </select>
                    </label>
                    
                    <label>
                        Fecha
                        <input 
                            type="date" 
                            value={gastos.fecha}
                            step={0.01}
                            onChange={(e)=>{
                                setGastos({
                                    ...gastos,
                                    fecha:e.target.value
                                });
                            }}
                        />
                    </label>

                    <label>
                        Aumento
                        <input 
                            type="number" 
                            ref={aumento}
                            value={gastos.aumento}
                            step={0.01}
                            onChange={(e)=>{
                                setGastos({
                                    ...gastos,
                                    aumento:e.target.value,
                                    final:Number(gastos.actual)+Number(e.target.value)
                                });
                            }}
                        />
                    </label>
                    
                </div>

                <div className="CardEditJudicial__details">
                    <div>
                        <p>Valor actual: </p>
                        <p>{useFormatterNumber({value:gastos.actual,currency:'USD'})}</p>
                    </div>
                    <div>
                        <p>Valor agregado: </p>
                        <p>{useFormatterNumber({value:gastos.aumento,currency:'USD'})}</p>
                    </div>
                    <div>
                        <p>Valor final: </p>
                        <p>{useFormatterNumber({value:gastos.final,currency:'USD'})}</p>
                    </div>
                </div>
                
                <div className="CardEditJudicial__footer">
                    <button
                        onClick={(e)=>{
            
                            if(gastos.final>0 & gastos.detail!=='' & gastos.fecha!==''){

                                e.target.textContent='Actualizando...';
                                const new_total_amount=Number(totalAmount)+Number(aumento.current.value);

                                const data={
                                    actual:gastos.actual,
                                    aumento:gastos.aumento,
                                    final:gastos.final,
                                    detail:gastos.detail,
                                    id:Number(gastos.id),
                                    cartera:gastos.cartera,
                                    totalAmount:new_total_amount,
                                    fecha:gastos.fecha
                                };
                            
                                fetch(`${import.meta.env.VITE_URL_BASE}/judicial`,{
                                    method:'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams(data)
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        if(data.state===200){
                                            setNew(data.data.gastos_judiciales,data.data.total_amount);
                                            close(false);
                                        }else{
                                            e.target.textContent='Error, inténtalo de nuevo';
                                        }
                                    });
                            }else{
                                e.target.textContent='Error, datos incompletos';
                            }

                        }}
                    >Actualizar</button>
                </div>
            </div>
        </div>
    );
}