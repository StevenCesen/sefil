import { useState } from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./pages.css";

export default function ReportEvolutionPays(){
    const [fecha_inicio,setFechaInicio]=useState("");
    const [fecha_final,setFechaFinal]=useState("");
    const [business,setBusiness]=useState();
    const [campains,setCampains]=useState();
    const [empresa,setEmpresa]=useState("SEFIL_1");
    const [type_search,setTypeSearch]=useState();
    const [number,setNumber]=useState();

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
                <h4 className="Reports__title">Evolución de créditos en función de pagos</h4>
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
                            </select>
                        </label>

                        <label className="Reports__filter">
                            Tipo de coincidencia
                            <select 
                                value={type_search}
                                onChange={(e)=>{
                                    setTypeSearch(e.target.value);
                                }}
                            >
                                <option value={'0'}>Sin pagos</option>
                                <option value={'1'}>Con</option>
                                <option value={'2'}>Más</option>
                            </select>
                        </label>

                        <label className="Reports__filter">
                            Número de pagos
                            <input 
                                value={number}
                                type="number"
                                onChange={(e)=>{
                                    setNumber(e.target.value);
                                }}
                            />
                        </label>
                        
                        <NavLink
                            className="Reports__button"
                            
                            onClick={(e)=>{
                                location.href=`${import.meta.env.VITE_URL_BASE}/evolution?cartera=${empresa}&user=${localStorage.getItem('name')}&type=${type_search}&number=${number}`;
                            }}
                        >Generar EXCEL</NavLink>
                    </div>
            </div>
        </div>
    );
}