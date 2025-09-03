import { useEffect } from "react";
import "./loader.css";

export default function Loader(){

    useEffect(()=>{
        console.log("cargando loader...")
    },[]);

    return (
        <div className="ContentLoader">
            <span className="loader"></span>
        </div>
    );
}