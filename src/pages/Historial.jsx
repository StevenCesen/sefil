import { NavLink } from "react-router-dom";
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

    const [data,setData]=useState(); //Aquí tenemos todos los créditos
    
    const updateData=(url)=>{
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => setData(data));
    }

    useEffect(()=>{

        fetch(`https://sefil.softsen.space/public/api/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data.data);
                setCampain(data.data[0]);

                fetch(`https://sefil.softsen.space/public/api/managmentall?campain=${data.data[0].id}`,{
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then((response) => response.json())  
                    .then((data) => {
                        console.log(data.data)
                        setData(data);
                    });
            });
        setCurrent([]);

    },[]);

    if(!campains) return <></>
    if(!data) return <></>
    if(!current) return <></>

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

                <label>
                    Campaña
                    <select 
                        value={campain.id}
                        onChange={(e)=>{
                            if(e.target.value!==''){
                                
                                localStorage.setItem('campain',e.target.value);
                                setCampain(e.target.value);

                                fetch(`https://sefil.softsen.space/public/api/managmentall?campain=${e.target.value}`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        console.log(data);
                                    });
                            }
                    }}>
                        <option value={""}>--Seleccionar--</option>
                        {
                            campains.map((campain,index)=>(
                                <option value={campain.id} key={index}>{campain.name}</option>
                            ))
                        }
                        
                    </select>
                </label>
            </div>

            <div style={{paddingBottom:"20px"}}>
                <h3 style={{color:"var(--color-1)"}}>Historial de gestiones</h3>
                
                <div className="Historial__head">
                    <label></label>
                    <label>Fecha gestión</label>
                    <label>Empresa</label>
                    <label>Nombre</label>
                    <label>Cédula</label>
                    <label>Tipo</label>
                    <label>ID crédito</label>
                    <label>Estado gestión</label>
                    <label>Acuerdo</label>
                    <label>Agente</label>
                    <label>Observación</label>
                </div>

                {
                    data.data.map((gestion,index)=>(
                        <div className="Historial__item">
                            <button
                                onClick={(e)=>{
                                    setCurrent(gestion)
                                    console.log(gestion)
                                }}
                            >Ver</button>
                            <label>{gestion.fecha.split(" ")[0]}</label>
                            <label>SEFIL_2</label>
                            <label>{gestion.client_name}</label>
                            <label>Cédula</label>
                            <label>Tipo</label>
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
                        data.links.map((button,index)=>(
                            (index===0)?
                                <NavLink key={index} onClick={()=>{updateData(button.url)}}>Anterior</NavLink>
                            : 
                                (index===(data.links.length-1)) ?
                                    <NavLink key={index} onClick={()=>{updateData(button.url)}}>Siguiente</NavLink>
                                :
                                    <></>
                        ))
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
