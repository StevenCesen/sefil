import { useEffect, useState } from "react";
import "./CardConfirm.css";

export default function CardConfirm({id,cartera,value,email,name,ci,direccion,telefono,setGastos,setView,setPDF}){

    const [dates,setDates]=useState();
    const [cuentas_bancarias,setCuentas]=useState();
    const [metodos,setMetodos]=useState();
    const [formas,setFormas]=useState();

    useEffect(()=>{

        fetch(`${import.meta.env.VITE_URL_BASE}/sofiaconfig`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                const cuentas=data.contribuyentes.contrib[0].cuentasBancarias.cuenta;
                const formas_pago=data.formasPago.formaPago;
                const metodos_pago=['ANTICIPO', 'CHEQUE', 'EFECTIVO', 'OTROS', 'TARJETA_CREDITO', 'TRANSFERENCIA', 'DEPOSITO'];

                setCuentas(cuentas);
                setFormas(formas_pago);
                setMetodos(metodos_pago);
                
            });

        if(id){
            setDates({
                name:name,
                ci:ci,
                direccion:direccion,
                telefono:telefono,
                email:email,
                value:value.toFixed(2),
                id:id,
                cartera:cartera,
                formaPago:"",
                metodo:"",
                referencia:"",
                idBanco:""
            });
        }else{
            
        }
        
    },[]);

    if(!dates) return <></>
    if(!cuentas_bancarias) return <></>
    if(!formas) return <></>
    if(!metodos) return <></>

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

            <label>
                Forma de pago:
                <select
                    value={dates.formaPago}
                    onChange={(e)=>{
                        setDates({
                            ...dates,
                            formaPago:e.target.value
                        });
                    }}
                >
                    <option value={""}>-- Seleccionar forma --</option>
                    <option value={"EFECTIVO"}>EFECTIVO</option>
                    <option value={"TARJETA_DEBITO"}>TARJETA DÉBITO</option>
                    <option value={"OTROS_FINANCIERO"}>OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
                </select>
            </label>

            <label>
                Métodos de pago:
                <select
                    value={dates.metodo}
                    onChange={(e)=>{
                        setDates({
                            ...dates,
                            metodo:e.target.value
                        });
                    }}
                >
                    <option value={""}>-- Seleccionar método --</option>
                    {
                        metodos.map((metodo)=>(
                            <option value={metodo}>{metodo}</option>
                        ))
                    }
                </select>
            </label>

            {
                (dates.metodo!=='EFECTIVO' & dates.metodo!=='')
                ?
                    <div className="CardConfirm__cuentas">
                        <label>
                            Institución financiera:
                            <select
                                value={dates.idBanco}
                                onChange={(e)=>{
                                    setDates({
                                        ...dates,
                                        idBanco:e.target.value
                                    });
                                }}
                            >
                                <option value={""}>-- Seleccionar cuenta bancaria --</option>
                                {
                                    cuentas_bancarias.map((cuenta)=>(
                                        <option value={cuenta.id}>{cuenta.nombre}</option>
                                    ))
                                }
                            </select>
                        </label>
                        <label>
                            Referencia
                            <input
                                type="text"
                                value={dates.referencia}
                                onChange={(e)=>{
                                    setDates({
                                        ...dates,
                                        referencia:e.target.value
                                    });
                                }}
                            />
                        </label>

                    </div>
                :   <></>
            }

            <div>
                <button
                    onClick={(e)=>{
                        e.textContent='Generando factura';

                        if(dates.formaPago!==""){
                            if(dates.formaPago==='EFECTIVO' & (dates.metodo==='' | dates.metodo!=='EFECTIVO')){  
                                e.target.textContent="Error, forma de pago y método no corresponden";
                            }else if(dates.formaPago!=='EFECTIVO' & (dates.metodo==='' | dates.metodo==='EFECTIVO' | dates.referencia==='' | dates.idBanco==='')){
                                e.target.textContent="Error, forma de pago y método no corresponden o falta información de banco";
                            }else{
                                fetch(`${import.meta.env.VITE_URL_BASE}/gastos/${dates.id}`,{
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
                            }
                        }else{
                            e.target.textContent="Error, ingrese una forma de pago";
                        }
                    }}
                >Confirmar</button>
            </div>
        </div>
    );
}