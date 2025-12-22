import { useEffect, useState } from "react";
import "./CardEditCampain.css";
import useFetch from "../../../hooks/useFetch";
import sendpush from "../../../helpers/sendpush";

export default function CardEditCampain({data_campain}){
    const { fetchWithAuth } = useFetch();

    const [campain,setCampain]=useState({
        name:"",
        id:"",
        agents:[],
        begin_time:"",
        end_time:"",
        data:[],
        business_id:"",
        type:""
    });

    const [agents,setAgents]=useState();
    const [business,setBusiness]=useState();

    useEffect(()=>{
        const campaignAgents = data_campain.agents_details || [];

        setCampain({
            id:data_campain.id,
            name:data_campain.name,
            agents:campaignAgents,
            begin_time:data_campain.begin_time?.split(' ')[0] || '',
            end_time:data_campain.end_time?.split(' ')[0] || '',
            data:[],
            business_id:data_campain.business_id,
            type:data_campain.type || 'manual'
        });

        fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/users?agents=true&is_active=1`)
            .then((response) => response.json())
            .then((data) => {
                const data_prev = Array.isArray(data) ? data : (data.result?.data || []);

                data_prev.forEach(agent => {
                    agent.status = false;
                });

                campaignAgents.forEach((agent_campain) => {
                    data_prev.forEach(agent => {
                        if(agent.id === agent_campain.id){
                            agent.status = true;
                        }
                    });
                });

                setAgents(data_prev);
            })
            .catch(error => {
                console.error('Error fetching agents:', error);
                setAgents([]);
            });

        fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/businesses`)
            .then((response) => response.json())
            .then((data) => {
                setBusiness(data.result.data || []);
            })
            .catch(error => {
                console.error('Error fetching business:', error);
                setBusiness([]);
            });
    },[]);

    if(!agents) return <></>
    if(!business) return <></>

    return (
        <div className="CardCreateCampain">
            <p>Editar campaña</p>

            <label className="CardCreateCampain__input">
                Nombre
                <input
                    value={campain.name} 
                    onChange={(e)=>{
                        setCampain({
                            ...campain,
                            name:e.target.value
                        })
                    }}
                    type="text" 
                    placeholder="Escribe aquí"
                />
            </label>

            <div className="CardCreateCampain__agents">
                <label>Agentes</label>
                <div className="CardCreateCampain__content">

                    {
                        agents.map((agent,index)=>(

                            <label key={index}>
                                <input 
                                    key={index}
                                    onChange={(e)=>{
                                        const data_prev=agents;
                                        
                                        data_prev.map(agent_actual=> {
                                            if(agent.id===agent_actual.id){
                                                agent_actual.status=e.target.checked;   
                                            }
                                        });
                                        setAgents(data_prev);
                                    }}

                                    value={agent.id}
                                    type="checkbox"
                                    defaultChecked={agent.status}
                                />
                                
                                {agent.name}
                            </label>

                        ))
                    }

                </div>
            </div>

            <div className="CardCreateCampain__form">
                <label className="CardCreateCampain__select">
                    Empresa
                    <select
                        value={campain.business_id}
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                business_id:e.target.value
                            });
                        }}
                    >
                        {
                            business.map((bus,index)=>(
                                (bus.name!=='CARTERA VENDIDA')
                                ?
                                    <option key={index} value={bus.id}>{bus.name}</option>
                                : <></>
                            ))
                        }
                    </select>
                </label>

                <label className="CardCreateCampain__select">
                    Tipo de campaña
                    <select
                        value={campain.type}
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                type:e.target.value
                            });
                        }}
                    >
                        <option value={"manual"}>Carga manual</option>
                        <option value={"api"}>Sincronización | Web Service</option>
                    </select>
                </label>

                <label className="CardCreateCampain__input">
                    Fecha de inicio
                    <input
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                begin_time:e.target.value
                            })
                        }}
                        value={campain.begin_time}
                        type="date"/>
                </label>

                <label className="CardCreateCampain__input">
                    Fecha de fin
                    <input
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                end_time:e.target.value
                            })
                        }}
                        value={campain.end_time}
                        type="date"
                    />
                </label>
            </div>

            <div className="CardCreateCampain__footer">
                <button
                    onClick={async (e)=>{

                        if(campain.name==='' || campain.begin_time==='' || campain.end_time==='' || campain.business_id===''){
                            sendpush({
                                title:'ERR: Datos incompletos.',
                                message:'Por favor, llene todos los campos.',
                                type:'Push--danger',
                                timeout:3000
                            });
                            return;
                        }

                        e.target.textContent="Actualizando...";
                        e.target.disabled = true;

                        const agents_select=[];

                        agents.map(agent=>{
                            if(agent.status){
                                agents_select.push(agent.id);
                            }
                        });

                        const data={
                            name:campain.name,
                            business_id:campain.business_id,
                            begin_time:campain.begin_time,
                            end_time:campain.end_time,
                            type:campain.type,
                            agents:JSON.stringify(agents_select),
                            state:'ACTIVE'
                        };

                        try {
                            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/campains/${campain.id}`,{
                                method:'PUT',
                                body:new URLSearchParams(data)
                            });

                            await response.json();

                            e.target.textContent="Actualizado";

                            sendpush({
                                title:'Éxito.',
                                message:'Campaña actualizada correctamente.',
                                type:'Push--sucessful',
                                timeout:3000
                            });

                        } catch(error) {
                            console.error('Error updating campaign:', error);
                            e.target.textContent='Guardar';

                            sendpush({
                                title:'Error.',
                                message:'Error al actualizar la campaña.',
                                type:'Push--danger',
                                timeout:3000
                            });
                        } finally {
                            e.target.disabled = false;
                        }
                    }}

                    className="CardCreateCampain__button CardCreateCampain__button--save"
                >Guardar</button>
            </div>
        </div>
    );
}