import { NavLink } from "react-router-dom";
import "./CardListCarteras.css";
import { useEffect, useState } from "react";

function preFormattedUnit(value){
    if(value>=10){
        return value;
    }else{
        return `0${value}`;
    }
}

export default function CardListCarteras({name,fecha_upload,last_update,versions,fecha_carga,state,view,setCurrent,data_cartera}){
    
    const [view_prelacion,setView]=useState(false);
    const [cartera,setCartera]=useState({
        name:'',
        fecha_upload:'',
        last_update:'',
        fecha_carga:fecha_carga,
        versions:[],
        state:''
    });

    const [export_cartera,setExport]=useState();
    const [date_start,setStart]=useState('');
    const [date_end,setEnd]=useState(new Date());

    useEffect(()=>{
        setView(false);

        setCartera({
            name:name,
            fecha_upload:fecha_upload,
            last_update:last_update,
            versions:versions,
            fecha_carga:fecha_carga,
            state:state
        });

        setStart('');
        
        const day=new Date().getDate();
        const month=new Date().getMonth()+1;
        const year=new Date().getFullYear();

        setEnd(`${year}-${preFormattedUnit(month)}-${preFormattedUnit(day)}`);

    },[]);

    return(
        <div className="CardListCarteras">
            <div>
                <p>{cartera.name}</p>
                <p>{cartera.fecha_upload}</p>
                <p>{cartera.last_update}</p>
                <p>{cartera.fecha_carga}</p>
                {/* <button onClick={(e)=>{
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
                } */}
                
                <p>{cartera.state}</p>
                <NavLink target="blank" to={`${import.meta.env.VITE_URL_BASE}/exportar?cartera=${cartera.name}`}>Excel</NavLink>
                <div>
                    <div>
                        <label>
                            Inicio
                            <input 
                                type="date"
                                value={date_start}
                                onChange={(e)=>{
                                    setStart(e.target.value)
                                }}
                            />
                        </label>

                        <label>
                            Fin
                            <input 
                                type="date"
                                value={date_end}
                                onChange={(e)=>{
                                    setEnd(e.target.value)
                                }}
                            />
                        </label>
                    </div>
                    <NavLink target="blank" to={`${import.meta.env.VITE_URL_BASE}/pays?cartera=${cartera.name}&fecha_inicio=${date_start}&fecha_final=${date_end}`}>Excel</NavLink>
                </div>
                <button
                    onClick={(e)=>{
                        view(true);
                        setCurrent(data_cartera);
                    }}
                >Orden de prelación</button>
            </div>
        </div>
    );
}