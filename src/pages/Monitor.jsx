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
                    <label>Llamadas</label>
                    <label>Campaña</label>
                    <label>Total</label>
                    <label>Cob. pendientes</label>
                    <label>Cob. gestionados</label>
                    <label>Cob. Gest. Agente</label>
                    <label>Cob. Gest. Pagos</label>
                </div>

                {
                    agents.map((agent,index)=>(
                        <CardUserState
                            key={index}
                            name={agent.name}
                            state={agent.state}
                            time={"00:00:00"}
                            nro_calls={0}
                            name_campain={"N/D"}
                            total_do={0}
                            mode={"complete"}
                        />
                    ))
                }

            </div>
        </div>
    );
}