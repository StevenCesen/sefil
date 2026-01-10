import { useEffect, useState } from "react";
import "./CardCurrentGestion.css";
import { MessageCircle } from "lucide-react";
import getCallsByManagementID from "../../helpers/Managements/getCallsByManagementID";

export default function CardCurrentGestion({management_id}){

    const [calls,setCalls]=useState(null);

    const handleGetCalls = async ({management_id})=>{
        const calls = await getCallsByManagementID({management_id});
        setCalls(calls.result);
    }

    useEffect(()=>{
        handleGetCalls({management_id});
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
                (calls.length > 0) ? (
                    calls.map((call,index)=>(
                        <div key={index} className="CardCurrentGestion__item">
                            <label>{call.created_at}</label>
                            <label>{call.call_duration} seg.</label>
                            <label>{call.client_name}</label>
                            <label>{(call.call_channel==='WA') ? <MessageCircle color="green" size={16}/> : <></>} {call.phone_number}</label>
                            <label>{call.call_state}</label>
                            <audio controls style={{width:"100%"}} src={`https://core.sefil.com.ec/api/public/files/audios/${call.call_media_path}`}></audio>
                        </div>
                    ))
                ) : (
                    <span className="CardCurrentGestion__span">No hay llamadas registradas para esta gestión.</span>
                )
            }
        </div>
    );
}