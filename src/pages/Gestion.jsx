import { NavLink } from "react-router-dom";
import "./pages.css";
import { useEffect, useState } from "react";

export default function Gestion(){
    useEffect(()=>{
        
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
            </div>
        </div>
    );
}
