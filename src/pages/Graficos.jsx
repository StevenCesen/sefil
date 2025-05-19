import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import CardGestion from "../components/CardGestion/CardGestion";
import addNotification from "react-push-notification";
import useWindows from "../hooks/useWindows";
import useFormatterNumber from "../hooks/useFormatterNumber";
import CardCurrentGestion from "../components/CardCurrentGestion/CardCurrentGestion";
import useFilterGestions from "../hooks/useFilterGestions";
import useReturnFilter from "../hooks/useReturnFilter";
import Loader from "../components/Loader/loader";

export default function Graficos(){

    const [campain,setCampain]=useState('');
    const [campains,setCampains]=useState();
    const [current,setCurrent]=useState();
    const [agents,setAgents]=useState();
    const [filters,setFilters]=useState();
    const [loading,setLoading]=useState();

    const [data,setData]=useState(); //Aquí tenemos todos los créditos

    useEffect(()=>{

        setFilters({
            fecha_gestion:"",
            campain:"",
            name:"",
            ci:"",
            type:"",
            state_gestion:"",
            date_promise:"",
            agente:""
        });

        setData([
            {
                "rango":"A) Preventiva",
                "creditos": 624,
                "monto": "",
                "gestiones": 622,
                "gestiones_pago": 46,
                "monto_recuperado": 81356.1,
                "monto_recuperado_gestion": 11278.74
            },
            {
                "rango":"B) 2-5",
                "creditos": 1203,
                "monto": 269628.28,
                "gestiones": 1413,
                "gestiones_pago": 944,
                "monto_recuperado": 307873.76,
                "monto_recuperado_gestion": 141449.07
            },
            {
                "rango":"C) 6-15",
                "creditos": 2934,
                "monto": 662563.4,
                "gestiones": 5170,
                "gestiones_pago": 1241,
                "monto_recuperado": 728337.27,
                "monto_recuperado_gestion": 167855.45
            },
            {
                "rango":"D) 16-30",
                "creditos": 1502,
                "monto": 380004.26,
                "gestiones": 4320,
                "gestiones_pago": 385,
                "monto_recuperado": 317728.93,
                "monto_recuperado_gestion": 52673.99
            },
            {
                "rango":"E) 31-60",
                "creditos": 533,
                "monto": 231975.81,
                "gestiones": 969,
                "gestiones_pago": 99,
                "monto_recuperado": 57248.2,
                "monto_recuperado_gestion": 8882.9
            },
            {
                "rango":"F) 61-90",
                "creditos": 186,
                "monto": 227159.89,
                "gestiones": 295,
                "gestiones_pago": 16,
                "monto_recuperado": 17287.42,
                "monto_recuperado_gestion": 3499.27
            },
            {
                "rango":"G) 91-120",
                "creditos": 110,
                "monto": 99562.76,
                "gestiones": 168,
                "gestiones_pago": 1,
                "monto_recuperado": 5217.87,
                "monto_recuperado_gestion": 200
            },
            {
                "rango":"H) 121-180",
                "creditos": 217,
                "monto": 263875.55,
                "gestiones": 343,
                "gestiones_pago": 15,
                "monto_recuperado": 8894.96,
                "monto_recuperado_gestion": 1110.93
            },
            {
                "rango":"I) 181-360",
                "creditos": 305,
                "monto": 386178.95,
                "gestiones": 492,
                "gestiones_pago": 27,
                "monto_recuperado": 9744.97,
                "monto_recuperado_gestion": 2385.13
            },
            {
                "rango":"J) 361-720",
                "creditos": 207,
                "monto": 308764.19,
                "gestiones": 334,
                "gestiones_pago": 20,
                "monto_recuperado": 3723.21,
                "monto_recuperado_gestion": 1492.65
            },
            {
                "rango":"K) 721-1080",
                "creditos": 13,
                "monto": 41504.75,
                "gestiones": 24,
                "gestiones_pago": 0,
                "monto_recuperado": 100,
                "monto_recuperado_gestion": 0
            },
            {
                "rango":"L) Más de 1080",
                "creditos": 74,
                "monto": 228491.88,
                "gestiones": 133,
                "gestiones_pago": 5,
                "monto_recuperado": 2034.7,
                "monto_recuperado_gestion": 301.56
            }
        ]);

        setLoading(false);
        
        fetch(`${import.meta.env.VITE_URL_BASE}/users/agents`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setAgents(data);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data.data);
            });

    },[]);

    if(!campains) return <Loader/>
    if(!data) return <Loader/>
    if(!agents) return <Loader/>

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
                <h3 style={{color:"var(--color-1)"}}>Recuperación de cartera</h3>
                
                <div className="Graficos__head">
                    <label>Rango</label>
                    <label># créditos asignados</label>
                    <label>% créditos asignados</label>
                    <label>Monto a gestionar</label>
                    <label>% Monto a gestionar</label>
                    <label># gestiones</label>
                    <label># gestiones con pago</label>
                    <label>Monto recuperado con gestión</label>
                    <label>Monto recuperado</label>
                </div>

                {
                    data.map((rango)=>(
                        <div className="Graficos__item">
                            <label>{rango.rango}</label>
                            <label>{rango.creditos}</label>
                            <label></label>
                            <label>{useFormatterNumber({value:rango.monto,currency:'USD'})}</label>
                            <label></label>
                            <label>{rango.gestiones}</label>
                            <label>{rango.gestiones_pago}</label>
                            <label>{useFormatterNumber({value:rango.monto_recuperado_gestion,currency:'USD'})}</label>
                            <label>{useFormatterNumber({value:rango.monto_recuperado,currency:'USD'})}</label>
                        </div>
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