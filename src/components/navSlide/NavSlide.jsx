import { NavLink } from "react-router-dom";
import "./navSlide.css";
import useNav from "../../hooks/useNav.js";
import { useEffect, useRef, useState } from "react";
import useMenu from "../../hooks/useMenu.js";

export default function NavSlide({actions,permission}){

    const menu=useRef();
    const config=useRef();
    const icon_menu=useRef();

    const [options,setOptions]=useState([]);

    useEffect(()=>{
        const permission=localStorage.getItem('permission').split(',');
        // permission.map((permiso)=>{
        //     if(permiso==='Consulta:all'){
        //         array_links.push({
        //             link:'dashboard/consulta',
        //             text:'Consulta',
        //             icon:'./icons/ic_round-search.png'
        //         });
        //     }else if(permiso==='Cobranza:all'){
        //         array_links.push({
        //             link:'dashboard/recaudacion',
        //             text:'Recaudación',
        //             icon:'./icons/solar_cart-bold.png'
        //         });
        //     }else if(permiso==='Comprobantes:all'){
        //         array_links.push({
        //             link:'dashboard/comprobantes',
        //             text:'Comprobantes',
        //             icon:'./icons/ic_baseline-receipt-long.png'
        //         });
        //     }else if(permiso==='Reportes:all'){

        //         array_links.push({
        //             link:'dashboard/reportes',
        //             text:'Reportes',
        //             icon:'./icons/ion_bar-chart.png',
        //             sublinks:[
        //                 {
        //                     link:'dashboard/reportes/estado',
        //                     text:'Estado de cartera'
        //                 },
        //                 {
        //                     link:'dashboard/reportes/actividad',
        //                     text:'Cierre de caja'
        //                 }
        //             ]
        //         });

        //     }else if(permiso.substring(0,4)==='User'){
        //         array_links.push({
        //             link:'dashboard/usuarios',
        //             text:'Usuarios',
        //             icon:'./icons/ph_user-bold.png'
        //         });

        //     }else if(permiso==='Gestion:all'){

        //         array_links.push({
        //             link:'dashboard/cobranza',
        //             text:'Cobranza',
        //             icon:'./icons/zoiper.png'
        //         });

        //     }else if(permiso==='DB:all'){
        //         array_links.push({
        //             link:'dashboard/configuracion',
        //             text:'Configuración',
        //             icon:'./icons/mdi_database-cog.png',
        //             sublinks:[
        //                 {
        //                     link:'dashboard/configuracion/importdb',
        //                     text:'Carteras'
        //                 },
        //                 // {
        //                 //     link:'dashboard/configuracion/exportdb',
        //                 //     text:'Pagos'
        //                 // },
        //                 // {
        //                 //     link:'dashboard/configuracion/backup',
        //                 //     text:'Copias de seguridad'
        //                 // }
        //             ]
        //         });
        //     }

        // });

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
                    <NavLink to="dashboard/cobranza" className="NavSlide__option">
                        <img src="./icons/zoiper.png"/>
                        <label>Cobranza</label>
                        <span>Cobranza</span>
                    </NavLink>
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
                    <div to={"dashboard/reportes"} className="NavSlide__option" onClick={(e)=>{useMenu(e.target,config,'NavSlide__subOption--active',icon_menu)}}>
                        <img src={"./icons/ion_bar-chart.png"}/>
                        <label>Reportes</label>
                        <span>Reportes</span>
                        <div className="NavSlide__option--down">
                            <img src="./icons/arrowDown.png"/>
                            <div ref={config}>
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