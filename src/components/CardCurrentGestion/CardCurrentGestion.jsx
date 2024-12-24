import { useEffect, useState } from "react";
import ReactAudioPlayer from 'react-audio-player';
import "./CardCurrentGestion.css";

export default function CardCurrentGestion({data}){

    const [calls,setCalls]=useState();

    const updateCall=(call)=>{
        let copy=(calls.length>0) ? calls : [];
        console.log(copy)
        copy.push(call);
        setCalls(copy);
    }

    useEffect(()=>{
        const ids=JSON.parse(data.id_calls_extras);
        localStorage.removeItem('calls');
        
        if(ids.length==0){
            setCalls([]);
        }

        ids.map(async (id)=>{
            await fetch(`${import.meta.env.VITE_URL_BASE}/calls/${id}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    if(localStorage.getItem('calls')){
                        const calls_s=JSON.parse(localStorage.getItem('calls'));
                        calls_s.push(data.call);
                        localStorage.setItem('calls',JSON.stringify(calls_s));
                    }else{
                        const calls_s=[];
                        calls_s.push(data.call);
                        localStorage.setItem('calls',JSON.stringify(calls_s));
                    }
                });

            setCalls(JSON.parse(localStorage.getItem('calls')).sort(function(a,b){return a.id-b.id}));

        });

    },[]);

    if(!calls) return <></>

    return (
        <div className="CardCurrentGestion">
            <p>Llamadas</p>
        
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
                            controls
                        />
                    </div>
                ))
            }

        </div>
    );
}