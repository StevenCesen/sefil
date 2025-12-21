import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Usuarios from "./Usuarios";
import Setting from "./Setting";
import Gestion from "./Gestion";
import Home from "./Home";
import Reports from "./Reports";
import Me from "./Me";
import Monitor from "./Monitor";
import GGestion from "./GGestion";
import Campain from "./Campain";
import Template from "./Template";
import GHistorial from "./Historial";
import Clist from "./Clist";
import Directions from "./Directions";
import Stadistics from "./StadisticsSync";
import Graficos from "./Graficos";
import Greports from "./Greports";
import Gconvenios from "./Gconvenios";
import Gcontactabilidad from "./Gcontactabilidad";
import ReportCondonations from "./ReportCondonations";
import ReportJudicial from "./ReportJudicial";
import ReportCobranza from "./ReportCobranza";
import ReportEvolutionPays from "./ReportEvolutionPays";
import ReportPays from "./ReportPays";
import PagosEfectivo from "./PagosEfectivo";
import ReportRevert from "./ReportRevert";
import ReportFaces from "./ReportFaces";
import ReportAssignCampain from "./ReportAssignCampain";

const permission=[
    {
        role:'superadmin',
        permission:{
            sections: [
                {
                    section:'home',
                    label:'Dashboard'
                },
                {
                    section:'monitor',
                    label:'Monitoreo'
                },
                {
                    section:'consult',
                    label:'Consultas'
                },
                {
                    section:'directions',
                    label:'Direcciones'
                },
                {
                    section:'contacts',
                    label:'Contactos'
                },
                {
                    section:'management_historial',
                    label:'Historial de gestiones'
                },
                {
                    section:'management',
                    label:'Gestión'
                },
                {
                    section:'campains',
                    label:'Campañas'
                },
                {
                    section:'users',
                    label:'Usuarios'
                },
                {
                    section:'settings',
                    label:'Configuración'
                },
                {
                    section:'calls',
                    label:'Llamadas'
                },
                {
                    section:'payments',
                    label:'Pagos'
                }
            ],
            abilities: [
                {
                    section: 'home',
                    abilitie: ['home:view']
                },
                {
                    section: 'users',
                    abilitie: ['users:create','users:edit','users:delete','users:view']
                },
                {
                    section: 'settings',
                    abilitie: ['settings:edit']
                },
                {
                    section: 'calls',
                    abilitie: ['calls:create','calls:make','calls:view']
                },
                {
                    section: 'payments',
                    abilitie: ['payments:create','payments:edit','payments:delete','payments:view']
                },
                {
                    section: 'reports',
                    abilitie: ['reports:view','reports:export']
                },
                {
                    section: 'db',
                    abilitie: ['db:import','db:export']
                },
                {
                    section: 'campains',
                    abilitie: ['campains:create','campains:edit','campains:delete','campains:view']
                },
                {
                    section: 'management',
                    abilitie: ['management:create','management:edit','management:delete','management:view']
                },
                {
                    section: 'contacts',
                    abilitie: ['contacts:create','contacts:edit','contacts:delete','contacts:view']
                },
                {
                    section: 'directions',
                    abilitie: ['directions:create','directions:edit','directions:delete','directions:view']
                },
                {
                    section: 'monitor',
                    abilitie: ['monitor:view']
                },
                {
                    section: 'consult',
                    abilitie: ['consult:view']
                },
                {
                    section: 'management_historial',
                    abilitie: ['management_historial:view']
                }
            ]
        }
    },
    {
        role:'admin',
        permission:{
            sections: [
                {
                    section:'home',
                    label:'Dashboard'
                },
                {
                    section:'monitor',
                    label:'Monitoreo'
                },
                {
                    section:'consult',
                    label:'Consultas'
                },
                {
                    section:'directions',
                    label:'Direcciones'
                },
                {
                    section:'contacts',
                    label:'Contactos'
                },
                {
                    section:'management_historial',
                    label:'Historial de gestiones'
                },
                {
                    section:'management',
                    label:'Gestión'
                },
                {
                    section:'campains',
                    label:'Campañas'
                },
                {
                    section:'users',
                    label:'Usuarios'
                },
                {
                    section:'settings',
                    label:'Configuración'
                },
                {
                    section:'calls',
                    label:'Llamadas'
                },
                {
                    section:'payments',
                    label:'Pagos'
                }
            ],
            abilities: [
                {
                    section: 'home',
                    abilitie: ['home:view']
                },
                {
                    section: 'users',
                    abilitie: ['users:create','users:view']
                },
                {
                    section: 'settings',
                    abilitie: ['settings:edit']
                },
                {
                    section: 'calls',
                    abilitie: ['calls:create','calls:make','calls:view']
                },
                {
                    section: 'payments',
                    abilitie: ['payments:create','payments:view']
                },
                {
                    section: 'reports',
                    abilitie: ['reports:view','reports:export']
                },
                {
                    section: 'campains',
                    abilitie: ['campains:create','campains:edit','campains:view']
                },
                {
                    section: 'management',
                    abilitie: ['management:create','management:view']
                },
                {
                    section: 'contacts',
                    abilitie: ['contacts:create','contacts:view']
                },
                {
                    section: 'directions',
                    abilitie: ['directions:create','directions:view']
                },
                {
                    section: 'monitor',
                    abilitie: ['monitor:view']
                },
                {
                    section: 'consult',
                    abilitie: ['consult:view']
                },
                {
                    section: 'management_historial',
                    abilitie: ['management_historial:view']
                }
            ]
        }
    },
    {
        role:'supervisor',
        permission:{
            sections: [
                {
                    section:'monitor',
                    label:'Monitoreo'
                },
                {
                    section:'consult',
                    label:'Consultas'
                },
                {
                    section:'directions',
                    label:'Direcciones'
                },
                {
                    section:'contacts',
                    label:'Contactos'
                },
                {
                    section:'management_historial',
                    label:'Historial de gestiones'
                },
                {
                    section:'management',
                    label:'Gestión'
                },
                {
                    section:'campains',
                    label:'Campañas'
                },
                {
                    section:'calls',
                    label:'Llamadas'
                },
                {
                    section:'payments',
                    label:'Pagos'
                }
            ],
            abilities: [
                {
                    section: 'calls',
                    abilitie: ['calls:make','calls:receive']
                },
                {
                    section: 'payments',
                    abilitie: ['payments:create','payments:view']
                },
                {
                    section: 'campains',
                    abilitie: ['campains:view','campains:transfer']
                },
                {
                    section: 'management',
                    abilitie: ['management:create','management:view']
                },
                {
                    section: 'contacts',
                    abilitie: ['contacts:create','contacts:view']
                },
                {
                    section: 'directions',
                    abilitie: ['directions:create','directions:view']
                },
                {
                    section: 'monitor',
                    abilitie: ['monitor:view']
                },
                {
                    section: 'consult',
                    abilitie: ['consult:view']
                },
                {
                    section: 'management_historial',
                    abilitie: ['management_historial:view']
                }
            ]
        }
    },
    {
        role:'campo',
        permission:{
            sections: [
                {
                    section:'contacts',
                    label:'Contactos'
                },
                {
                    section:'management',
                    label:'Gestión'
                },
                {
                    section:'calls',
                    label:'Llamadas'
                },
                {
                    section:'payments',
                    label:'Pagos'
                }
            ],
            abilities: [
                {
                    section: 'calls',
                    abilitie: ['calls:view']
                },
                {
                    section: 'payments',
                    abilitie: ['payments:view']
                },
                {
                    section: 'management',
                    abilitie: ['management:create','management:view']
                },
                {
                    section: 'contacts',
                    abilitie: ['contacts:create','contacts:view']
                }
            ]
        }
    },
    {
        role:'call',
        permission:{
            sections: [
                {
                    section:'contacts',
                    label:'Contactos'
                },
                {
                    section:'management',
                    label:'Gestión'
                },
                {
                    section:'calls',
                    label:'Llamadas'
                }
            ],
            abilities: [
                {
                    section: 'calls',
                    abilitie: ['calls:view']
                },
                {
                    section: 'management',
                    abilitie: ['management:create','management:view']
                },
                {
                    section: 'contacts',
                    abilitie: ['contacts:create','contacts:view']
                }
            ]
        }
    }
];

