import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import CardGestion from "../components/CardGestion/CardGestion";
import addNotification from "react-push-notification";
import useWindows from "../hooks/useWindows";
import useFormatterNumber from "../hooks/useFormatterNumber";
import CardCurrentGestion from "../components/CardCurrentGestion/CardCurrentGestion";

export default function GHistorial(){

    const [campain,setCampain]=useState('');
    const [campains,setCampains]=useState();
    const [current,setCurrent]=useState();
    const [agents,setAgents]=useState();

    const params=new URLSearchParams(useLocation().search);
    const param=useParams();

    const [data,setData]=useState(); //Aquí tenemos todos los créditos
    
    const updateData=(url)=>{
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => {
                data.path+=`?credit=${param.ci}&cartera=${params.get('cartera')}`;

                if(data.next_page_url!==null){
                    const page_param_next=data.next_page_url.split('?')[1];
                    data.next_page_url=`${data.path}&${page_param_next}`;
                }

                if(data.prev_page_url!==null){
                    const page_param_prev=data.prev_page_url.split('?')[1];
                    data.prev_page_url=`${data.path}&${page_param_prev}`;
                }

                console.log(data);
                
                setData(data)
            });
    }

    useEffect(()=>{

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/users/agents`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setAgents(data);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data.data);
                setCampain(data.data[0]);

                if(param.ci!==undefined){
                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?credit=${param.ci}&cartera=${params.get('cartera')}`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then((data) => {
                            data.path+=`?credit=${param.ci}&cartera=${params.get('cartera')}`;

                            if(data.next_page_url!==null){
                                const page_param_next=data.next_page_url.split('?')[1];
                                data.next_page_url=`${data.path}&${page_param_next}`;
                            }

                            if(data.prev_page_url!==null){
                                const page_param_prev=data.prev_page_url.split('?')[1];
                                data.prev_page_url=`${data.path}&${page_param_prev}`;
                            }
                            console.log(data)
                            setData(data);
                        });
                }else{
                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?campain=${data.data[0].id}`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then((data) => {
                            setData(data);
                        });
                }
            });
        setCurrent([]);

    },[]);

    if(!campains) return <></>
    if(!data) return <></>
    if(!current) return <></>
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

            <div style={{paddingBottom:"20px"}}>
                <h3 style={{color:"var(--color-1)"}}>Historial de gestiones</h3>
                
                <div className="Historial__head">
                    <label></label>
                    <label>
                        Fecha gestión
                        <input type="date"/>
                    </label>
                    <label>
                        Campaña
                        <select
                            value={campain.id}
                            onChange={(e)=>{
                                if(e.target.value!==''){
                                    
                                    localStorage.setItem('campain',e.target.value);
                                    setCampain(e.target.value);
    
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?campain=${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }
                            }}
                        >
                            <option value={""}>--Seleccionar--</option>
                            {
                                campains.map((campain,index)=>(
                                    <option value={campain.id} key={index}>{campain.name}</option>
                                ))
                            }
                        </select>    
                    </label>
                    <label>
                        Nombre
                        <input 
                            type="value"
                            onChange={(e)=>{
                                if(e.target.value.length>2){
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?name=${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }else{
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }
                            }}
                        />
                    </label>
                    <label>
                        Cédula
                        <input 
                            type="value"
                            onChange={(e)=>{
                                if(e.target.value.length>3){
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?ci=${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }else{
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }
                            }}
                        />

                    </label>
                    <label>
                        Tipo
                        <select
                            onChange={(e)=>{
                                if(e.target.value!==''){
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?type=${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }else{
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }
                            }}
                        >
                            <option value={""}>-- Seleccionar --</option>
                            <option value={"TITULAR"}>TITULAR</option>
                            <option value={"GARANTE"}>GARANTE</option>
                        </select>
                    </label>
                    <label>ID crédito</label>
                    <label>
                        Estado gestión
                        <select>
                            <option>COMPROMISO DE PAGO</option>
                            <option>COMPROMISO DE PAGO</option>
                        </select>
                    </label>
                    <label>
                        Acuerdo
                        <input 
                            type="date"
                            onChange={(e)=>{
                                if(e.target.value!==''){
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?promise=${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }else{
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }
                            }}
                        />
                    </label>
                    <label>
                        Agente
                        <select
                            onChange={(e)=>{
                                if(e.target.value!==''){
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall?agent=${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }else{
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managmentall`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setData(data);
                                        });
                                }
                            }}
                        >
                            <option>-- Seleccionar --</option>
                            {
                                agents.map((agent)=>(
                                    <option value={agent.name}>{agent.name}</option>
                                ))
                            }
                            
                        </select>
                    </label>
                    <label>Observación</label>
                </div>

                {
                    data.data.map((gestion,index)=>(
                        <div className="Historial__item">
                            <button
                                onClick={(e)=>{
                                    setCurrent(gestion)
                                }}
                            >Ver</button>
                            <label>{gestion.fecha.split(" ")[0]}</label>
                            <label>{campain.name}</label>
                            <label>{gestion.client_name}</label>
                            <label>{gestion.client_ci}</label>
                            <label>{gestion.type}</label>
                            <label>{gestion.id_credit}</label>
                            <label>{gestion.substate_gestion}</label>
                            <label>{gestion.date_promise}</label>
                            <label>{`${gestion.byUser.split(" ")[0].substring(0,1)}. ${gestion.byUser.split(" ")[1]}`}</label>
                            <label>{gestion.observation}</label>
                        </div>
                    ))
                }

                <div className="DetailCredit__access" style={{margin:"10px 0"}}>
                    <p>Registros del {data.from}-{data.to} de {data.total}</p>
                    <div>
                    {
                        (data.total>10)
                        ?   
                            <>
                                <button onClick={()=>{
                                    if(data.prev_page_url!==null){
                                        updateData(data.prev_page_url)
                                    }
                                }}>Anterior</button>
                                <button onClick={()=>{
                                    if(data.next_page_url!==null){
                                        updateData(data.next_page_url)
                                    }
                                }}>Siguiente</button>
                            </>
                        : 
                            <></>
                    }
                    </div>
                </div>
                
            </div>

            {
                ('client_name' in current)
                ?
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setCurrent([])}}>Volver</button>
                        <CardCurrentGestion
                            data={current}
                        />
                    </div>
                :   <></>
            }

        </div>
    );
}
