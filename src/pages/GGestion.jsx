import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function GGestion(){

    const [templates,setTemplates]=useState();

    useEffect(()=>{
        fetch(`https://sefil.softsen.space/public/api/templates`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setTemplates(data);
            });
    },[]);

    if(!templates) return <></>

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

            <div className="Templates">
                <div className="Templates__init">
                    <h4 className="Reports__title">Plantillas de gestión</h4>
                    <button>Agregar nueva</button>
                </div>
                <div className="Templates__items">
                    
                    <div className="Templates__head">
                        <label>ID</label>
                        <label>Nombre de plantilla</label>
                        <label>Estructura</label>
                        <label>Creado por</label>
                        <label>Estado</label>
                    </div>

                    {
                        templates.map((template,index)=>(
                            <div key={index} className="Templates__item">
                                <NavLink to={`/dashboard/templates/${template.id}`}>1</NavLink>
                                <label>{template.name}</label>
                                <label>
                                    {
                                        JSON.parse(template.structure).default.map((item)=>(
                                            <label>{item.title}, </label>
                                        ))
                                    }
                                    {
                                        JSON.parse(template.structure).additional.map((item)=>(
                                            <label>{item.title}, </label>
                                        ))
                                    }
                                </label>
                                <label>{template.byUser}</label>
                                <label>{template.status}</label>
                            </div>
                        ))
                    }
                </div>
            </div>
            
        </div>
    );
}