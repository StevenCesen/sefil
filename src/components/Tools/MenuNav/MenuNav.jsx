import { useState } from "react";
import "./MenuNav.css";
import NavigationToggle from "../NavigationToggle/NavigationToggle";
import CardManagement from "../../Management/CardManagement/CardManagement";

export default function MenuNav({options}){

    const [data,setData]=useState({
        current_page: 1,
        data: [],
        first_page_url: '',
        from:null,
        last_page: 1,
        last_page_url: null,
        links: [],
        next_page_url: null,
        path:'',
        per_page:10,
        prev_page_url: null,
        to: null,
        total: 0
    });

    return(
        <div className="MenuNav">
            <div className="MenuNav__sectionOptions">
                {
                    options.map(option=>(
                        <button 
                            key={option.name}
                            className={`${(option.default_option) ? "Credit__sectionOptions--activeButton" : ""}`}
                            onClick={(e)=>{
                                //  Consultar hacia el endpoint
                            }}    
                        >{option.name}</button>
                    ))
                }
            </div>
            {/* <div className="MenuNav__navigation">
                <h2>Registros</h2>
                <NavigationToggle
                    first_url={data.first_url}
                    prev_url={data.prev_page_url}
                    per_page={data.per_page}
                    next_url={data.next_page_url}
                    last_page={data.last_page_url}
                />
            </div> */}
            <div className="MenuNav__list">
                <CardManagement
                    management={{
                        create_date:"2025/07/21 10:25:10",
                        user_name:"Mateo Ojeda",
                        client_identification:"1103381982",
                        state_gestion:"CONTACTADO EFECTIVO",
                        substate_gestion:"OFERTA DE PAGO",
                        days_past_due:210,
                        promise_date:"2025/07/31",
                        observation:"HERMANOS - GARANTE (abogado) - no hay respuesta en las llamadas por parte del deudor - 0990339084 garante BYRON LANCHIMBA se lo notifica al wa solicitando nos ayude insistiendo con el deudor sobre la deuda que mantiene pendiente para que se pueda acercara realizar el pago"
                    }}
                />
            </div>
        </div>
    );
}