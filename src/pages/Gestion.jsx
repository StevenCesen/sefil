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
import { useStoreTemplate } from "../stores/useStoreTemplates";
import CardSendSMS from "../components/Contacts/CardSendSMS/CardSendSMS";
import CardSendMail from "../components/Credits/CardSendMail/CardSendMail";

export default function Gestion(){
    const [loading,setLoading]=useState();
    const credits=useStoreFilterManagement();
    const store_templates=useStoreTemplate();

    useEffect(()=>{
        credits.numberTrays();
        store_templates.getTemplates();
    },[]);
    
    return (
        <div className="pageConsulta">
            
            <CardSendSMS/>
            <CardSendMail/>

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

            {credits.credits && credits.credits.data.map((credit,n) => (
                <CardCreditManagement key={credit.id} index={n} credit={credit} />
            ))}

            {credits.credits && (
                <p className="Gestion__subtitle">
                    Registros del {credits.credits.from} al {credits.credits.to} de un total de {credits.credits.total}
                </p>
            )}

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
