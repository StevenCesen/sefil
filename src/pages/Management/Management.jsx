import { NavLink } from "react-router-dom";
import "./Management.css";
import {useEffect} from "react";
import PanelManagement from "../../components/Management/PanelManagement/PanelManagement";
import FilterManagement from "../../components/Management/FilterManagement/FilterManagement";
import { useStoreFilterManagement } from "../../stores/useStoreFilterManagement";
import CardCreditManagement from "../../components/Management/CardCreditManagement/CardCreditManagement";
import TraysManagement from "../../components/Management/TraysManagement/TraysManagement";
import SelectNameCampain from "../../components/Campains/SelectCampain/SelectNameCampain";
import { useStoreTemplate } from "../../stores/useStoreTemplates";
import CardSendSMS from "../../components/Contacts/CardSendSMS/CardSendSMS";
import CardSendMail from "../../components/Credits/CardSendMail/CardSendMail";
import { useStoreLoader } from "../../stores/useStoreLoader";

export default function Management(){
    const credits=useStoreFilterManagement();
    const store_templates=useStoreTemplate();
    const loader = useStoreLoader();

    useEffect(()=>{
        loader.viewOn(true);
        store_templates.getTemplates();
        loader.viewOn(false);
    },[]);

    return (
        <div className="Management">

            <CardSendSMS/>
            <CardSendMail/>

            <div className="Management__header">
                <NavLink
                    to=""
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1)
                    }}
                >Regresar</NavLink>
                <div className="Management__nav">
                    <h4 className="Management__navtray">Bandeja actual - {credits.tray}</h4>
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
                    <p className="Management__subtitle">
                        Registros del {credits.credits.meta.from} al {credits.credits.meta.to} de un total de {credits.credits.meta.total}
                    </p>
                    <div className="Management__navPagination">
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
