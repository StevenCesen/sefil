import { NavLink } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import CardUserState from "../components/CardUserState/CardUserState.jsx";
import Loader from "../components/Loader/loader.jsx";
import { useStoreMonitor } from "../stores/useStoreMonitor.js";

export default function Monitor(){
    const [loading,setLoading]=useState();
    const store_monitor=useStoreMonitor();
    
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
        setAgents(new_agents);
    }

    // document.addEventListener("visibilitychange", function(e) {   
    // });

    // useEffect(()=>{
    //     if(location.hash==='#/dashboard/monitor'){
    //         connection.current = conn;
    //         if (connection.current) {
    //             return () => {
    //                 connection.current.close();
    //             };
    //         }
    //     }
    // },[]);

    store_monitor.connectWS();

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
                        onChange={(e)=>{
                            
                        }}
                    >
                        <option value={""}>-- Todas --</option>
                        
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
                    // agents.map((campain,index)=>(
                    //     <CardUserState
                    //         key={index}
                    //         name={campain.agente}
                    //         state={campain.state}
                    //         time={campain.tiempo}
                    //         name_campain={campain.campain}
                    //         mode={"complete"}
                    //         data={{
                    //             nro_credits:campain.total_credits,
                    //             nro_gestions:campain.total_credits_ges,
                    //             nro_gestions_dia:campain.total_credits_ges_dia,
                    //             nro_gestions_efec:campain.total_credits_ges_efec,
                    //             nro_gestions_efec_dia:campain.total_credits_ges_efec_dia,
                    //             nro_pendientes:campain.nro_pendientes,
                    //             nro_proceso:campain.nro_proceso,
                    //             nro_proceso_dia:campain.nro_proceso_dia,
                    //             nro_calls:campain.nro_llamadas,
                    //             nro_calls_acum:campain.nro_llamadas_acum,
                    //         }}
                    //     />
                    // ))
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