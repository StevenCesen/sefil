import { NavLink } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import Loader from "../components/Loader/loader";
import PanelManagement from "../components/Management/PanelManagement/PanelManagement";
import FilterManagement from "../components/Management/FilterManagement/FilterManagement";
import { useStoreFilterManagement } from "../stores/useStoreFilterManagement";
import CardCreditManagement from "../components/Management/CardCreditManagement/CardCreditManagement";
import TraysManagement from "../components/Management/TraysManagement/TraysManagement";
import SelectNameCampain from "../components/Campains/SelectCampain/SelectNameCampain";

export default function Gestion(){
    const [loading,setLoading]=useState();
    const credits=useStoreFilterManagement();

    useEffect(()=>{
        // fetch(`${import.meta.env.VITE_URL_BASE}/templates`,{
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())  
        //     .then((data) => {
        //         const templates=[];
        //         data.map((struc)=>{
        //             if(struc.status==="EN USO"){
        //                 templates.push(struc.structure);
        //             }
        //         });
        //         setStructure(templates);
        //     });
        credits.numberTrays();
    },[]);

    return (
        <div className="pageConsulta">

            <div className="Gestion__header">
                <NavLink
                    to="" 
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1) 
                    }}
                >Regresar</NavLink>
                <div className="Gestion__nav">
                    <TraysManagement/>
                    <SelectNameCampain/>
                </div>
            </div>
            
            <FilterManagement/>

            {
                (credits.credits!==null)
                ?
                    credits.credits.data.map((credit)=>(
                        <CardCreditManagement
                            key={credit.id}
                            credit={credit}
                        />
                    ))
                :   <></>
            }

            {
                (credits.credits!==null)
                ?   <p className="Gestion__subtitle">Registros del {credits.credits.from} al {credits.credits.to} de un total de {credits.credits.total}</p>
                :   <></>
            }

            {
                <PanelManagement/>
            }

            {
                (loading)
                ?
                    <Loader/>
                :   <></>
            }

        </div>
    );
}
