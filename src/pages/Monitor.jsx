import { NavLink } from "react-router-dom";
import "./pages.css";
import { useContext, useEffect, useRef, useState } from "react";
import CardUserState from "../components/CardUserState/CardUserState.jsx";
import Loader from "../components/Loader/loader.jsx";
import { GestionContext } from "../contexts/GestionContext.jsx";
import useReceiveState from "../hooks/useReceiveState.js";

export default function Monitor(){

    const [agents,setAgents]=useState();
    const [campains,setCampains]=useState();
    const [campain,setCampain]=useState();
    const [interval_agents,setIntervalAgent]=useState();
    const [loading,setLoading]=useState();
    const datacontext=useContext(GestionContext);
    const [current_agents,setCurrentAgents]=useState();
    const connection = useRef(null);
    
    const updateState=()=>{
        setIntervalAgent(
            setInterval(() => {

                (location.hash==="#/dashboard/monitor") 
                ?
                    fetch(`${import.meta.env.VITE_URL_BASE}/users?campain=26&cartera=syncs`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then((data) => {
                            const data_prev=data;
                            let agents_new=[];
                            
                            data_prev.map(agent=> {
                                agent.status='DESCONECTADO';

                                if(agent.name!=='Vanesa Rodriguez' & agent.name!=='Alexis Ortega' & agent.name!=='Patricio Paéz'){
                                    if(localStorage.getItem('filter_campain')!==null & localStorage.getItem('filter_campain')!==""){
                                        
                                        if(agent.gestion.length>0){
                                            let new_agents=[];

                                            agent.gestion.map((camp)=>{
                                                if(camp.campain===localStorage.getItem('filter_campain')){
                                                    new_agents.push(camp);
                                                }
                                            });

                                            agent.gestion=new_agents;
                                            if(agent.gestion.length>0){
                                                agents_new.push(agent);
                                            }
                                        }

                                    }else{
                                        agents_new.push(agent);
                                    }
                                }

                            });

                            setAgents(agents_new);
                        })
                :   clearInterval(interval_agents)
                
            }, 5000)
        );
    }

    const updateData=(data)=>{
        let agentes=datacontext.agents;
        let new_agents=[];
    

        const ids=localStorage.getItem('agents_ids');
    
        agentes.map(agente=>{
            if(agente.id==data.user_id){
                if('all' in data){
                    agente.id=data.user_id;
                    agente.agente=data.agente;
                    agente.state=data.state;
                    agente.tiempo=data.tiempo;
                    agente.campain=data.campain;
                    agente.total_credits=data.total_credits;
                    agente.total_credits_ges=data.total_credits_ges;
                    agente.total_credits_ges_dia=data.total_credits_ges_dia;
                    agente.total_credits_ges_efec=data.total_credits_ges_efec;
                    agente.total_credits_ges_efec_dia=data.total_credits_ges_efec_dia;
                    agente.nro_pendientes=data.nro_pendientes;
                    agente.nro_proceso_dia=data.nro_proceso_dia;
                    agente.nro_proceso=data.nro_proceso;
                    agente.nro_llamadas=data.nro_llamadas;
                    agente.nro_llamadas_acum=data.nro_llamadas_acum;
                    agente.nro_llamadas_efec=data.nro_llamadas_efec;
                    agente.nro_llamadas_no_efec=data.nro_llamadas_no_efec;
                }else{
                    agente.state=data.state;
                    agente.tiempo=data.tiempo;
                }
            }

            if(JSON.parse(ids).includes(agente.id)){
                new_agents.push(agente);
            }
        
        });

        datacontext.setAgents(new_agents);
        setAgents(new_agents);
    }

    useEffect(()=>{

        if(location.hash==='#/dashboard/monitor'){
            
            const conn = new WebSocket('wss://check.sefil.com.ec/ws');

            conn.onopen = function(e) {
                console.log("Connection established!");
            };
            
            conn.onmessage = function(e) {
                const data=JSON.parse(e.data);
                updateData(data.data);
            };

            setCurrentAgents(datacontext.agents);
            setAgents(datacontext.agents);
            setCampains(datacontext.campains);
            setCampain(datacontext.campain.name);

            let ids=[];

            datacontext.agents.map((ag=>{
                ids.push(ag.id);
            }));

            localStorage.setItem('agents_ids',JSON.stringify(ids));

            document.addEventListener("visibilitychange", function(e) {
                if(e.target.visibilityState==='visible'){
                    fetch(`${import.meta.env.VITE_URL_BASE}/users/monitor?campain=${localStorage.getItem('campain_id')}&cartera=syncs`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then((data) => {
                            console.log(data);
                            datacontext.setAgents(data);
                            setAgents(data);

                            let ids=[];

                            data.map((ag=>{
                                ids.push(ag.id);
                            }));

                            localStorage.setItem('agents_ids',JSON.stringify(ids));
                        });
                }
            });

            connection.current = conn;

            if (connection.current) {
                return () => {
                    connection.current.close();  // Cerrar la conexión de WebSocket
                };
            }
        }

    },[]);

    if(!agents) return <Loader/>
    if(!campains) return <Loader/>

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
                <NavLink
                    to="" 
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1) 
                    }}
                >Regresar</NavLink>
            </div>

            <div className="pageConsulta__search">
                <h4 className="Reports__title">Monitoreo</h4>
                <label>
                    Campaña
                    <select
                        value={campain}
                        onChange={(e)=>{
                            setCampain(e.target.value);
                            setLoading(true);

                            console.log(`${import.meta.env.VITE_URL_BASE}/users/monitor?campain=${e.target.value.split('/')[1]}&cartera=${e.target.value.split('/')[0]}`)

                            fetch(`${import.meta.env.VITE_URL_BASE}/users/monitor?campain=${e.target.value.split('/')[1]}&cartera=${e.target.value.split('/')[0]}`,{
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    
                                    datacontext.setAgents(data);
                                    setAgents(data);

                                    let ids=[];

                                    data.map((ag=>{
                                        ids.push(ag.id);
                                    }));

                                    localStorage.setItem('agents_ids',JSON.stringify(ids));

                                    setLoading(false);
                                });
                        }}
                    >
                        <option value={""}>-- Todas --</option>
                        {
                            campains.map(campain=>(
                                <option value={`${campain.cartera}/${campain.id}/${campain.name}`}>{campain.name}</option>
                            ))
                        }
                    </select>
                </label>
            </div>

            <div className="pageConsulta__monitor">
                <div className="pageConsulta__monitorHead" style={{top:"-20px"}}>
                    <label>Usuario</label>
                    <label>Estado</label>
                    <label>Tiempo</label>
                    
                    <label>Nro. créditos asignados</label>
                    <label>
                        Nro. créditos gestionados
                        <div>
                            <label>Acum.</label>
                            <label>Día.</label>
                        </div>
                    </label>
                    <label>
                        Nro. créditos gestion efec.
                        <div>
                            <label>Acum.</label>
                            <label>Día.</label>
                        </div>
                    </label>
                    <label>Nro. créditos pendientes</label>
                    <label>
                        Nro. créditos en proceso
                    </label>
                    <label>
                        Nro. llamadas
                        <div>
                            <label>Acum.</label>
                            <label>Día.</label>
                        </div>
                    </label>
                </div>

                {
                    agents.map((campain,index)=>(
                        <CardUserState
                            key={index}
                            name={campain.agente}
                            state={campain.state}
                            time={campain.tiempo}
                            name_campain={campain.campain}
                            mode={"complete"}
                            data={{
                                nro_credits:campain.total_credits,
                                nro_gestions:campain.total_credits_ges,
                                nro_gestions_dia:campain.total_credits_ges_dia,
                                nro_gestions_efec:campain.total_credits_ges_efec,
                                nro_gestions_efec_dia:campain.total_credits_ges_efec_dia,
                                nro_pendientes:campain.nro_pendientes,
                                nro_proceso:campain.nro_proceso,
                                nro_proceso_dia:campain.nro_proceso_dia,
                                nro_calls:campain.nro_llamadas,
                                nro_calls_acum:campain.nro_llamadas_acum,
                            }}
                        />
                    ))
                }

            </div>
            {
                (loading)
                ?
                    <Loader/>
                :   <></>
            }
        </div>
    );
}