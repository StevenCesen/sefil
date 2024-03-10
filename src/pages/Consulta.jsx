import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import { useEffect, useState } from "react";
import useSearch from "../hooks/useSearch.js";

export default function Consulta(){
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

    const updateData=(url)=>{
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => setCredits(data));
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

        if(localStorage.getItem('cartera')!=='' & localStorage.getItem('cartera')!==null){
            setAux(localStorage.getItem('cartera'));
            fetch(`https://sefil.softsen.space/public/api/bussines/${localStorage.getItem('cartera')}`,{
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

    },[]);

    if(!business) return <></>    

    return (
        <div className="pageConsulta">
            <div className="pageConsulta__search">
                <label>
                    Buscar cliente
                    <input onKeyUp={(e)=>{
                        const ci=e.target.value;
                        if(aux_busines!==""){
                            useSearch(ci,aux_busines,setCredits);
                        }
                        
                    }} placeholder="Ingrese cédula o nombre"/>
                </label>
                <label>
                    Empresa
                    <select value={aux_busines} onChange={(e)=>{
                        if(e.target.value!=='default'){
                            setAux(e.target.value);
                            localStorage.setItem('cartera',e.target.value);
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
                                <NavLink to={`/dashboard/recaudacion/view/${aux_busines}?id=${credit.id}`} onClick={()=>{localStorage.setItem('hash',location.hash)}}>{credit.id}</NavLink>
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
                                <NavLink key={index} onClick={()=>{updateData(button.url)}}>Anterior</NavLink>
                            : 
                                (index===(credits.links.length-1)) ?
                                    <NavLink key={index} onClick={()=>{updateData(button.url)}}>Siguiente</NavLink>
                                :
                                    <></>
                        ))
                    }
                    </div>
                </div>

            </div>
        </div>
    );
}