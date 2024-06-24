import { NavLink } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import CardGestion from "../components/CardGestion/CardGestion";
import addNotification from "react-push-notification";
import useWindows from "../hooks/useWindows";
import useFormatterNumber from "../hooks/useFormatterNumber";

export default function GHistorial(){

    const [campain,setCampain]=useState('');
    const [campains,setCampains]=useState();

    const [data,setData]=useState(); //Aquí tenemos todos los créditos
    
    useEffect(()=>{

        fetch(`https://sefil.softsen.space/public/api/gestion/campains?id=${localStorage.getItem('temp_uS')}`,{
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

                <label>
                    Campaña
                    <select onChange={(e)=>{
                        if(e.target.value!==''){
                            
                            localStorage.setItem('campain',e.target.value);
                            setCampain(e.target.value);

                            fetch(`https://sefil.softsen.space/public/api/bussines/${e.target.value}`,{
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                   
                                });
                        }
                    }}>
                            <option value={""}>--Seleccionar--</option>
                        
                    </select>
                </label>
            </div>

            <div>
                <h3>Historial de gestiones</h3>
            </div>

        </div>
    );
}
