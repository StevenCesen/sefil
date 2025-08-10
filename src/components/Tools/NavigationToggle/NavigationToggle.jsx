import { useState } from "react";
import "./NavigationToggle.css";

export default function NavigationToggle({first_url,prev_url,per_page,next_url,last_url,setData}){

    const [per_pagination,setPerPagination]=useState(per_page);

    const handlerNavigation=({url,per_page})=>{
        setData([]);
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