export default function Dashboard({rol}){
    
    const [permission,setPermission]=useState([]);
    const [actions,setActions]=useState([]);
    const [loading,setLoading]=useState(true);

    const page=useParams();

    useEffect(()=>{
        window.addEventListener("load",setLoading(false));

        data.map((user)=>{
            if(rol===user.rol){
                setPermission(user.permission);
                setActions(user.actions);
            }
        });
    
        return () => window.removeEventListener("load",setLoading(false));

    },[]);
    
    return (
        <div className="Dashboard__currentPage">
            {
                
                        (page.action==='me')
                        ?
                            <Me/>
                        :
                                    (page.action==='monitor')
                                    ?
                                        <Monitor/>
                                    :
                                        (page.action==='cobros')
                                        ?
                                            <ReportPays/>
                                        :
                                        (page.action==='pagosefectivos')
                                        ?
                                            <PagosEfectivo/>
                                        :
                                        (page.action==='pagosrevertidos')
                                        ?
                                            <ReportRevert/>
                                        :
                                        (page.action==='gastoscobranza')
                                        ?
                                            <ReportCobranza/>
                                        :
                                        (page.action==='gastosjudicial')
                                        ?
                                            <ReportJudicial/>
                                        :
                                        (page.action==='evolucionpagos')
                                        ?
                                            <ReportEvolutionPays/>
                                        :
                                        (page.action==='condonaciones')
                                        ?
                                            <ReportCondonations/>
                                        :
                                        (page.action==='estado')
                                        ?
                                            <Reports/>
                                        :
                                        (page.action==='cierrefaces')
                                        ?
                                            <ReportFaces/>
                                        :
                                        (page.action==='asignacion')
                                        ?
                                            <ReportAssignCampain/>
                                        :
                                            (page.action==='greports')
                                            ?
                                                <Greports/>
                                            :
                                                (page.action==='gconvenios')
                                                ?
                                                    <Gconvenios/>
                                                :
                                                (page.action==='gcontactabilidad')
                                                ?
                                                    <Gcontactabilidad/>
                                                :
                                                (page.action==='glist')
                                                ?
                                                    <GHistorial/>
                                                :
                                                    (page.action==='clist')
                                                    ?
                                                        <Clist/>
                                                    :
                                                        (page.action==='stadistics')
                                                        ?
                                                            <Stadistics/>
                                                        :
                                                            (page.action==='call')
                                                            ?
                                                                <Gestion/>
                                                            :
                                                                (page.action==='graficos')
                                                                ?
                                                                    <Graficos/>
                                                                :
                                                                    (page.action==='ccall')
                                                                    ?
                                                                        <GGestion/>
                                                                    :
                                                                        (page.action==='templates')
                                                                        ?
                                                                            <Template/>
                                                                        :
                                                                            (page.action==='campain')
                                                                            ?
                                                                                <Campain/>
                                                                            :
                                                                                (page.action==='usuarios')
                                                                                ?
                                                                                    <Usuarios/>
                                                                                :
                                                                                    (page.action==='configuracion')
                                                                                    ?
                                                                                        <Setting/>
                                                                                    :   
                                                                                        (page.action==='direcciones')
                                                                                        ?
                                                                                            <Directions/>
                                                                                        :
                                                                                            (localStorage.getItem('rol')==='administrador') ?
                                                                                                <Home/>
                                                                                            :
                                                                                                (localStorage.getItem('rol')!=='super')
                                                                                                ? 

                                                                                                    (localStorage.getItem('rol')==='cobranza' | localStorage.getItem('rol')==='consulta')
                                                                                                    ?
                                                                                                        <></>
                                                                                                    : 
                                                                                                        <Gestion/>

                                                                                                :   <Setting/>
            }
        </div>
    );
}