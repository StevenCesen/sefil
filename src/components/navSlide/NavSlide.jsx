import { NavLink } from "react-router-dom";
import "./navSlide.css";
import useNav from "../../hooks/useNav.js";
import { useEffect, useRef, useState } from "react";
import useMenu from "../../hooks/useMenu.js";

export default function NavSlide({actions,permission}){

    const menu=useRef();
    const config=useRef();
    const icon_menu=useRef();
    const gestion=useRef();

    const [options,setOptions]=useState([]);

    useEffect(()=>{
        const permission=localStorage.getItem('permission').split(',');

        setOptions(permission);

    },[]);

    return (
        <div className="Dashboard__navSlide" ref={icon_menu}>
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
                (options.includes('Consulta:all')) ?
                    <NavLink to="dashboard/consulta" className="NavSlide__option">
                        <img src="./icons/ic_round-search.png"/>
                        <label>Consulta</label>
                        <span>Consulta</span>
                    </NavLink>
                : <></>
            }

            {
                (options.includes('Cobranza:all')) ?
                    <NavLink to="dashboard/recaudacion" className="NavSlide__option">
                        <img src="./icons/solar_cart-bold.png"/>
                        <label>Recaudación</label>
                        <span>Recaudación</span>
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
                                                        <NavLink to={"dashboard/monitor"}>Monitoreo</NavLink>
                                                        <NavLink to={"dashboard/campain"}>Campañas</NavLink>
                                                        <NavLink to={"dashboard/ccall"}>Configuración de Gestión</NavLink>
                                                    </>

                                                :   <NavLink to={"dashboard/call"}>Gestión</NavLink>
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
                (options.includes('Comprobantes:all')) ?
                    <NavLink to="dashboard/comprobantes" className="NavSlide__option">
                        <img src="./icons/ic_baseline-receipt-long.png"/>
                        <label>Comprobantes</label>
                        <span>Comprobantes</span>
                    </NavLink>
                :<></>
            }
        
            {
                (options.includes('Reportes:all')) ?
                    <div to={"dashboard/reportes"} className="NavSlide__option" onClick={(e)=>{useMenu(e.target,icon_menu,'NavSlide__subOption--active',icon_menu)}}>
                        <img src={"./icons/ion_bar-chart.png"}/>
                        <label>Reportes</label>
                        <span>Reportes</span>
                        <div className="NavSlide__option--down">
                            <img src="./icons/arrowDown.png"/>
                            <div ref={icon_menu}>
                                {
                                    (options.includes('User:all') | options.includes('User:minimize')) ?
                                        <>
                                            <NavLink to={"dashboard/reportes/estado"}>Estado de cartera</NavLink>
                                            <NavLink to={"dashboard/reportes/actividad"}>Cierre de caja</NavLink>
                                        </>
                                    :
                                        <></>
                                }
                                <NavLink to={"dashboard/reportes/cobros"}>Pagos</NavLink>
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
                                <NavLink to={"dashboard/configuracion/importpays"}>Pagos</NavLink>
                            </div>
                        </div>
                    </div>
                : <></>
            }
            
        </div>
    );
}