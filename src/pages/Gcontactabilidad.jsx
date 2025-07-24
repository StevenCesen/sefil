import { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import Campain from "./Campain";
import Loader from "../components/Loader/loader";

export default function Gcontactabilidad(){

    const [convenios,setConvenios]=useState();
    const [filter,setFilter]=useState();
    const [campains,setCampains]=useState();
    const [loading,setLoading]=useState();
    const [agents,setAgents]=useState();

    const updateData=({campain,tipo,agent})=>{
        let filter="";
        setLoading(true);

        if(campain!==""){
            filter+=`&campain=${campain}`;
        }

        if(tipo!==""){
            filter+=`&tipo=${tipo}`;
        }

        if(agent!=""){
            filter+=`&user_id=${agent}`
        }

        console.log(filter)

        fetch(`${import.meta.env.VITE_URL_BASE}/gcontactabilidad?${filter}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setConvenios(data);
                setLoading(false);
            });
    }

    useEffect(()=>{

        setFilter({
            campain:'',
            tipo:1,
            agent:''
        });

        setLoading(true);

        setConvenios([]);

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data.data);
                setLoading(false);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=syncs`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setAgents(data);
                    setLoading(false);
                });

    },[]);

    if(!convenios) return <Loader/>
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

            <div className="Convenios">
                <div className="Convenios__filter">
                    <h4 className="Reports__title">Créditos sin gestión efectiva ({convenios.length})</h4>
                    <label>
                        Campaña
                        <select
                            value={filter.campain}
                            onChange={(e)=>{
                                setFilter({
                                    ...filter,
                                    campain:e.target.value
                                });

                                updateData({
                                    campain:e.target.value,
                                    tipo:filter.tipo,
                                    agent:filter.agent
                                });
                            }}
                        >
                            <option>-- Seleccionar --</option>
                            {
                                campains.map(camp=>(
                                    (camp.cartera=="syncs") ? <option value={camp.id}>{camp.name}</option> : <></>
                                ))
                            }
                        </select>
                    </label>
                    <label>
                        Forma de selección
                        <select
                            value={filter.tipo}
                            onChange={(e)=>{
                                setFilter({
                                    ...filter,
                                    tipo:e.target.value
                                });

                                updateData({
                                    campain:filter.campain,
                                    tipo:e.target.value,
                                    agent:filter.tipo
                                });
                            }}
                        >
                            <option value={1}>En campaña</option>
                            <option value={2}>Solo hoy</option>
                        </select>
                    </label>
                    <a href={`${import.meta.env.VITE_URL_BASE}/GenNoEfectivos?campain=${filter.campain}&tipo=${filter.tipo}`} target="_blank" className="Convenio__button">Descargar</a>
                </div>
                <div className="Convenios__items">
                    
                    <div className="Convenios__head">
                        <label>Crédito</label>
                        <label>Titular</label>
                        <label>Cédula</label>
                        <label>
                            Agente gestion
                            <select
                                value={filter.agent}
                                onChange={(e)=>{
                                    setFilter({
                                        ...filter,
                                        agent:e.target.value
                                    });

                                    updateData({
                                        campain:filter.campain,
                                        tipo:filter.tipo,
                                        agent:e.target.value
                                    });
                                }}
                            >
                                <option value={""}>--Seleccionar--</option>
                                {
                                    agents.map(agent=>(
                                        <option value={agent.id}>{agent.name}</option>
                                    ))
                                }
                            </select>
                        </label>
                        <label>Bandeja actual</label>
                        <label>Estado últ. gestión</label>
                        <label>Días de mora</label>
                        <label>Agencia</label>
                        <label></label>
                    </div>

                    {
                        convenios.map(convenio=>(
                            <div className="Convenios__item">
                                <NavLink to={`/dashboard/clist/${convenio.id_credito}`} onClick={()=>{localStorage.setItem('hash',location.hash)}}>syncs-{convenio.credito}</NavLink>
                                
                                <label>{convenio.titular_nombre}</label>
                                <label>{convenio.titular_cedula}</label>
                                <label>{convenio.agente}</label>
                                <label>{convenio.bandeja_actual}</label>
                                <label>{convenio.estado_ult_gestion}</label>
                                <label>{convenio.dias_mora}</label>
                                <label>{convenio.agencia}</label>
                                <label>{}</label>
                            </div>
                        ))
                    }
                </div>
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