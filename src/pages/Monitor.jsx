import { NavLink } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import CardUserState from "../components/CardUserState/CardUserState.jsx";
import Loader from "../components/Loader/loader.jsx";
import { useStoreMonitor } from "../stores/useStoreMonitor.js";

export default function Monitor(){
    const [loading,setLoading]=useState();
    const store_monitor=useStoreMonitor();
    const connection=useRef();

    // document.addEventListener("visibilitychange", function(e) {   
    // });

    useEffect(()=>{

        setLoading(true);
        const conn = new WebSocket('wss://check.sefil.com.ec/ws');
        
        conn.onopen = function(e) {
            console.log("WSS: Connection established!");
            store_monitor.setAgents();
            setLoading(false);
        };

        conn.onmessage = async function(e) {
            const data=JSON.parse(e.data);
            await store_monitor.updateAgent({data});
        };

        connection.current = conn;

        if (connection.current) {
            return () => {
                connection.current.close();
            };
        }
    },[]);



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
                        onChange={async (e)=>{
                            setLoading(true);
                            store_monitor.setIDCampain(e.target.value);
                            await store_monitor.setAgents();
                            setLoading(false);
                        }}
                    >
                        <option value={""}>-- Todas --</option>
                        <option value={"SEFIL_1"}>SEFIL 1</option>
                        <option value={"SEFIL_2"}>SEFIL 2</option>
                        <option value={"syncs"}>FACES</option>
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
                    store_monitor.agents.map((campain,index)=>(
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