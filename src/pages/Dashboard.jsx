import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Consulta from "./Consulta";
import Cobranza from "./Cobranza";
import Usuarios from "./Usuarios";
import Setting from "./Setting";
import Comprobantes from "./Comprobantes";
import Gestion from "./Gestion";
import Garantes from "./Garantes";
import Home from "./Home";
import Reports from "./Reports";
import Me from "./Me";

const data=[
    {
        rol:'gestor',
        permission:['DB:import','DB:export','User:create','User:delete','User:update'],
        actions:[
            {
                name:'Configuración y usuarios',
                hash:'/configuracion'
            }
        ]
    },
    {
        rol:'admin',
        permission:['User:create','User:delete','User:update','Cash:crud','Reports:crud','Voucher:crud'],
        actions:[
            {
                name:'Consulta',
                hash:'/consulta'
            },
            {
                name:'Cobranza',
                hash:'/cobranza'
            },
            {
                name:'Comprobantes',
                hash:'/comprobantes'
            },
            {
                name:'Reportes',
                hash:'/reportes'
            },
            {
                name:'Usuarios',
                hash:'/configuracion'
            }
        ]
    },
    {
        rol:'consult',
        permission:['Voucher:crud'],
        actions:[
            {
                name:'Consulta',
                hash:'/consulta'
            },
            {
                name:'Comprobantes',
                hash:'/comprobantes'
            }
        ]
    },
    {
        rol:'cash',
        permission:['Voucher:crud'],
        actions:[
            {
                name:'Consulta',
                hash:'/consulta'
            },
            {
                name:'Cobranza',
                hash:'/cobranza'
            },
            {
                name:'Comprobantes',
                hash:'/comprobantes'
            }
        ]
    }

]

export default function Dashboard({rol}){
    
    const [permission,setPermission]=useState([]);
    const [actions,setActions]=useState([]);

    const page=useParams();

    useEffect(()=>{
        //Consulta a API, para setear permisos
        data.map((user)=>{
            if(rol===user.rol){
                setPermission(user.permission);
                setActions(user.actions);
            }
        });
    },[]);

    return (
        <div className="Dashboard__currentPage">
            {
                (page.action==='consulta')
                ?
                    <Consulta/>
                :
                    (page.action==='recaudacion')
                    ?
                        <Cobranza/>
                    :
                        (page.action==='me')
                        ?
                            <Me/>
                        :
                            (page.action==='garantes')
                            ?
                                <Garantes/>
                            :
                                (page.action==='comprobantes')
                                ?
                                    <Comprobantes />
                                :
                                    (page.action==='reportes')
                                    ?
                                        <Reports/>
                                    :
                                        (page.action==='cobranza')
                                        ?
                                            <Gestion/>
                                        :
                                            (page.action==='usuarios')
                                            ?
                                                <Usuarios/>
                                            :
                                                (page.action==='configuracion')
                                                ?
                                                    <Setting/>
                                                :   
                                                    (localStorage.getItem('rol')==='administrador') ?
                                                        <Home/>
                                                    :
                                                        (localStorage.getItem('rol')!=='super')? 
                                                            <Consulta/>
                                                        :   <Setting/>
            }
        </div>
    );
}