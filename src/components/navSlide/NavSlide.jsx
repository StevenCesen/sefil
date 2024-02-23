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
        const array_links=[];
        
        permission.map((permiso)=>{
            if(permiso==='Consulta:all'){
                array_links.push({
                    link:'dashboard/consulta',
                    text:'Consulta',
                    icon:'./icons/ic_round-search.png'
                });
            }else if(permiso==='Cobranza:all'){
                array_links.push({
                    link:'dashboard/cobranza',
                    text:'Cobranza',
                    icon:'./icons/solar_cart-bold.png'
                });
            }else if(permiso==='Comprobantes:all'){
                array_links.push({
                    link:'dashboard/comprobantes',
                    text:'Comprobantes',
                    icon:'./icons/ic_baseline-receipt-long.png'
                });
            }else if(permiso==='Reportes:all'){

                array_links.push({
                    link:'dashboard/reportes',
                    text:'Reportes',
                    icon:'./icons/ion_bar-chart.png',
                    sublinks:[
                        {
                            link:'dashboard/reportes/pagos',
                            text:'Reporte de pagos'
                        },
                        {
                            link:'dashboard/reportes/actividad',
                            text:'Reporte de actividad'
                        }
                    ]
                });

            }else if(permiso.substring(0,4)==='User'){
                array_links.push({
                    link:'dashboard/usuarios',
                    text:'Usuarios',
                    icon:'./icons/ph_user-bold.png'
                });

            }else if(permiso==='Gestion:all'){

                array_links.push({
                    link:'dashboard/gestion',
                    text:'Gestión',
                    icon:'./icons/zoiper.png'
                });

            }else if(permiso==='DB:all'){
                array_links.push({
                    link:'dashboard/configuracion',
                    text:'Configuración',
                    icon:'./icons/mdi_database-cog.png',
                    sublinks:[
                        {
                            link:'dashboard/configuracion/importdb',
                            text:'Carteras'
                        },
                        // {
                        //     link:'dashboard/configuracion/exportdb',
                        //     text:'Pagos'
                        // },
                        // {
                        //     link:'dashboard/configuracion/backup',
                        //     text:'Copias de seguridad'
                        // }
                    ]
                });
            }

        });

        setOptions(array_links);

    },[]);

    return (
        <div className="Dashboard__navSlide" ref={icon_menu}>
            <div>
                <img src="./icons/entypo_menu.png" onClick={(e)=>{useNav(e)}}/>
            </div>
            {
                (localStorage.getItem('rol')==='administrador') &&
                    <NavLink to="dashboard/" className="NavSlide__option">
                        <img src="./icons/mdi_home.png"/>
                        <label>Inicio</label>
                        <span>Inicio</span>
                    </NavLink>
            }

            {
                options.map((option,index)=>(
                    (option.sublinks)
                    ?
                        <div key={index} to={option.link} className="NavSlide__option" onClick={(e)=>{useMenu(e.target,menu,'NavSlide__subOption--active',icon_menu)}}>
                            <img src={option.icon}/>
                            <label>{option.text}</label>
                            <span>{option.text}</span>
                            <div className="NavSlide__option--down">
                                <img src="./icons/arrowDown.png"/>
                                <div ref={menu}>
                                    {
                                        option.sublinks.map((sublink,index)=>(
                                            <NavLink key={index} to={sublink.link}>{sublink.text}</NavLink>
                                        ))
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    :
                        <NavLink key={index} to={option.link} className="NavSlide__option">
                            <img src={option.icon}/>
                            <label>{option.text}</label>
                            <span>{option.text}</span>
                        </NavLink>
                ))
            }
            
        </div>
    );
}