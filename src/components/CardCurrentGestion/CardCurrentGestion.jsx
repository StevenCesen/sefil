import { useEffect, useState } from "react";
import ReactAudioPlayer from 'react-audio-player';
import "./CardCurrentGestion.css";

export default function CardCurrentGestion({data}){

    const [calls,setCalls]=useState();

    useEffect(()=>{
        console.log(data)
        const ids=JSON.parse(data.id_calls_extras);
        let prev_calls=[];
        
        ids.map((id)=>{
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/calls/${id}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    console.log(data);
                    setCalls([data.call]);
                    prev_calls.push(data.call);
                });
        });

    },[]);

    if(!calls) return <></>

    return (
        <div className="CardCurrentGestion">
            <p>Llamadas</p>
            {
                console.log(calls)
            }
            <div className="CardCurrentGestion__head">
                <label>Fecha</label>
                <label>Tiempo</label>
                <label>Contacto</label>
                <label>Número</label>
                <label>Estado</label>
                <label>Grabación</label>
            </div>

            {
                calls.map((call,index)=>(
                    <div key={index} className="CardCurrentGestion__item">
                        <label>{call.fecha}</label>
                        <label>{call.duration_call} seg.</label>
                        <label>{data.client_name}</label>
                        <label>{call.phone}</label>
                        <label>{call.state_call}</label>
                        <ReactAudioPlayer
                            style={{width:"100%"}}
                            src={`https://core.sefil.com.ec/api/public/files/audios/${call.id_record}`}
                            autoPlay
                            controls
                        />
                    </div>
                ))
            }

        </div>
    );
}