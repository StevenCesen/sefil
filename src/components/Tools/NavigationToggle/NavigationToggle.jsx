import { useState } from "react";
import "./NavigationToggle.css";
import { useStoreLoader } from "../../../stores/useStoreLoader";
import getPage from "../../../helpers/Credits/getPage";

export default function NavigationToggle({first_url,prev_url,per_page,next_url,last_url,setData,filters}){
    const [per_pagination,setPerPagination]=useState(per_page);
    const loader = useStoreLoader();

    const handlerNavigation = async ({url,per_page})=>{
        console.log(url);
        if(url){
            loader.viewOn(true);
            const data = await getPage({
                per_page,
                filters:filters
            });
            setData(data);
            loader.viewOn(false);
        }
    };

    return(
        <div className="NavigationToggle">
            <button 
                onClick={()=>{handlerNavigation({url:first_url,per_page:per_pagination})}} 
                title="Primer página"
            >⏪</button>
            <button
                onClick={()=>{handlerNavigation({url:prev_url,per_page:per_pagination})}} 
                title="Página anterior"
            >◀️</button>
            <input
                type="text"
                defaultValue={per_page}
                onChange={(e)=>{setPerPagination(e.target.value)}}
            />
            <button
                onClick={()=>{handlerNavigation({url:next_url,per_page:per_pagination})}} 
                title="Página siguiente"
            >▶️</button>
            <button
                onClick={()=>{handlerNavigation({url:last_url,per_page:per_pagination})}} 
                title="Última página"
            >⏩</button>
        </div>
    );
}