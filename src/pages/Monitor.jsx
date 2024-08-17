import { NavLink } from "react-router-dom";
import "./pages.css";
import { useContext, useEffect, useState } from "react";
import CardUserState from "../components/CardUserState/CardUserState.jsx";
import { GestionContext } from "../contexts/GestionContext.jsx";

export default function Monitor(){

    const [agents,setAgents]=useState();
    const data=useContext(GestionContext);

    useEffect(()=>{

        setAgents(data.agents);
        
    },[data.agents]);

    if(!agents) return <></>

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
                {/* <label>
                    Buscar cliente
                    <input onKeyUp={(e)=>{
                        const ci=e.target.value;
                        if(aux_busines!==""){
                            useSearch(ci,aux_busines,updateCredits,setCredits);
                        }
                        
                    }} placeholder="Ingrese cédula o nombre"/>
                </label> */}
            </div>

            <div className="pageConsulta__monitor">
                <div className="pageConsulta__monitorHead">
                    <label>Usuario</label>
                    <label>Estado</label>
                    <label>Tiempo</label>
                    <label>Campaña</label>
                    <label>Nro. créditos</label>
                    <label>Nro. créditos gestionados</label>
                    <label>Nro. llamadas</label>
                    <label>Nro. llamadas efec.</label>
                    <label>Nro. llamadas no efec.</label>
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
                                        nro_calls:campain.nro_llamadas,
                                        nro_efec:campain.nro_llamadas_efec,
                                        nro_no_efec:campain.nro_llamadas_no_efec
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
                                    nro_credits:"-",
                                    nro_gestions:"-",
                                    nro_calls:"-",
                                    nro_efec:"-",
                                    nro_no_efec:"-"
                                }}
                            />
                    ))
                }

            </div>
        </div>
    );
}