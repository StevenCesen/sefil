import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CardCreateCampain from "../components/CardCreateCampain/CardCreateCampain";

export default function Campain(){

    const [create,setCreate]=useState(false);
    const [edit,setEdit]=useState(false);
    const [transfer,setTransfer]=useState(false);

    useEffect(()=>{
        setCreate(false);
        setEdit(false);
        setTransfer(false);
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
                        <button>Nueva campaña</button>
                    </div>

                    <div className="Campain__head">
                        <label>Nombre</label>
                        <label>Estado</label>
                        <label>Fecha de inicio</label>
                        <label>Fecha de fin</label>
                        <label>Acciones</label>
                    </div>

                    <div className="Campain__items">
                        <div className="Campain__item">
                            <label>FACES - Abril 2024</label>
                            <label>ACTIVA</label>
                            <label>2024-04-01 19:00:00</label>
                            <label>2024-04-30 19:00:00</label>
                            <div>
                                <button>
                                    <img title="Editar campaña" src="./icons/edit.png"/>
                                </button>
                                <button>
                                    <img title="Asignar campaña" src="./icons/transfer.png"/>
                                </button>
                                <button>
                                    <img title="Exportar campaña" src="./icons/expor.png"/>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {
                (create)
                ? <></>
                : <CardCreateCampain/>
            }
            
        </div>
    )
}