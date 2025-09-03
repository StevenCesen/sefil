import { useEffect, useState } from "react";
import "./CardSync.css";
import ProgressBar from "../ProgressBar/ProgressBar";

export default function CardSync(){

    const [number_credits,setNumberCredits]=useState();
    const [porcentual,setPorcentual]=useState(0);
    const [message,setMessage]=useState("");

    const [interval,setBucle]=useState();

    useEffect(()=>{
        setBucle(
            (porcentual<100) &&
                setInterval(() => {
                    fetch(`${import.meta.env.VITE_URL_BASE}/sync/status`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then((data) => {
                            if(data.status===400){
                                setPorcentual(0);
                                setMessage("No hay sincronizaciones");
                            }else if(data.status==='ERROR - NULL'){
                                setMessage(data.message);
                            }else if(data.status===200){
                                setMessage("Consultando créditos, esto puede llevar unos minutos..." );
                                setPorcentual(data.porcentual);
                                setNumberCredits(data.total);
                            }
                        });
                }, 3000)
        );

        if(porcentual<100){
            return () => clearInterval(interval);
        }else{
            setPorcentual(100);
        }

    },[]);

    if(!message) return <></>

    return (
        <div className="CardSync">
            <h3>Proceso de sincronización</h3>

            <div className="CardSync__detail">
                <h4>Créditos</h4>
                <p>
                    {
                        (porcentual===0)
                        ?
                            message
                        :   (!number_credits)
                            ?
                                message  
                            :   "Sincronizando: "+number_credits+" créditos."
                    }
                </p>
            </div>
            
            {
                (number_credits)
                ?
                    <div className="CardSync__detail">
                        <h4>Estado de sincronización</h4>
                        {
                            (porcentual===0)
                            ?   <p>No hay sincronizaciones</p>
                            :   <p>Actualizando contactos, esto puede llevar unos minutos...</p>
                        }

                        <ProgressBar
                            val_porcentual={porcentual}
                        />

                    </div>
                :   <></>
            }

        </div>
    );    
}