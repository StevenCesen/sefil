import { useState } from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./pages.css";

export default function ReportJudicial(){
    const [fecha_inicio,setFechaInicio]=useState("");
    const [fecha_final,setFechaFinal]=useState("");
    const [business,setBusiness]=useState();
    const [campains,setCampains]=useState();

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/bussines`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
            });

        setFechaInicio("");
        setFechaFinal("");
    },[]);

    if(!business) return <></>
    if(!campains) return <></>

    return (
        <div className="Reports">
            <div className="Reports__content">
                <h4 className="Reports__title">Gastos judiciales cargados</h4>
                <div className="Reports__filters Reports__filters--columns-5">
                    <label className="Reports__filter">
                        Fecha de inicio
                        <input 
                            type="date"
                            value={fecha_inicio}
                            onChange={(e)=>{
                                setFechaInicio(e.target.value);
                            }}
                        />
                    </label>

                    <label className="Reports__filter">
                        Fecha de corte
                        <input 
                            type="date" 
                            value={fecha_final} 
                            onChange={(e)=>{
                                setFechaFinal(e.target.value);
                            }}/>
                    </label>
                    
                    <NavLink
                        className="Reports__button"
                        
                        onClick={(e)=>{
                            const splits_inicio=fecha_inicio.split('-');
                            const inicio=`${splits_inicio[0]}/${splits_inicio[1]}/${splits_inicio[2]}`;

                            const splits_final=fecha_final.split('-');
                            const final=`${splits_final[0]}/${splits_final[1]}/${splits_final[2]}`;
                            
                            location.href=`${import.meta.env.VITE_URL_BASE}/gjudicial?fecha_inicio=${inicio}&user=${localStorage.getItem('name')}&fecha_final=${final}`;
                        }}
                    >Generar EXCEL</NavLink>
                </div>
            </div>
        </div>
    );
}
