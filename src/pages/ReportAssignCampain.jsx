import { useState } from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./pages.css";

export default function ReportAssignCampain(){
    const [fecha_inicio,setFechaInicio]=useState("");
    const [fecha_final,setFechaFinal]=useState("");
    const [business,setBusiness]=useState();
    const [campains,setCampains]=useState();
    const [empresa,setEmpresa]=useState("SEFIL_1");

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
                <h4 className="Reports__title">Reporte de asignación de campaña</h4>
                <div className="Reports__filters Reports__filters--columns-5">
                    <label className="Reports__filter">
                        Empresa
                        <select 
                            value={empresa}
                            onChange={(e)=>{
                                setEmpresa(e.target.value);
                            }}
                        >
                            {
                                business.map((bus,index)=>(
                                    <option key={index} value={bus.name.toUpperCase()}>{bus.name.toUpperCase()}</option>
                                ))
                            }
                            <option value="syncs">FACES</option>
                        </select>
                    </label>
                    
                    <NavLink
                        className="Reports__button"
                        
                        onClick={(e)=>{
                            location.href=`${import.meta.env.VITE_URL_BASE}/reporteAsignacion?cartera=${empresa}`;
                        }}
                    >Generar EXCEL</NavLink>
                </div>
            </div>
        </div>
    );
}