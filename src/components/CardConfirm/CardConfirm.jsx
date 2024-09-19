import { useEffect, useState } from "react";
import "./CardConfirm.css";

export default function CardConfirm({id,cartera,value,email,name,ci,direccion,telefono,setGastos,setView,setPDF}){

    const [dates,setDates]=useState();

    useEffect(()=>{
        console.log(cartera)
        setDates({
            name:name,
            ci:ci,
            direccion:direccion,
            telefono:telefono,
            email:email,
            value:value,
            id:id,
            cartera:cartera
        });
    },[]);

    if(!dates) return <></>

    return (
        <div className="CardConfirm">

            <p>Gastos de cobranza</p>

            <label>
                Total:
                <input 
                    type="number"
                    onChange={(e)=>{
                        setDates({
                            ...dates,
                            value:Number(e.target.value)
                        })
                    }}
                    min={0}
                    value={dates.value}
                />
            </label>

            <label>
                Email:
                <input 
                    type="text"
                    placeholder="Correo electrónico"
                    onChange={(e)=>{
                        setDates({
                            ...dates,
                            email:e.target.value
                        });
                    }}  
                    value={dates.email}
                />
            </label>

            <div>
                <button
                    onClick={(e)=>{
                        e.textContent='Generando factura';

                        setView(false);
                        // setGastos({
                        //     status:false,
                        //     email:dates.email,
                        //     valor_gasto:dates.value,
                        //     fecha:"2024-05-27",
                        //     clave_acceso:"NO/D"
                        // });

                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/gastos/${dates.id}`,{
                            method:'POST',
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            },
                            body:new URLSearchParams(dates)
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                if('status' in data){
                                    e.target.textContent='Facturado';
                                    setView(false);
                                    setGastos({
                                        status:false,
                                        email:dates.email,
                                        valor_gasto:dates.value,
                                        fecha:data.fecha,
                                        clave_acceso:data.clave_acceso
                                    });
                                    setPDF(true);
                                }else{
                                    e.target.textContent='Error, inténtalo de nuevo';
                                }
                            });
                    }}
                >Confirmar</button>
            </div>
        </div>
    );
}