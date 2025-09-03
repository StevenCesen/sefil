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
import Monitor from "./Monitor";
import GGestion from "./GGestion";
import Campain from "./Campain";
import Template from "./Template";
import GHistorial from "./Historial";
import Clist from "./Clist";
import Directions from "./Directions";
import Loader from "../components/Loader/loader";
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
    const [loading,setLoading]=useState(true);

    const page=useParams();

    useEffect(()=>{
        //Consulta a API, para setear permisos
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
                                                                                                        <Consulta/>
                                                                                                    : 
                                                                                                        <Gestion/>

                                                                                                :   <Setting/>
            }
        </div>
    );
}