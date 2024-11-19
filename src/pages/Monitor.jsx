import { NavLink } from "react-router-dom";
import "./pages.css";
import { useContext, useEffect, useState } from "react";
import CardUserState from "../components/CardUserState/CardUserState.jsx";
import { GestionContext } from "../contexts/GestionContext.jsx";

export default function Monitor(){

    const [agents,setAgents]=useState();
    const [campains,setCampains]=useState();
    const [campain,setCampain]=useState("");

    const data=useContext(GestionContext);

    useEffect(()=>{

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains`,{
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
            });

        setAgents(data.agents);
        
    },[data.agents]);

    if(!agents) return <></>
    if(!campains) return <></>

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
                    <label>
                        Campaña
                        <select>
                            <option value={""}>-- Todas --</option>
                            {
                                campains.map(campain=>(
                                    <option value={campain.name}>{campain.name}</option>
                                ))
                            }
                        </select>
                    </label>
                    <label>Nro. créditos asignados</label>
                    <label>Nro. créditos gestionados</label>
                    <label>Nro. créditos gestion efec.</label>
                    <label>Nro. créditos pendientes</label>
                    <label>Nro. créditos en proceso</label>
                    <label>Nro. llamadas</label>
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
                                        nro_gestions_efec:campain.total_credits_ges_efec,
                                        nro_pendientes:campain.nro_pendientes,
                                        nro_proceso:campain.nro_proceso,
                                        nro_calls:campain.nro_llamadas,
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
                                    nro_gestions_efec:"-",
                                    nro_pendientes:"-",
                                    nro_proceso:"-",
                                    nro_calls:"-",
                                }}
                            />
                    ))
                }

            </div>
        </div>
    );
}