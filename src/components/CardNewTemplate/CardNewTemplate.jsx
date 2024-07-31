import { useEffect, useState } from "react";
import "./CardNewTemplate.css";

export default function CardNewTemplate({add_template,form}){

    const [template,setTemplate]=useState();

    useEffect(()=>{
        setTemplate({
            name:'',
            context:'',
            structure:JSON.stringify({default:[{title:"Nombre del contacto",type_value:"text"}],additional:[]}),
            status:'INACTIVE'
        });
    },[]);

    if(!template) return <></>

    return (
        <div className="CardNewTemplate">

            <p className="CardNewTemplate__header">Nueva plantilla</p>

            <label>
                Nombre de plantilla
                <input 
                    type="text" 
                    placeholder="Escribe aquí..."
                    value={template.name}
                    onChange={(e)=>{
                        setTemplate({
                            ...template,
                            name:e.target.value
                        })
                    }}
                />
            </label>

            <div>
                <label>
                    Contexto
                    <select
                        value={template.context}
                        onChange={(e)=>{
                            setTemplate({
                                ...template,
                                context:e.target.value
                            })
                        }}
                    >
                        <option value={""}>--Seleccionar--</option>
                        <option value={"call center"}>Asociar a Call Center</option>
                        <option value={"campo"}>Asociar a Campo</option>
                    </select>
                </label>

                <label>
                    Estado
                    <select
                        value={template.status}
                        onChange={(e)=>{
                            setTemplate({
                                ...template,
                                status:e.target.value
                            })
                        }}
                    >
                        <option value={""}>--Seleccionar--</option>
                        <option value={"INACTIVE"}>Inactivar</option>
                        <option value={"EN USO"}>Activar</option>
                    </select>
                </label>
            </div>

            <div className="CardNewTemplate__footer">
                <button
                    onClick={(e)=>{
                        e.target.textContent="Guardando...";
                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/templates`,{
                            method:'POST',
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            },
                            body:new URLSearchParams(template)
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                if(data.state===200){
                                    e.target.textContent="Guardada";
                                    form(false);
                                    add_template(data.data);
                                }else{
                                    e.target.textContent="Error, inténtalo de nuevo";
                                }
                            });
                    }}
                >
                    Guardar plantilla
                </button>
            </div>

        </div>
    );
}