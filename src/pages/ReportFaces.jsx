import { useState } from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./pages.css";

export default function ReportFaces(){
    const [fecha_inicio,setFechaInicio]=useState("");
    const [fecha_final,setFechaFinal]=useState("");
    const [business,setBusiness]=useState();
    const [campains,setCampains]=useState();
    const [empresa,setEmpresa]=useState("SEFIL_1");
    const [campain,setCampain]=useState();

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
        setEmpresa("SEFIL_1");
    },[]);

    if(!business) return <></>
    if(!campains) return <></>

    return (
        <div className="Reports">
            <div className="Reports__content">
            <h4 className="Reports__title">Reporte mensual de gestiones de Call Center para FACES</h4>
                <div className="Reports__filters Reports__filters--columns-5">
                    <label className="Reports__filter">
                        Campaña
                        <select 
                            value={campain}
                            onChange={(e)=>{
                                setCampain(e.target.value);
                            }}
                        >
                            {
                                campains.data.map((camp,index)=>(
                                    (camp.cartera==="syncs") ? <option key={index} value={camp.id}>{camp.name.toUpperCase()}</option> : <></>
                                ))
                            }
                        </select>
                    </label>
                    
                    <NavLink
                        className="Reports__button"
                        
                        onClick={(e)=>{
                            location.href=`${import.meta.env.VITE_URL_BASE}/GenReporteFACES?campain=${campain}&user=${localStorage.getItem('name')}`;
                        }}
                    >Generar</NavLink>
                </div>
            </div>
        </div>
    );
}