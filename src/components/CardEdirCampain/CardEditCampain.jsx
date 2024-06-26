import { useEffect, useState } from "react";
import "./CardEditCampain.css"

export default function CardEditCampain({data_campain}){

    const [campain,setCampain]=useState({
        name:"",
        id:"",
        agents:[],
        fecha_init:"",
        fecha_finish:"",
        data:[],
        cartera:"",
        distributions:[]
    });

    const [agents,setAgents]=useState();
    const [business,setBusiness]=useState();

    useEffect(()=>{
        setCampain({
            id:data_campain.id,
            name:data_campain.name,
            agents:JSON.parse(data_campain.agents),
            fecha_init:data_campain.fecha_init,
            fecha_finish:data_campain.fecha_finish,
            data:[],
            cartera:data_campain.cartera,
            distributions:data_campain.distributions
        });

        //Bajamos los agentes
        fetch(`https://sefil.softsen.space/public/api/users/agents`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {

                const data_prev=data;
                data_prev.map(agent=> {
                    agent.status=false
                });
                
                JSON.parse(data_campain.agents).map((agent_campain)=>{
                    data_prev.map(agent=> {
                        if(agent.id===agent_campain.id){
                            agent.status=true
                        }
                    });
                })
            
                setAgents(data_prev);
            });
        
        //Bajamos las carteras
        fetch("https://sefil.softsen.space/public/api/bussines",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
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
                        value={campain.cartera}
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                cartera:e.target.value
                            });
                        }}
                    >
                        {
                            business.map((bus,index)=>(
                                (bus.name!=='CARTERA VENDIDA')
                                ?
                                    <option key={index} value={bus.name}>{bus.name}</option>
                                : <></>
                            ))
                        }
                    </select>
                </label>
                
                <label></label>

                <label className="CardCreateCampain__input">
                    Fecha de inicio
                    <input
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                fecha_init:e.target.value
                            })
                        }}
                        value={campain.fecha_init} 
                        type="date"/>
                </label>
                
                <label className="CardCreateCampain__input">
                    Fecha de fin
                    <input 
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                fecha_finish:e.target.value
                            })
                        }}
                        value={campain.fecha_finish} 
                        type="date"
                    />
                </label>
            </div>

            <div className="CardCreateCampain__footer">
                <button 
                    onClick={(e)=>{

                        e.target.textContent="Actualizando...";

                        const agents_select=[];

                        agents.map(agent=>{
                            if(agent.status){
                                agents_select.push({
                                    id:agent.id,
                                    name:agent.name
                                });
                            }
                        });

                        const data={
                            agents:JSON.stringify(agents_select),
                            name:campain.name,
                            cartera:campain.cartera,
                            fecha_init:campain.fecha_init,
                            fecha_finish:campain.fecha_finish,
                            distributions:campain.distributions
                        };

                        fetch(`https://sefil.softsen.space/public/api/campains/${campain.id}`,{
                            method:'PUT',
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            },
                            body:new URLSearchParams(data)
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                e.target.textContent="Actualizado";
                            });

                    }}
                    className="CardCreateCampain__button CardCreateCampain__button--save"
                >Guardar</button>
            </div>
        </div>
    );
}