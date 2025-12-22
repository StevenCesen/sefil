import { NavLink } from "react-router-dom";
import "./pages.css";
import {useEffect} from "react";
import PanelManagement from "../components/Management/PanelManagement/PanelManagement";
import FilterManagement from "../components/Management/FilterManagement/FilterManagement";
import { useStoreFilterManagement } from "../stores/useStoreFilterManagement";
import CardCreditManagement from "../components/Management/CardCreditManagement/CardCreditManagement";
import TraysManagement from "../components/Management/TraysManagement/TraysManagement";
import SelectNameCampain from "../components/Campains/SelectCampain/SelectNameCampain";
import { useStoreTemplate } from "../stores/useStoreTemplates";
import CardSendSMS from "../components/Contacts/CardSendSMS/CardSendSMS";
import CardSendMail from "../components/Credits/CardSendMail/CardSendMail";
import { useStoreLoader } from "../stores/useStoreLoader";

export default function Gestion(){
    const credits=useStoreFilterManagement();
    const store_templates=useStoreTemplate();
    const loader = useStoreLoader();

    useEffect(()=>{
        loader.viewOn(true);
        // store_templates.getTemplates();
        loader.viewOn(false);
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
                    <h4 className="Gestion__navtray">Bandeja actual - {credits.tray}</h4>
                    <TraysManagement/>
                    <SelectNameCampain/>
                </div>
            </div>
            
            <FilterManagement/>

            {credits.credits && credits.credits.data.map((credit,n) => (
                <CardCreditManagement key={credit.id} index={n} credit={credit} />
            ))}
            
            {credits.credits && (
                <div>
                    <p className="Gestion__subtitle">
                        Registros del {credits.credits.meta.from} al {credits.credits.meta.to} de un total de {credits.credits.meta.total}
                    </p>
                    <div className="Gestion__navPagination">
                        <button
                            onClick={async ()=>{
                                if(credits.credits.links.prev!==null){        
                                    await credits.nextPage({url:credits.credits.links.prev});
                                }
                            }}
                        >Anterior</button>
                        <button
                            onClick={async ()=>{
                                if(credits.credits.links.next!==null){        
                                    await credits.nextPage({url:credits.credits.links.next});
                                }
                            }}
                        >Siguiente</button>
                    </div>
                </div>
            )}

            {
                <PanelManagement/>
            }
        </div>
    );
}