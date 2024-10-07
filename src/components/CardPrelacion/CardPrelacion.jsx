import { useEffect, useState } from "react";
import "./CardPrelacion.css";

export default function CardPrelacion({cartera}){

    const [result,setResult]=useState();

    const addResult=(value)=>{
        const copy=result;
        let new_result=[];

        copy.map((item)=>{
            new_result.push(item);
        });

        new_result.push(value);

        setResult(new_result);
    }

    const removeResult=(value)=>{
        const copy=result;
        let new_result=[];

        copy.map((item)=>{
            if(item!==value){
                new_result.push(item);
            }
        });

        console.log(new_result);

        setResult(new_result);
    }

    useEffect(()=>{
        setResult([]);
        console.log(cartera)
    },[]);

    if(!result) return <></>

    return (
        <div className="CardPrelacion">
            <p className="CardPrelacion__header">Orden de prelación</p>

            <div className="CardValues">
                <div className="CardSelects">
                    <label
                        draggable

                        onDragOver={(e)=>{
                            e.preventDefault();
                            // const data = e.dataTransfer.getData("Text");
                            // console.log(data)
                            // e.target.textContent=data;
                        }}

                        onDragEnd={(e)=>{
                            e.preventDefault();
                            console.log("FINALICE")
                            console.log(localStorage.getItem('oldValue'))
                            // e.target.textContent=localStorage.getItem('oldValue');
                            // localStorage.removeItem('oldValue');
                        }}

                        onDragStart={(e)=>{
                            console.log(`Arrastrando ${e.target.textContent}`)
                            e.dataTransfer.setData("Text", e.target.textContent);
                        }}
                    >
                        {/* <input
                            onDragStart={(e)=>{
                                console.log(e);
                            }}

                            onChange={(e)=>{
                                if(e.target.checked){
                                    addResult(e.target.value);
                                }else{
                                    removeResult(e.target.value);
                                }
                            }}
                            value={"saldo_capital"}
                            type="checkbox"/> */}
                        Saldo capital
                    </label>
                    <label
                        draggable
                        
                        onDragOver={(e)=>{
                            e.preventDefault();
                            localStorage.setItem('oldValue',e.target.textContent);
                            console.log(e.target.textContent)
                            // console.log(e.target.textContent)
                            const data = e.dataTransfer.getData("Text");
                            // console.log(data)
                            e.target.textContent=data;
                        }}

                        onDragEnd={(e)=>{
                            e.preventDefault();
                            // console.log(localStorage.getItem('oldValue'))
                            // e.target.textContent=localStorage.getItem('oldValue');
                            // localStorage.removeItem('oldValue');
                        }}

                        onDragStart={(e)=>{
                            // console.log(`Arrastrando ${e.target.textContent}`)
                            e.dataTransfer.setData("Text", e.target.textContent);
                        }}
                    >
                        {/* <input
                            onChange={(e)=>{
                                if(e.target.checked){
                                    addResult(e.target.value);
                                }else{
                                    removeResult(e.target.value);
                                }
                            }} 
                            value={"interes"}
                            type="checkbox"/> */}
                        Interés
                    </label>
                    <label
                        draggable
                    >
                        {/* <input
                            onChange={(e)=>{
                                if(e.target.checked){
                                    addResult(e.target.value);
                                }else{
                                    removeResult(e.target.value);
                                }
                            }} 
                            value={"mora"}
                            type="checkbox"/> */}
                        Mora
                    </label>
                    <label
                        draggable
                    >
                        {/* <input 
                            onChange={(e)=>{
                                if(e.target.checked){
                                    addResult(e.target.value);
                                }else{
                                    removeResult(e.target.value);
                                }
                            }}
                            value={"seguro_desgravamen"}
                            type="checkbox"/> */}
                        Seguro desgravamen
                    </label>
                    <label
                        draggable
                    >
                        {/* <input
                            onChange={(e)=>{
                                if(e.target.checked){
                                    addResult(e.target.value);
                                }else{
                                    removeResult(e.target.value);
                                }
                            }} 
                            value={"gastos_cobranza"}
                            type="checkbox"/> */}
                        Gastos de cobranza
                    </label>
                    <label
                        draggable
                    >
                        {/* <input 
                            onChange={(e)=>{
                                if(e.target.checked){
                                    addResult(e.target.value);
                                }else{
                                    removeResult(e.target.value);
                                }
                            }}
                            value={"gastos_judiciales"}
                            type="checkbox"/> */}
                        Gastos judiciales
                    </label>
                    <label
                        draggable
                    >
                        {/* <input 
                            onChange={(e)=>{
                                if(e.target.checked){
                                    addResult(e.target.value);
                                }else{
                                    removeResult(e.target.value);
                                }
                            }}
                            value={"otros_valores"}
                            type="checkbox"/> */}
                        Otros valores
                    </label>
                </div>

                {/* <div className="CardResult">
                    {
                        result.map((inp)=>(
                            <label>{inp}</label>
                        ))
                    }
                </div> */}

            </div>

            <div className="CardPrelacion__footer">
                <button>Guardar y aplicar</button>
            </div>
        </div>
    );
}