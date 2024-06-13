import { useEffect, useState } from "react";
import "./CardCreateCampain.css"

export default function CardCreateCampain({setData}){

    const [campain,setCampain]=useState({
        name:"",
        fecha_init:"",
        fecha_finish:"",
        data:[],
        cartera:""
    });

    const [agents,setAgents]=useState();
    const [business,setBusiness]=useState();

    useEffect(()=>{
        setCampain({
            name:"",
            fecha_init:"",
            fecha_finish:"",
            data:[],
            cartera:"SEFIL_1"
        });

        //Bajamos los agentes
        fetch(`https://sefil.softsen.space/public/api/users?role=gestor`,{
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

                <label className="CardCreateCampain__input">
                    Cargar datos
                    <input 
                        onChange={(e)=>{

                        }}
                        type="text"
                    />
                </label>

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
                            distributions:JSON.stringify([])
                        };

                        fetch("https://sefil.softsen.space/public/api/campains",{
                            method:'POST',
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            },
                            body:new URLSearchParams(data)
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                setData(data.data);
                                setCampain({
                                    name:"",
                                    fecha_init:"",
                                    fecha_finish:"",
                                    data:[],
                                    cartera:"SEFIL_1"
                                });
                            });

                    }}
                    className="CardCreateCampain__button CardCreateCampain__button--save"
                >Guardar</button>
            </div>
        </div>
    );
}