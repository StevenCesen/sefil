import { useEffect } from "react";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import { useStoreLoader } from "../../../stores/useStoreLoader";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./SelectCampain.css";

export default function SelectNameCampain(){

    const filter_management=useStoreFilterManagement();
    const store_management=useStoreManagement();
    const loader = useStoreLoader();
    
    useEffect(()=>{
        loader.viewOn(true);
        filter_management.getCampains();
        loader.viewOn(false);
    },[]);

    if(!filter_management.campains) return <></>

    return(
        <label className="SelectCampain">
            Campaña
            <select
                onChange={(e)=>{
                    loader.viewOn(true);
                    filter_management.setBusiness(e.target.value);
                    filter_management.FilteredCredits(filter_management.getFilterString());
                    filter_management.numberTrays();
                    store_management.setIDCampain(e.target.value);
                    loader.viewOn(false);
                }}
            >
                <option value={''}>-- Seleccionar --</option>
                {filter_management.campains.data.map((campain)=>(
                    <option 
                        key={campain.id}
                        value={campain.business_id}
                    >
                        {campain.name}
                    </option>
                ))}
            </select>
        </label>
    );
}