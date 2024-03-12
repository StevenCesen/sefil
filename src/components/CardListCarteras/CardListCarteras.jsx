import { NavLink } from "react-router-dom";
import "./CardListCarteras.css";
import { useEffect, useState } from "react";


export default function CardListCarteras({name,fecha_upload,last_update,versions,state}){
    
    const [viewVersions,setView]=useState(false);
    const [cartera,setCartera]=useState({
        name:'',
        fecha_upload:'',
        last_update:'',
        versions:[],
        state:''
    });

    const [export_cartera,setExport]=useState();

    useEffect(()=>{
        setView(false);
        setCartera({
            name:name,
            fecha_upload:fecha_upload,
            last_update:last_update,
            versions:versions,
            state:state
        });
    },[]);

    return(
        <div className="CardListCarteras">
            <div>
                <p>{cartera.name}</p>
                <p>{cartera.fecha_upload}</p>
                <p>{cartera.last_update}</p>
                <button onClick={(e)=>{
                    setView(!viewVersions);

                    if(!viewVersions){
                        e.target.textContent="Ocultar versiones";
                    }else{
                        e.target.textContent="Ver versiones";
                    }
                }}>Ver versiones</button>
                <button>Actualizar</button>

                {
                    (viewVersions)
                    ?
                        <div className="CardListCarteras__versions">
                            {
                                cartera.versions.map((version,index)=>(
                                    <NavLink key={index}>{version}</NavLink>
                                ))
                            }
                        </div>
                    :   <></>
                }

                <p>{cartera.state}</p>
                <NavLink to={`https://sefil.softsen.space/public/api/exportar?cartera=${cartera.name}`}>Excel</NavLink>
                <NavLink to={`https://sefil.softsen.space/public/api/pays?cartera=${cartera.name}`}>Excel</NavLink>
            </div>
        </div>
    );
}