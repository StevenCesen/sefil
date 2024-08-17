import { useEffect, useState } from "react";
import "./CardSync.css";
import ProgressBar from "../ProgressBar/ProgressBar";

export default function CardSync(){

    const [number_credits,setNumberCredits]=useState();
    const [porcentual,setPorcentual]=useState(0);

    const [interval,setBucle]=useState();

    useEffect(()=>{
        setBucle(
            setInterval(() => {
                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/sync/status/1`,{
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then((response) => response.json())  
                    .then((data) => {
                        setPorcentual(data);
                    });
            }, 3000)
        );

        return () => clearInterval(interval);

    },[]);

    return (
        <div className="CardSync">
            <h3>Sincronizando créditos de la campaña FACES_AGOSTO_Sync</h3>

            <div className="CardSync__detail">
                <h4>Créditos</h4>
                <p>
                    {
                        (!number_credits)
                        ?
                            "Consultando créditos, esto puede llevar unos minutos..."   
                        :   number_credits
                    }
                </p>
            </div>

            {
                (!number_credits)
                ?
                    <div className="CardSync__detail">
                        <h4>Estado de sincronización</h4>
                        <p>Actualizando contactos y pagos, esto puede llevar unos minutos...</p>

                        <ProgressBar
                            val_porcentual={porcentual}
                        />

                    </div>
                :   <></>
            }

        </div>
    );    
}