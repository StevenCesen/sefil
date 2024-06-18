import { useEffect, useState } from "react";
import "./CardEditJudicial.css";

export default function CardEditJudicial({id,name,gastos_judiciales,setNew,close}){

    const [gastos,setGastos]=useState();

    useEffect(()=>{
        setGastos({
            actual:gastos_judiciales,
            aumento:0,
            final:gastos_judiciales
        });
        console.log(gastos)
    },[]);

    if(!gastos) return <></>

    return (
        <div className="CardEditJudicial">
            <p className="CardEditJudicial__header">Editar Gastos Judiciales</p>
            <div className="CardEditJudicial__labels">
                <label>
                    Valor actual
                    <input 
                        type="number" 
                        min={0}
                        value={gastos.actual}
                        disabled
                    />
                </label>
                <label>
                    Aumento
                    <input 
                        type="number" 
                        value={gastos.aumento}
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
            <label>
                Valor final
                <input 
                    type="text"  
                    disabled
                    value={gastos.final}
                />
            </label>
            <div className="CardEditJudicial__footer">
                <button
                    onClick={(e)=>{
                        close(false);
                        setNew(gastos.final);
                    }}
                >Actualizar</button>
            </div>
        </div>
    );
}