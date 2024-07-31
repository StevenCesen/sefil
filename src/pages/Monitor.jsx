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
        console.log(data.agents)
        
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
                        <CardUserState
                            key={index}
                            name={agent.name}
                            state={agent.state}
                            time={"00:00:00"}
                            name_campain={"N/D"}
                            mode={"complete"}
                            data={{
                                nro_credits:20,
                                nro_gestions:8,
                                nro_calls:15,
                                nro_efec:8,
                                nro_no_efec:1
                            }}
                        />
                    ))
                }

            </div>
        </div>
    );
}