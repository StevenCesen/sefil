import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import DetailCredit from "./DetailCredit";
import { useEffect, useRef, useState } from "react";
import useSearch from "../hooks/useSearch";

export default function Cobranza(){
    const param = useParams();

    const [credits,setCredits]=useState({
        current_page:1,
        data:[],
        first_page_url:'',
        from:1,
        last_page:0,
        last_page_url:'',
        links:[],
        next_page_url:'',
        path:'',
        per_page:0,
        prev_page_url:'',
        to:0,
        total:0,
        acumulado:0,
    });

    const [business,setBusiness]=useState();

    const [aux_busines,setAux]=useState("");

    const updateData=(url,btn,text)=>{
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => {
                setCredits(data);
                btn.textContent=text;
            });
    }

    useEffect(()=>{
        fetch("https://sefil.softsen.space/public/api/bussines",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
            });
        
        setCredits({
            ...credits,
            data:[],
            links:[]
        });

    },[]);

    if(!business) return <></>  

    return (
        <div className="pageConsulta">
            {
                (!param.id) &&
                    <div className="pageConsulta__search">
                        <label>
                            Buscar cliente
                            <input onKeyUp={(e)=>{
                                const ci=e.target.value;
                                useSearch(ci,aux_busines,setCredits);
                            }} placeholder="Ingrese cédula o nombre"/>
                        </label>
                        <label>
                            Empresa
                            <select onChange={(e)=>{
                                if(e.target.value!=='default'){
                                    setAux(e.target.value);
                                    fetch(`https://sefil.softsen.space/public/api/bussines/${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setCredits(data);
                                        });
                                }
                            }}>
                                    <option value={"default"}>--Seleccionar--</option>
                                {
                                    business.map((bus,index)=>(
                                        <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                    ))
                                }
                            </select>
                        </label>
                    </div>
            }
            <div className="pageConsulta__results">

                {
                    (!param.id)
                    ?
                    <div className="pageConsulta__results">
                        <div className="DetailCredit__pays">
                            <div>
                                <p>ID</p>
                                <p>Crédito</p>
                                <p>Tipo</p>
                                <p>Nombre</p>
                                <p>Monto</p>
                                <p>Cédula</p>
                                <p>Compañia</p>
                                <p>Provincia</p>
                                <p>Canton</p>
                                <p>Parroquia</p>
                                <p>Agencia</p>
                            </div>

                            {
                                credits.data.map((credit,index)=>(
                                    <div>
                                        <NavLink to={`/dashboard/cobranza/view/set?cartera=${aux_busines}&id=${credit.id}`} onClick={()=>{localStorage.setItem('hash',location.hash)}}>{credit.id}</NavLink>
                                        <p>{credit.credito}</p>
                                        <p>{credit.tipo}</p>
                                        <p>{credit.name}</p>
                                        <p>$ {credit.totalAmount} USD</p>
                                        <p>{credit.ci}</p>
                                        <p>{credit.company}</p>
                                        <p>{credit.provincia}</p>
                                        <p>{credit.canton}</p>
                                        <p>{credit.parroquia}</p>
                                        <p>{credit.agency}</p>
                                    </div> 
                                ))
                            }


                        </div>

                        <div className="DetailCredit__access">
                            <p>Registros del {credits.from}-{credits.to} de {credits.total}</p>
                            <div>
                            {
                                credits.links.map((button,index)=>(
                                    (index===0)?
                                        <NavLink key={index} onClick={(e)=>{
                                            e.target.textContent='Cargando...';
                                            updateData(button.url,e.target,'Anterior');
                                        }}>Anterior</NavLink>
                                    : 
                                        (index===(credits.links.length-1)) ?
                                            <NavLink key={index} onClick={(e)=>{
                                                e.target.textContent='Cargando...';
                                                updateData(button.url,e.target,'Siguiente')
                                            }}>Siguiente</NavLink>
                                        :
                                            <></>
                                ))
                            }
                            </div>
                        </div>

                    </div>
                    :
                    <DetailCredit
                        id={param.id}
                        ci="1150575338"
                        name={"STEVEN RAFAEL CESEN PACCHA"}
                        data_pays=""
                    />
                }

            </div>
        </div>
    );
}