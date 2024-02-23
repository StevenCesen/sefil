import CardDiscuss from "../components/CardDiscuss/CardDiscuss";
import NavLeftCRM from "../components/NavLeftCRM";
import NavRightCRM from "../components/NavRightCRM";
import "./pages.css";
import { useEffect, useState } from "react";

/*
endPoints
https://sefil.softsen.space/public/api/credit/${param.id}

https://sefil.softsen.space/public/api/credit/${e.target.value}


https://sefil.softsen.space/public/api/credit/${e.target.value}

*/

export default function Gestion(){
    useEffect(()=>{
        
    },[]);

    return (
        <div className="Crm">
            <NavLeftCRM/>
            <CardDiscuss 
                image="./user1.png"
                name="Juan Carlos Ontaneda"
                messages={[]}
            />
            <NavRightCRM/>
        </div>
    );
}
