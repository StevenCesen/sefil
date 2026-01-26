import { NavLink } from "react-router-dom";
import "./CardUpdatePay.css";
import { useEffect, useRef, useState } from "react";
import CardManualPay from "../CardManualPay/CardManualPay";
import sendpush from "../../helpers/sendpush";

export default function CardUpdatePay({name,fecha_carga,state,business_id}){

    const [viewManual,setView]=useState(false);
    const [pays_denied,setPays]=useState(null);
    const [cartera,setCartera]=useState({
        name:'',
        state:'',
        business_id:''
    });

    const [viewFallas,setViewFallas]=useState();
    const [fallas,setFallas]=useState();

    const label_ref=useRef();

    const updateView=()=>{
        console.log('updateView llamado, viewManual actual:', viewManual);
        setView(!viewManual);
    }

    useEffect(()=>{
        setView(false);
        setViewFallas(false);
        setFallas([]);
        setCartera({
            name:name,
            fecha_carga:fecha_carga,
            state:state,
            business_id:business_id
        });

        fetch(`${import.meta.env.VITE_URL_BASE}/payments?payment_status=ERROR_SUM&business_id=${business_id}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if(data && data.result){
                    setPays({ 
                        result: data.result,
                        data: data.result,
                        total: data.result.length 
                    });
                }else{
                    setPays({ total: 0, data: [], result: [] });
                }
            })
            .catch((error) => {
                setPays({ total: 0, data: [], result: [] });
            });
            
    },[]);

    if(!fallas) return <></>
    if(!pays_denied) return <></>

    return(
        <div className="CardListUpdateCarteras">
            <div>
                <p>{cartera.name}</p>
                <label
                    htmlFor={`pays-${name}`}
                    onChange={(e)=>{
                        label_ref.current.textContent=e.target.files[0].name;
                    }}
                >
                    <p ref={label_ref}>Elegir archivo</p>
                    <input type="file" id={`pays-${name}`}/>
                </label>
                <p>{cartera.state}</p>
                <p>{cartera.fecha_carga}</p>
                <p>
                    {
                        (pays_denied.result.length > 0)
                        ?
                            <button
                                onClick={(e)=>{
                                    console.log('Abriendo modal, pays_denied:', pays_denied);
                                    setView(true);
                                }}
                            >
                                Procesar {pays_denied.result.length}
                            </button>
                        :
                            0
                    }
                </p>

                <NavLink to={`${import.meta.env.VITE_URL_BASE}/nopays?cartera=${name}`}>Descargar</NavLink>

                <button
                    onClick={(e)=>{
                        const file=document.getElementById(`pays-${name}`);

                        if(file.files[0]===undefined){

                            sendpush({
                                title:'ERR: formato de archivo inválido.',
                                message:'Por favor, elige un archivo en formato EXCEL e intenta de nuevo.',
                                type:'Push--danger',
                                timeout:3000
                            });

                        }else{
                            const data_import=new FormData();
                            data_import.append('file',file.files[0]);
                            data_import.append('business_id',cartera.business_id);
                            e.target.textContent='Verificando pagos, espere...';

                            fetch(`${import.meta.env.VITE_URL_BASE}/ImportPayments`,{
                                method:'POST',
                                body:data_import,
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if(data.success || data.imported >= 0){
                                        const skipped = data?.skipped || 0;
                                        const imported = data?.imported || 0;
                                        const error_sum_count = data?.error_sum_count || 0;

                                        // Actualizar el estado de pagos con ERROR_SUM si existen
                                        if(data.error_sum_payments && data.error_sum_payments.length > 0){
                                            setPays({
                                                result: data.error_sum_payments,
                                                data: data.error_sum_payments,
                                                total: data.error_sum_payments.length
                                            });
                                        }

                                        if(skipped > 0){
                                            sendpush({
                                                title:'Importación completada.',
                                                message:`${imported} pagos importados, ${skipped} omitidos. ${error_sum_count > 0 ? `${error_sum_count} con ERROR_SUM.` : ''}`,
                                                type:'Push--warning',
                                                timeout:5000
                                            });

                                            e.target.textContent=`Importados: ${imported}, Omitidos: ${skipped}`;
                                        }else if(error_sum_count > 0){
                                            sendpush({
                                                title:'Importación completada.',
                                                message:`${imported} pagos importados. ${error_sum_count} marcados con ERROR_SUM para procesar.`,
                                                type:'Push--warning',
                                                timeout:5000
                                            });

                                            e.target.textContent='Importación correcta';
                                        }else{
                                            sendpush({
                                                title:'Éxito.',
                                                message:`${imported} pagos importados correctamente.`,
                                                type:'Push--sucessful',
                                                timeout:3000
                                            });

                                            e.target.textContent='Importación correcta';
                                        }
                                    }else{
                                        if(data.failures){
                                            sendpush({
                                                title:'ERR: Errores en validación',
                                                message:'El archivo contiene errores de validación.',
                                                type:'Push--danger',
                                                timeout:3000
                                            });

                                            e.target.textContent='Intentar de nuevo';
                                            setFallas(data.failures);
                                            setViewFallas(true);
                                        }else{
                                            sendpush({
                                                title:'ERR: Error en importación',
                                                message:data.message || 'Error al importar pagos.',
                                                type:'Push--danger',
                                                timeout:3000
                                            });

                                            e.target.textContent='Intentar de nuevo';
                                        }
                                    }
                                })
                                .catch((error) => {
                                    sendpush({
                                        title:'ERR: Error de red',
                                        message:'No se pudo conectar con el servidor.',
                                        type:'Push--danger',
                                        timeout:3000
                                    });
                                    e.target.textContent='Intentar de nuevo';
                                });
                        }
                    }}
                >Subir</button>
            </div>
            
            {(() => {
                console.log('Renderizando CardManualPay? viewManual:', viewManual, 'pays_denied:', pays_denied);
                return (viewManual) 
                ?
                    <CardManualPay
                        callback={updateView}
                        pays={pays_denied}
                        cartera={name}
                        setUpdate={setPays}
                    />
                :
                    <>
                    </>;
            })()}

            {
                (viewFallas)
                ?   
                    <div className="CardFail">
                        <button className="CardCondonacion__close" onClick={()=>{setViewFallas(false)}}>Volver</button>
                        {
                            fallas.map((falla,index)=>(
                                <div key={index}>
                                    <p>Fila: {falla.row}</p>
                                    <p>Atributo: {falla.attribute}</p>
                                    <p>Error: {falla.errors[0]}</p>
                                </div>
                            ))
                        }
                    </div>
                :   <></>
            }
            
        </div>
    );
}