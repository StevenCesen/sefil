import { NavLink } from "react-router-dom";
import "./pages.css";
import { useContext, useEffect, useState } from "react";
import CardUserState from "../components/CardUserState/CardUserState.jsx";
import { GestionContext } from "../contexts/GestionContext.jsx";
import Loader from "../components/Loader/loader.jsx";

export default function Monitor(){

    const [agents,setAgents]=useState();
    const [campains,setCampains]=useState();
    const [campain,setCampain]=useState();
    const [interval_agents,setIntervalAgent]=useState();
    const [loading,setLoading]=useState();

    const updateState=()=>{
        setIntervalAgent(
            setInterval(() => {

                (location.hash==="#/dashboard/monitor") 
                ?
                    fetch(`${import.meta.env.VITE_URL_BASE}/users`,{
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

                                if(agent.name!=='EN ESPERA' & agent.name!=='Vanesa Rodriguez' & agent.name!=='Alexis Ortega' & agent.name!=='Patricio Paéz' & agent.name!=='Dayannara Mora'){
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
                
            }, 4000)
        );
    }

    useEffect(()=>{
        setLoading(false);

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                let camps=[];
                data.data.map(campa=>{
                    if(campa.state==='ACTIVA'){
                        camps.push(campa);
                    }
                });
                setCampains(camps);

                localStorage.setItem('filter_campain',camps[camps.length-1].name);
                setCampain(camps[camps.length-1].name);

            });

        if(localStorage.getItem('rol')==='administrador' | localStorage.getItem('rol')==='super' | localStorage.getItem('permission').split(',').includes('Monitor:all')){
            updateState();
            
            fetch(`${import.meta.env.VITE_URL_BASE}/users`,{
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
                        
                        if(agent.name!=='EN ESPERA' & agent.name!=='Vanesa Rodriguez' & agent.name!=='Alexis Ortega' & agent.name!=='Patricio Paéz' & agent.name!=='Dayannara Mora'){
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
                });
        }else{
            setAgents([]);
        }

        return () => {
            clearInterval(interval_agents);
        };
        
    },[]);

    if(!agents) return <><Loader/></>
    if(!campains) return <><Loader/></>

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
                            localStorage.setItem('filter_campain',e.target.value)

                            if(e.target.value!==""){
                                let copy=agents;
                                let agents_new=[];
                    
                                copy.map((agent)=>{
                                    let new_agents=[];
                                    if(agent.gestion.length>0){
                                        agent.gestion.map((camp)=>{
                                            if(camp.campain===e.target.value){
                                                new_agents.push(camp);
                                            }
                                        });
                                        agent.gestion=new_agents;
                                        agents_new.push(agent);
                                    }
                                });
                    
                                setAgents(agents_new);
                            }

                            setLoading(false);
                        }}
                    >
                        <option value={""}>-- Todas --</option>
                        {
                            campains.map(campain=>(
                                <option value={campain.name}>{campain.name}</option>
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
                        <div>
                            <label>Acum.</label>
                            <label>Día.</label>
                        </div>
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
                    agents.map((agent,index)=>(
                        (agent.gestion.length>0)
                        ?
                            agent.gestion.map((campain,index)=>(
                                <CardUserState
                                    key={index}
                                    name={agent.name}
                                    state={agent.state}
                                    time={agent.tiempo}
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
                        :
                            <CardUserState
                                key={index}
                                name={agent.name}
                                state={agent.state}
                                time={agent.tiempo}
                                name_campain={"-"}
                                mode={"complete"}
                                data={{
                                    nro_credits:'-',
                                    nro_gestions:'-',
                                    nro_gestions_dia:'-',
                                    nro_gestions_efec:'-',
                                    nro_gestions_efec_dia:'-',
                                    nro_pendientes:'-',
                                    nro_proceso:'-',
                                    nro_proceso_dia:'-',
                                    nro_calls:'-',
                                    nro_calls_acum:'-',
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