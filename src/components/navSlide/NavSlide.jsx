import { NavLink } from "react-router-dom";
import "./navSlide.css";
import useNav from "../../hooks/useNav.js";
import { useEffect, useRef, useState } from "react";
import useMenu from "../../hooks/useMenu.js";

export default function NavSlide({actions,permission}){

    const menu=useRef();
    const config=useRef();
    const icon_menu=useRef();
    const reports=useRef();
    const gestion=useRef();
    const monitoreo=useRef();

    const [options,setOptions]=useState([]);
    const abilities_reports=[
        "pagos:all",
        "gestiones_pago:all",
        "no_efectivos:all",
        "estado_convenios:all",
        "estadistica_gestion:all",
        "historico_condonaciones:all",
        "gastos_gestion:all",
        "cierre_caja:all",
        "estado_cartera:all"
    ];

    useEffect(()=>{
        const permission=localStorage.getItem('permission').split(',');
        setOptions(permission);
    },[]);

    return (
        <div className="Dashboard__navSlide">
            <div>
                <img src="./icons/entypo_menu.png" onClick={(e)=>{useNav(e)}}/>
            </div>
            {
                (localStorage.getItem('rol')==='administrador') ?
                    <NavLink to="dashboard/" className="NavSlide__option">
                        <img src="./icons/mdi_home.png"/>
                        <label>Inicio</label>
                        <span>Inicio</span>
                    </NavLink>
                : <></>
            }

            {
                (options.includes('Monitor:all') | options.includes('estadistica_gestion:all') | options.includes('no_efectivos:all')) ?
                    <div className="NavSlide__option" onClick={(e)=>{useMenu(e.target,monitoreo,'NavSlide__subOption--active',monitoreo)}}>
                        <img src="./icons/monitor.png"/>
                        <label>Monitoreo</label>
                        <span>Monitoreo</span>
                        <div className="NavSlide__option--down">
                            <img src="./icons/arrowDown.png"/>
                            <div ref={monitoreo}>
                                {
                                    (options.includes('Monitor:all')) 
                                    ?
                                        <NavLink to={"dashboard/monitor"}>Dashboard monitoreo</NavLink>
                                    :   <></>
                                }
                                {
                                    (options.includes('estadistica_gestion:all'))
                                    ?
                                        <NavLink to={"dashboard/greports"}>Estadísticas de gestiones</NavLink>
                                    :   <></>
                                }
                                {
                                    (options.includes('no_efectivos:all'))
                                    ?
                                        <NavLink to={"dashboard/gcontactabilidad"}>Créditos no efectivos</NavLink>
                                    :   <></>             
                                }
                            </div>
                        </div>
                    </div>
                : <></>
            }

            {
                (options.includes('Consulta:all') || options.includes('Cobranza:all'))
                ?
                    <NavLink to="credits" className="NavSlide__option">
                        <img src="./icons/ic_round-search.png"/>
                        <label>Créditos</label>
                        <span>Créditos</span>
                    </NavLink>
                :   <></>
            }

            {/* {
                (options.includes('Consulta:all')) ?
                    <NavLink to="dashboard/consulta" className="NavSlide__option">
                        <img src="./icons/ic_round-search.png"/>
                        <label>Consulta</label>
                        <span>Consulta</span>
                    </NavLink>
                : <></>
            }

            {
                () ?
                    <NavLink to="dashboard/recaudacion" className="NavSlide__option">
                        <img src="./icons/solar_cart-bold.png"/>
                        <label>Recaudación</label>
                        <span>Recaudación</span>
                    </NavLink>
                : <></>
            } */}

            {
                (options.includes('Direcciones:all')) ?
                    <NavLink to="dashboard/direcciones" className="NavSlide__option">
                        <img src="./icons/location.png"/>
                        <label>Direcciones</label>
                        <span>Direcciones</span>
                    </NavLink>
                : <></>
            }

            {
                (options.includes('Gestion:all')) ?
                    <div to="dashboard/cobranza" className="NavSlide__option" onClick={(e)=>{useMenu(e.target,gestion,'NavSlide__subOption--active',gestion)}}>
                        <img src="./icons/zoiper.png"/>
                        <label>Cobranza</label>
                        <span>Cobranza</span>
                        <div className="NavSlide__option--down">
                            <img src="./icons/arrowDown.png"/>
                            <div ref={gestion}>
                                {
                                    (options.includes('Gestion:all')) ?
                                        <>
                                            {
                                                (options.includes('User:all') | options.includes('User:minimize'))
                                                ?
                                                    <>
                                                        <NavLink to={"dashboard/glist"}>Historial de gestiones</NavLink>
                                                        <NavLink to={"dashboard/clist"}>Consulta créditos</NavLink>
                                                        {
                                                            (options.includes('Gestion:all'))
                                                            ?
                                                                <NavLink to={"dashboard/call"}>Gestión</NavLink>
                                                            : <></>
                                                        }
                                                        
                                                        <NavLink to={"dashboard/campain"}>Campañas</NavLink>
                                                        <NavLink to={"dashboard/ccall"}>Configuración de Gestión</NavLink>
                                                        {/* <NavLink to={"dashboard/graficos"}>Consolidado general</NavLink> */}
                                                    </>

                                                :   
                                                    (options.includes('Monitor:all'))
                                                    ?
                                                        <>
                                                            <NavLink to={"dashboard/greports"}>Estadísticas de gestiones</NavLink>
                                                            <NavLink to={"dashboard/call"}>Gestión</NavLink>
                                                            <NavLink to={"dashboard/glist"}>Historial de gestiones</NavLink>
                                                            <NavLink to={"dashboard/clist"}>Consulta créditos</NavLink>
                                                            <NavLink to={"dashboard/campain"}>Campañas</NavLink>
                                                            {/* <NavLink to={"dashboard/graficos"}>Consolidado general</NavLink> */}
                                                        </>
                                                    :
                                                        <NavLink to={"dashboard/call"}>Gestión</NavLink>
                                            }
                                        </>
                                    :
                                        <></>
                                }
                            </div>
                        </div>
                    </div>
                :<></>
            }
            
            {
                (    
                    options.includes('pagos_efectivo:all') | 
                    options.includes('pagos_revertidos:all') | 
                    options.includes('gastos_cobranza:all') | 
                    options.includes('gastos_condonaciones:all') | 
                    options.includes('pagos:all')
                ) ?
                    <div to={"dashboard/reportes"} className="NavSlide__option" onClick={(e)=>{useMenu(e.target,icon_menu,'NavSlide__subOption--active',icon_menu)}}>
                        <img src={"./icons/ion_bar-chart.png"}/>
                        <label>Reportes cierre de caja</label>
                        <span>Reportes cierre de caja</span>
                        <div className="NavSlide__option--down">
                            <img src="./icons/arrowDown.png"/>
                            <div ref={icon_menu}>
                                {
                                    (options.includes('pagos_efectivo:all')) ?
                                        <NavLink to={"dashboard/pagosefectivos"}>Pagos en efectivo</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('pagos_revertidos:all')) ?
                                        <NavLink to={"dashboard/pagosrevertidos"}>Pagos revertidos</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('gastos_cobranza:all')) ?
                                        <NavLink to={"dashboard/gastoscobranza"}>Facturación gastos de cobranza</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('gastos_cobranza:all')) ?
                                        <NavLink to={"dashboard/condonaciones"}>Condonaciones</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('pagos:all')) ?
                                        <NavLink to={"dashboard/cobros"}>Pagos contabilidad</NavLink>
                                    :
                                        <></>
                                }
                            </div>
                        </div>
                    </div>
                :<></>
            }

            {
                (   
                    options.includes('gastos_judiciales:all') | 
                    options.includes('estado_convenios:all')  |
                    options.includes('gestiones_pago:all') |
                    options.includes('reporte_faces:all') | 
                    options.includes('estado_cartera:all') |
                    options.includes('evolucion_creditos:all') |
                    options.includes('asignacion_campain:all')
                ) ?
                    <div to={"dashboard/reportes"} className="NavSlide__option" onClick={(e)=>{useMenu(e.target,reports,'NavSlide__subOption--active',reports)}}>
                        <img src={"./icons/ion_bar-chart.png"}/>
                        <label>Reportes estadísticas</label>
                        <span>Reportes estadísticas</span>
                        <div className="NavSlide__option--down">
                            <img src="./icons/arrowDown.png"/>
                            <div ref={reports}>
                                {
                                    (options.includes('gastos_judiciales:all')) ?
                                        <NavLink to={"dashboard/gastosjudicial"}>Gastos judiciales cargados</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('estado_convenios:all')) ?
                                        <NavLink to={"dashboard/gconvenios"}>Estado de convenios</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('gestiones_pago:all')) ?
                                        <NavLink to={"dashboard/stadistics"}>Pagos con gestión</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('reporte_faces:all')) ?
                                        <NavLink to={"dashboard/cierrefaces"}>Reporte gestión FACES</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('estado_cartera:all')) ?
                                        <NavLink to={"dashboard/estado"}>Estado de cartera (SEFIL)</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('evolucion_creditos:all')) ?
                                        <NavLink to={"dashboard/evolucionpagos"}>Evolución créditos y pagos (SEFIL)</NavLink>
                                    :
                                        <></>
                                }
                                {
                                    (options.includes('asignacion_campain:all')) ?
                                        <NavLink to={"dashboard/asignacion"}>Asignación de campaña</NavLink>
                                    :
                                        <></>
                                }
                                
                            </div>
                        </div>
                    </div>
                :<></>
            }

            {
                (options.includes('User:all') | options.includes('User:minimize')) ?
                    <NavLink to="dashboard/usuarios" className="NavSlide__option">
                        <img src="./icons/ph_user-bold.png"/>
                        <label>Usuarios</label>
                        <span>Usuarios</span>
                    </NavLink>
                : <></>
            }

            {
                (options.includes('DB:all')) ?
                    <div className="NavSlide__option" onClick={(e)=>{useMenu(e.target,menu,'NavSlide__subOption--active',menu)}}>
                        <img src={"./icons/mdi_database-cog.png"}/>
                        <label>Configuración</label>
                        <span>Configuración</span>
                        <div className="NavSlide__option--down">
                            <img src="./icons/arrowDown.png"/>
                            <div ref={menu}>
                                <NavLink to={"dashboard/configuracion/importdb"}>Carteras</NavLink>
                                <NavLink to={"dashboard/configuracion/importpays"}>Carga de pagos</NavLink>
                            </div>
                        </div>
                    </div>
                : <></>
            }
            
        </div>
    );
}