import { NavLink } from "react-router-dom";
import "./pages.css";
import { useEffect, useState } from "react";
import useFormatterNumber from "../hooks/useFormatterNumber.js";
import CardUserState from "../components/CardUserState/CardUserState.jsx";

export default function Monitor(){

    useEffect(()=>{
        fetch("https://sefil.softsen.space/public/api/bussines",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
               
            });

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

                <CardUserState
                    name={"STEVEN CESEN"}
                    state={"EN LLAMADA"}
                    time={"00:10:00"}
                    nro_calls={70}
                    name_campain={"SEFIL-001"}
                    total_do={12}
                    mode={"complete"}
                />

                <CardUserState
                    name={"PATRICIO PAÉZ"}
                    state={"DESCONECTADO"}
                    time={"00:10:00"}
                    nro_calls={70}
                    name_campain={"SEFIL-001"}
                    total_do={12}
                    mode={"complete"}
                />

            </div>
        </div>
    );
}