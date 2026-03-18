import { useEffect, useState } from "react";
import "./CardCreateCampain.css";
import useFetch from "../../../hooks/useFetch";
import sendpush from "../../../helpers/sendpush";

export default function CardCreateCampain({setData}){
    const { fetchWithAuth } = useFetch();

    const [campain,setCampain]=useState({
        name:"",
        begin_time:"",
        end_time:"",
        data:[],
        business_ids:[],
        type:"manual"
    });

    const [agents,setAgents]=useState();
    const [business,setBusiness]=useState();
    const [new_business,setNew]=useState();

    useEffect(()=>{
        setCampain({
            name:"",
            begin_time:"",
            end_time:"",
            data:[],
            business_ids:[],
            type:'manual'
        });

        setNew(false);

        //Bajamos los agentes
        fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/users?agents=true&is_active=1`)
            .then((response) => response.json())
            .then((data) => {
                const data_prev = Array.isArray(data) ? data : (data.result?.data || []);
                data_prev.map(agent=> {
                    agent.status=false
                });
                setAgents(data_prev);
            })
            .catch(error => {
                console.error('Error fetching agents:', error);
                setAgents([]);
            });

        //Bajamos las carteras
        fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/businesses`)
            .then((response) => response.json())
            .then((data) => {
                setBusiness(data.result.data || []);
            })
            .catch(error => {
                setBusiness([]);
            });
    },[]);

    if(!agents) return <></>
    if(!business) return <></>
    if(!campain) return <></>

    return (
        <div className="CardCreateCampain">
            <p>Crear campaña</p>

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
                                    
                                />
                                {agent.name}
                            </label>
                        ))
                    }

                </div>
            </div>

            <div className="CardCreateCampain__form">
                <div className="CardCreateCampain__agents" style={{gridColumn:'1 / -1'}}>
                    <label>Empresa</label>
                    <div className="CardCreateCampain__content">
                        {business.filter(b => b.name !== 'CARTERA VENDIDA').map((bus, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    value={bus.id}
                                    checked={campain.business_ids.includes(bus.id)}
                                    onChange={(e) => {
                                        const { id } = bus;
                                        const prev = campain.business_ids;
                                        setCampain({
                                            ...campain,
                                            business_ids: e.target.checked
                                                ? [...prev, id]
                                                : prev.filter(b => b !== id)
                                        });
                                    }}
                                />
                                {bus.name}
                            </label>
                        ))}
                    </div>
                </div>

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

                        if(campain.name==='' || campain.begin_time==='' || campain.end_time==='' || campain.business_ids.length===0){
                            sendpush({
                                title:'ERR: Datos incompletos.',
                                message:'Por favor, llene todos los campos.',
                                type:'Push--danger',
                                timeout:3000
                            });
                            return;
                        }

                        e.target.textContent='Creando campaña...';
                        e.target.disabled = true;

                        const agents_select=[];

                        agents.map(agent=>{
                            if(agent.status){
                                agents_select.push(agent.id);
                            }
                        });

                        const data={
                            name:campain.name,
                            business_ids:JSON.stringify(campain.business_ids),
                            begin_time:campain.begin_time,
                            end_time:campain.end_time,
                            type:campain.type,
                            agents:JSON.stringify(agents_select),
                            state:'ACTIVE'
                        };

                        try {
                            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/campains`,{
                                method:'POST',
                                body:new URLSearchParams(data)
                            });

                            const result = await response.json();

                            e.target.textContent='Campaña creada';

                            if(result.result && result.result.data) {
                                setData(result.result.data);
                            }

                            setCampain({
                                name:"",
                                begin_time:"",
                                end_time:"",
                                data:[],
                                business_id:"",
                                type:"manual"
                            });

                            sendpush({
                                title:'Éxito.',
                                message:'Campaña creada correctamente.',
                                type:'Push--sucessful',
                                timeout:3000
                            });

                        } catch(error) {
                            console.error('Error creating campaign:', error);
                            e.target.textContent='Guardar';

                            sendpush({
                                title:'Error.',
                                message:'Error al crear la campaña.',
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