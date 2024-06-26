import { NavLink } from "react-router-dom";
import "./CardUpdatePay.css";
import { useEffect, useRef, useState } from "react";
import addNotification from "react-push-notification";
import CardManualPay from "../CardManualPay/CardManualPay";


export default function CardUpdatePay({name,fecha_carga,state}){
    
    const [viewManual,setView]=useState(false);
    const [pays_denied,setPays]=useState([]);
    const [cartera,setCartera]=useState({
        name:'',
        state:''
    });

    const [viewFallas,setViewFallas]=useState();
    const [fallas,setFallas]=useState();

    const label_ref=useRef();

    const updateView=()=>{
        setView(!viewManual);
    }

    useEffect(()=>{
        setView(false);
        setViewFallas(false);
        setFallas([]);
        setCartera({
            name:name,
            fecha_carga:fecha_carga,
            state:state
        });

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/pays/denied?cartera=${name}`,{
            headers: {
                Accept: 'application/json',
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setPays(data);
            });
            
    },[]);

    if(!fallas) return <></>

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
                        (pays_denied.total>0) 
                        ?
                            <div>
                                <button
                                    onClick={(e)=>{
                                        setView(true)
                                    }}
                                >
                                    Procesar {pays_denied.total}
                                </button>
                                <button 
                                    onClick={(e)=>{
                                        location.href=`${import.meta.env.VITE_URL_BASE}/public/api/pays/denegados?cartera=SEFIL_2`;
                                    }}
                                    style={{marginLeft:5,padding:5,color:'var(--color-2)',backgroundColor:"inherit",border:'1px solid'}}
                                >
                                    EXCEL
                                </button>
                            </div>
                        :
                            pays_denied.total
                    }
                </p>
                
                <NavLink to={`${import.meta.env.VITE_URL_BASE}/public/api/nopays?cartera=${name}`}>Descargar</NavLink>

                <button
                    onClick={(e)=>{
                        const file=document.getElementById(`pays-${name}`);

                        if(file.files[0]===undefined){
                            addNotification({
                                title: 'Error archivo',
                                subtitle: 'Se debe cargar un archivo',
                                message: 'Por favor, elige un archivo en formato EXCEL e intenta de nuevo',
                                native: false,
                                backgroundTop: '#FF9619',
                                backgroundBottom: '#fdb864',
                                colorTop: 'white',
                                colorBottom: 'white',
                                closeButton: 'Cerrar',
                                duration: 4000,
                            });
                        }else{
                            const data_import=new FormData();
                            data_import.append('name',name);
                            data_import.append('file',file.files[0]);
                            e.target.textContent='Verificando pagos, espere...';

                            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/cartera/pagosUpdate`,{
                                method:'POST',
                                body:data_import,
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    if(!('fallas' in data)){
                                        if(data.pagos_erroneos.data.length>0){
                                            setPays(data.pagos_erroneos);
                                            addNotification({
                                                title: 'Pagos subidos',
                                                subtitle: 'Carga completa, con pendientes',
                                                message: 'Se han encontrado pagos con diferencias',
                                                native: false,
                                                backgroundTop: '#FF9619',
                                                backgroundBottom: '#fdb864',
                                                colorTop: 'white',
                                                colorBottom: 'white',
                                                closeButton: 'Cerrar',
                                                duration: 4000,
                                            });

                                            e.target.textContent='Subido con pagos erróneos';

                                        }else{
                                            addNotification({
                                                title: 'Pagos subidos',
                                                subtitle: 'Carga completa sin pendientes',
                                                message: '',
                                                native: false,
                                                backgroundTop: '#009793',
                                                backgroundBottom: '#459d9a',
                                                colorTop: 'white',
                                                colorBottom: 'white',
                                                closeButton: 'Cerrar',
                                                duration: 4000,
                                            });

                                            e.target.textContent='Importación correcta';
                                        }
                                    }else{
                                        addNotification({
                                            title: 'Error',
                                            subtitle: 'Formato incorrecto',
                                            message: 'El archivo cargado no cumple con el formato',
                                            native: false,
                                            backgroundTop: '#FF9619',
                                            backgroundBottom: '#fdb864',
                                            colorTop: 'white',
                                            colorBottom: 'white',
                                            closeButton: 'Cerrar',
                                            duration: 3000,
                                        });

                                        e.target.textContent='Intentar de nuevo';
                                        setFallas(data.fallas)
                                        setViewFallas(true);
                                        
                                    }
                                });
                        }
                    }}
                >Subir</button>
            </div>
            
            {
                (viewManual) 
                ?
                    <CardManualPay
                        callback={updateView}
                        pays={pays_denied}
                        cartera={name}
                        setUpdate={setPays}
                    />
                :
                    <>
                    </>
            }

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