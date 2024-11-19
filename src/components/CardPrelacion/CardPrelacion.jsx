import { useEffect, useState } from "react";
import "./CardPrelacion.css";

export default function CardPrelacion({cartera}){

    const [result,setResult]=useState();
    const [select,setSelect]=useState();
    const [viewEdit,setViewEdit]=useState();

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

        let items=document.getElementsByClassName('CardSelectsFrom')[0].children;
        items=[].slice.call(items);

        items.map((item)=>{
            if(item.textContent===value){
                item.classList.remove('CardSelectsFrom__labelOff');
            }
        });

        setResult(new_result);
    }

    useEffect(()=>{
        setViewEdit(false);
        setResult([]);
        
        const order=[];
        const prev_select=JSON.parse(cartera.orden_prelacion);
        prev_select.map((item)=>{
            if(item==='saldo_capital'){
                order.push('Saldo capital');
            }else if(item==='interes'){
                order.push('Interés');
            }else if(item==='mora'){
                order.push('Mora');
            }else if(item==='seguro_desgravamen'){
                order.push('Seguro desgravamen');
            }else if(item==='gastos_cobranza'){
                order.push('Gastos de cobranza');
            }else if(item==='gastos_judiciales'){
                order.push('Gastos judiciales');
            }else if(item==='otros_valores'){
                order.push('Otros valores');
            }
        });

        setSelect(order);

    },[]);

    if(!result) return <></>
    if(!select) return <></>

    return (
        <div className="CardPrelacion">
            <p className="CardPrelacion__header">Orden de prelación</p>

            <div className="CardValues">

                <div className="CardValues__head">
                    <p>Orden actual</p>
                    <button
                        onClick={(e)=>{
                            setViewEdit(!viewEdit);

                            if(viewEdit){
                                e.target.textContent="Cambiar";
                            }else{
                                e.target.textContent="Volver";
                                setResult([]);
                            }
                        }}
                    >Cambiar</button>
                </div>

                {
                    (viewEdit)
                        ?
                            <div className="CardSelectsEdit">
                                <div className="CardSelectsFrom">

                                    {
                                        select.map(sel=>(
                                            <label
                                                draggable
                        
                                                onDragEnd={(e)=>{
                                                    e.preventDefault();
                                                    e.target.classList.add('CardSelectsFrom__labelOff');
                                                }}
                        
                                                onDragStart={(e)=>{
                                                    e.dataTransfer.setData("Text", e.target.textContent);
                                                }}
                                            >
                                                {sel}
                                            </label>
                                        ))
                                    }
                                
                                </div>

                                <div 
                                    className="CardSelectsTo"
                                    onDragLeave={(e)=>{
                                        e.preventDefault();

                                        if(!!document.getElementById('message-drop')){
                                            e.target.removeChild(document.getElementById('message-drop'));
                                        }

                                        let elements=document.getElementsByClassName('CardSelectsTo__label');
                                        elements=[].slice.call(elements);

                                        const data = e.dataTransfer.getData("Text");
                                        let count=0;

                                        elements.map((element)=>{
                                            if(element.textContent===data){
                                                count++;
                                            }
                                        });

                                        if(count===0){
                                            addResult(data);
                                        }
                                    }}

                                >
                                    <label id="message-drop">Arrastrar y soltar</label>
                                    {
                                        result.map((item)=>(
                                            <label 
                                                class="CardSelectsTo__label"
                                                onClick={(e)=>{
                                                    removeResult(item);
                                                }}
                                            >{item}</label>
                                        ))
                                    }
                                </div>
                            </div>
                        :   
                            <div className="CardSelects">
                                {
                                    select.map(sel=>(
                                        <label>{sel}</label>
                                    ))
                                }
                            </div>
                }

            </div>

            <div className="CardPrelacion__footer">
                <button
                    onClick={async (e)=>{

                        e.target.textContent="Guardando...";
                        const new_order=[];

                        result.map((item)=>{
                            if(item==='Saldo capital'){
                                new_order.push('saldo_capital');
                            }else if(item==='Interés'){
                                new_order.push('interes');
                            }else if(item==='Mora'){
                                new_order.push('mora');
                            }else if(item==='Seguro desgravamen'){
                                new_order.push('seguro_desgravamen');
                            }else if(item==='Gastos de cobranza'){
                                new_order.push('gastos_cobranza');
                            }else if(item==='Gastos judiciales'){
                                new_order.push('gastos_judiciales');
                            }else if(item==='Otros valores'){
                                new_order.push('otros_valores');
                            }
                        });

                        const request= await fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines`,{
                            method:'POST',
                            body:new URLSearchParams({
                                cartera:cartera.name,
                                new_order:JSON.stringify(new_order)
                            }),
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    
                        const response=await request.json();
                        
                        if(response.status===200){
                            e.target.textContent="Guardado";
                        }else{
                            e.target.textContent="Error";
                        }

                    }}
                >Guardar y aplicar</button>
            </div>
        </div>
    );
}