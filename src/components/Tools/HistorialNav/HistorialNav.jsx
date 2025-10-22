import { NavLink } from "react-router-dom";
import "./HistorialNav.css";

export default function HistorialNav(){
    return (
        <div className="HistorialNav">
            <NavLink
                to="" 
                onClick={(e)=>{
                    e.preventDefault();
                    history.go(-1) 
                }}
            >Regresar</NavLink>
        </div>
    );
}