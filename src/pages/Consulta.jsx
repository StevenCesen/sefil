import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import { useEffect, useState } from "react";
import useSearch from "../hooks/useSearch.js";
import useFormatterNumber from "../hooks/useFormatterNumber.js";
import Loader from "../components/Loader/loader.jsx";

export default function Consulta(){
    const param = useParams();

    //Estados para filtro de búsqueda en cabecera
    const [type_client,setClient]=useState('TITULAR');
    const [canton_input,setInput]=useState('');
    const [canton,setCanton]=useState('all');
    const [parroquia,setParroquia]=useState('all');
    const [agents,setAgents]=useState();
    const [agent,setAgent]=useState();
    const [loading,setLoading]=useState();
    const [filter,setFilter]=useState();

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
        console.log(url)
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => setCredits(data));
    }

    const updateFilter=({canton,status,campain,agente,estado_credito})=>{
        let filter="";


        if(canton!==""){
            filter+=`&canton=${canton}`;
        }

        if(status!==""){
            filter+=`&status=${status}`;
        }

        if(agente!==""){
            filter+=`&user_id=${agente}`;
        }

        if(estado_credito!==""){
            filter+=`&estado=${estado_credito}`;
        }
        
        filter=filter.substring(1)

        fetch(`${import.meta.env.VITE_URL_BASE}/bussines/${campain}?${filter}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCredits(data);
                setLoading(false);
            });
    }

    const updateCredits=(data)=>{
        setCredits({
            ...credits,
            data:data
        })
    }

    useEffect(()=>{
        
        setClient('TITULAR');
        setInput('');
        setCanton('all');
        setParroquia('all');
        setAgent("all");
        setLoading(false);
        setFilter({
            campain:"SEFIL_1",
            canton:"",
            status:"",
            user_id:"",
            collection_state:""
        });

        fetch(`${import.meta.env.VITE_URL_BASE}/bussines`,{
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

        localStorage.setItem('cartera','SEFIL_1');
        setAux(localStorage.getItem('cartera'));

        if(localStorage.getItem('cartera')!=='' & localStorage.getItem('cartera')!==null){
            setAux(localStorage.getItem('cartera'));
            fetch(`${import.meta.env.VITE_URL_BASE}/bussines/${localStorage.getItem('cartera')}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setCredits(data);
                });

            fetch(`${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=${localStorage.getItem('cartera')}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setAgents(data);
                });
        }

    },[]);

    if(!business) return <Loader/>  
    if(!agents) return <Loader/>
    if(!agent) return <Loader/>
    if(!filter) return <Loader/>

    return (
        <div className="pageConsulta">
            <div className="pageConsulta__search">
                <label>
                    Buscar cliente
                    <input onKeyUp={(e)=>{
                        const ci=e.target.value;
                        if(aux_busines!==""){
                            useSearch(ci,aux_busines,updateCredits,setCredits);
                        }
                        
                    }} placeholder="Ingrese cédula o nombre"/>
                </label>

                {/* <label>
                    Empresa
                    <select value={aux_busines} onChange={(e)=>{
                        if(e.target.value!=='default'){
                            setAux(e.target.value);
                            setLoading(true);
                            localStorage.setItem('cartera',e.target.value);
                            fetch(`${import.meta.env.VITE_URL_BASE}/bussines/${e.target.value}`,{
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    setCredits(data);
                                    setLoading(false);
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
                </label> */}
            </div>

            <div className="pageConsulta__results">
                <div className="DetailCredit__pays">
                    <div>
                        <p>ID</p>
                        <p>Crédito</p>
                        <label>
                            Tipo
                            <select
                                value={type_client}
                                onChange={(e)=>{
                                    setLoading(true);
                                    setClient(e.target.value);
                                    if(e.target.value==='GARANTE'){
                                        fetch(`${import.meta.env.VITE_URL_BASE}/credit/filterGarante`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                updateCredits(data.data);
                                                setLoading(false);
                                            });
                                    }else{
                                        fetch(`${import.meta.env.VITE_URL_BASE}/credit?cartera=SEFIL_1`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                updateCredits(data.data);
                                                setLoading(false);
                                            });
                                    }

                                }}
                            >
                                <option value={"TITULAR"}>TITULAR</option>
                                <option value={"GARANTE"}>GARANTE</option>
                            </select>
                        </label>

                        <p>Nombre</p>
                        <p>Monto</p>
                        <p>Cédula</p>

                        <label>
                            Compañia
                            <select
                                value={filter.campain}
                                onChange={(e)=>{
                                    if(e.target.value!=='default'){
                                        setLoading(true);
                                        localStorage.setItem('cartera',e.target.value);

                                        setFilter({
                                            ...filter,
                                            campain:e.target.value
                                        });

                                        updateFilter({
                                            canton:filter.canton,
                                            campain:e.target.value,
                                            agente:filter.user_id,
                                            status:filter.status,
                                            estado_credito:filter.collection_state
                                        });

                                        fetch(`${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=${localStorage.getItem('cartera')}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                setAgents(data);
                                                setLoading(false);
                                            });
                                    }
                                }}
                            >
                                {
                                    business.map((bus,index)=>(
                                        <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                    ))
                                }
                            </select>
                        </label>

                        <label>
                            Cantón
                            <input
                                value={filter.canton}
                                type="text" 
                                placeholder="Cantón"
                                onChange={(e)=>{
                                    setInput(e.target.value);
                                    setLoading(true);

                                    setFilter({
                                        ...filter,
                                        canton:e.target.value
                                    });

                                    updateFilter({
                                        canton:e.target.value,
                                        campain:filter.campain,
                                        agente:filter.user_id,
                                        status:filter.status,
                                        estado_credito:filter.collection_state
                                    });
                                }}
                            />
                    
                        </label>
                        
                        <label>
                            Estado campaña
                            <select
                                value={filter.status}
                                onChange={(e)=>{

                                    setLoading(true);
                                    setFilter({
                                        ...filter,
                                        status:e.target.value
                                    });

                                    updateFilter({
                                        canton:filter.canton,
                                        campain:filter.campain,
                                        agente:filter.user_id,
                                        status:e.target.value,
                                        estado_credito:filter.collection_state
                                    });
                                }}
                            >
                                <option value={""}>--  Seleccionar --</option>
                                <option value={"ACTIVE"}>ACTIVO</option>
                                <option value={"INACTIVE"}>INACTIVO</option>
                            </select>
                        </label>

                        <label>
                            Agente
                            <select
                                value={filter.user_id}
                                onChange={(e)=>{
                                    setLoading(true);
                                    setFilter({
                                        ...filter,
                                        user_id:e.target.value
                                    });

                                    updateFilter({
                                        canton:filter.canton,
                                        campain:filter.campain,
                                        agente:e.target.value,
                                        status:filter.status,
                                        estado_credito:filter.collection_state
                                    });
                                }}
                            >
                                <option value={"all"}>-- Seleccionar agente --</option>
                                {
                                    agents.map((agent)=>(
                                        <option value={agent.id}>{agent.name}</option>
                                    ))
                                }
                            </select>
                        </label>

                        <label>
                            Estado
                            <select
                                value={filter.collection_state}
                                onChange={(e)=>{
                                    setLoading(true);
                                    setFilter({
                                        ...filter,
                                        collection_state:e.target.value
                                    });

                                    updateFilter({
                                        canton:filter.canton,
                                        campain:filter.campain,
                                        agente:filter.user_id,
                                        status:filter.status,
                                        estado_credito:e.target.value
                                    });
                                }}
                            >
                                <option value={""}>-- Seleccionar --</option>
                                <option value={"Vencido"}>Vencido</option>
                                <option value={"Cancelado"}>Cancelado</option>
                                <option value={"CONVENIO DE PAGO"}>Convenio</option>
                            </select>
                        </label>
                    </div>

                    {
                        credits.data.map((credit,index)=>(
                            <div key={index}>
                                <NavLink to={`/dashboard/recaudacion/view/${credit.cartera}?id=${credit.id}`} onClick={()=>{localStorage.setItem('hash',location.hash)}}>{credit.id}</NavLink>
                                <p>{credit.cartera}-{credit.credito}</p>
                                <p>{credit.tipo}</p>
                                <p>{credit.name}</p>
                                <p>{useFormatterNumber({value:credit.totalAmount,currency:'USD'})}</p>
                                <p>{credit.ci}</p>
                                <p>{credit.company}</p>
                                <p>{credit.canton}</p>
                                <p>{credit.status}</p>
                                <p>{(credit.agent==="") ? "N/D" : credit.agent}</p>
                                <p>{credit.collectionState}</p>
                            </div> 
                        ))
                    }


                </div>

                {
                    //TENER EN CUENTA
                    (1===1)
                    ?
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
                    :   <></>
                }

            </div>
            {
                (loading)
                ?
                    <Loader/>
                :   <></>
            }
        </div>
    );
}