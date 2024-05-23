import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CardCreateCampain from "../components/CardCreateCampain/CardCreateCampain";

export default function Campain(){

    const [create,setCreate]=useState(false);
    const [edit,setEdit]=useState(false);
    const [transfer,setTransfer]=useState(false);
    const [campains,setCampains]=useState();

    const updateCampain=(data)=>{

        const prev=campains.data;

        prev.push(data);

        setCampains({
            ...campains,
            data:prev
        });
    }

    useEffect(()=>{
        setCreate(false);
        setEdit(false);
        setTransfer(false);

        fetch("https://sefil.softsen.space/public/api/campains",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data);
            });
    },[]);

    if(!campains) return <></>

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

            <div className="Campain__content">
                <h3 className="Campain__title">Creación y asignación de campaña</h3>
                
                <div className="Campain__sincronice">
                    <h4 className="Campain__subtitle">Sincronización</h4>
                    <div>

                    </div>
                </div>

                <div className="Campain__list">
                    <div className="Campain__access">
                        <h4 className="Campain__subtitle">Campañas</h4>
                        <button
                            onClick={(e)=>{
                                setCreate(true);
                            }}
                        >Nueva campaña</button>
                    </div>

                    <div className="Campain__head">
                        <label>Nombre</label>
                        <label>Estado</label>
                        <label>Fecha de inicio</label>
                        <label>Fecha de fin</label>
                        <label>Acciones</label>
                    </div>

                    <div className="Campain__items">

                        {
                            campains.data.map((campain,index)=>(
                                <div 
                                    key={index}
                                    className="Campain__item"
                                >
                                    <label>{campain.name}</label>
                                    <label>{campain.state}</label>
                                    <label>{campain.fecha_init}</label>
                                    <label>{campain.fecha_finish}</label>
                                    <div>

                                        <button
                                            onClick={()=>{
                                                console.log("Edición de campaña")
                                            }}
                                        >
                                            <img title="Editar campaña" src="./icons/edit.png"/>
                                        </button>

                                        <button
                                            onClick={()=>{
                                                console.log("Asignación de campaña")
                                            }}
                                        >
                                            <img title="Asignar campaña" src="./icons/transfer.png"/>
                                        </button>

                                        <button
                                            onClick={()=>{
                                                console.log("Exportación de datos")
                                            }}
                                        >
                                            <img title="Exportar campaña" src="./icons/expor.png"/>
                                        </button>
                                        
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                </div>

            </div>

            {
                (create)
                ? 
                    <div className="CardPay">
                        <button 
                            className="CardCondonacion__close" 
                            onClick={()=>{
                                setCreate(false);
                            }}>Volver</button>

                            <CardCreateCampain
                                setData={updateCampain}
                            />

                    </div>
                : <></>
            }
            
        </div>
    )
}