import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import CardNewTemplate from "../components/CardNewTemplate/CardNewTemplate";

export default function GGestion(){

    const [templates,setTemplates]=useState();
    const [view_form,setView]=useState(false);

    const add_template=(template)=>{
        const copy=templates;
        copy.push(template);

        setTemplates(templates);
    }

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_URL_BASE}/templates`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setTemplates(data);
            });
        setView(false);

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
                    <button
                        onClick={(e)=>{
                            setView(true);
                        }}
                    >Agregar nueva</button>
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
                                <NavLink to={`/dashboard/templates/${template.id}`}>{template.id}</NavLink>
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

            {
                (view_form)
                ?   
                    <div className="CardPay">
                        <button 
                            className="CardCondonacion__close" 
                            onClick={()=>{
                                setView(false);
                            }}
                        >
                            Volver
                        </button>

                        <CardNewTemplate
                            form={setView}
                            add_template={add_template}
                        />

                    </div>
                :   <></>
            }
            
        </div>
    );
}