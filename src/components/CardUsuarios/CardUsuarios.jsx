import { useEffect, useRef, useState } from "react";
import "./CardUsuarios.css";
import useMenu from "../../hooks/useMenu";
import useUpdatePermiss from "../../hooks/useUpdatePermiss";
import addNotification from 'react-push-notification';

const list={
    "consulta":{
        "action":"Consulta:all",
        "checked":false
    },
    "recaudacion":{
        "action":"Cobranza:all",
        "checked":false
    },
    "cobranza":{
        "action":"Gestion:all",
        "checked":false
    },
    "comprobantes":{
        "action":"Comprobantes:all",
        "checked":false
    },
    "reportes":{
        "action":"Reportes:all",
        "checked":false
    },
    "usuarios":{
        "action":"User:all",
        "checked":false
    },
    "bd":{
        "action":"DB:all",
        "checked":false
    },
    "condonar":{
        "action":"condonar:set",
        "checked":false
    },
    "convenio":{
        "action":"convenio:set",
        "checked":false
    }
};

export default function CardUsuarios({id,name,email,rol,permission}){
    
    const menu=useRef();
    const permiss=useRef();
    const [permisos,setPermisos]=useState(list);
    const [user_permisos,setUser]=useState(permission);

    useEffect(()=>{
        setUser(permission);

        list.consulta.checked=user_permisos.includes(list.consulta.action);
        list.recaudacion.checked=user_permisos.includes(list.recaudacion.action);
        list.cobranza.checked=user_permisos.includes(list.cobranza.action);
        list.comprobantes.checked=user_permisos.includes(list.comprobantes.action);
        list.reportes.checked=user_permisos.includes(list.reportes.action);
        list.usuarios.checked=user_permisos.includes(list.usuarios.action);
        list.bd.checked=user_permisos.includes(list.bd.action);
        list.condonar.checked=user_permisos.includes(list.condonar.action);
        list.convenio.checked=user_permisos.includes(list.convenio.action);

        setPermisos({
            ...permisos,
            consulta:{
                ...permisos.consulta,
                checked:user_permisos.includes(list.consulta.action)
            },
            recaudacion:{
                ...permisos.recaudacion,
                checked:user_permisos.includes(list.recaudacion.action)
            },
            cobranza:{
                ...permisos.cobranza,
                checked:user_permisos.includes(list.cobranza.action)
            },
            comprobantes:{
                ...permisos.comprobantes,
                checked:user_permisos.includes(list.comprobantes.action)
            },
            reportes:{
                ...permisos.reportes,
                checked:user_permisos.includes(list.reportes.action)
            },
            usuarios:{
                ...permisos.usuarios,
                checked:user_permisos.includes(list.usuarios.action)
            },
            bd:{
                ...permisos.bd,
                checked:user_permisos.includes(list.bd.action)
            },
            condonar:{
                ...permisos.condonar,
                checked:user_permisos.includes(list.condonar.action)
            },
            convenio:{
                ...permisos.convenio,
                checked:user_permisos.includes(list.convenio.action)
            },
        });

    },[]);

    if(!permisos) return <></>
    if(!user_permisos) return <></>

    return (
        <div className="CardUsuarios">
            <span>{id}</span>
            <span>{name}</span>
            <span>{email}</span>
            <span>{rol}</span>
            <span className="CardUsuarios__list" ref={permiss}>
                <label>
                    <input
                        value={permisos.consulta.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                consulta:{
                                    ...permisos.consulta,
                                    checked:e.target.checked
                                }
                            });
                            const data={
                                "permiso":permisos.consulta.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);
                        }} 
                        type="checkbox" 
                        checked={permisos.consulta.checked}
                    />
                    Consulta
                </label>
                <label>
                    <input
                        value={permisos.recaudacion.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                recaudacion:{
                                    ...permisos.recaudacion,
                                    checked:e.target.checked
                                }
                            });
                            
                            const data={
                                "permiso":permisos.recaudacion.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);

                        }} 
                        type="checkbox" 
                        checked={permisos.recaudacion.checked}
                    />
                    Recaudación
                </label>
                <label>
                    <input
                        value={permisos.cobranza.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                cobranza:{
                                    ...permisos.cobranza,
                                    checked:e.target.checked
                                }
                            });
                            const data={
                                "permiso":permisos.cobranza.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);
                        }} 
                        type="checkbox" 
                        checked={permisos.cobranza.checked}
                    />
                    Cobranza
                </label>
                <label>
                    <input
                        value={permisos.bd.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                condonar:{
                                    ...permisos.condonar,
                                    checked:e.target.checked
                                }
                            });
                            const data={
                                "permiso":permisos.condonar.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);
                        }} 
                        type="checkbox" 
                        checked={permisos.condonar.checked}
                    />
                    Solicitud condonación
                </label>
                <label>
                    <input
                        value={permisos.convenio.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                convenio:{
                                    ...permisos.convenio,
                                    checked:e.target.checked
                                }
                            });
                            const data={
                                "permiso":permisos.convenio.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);
                        }} 
                        type="checkbox" 
                        checked={permisos.convenio.checked}
                    />
                    Solicitud convenio de pago
                </label>
                <label>
                    <input
                        value={permisos.comprobantes.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                comprobantes:{
                                    ...permisos.comprobantes,
                                    checked:e.target.checked
                                }
                            });
                            const data={
                                "permiso":permisos.comprobantes.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);
                        }} 
                        type="checkbox" 
                        checked={permisos.comprobantes.checked}
                    />
                    Comprobantes
                </label>
                <label>
                    <input
                        value={permisos.reportes.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                reportes:{
                                    ...permisos.reportes,
                                    checked:e.target.checked
                                }
                            });
                            const data={
                                "permiso":permisos.reportes.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);
                        }} 
                        type="checkbox" 
                        checked={permisos.reportes.checked}
                    />
                    Reportes
                </label>
                <label>
                    <input
                        value={permisos.usuarios.action}
                        onChange={(e)=>{
                            if(permission.includes('User:minimize')){
                                {
                                    addNotification({
                                        title: 'No autorizado',
                                        subtitle: 'No puedes activar esta opción',
                                        message: 'Se necesita autorización de SUPER USUARIO',
                                        native: false,
                                        backgroundTop: '#FF9619',
                                        backgroundBottom: '#fdb864',
                                        colorTop: 'white',
                                        colorBottom: 'white',
                                        closeButton: 'Cerrar',
                                        duration: 3000,
                                    });
                                }
                            }else{
                                setPermisos({
                                    ...permisos,
                                    usuarios:{
                                        ...permisos.usuarios,
                                        checked:e.target.checked
                                    }
                                });
                                const data={
                                    "permiso":permisos.usuarios.action,
                                    "status":e.target.checked
                                };
                                useUpdatePermiss(data,id);
                            }
                        }} 
                        type="checkbox" 
                        checked={permisos.usuarios.checked}
                    />
                    Usuarios
                </label>
                <label>
                    <input
                        value={permisos.bd.action}
                        onChange={(e)=>{
                            setPermisos({
                                ...permisos,
                                bd:{
                                    ...permisos.bd,
                                    checked:e.target.checked
                                }
                            });
                            const data={
                                "permiso":permisos.bd.action,
                                "status":e.target.checked
                            };
                            useUpdatePermiss(data,id);
                        }} 
                        type="checkbox" 
                        checked={permisos.bd.checked}
                    />
                    Bases de datos y backup
                </label>
            </span>
            
            <button>
                <img src="./icons/options.png" onClick={(e)=>{useMenu(e.target,menu,'CardUsuarios__actions--active',null)}}/>
                <div ref={menu} className="CardUsuarios__actions">
                    <button>Editar datos</button>
                    <button>Borrar</button>
                </div>
            </button>
        </div>
    );
}