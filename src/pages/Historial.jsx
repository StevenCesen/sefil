import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import CardCurrentGestion from "../components/CardCurrentGestion/CardCurrentGestion";
import useFilterGestions from "../hooks/useFilterGestions";
import useReturnFilter from "../hooks/useReturnFilter";
import Loader from "../components/Loader/loader";

export default function GHistorial(){

    const [campain,setCampain]=useState('');
    const [campains,setCampains]=useState();
    const [current,setCurrent]=useState();
    const [agents,setAgents]=useState();
    const [filters,setFilters]=useState();
    const [loading,setLoading]=useState();

    const params=new URLSearchParams(useLocation().search);
    const param=useParams();

    const [data,setData]=useState(); //Aquí tenemos todos los créditos
    
    const updateData=(url)=>{
        setLoading(true);
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => {

                if(param.ci){
                    data.path+=`?credit=${param.ci}&cartera=${params.get('cartera')}`;

                    if(data.next_page_url!==null){
                        const page_param_next=data.next_page_url.split('?')[1];
                        data.next_page_url=`${data.path}&${page_param_next}`;
                    }

                    if(data.prev_page_url!==null){
                        const page_param_prev=data.prev_page_url.split('?')[1];
                        data.prev_page_url=`${data.path}&${page_param_prev}`;
                    }
                }else{
                    const filter=useReturnFilter({
                        fecha_gestion:filters.fecha_gestion,
                        campain:filters.campain,
                        name:filters.name,
                        ci:filters.ci,
                        type:filters.type,
                        state_gestion:filters.state_gestion,
                        date_promise:filters.date_promise,
                        credito:filters.credito,
                        agente:filters.agente,
                        gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                    });
                    
                    if(data.next_page_url!==null){
                        data.next_page_url+=`&${filter}`;
                    }
                    
                    if(data.prev_page_url!==null){
                        data.prev_page_url+=`&${filter}`; 
                    }
                }
                
                setData(data);
                setLoading(false);
            });
    }

    useEffect(()=>{

        setFilters({
            fecha_gestion:"",
            campain:"",
            name:"",
            ci:"",
            type:"",
            state_gestion:"",
            date_promise:"",
            agente:"",
            credito:"",
            gestion_channel_whatsapp:""
        });

        setLoading(false);
        
        fetch(`${import.meta.env.VITE_URL_BASE}/users/agents`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setAgents(data);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data.data);

                if(param.ci!==undefined){
                    fetch(`${import.meta.env.VITE_URL_BASE}/managmentall?credit=${param.ci}&cartera=${params.get('cartera')}`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then((data) => {
                            data.path+=`?credit=${param.ci}&cartera=${params.get('cartera')}`;

                            if(data.next_page_url!==null){
                                const page_param_next=data.next_page_url.split('?')[1];
                                data.next_page_url=`${data.path}&${page_param_next}`;
                            }

                            if(data.prev_page_url!==null){
                                const page_param_prev=data.prev_page_url.split('?')[1];
                                data.prev_page_url=`${data.path}&${page_param_prev}`;
                            }
                            
                            setData(data);
                        });
                }else{

                    fetch(`${import.meta.env.VITE_URL_BASE}/managmentall`,{
                        headers: {

                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then((data) => {
                            setData(data);
                        });
                }
            });
        setCurrent([]);

    },[]);

    if(!campains) return <Loader/>
    if(!data) return <Loader/>
    if(!current) return <Loader/>
    if(!agents) return <Loader/>

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
                <NavLink
                    to="" 
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1) 
                    }}
                >Regresar</NavLink>
            </div>

            <div style={{paddingBottom:"20px"}}>
                <h3 style={{color:"var(--color-1)"}}>Historial de gestiones</h3>
                
                <div className="Historial__head">
                    <label></label>
                    <label>
                        Fecha gestión
                        <input 
                            value={filters.fecha_gestion}
                            type="date"
                            onChange={(e)=>{

                                setFilters({
                                    ...filters,
                                    fecha_gestion:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:e.target.value,
                                    campain:filters.campain,
                                    name:filters.name,
                                    ci:filters.ci,
                                    type:filters.type,
                                    state_gestion:filters.state_gestion,
                                    date_promise:filters.date_promise,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                });

                            }}
                        />
                    </label>
                    <label>
                        Campaña
                        <select
                            value={filters.campain}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    campain:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:e.target.value,
                                    name:filters.name,
                                    ci:filters.ci,
                                    type:filters.type,
                                    state_gestion:filters.state_gestion,
                                    date_promise:filters.date_promise,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                });
                            }}
                        >
                            <option>-- Seleccionar --</option>
                            {
                                campains.map((campain,index)=>(
                                    <option value={campain.id} key={index}>{campain.name}</option>
                                ))
                            }
                        </select>    
                    </label>
                    <label>
                        Nombre
                        <input 
                            value={filters.name}
                            type="value"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    name:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:filters.campain,
                                    name:e.target.value,
                                    ci:filters.ci,
                                    type:filters.type,
                                    state_gestion:filters.state_gestion,
                                    date_promise:filters.date_promise,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                });
                            }}
                        />
                    </label>
                    <label>
                        Cédula
                        <input 
                            value={filters.ci}
                            type="value"
                            placeholder="Cédula"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    ci:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:filters.campain,
                                    name:filters.name,
                                    ci:e.target.value,
                                    type:filters.type,
                                    state_gestion:filters.state_gestion,
                                    date_promise:filters.date_promise,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                });
                            }}
                        />

                    </label>
                    <label>
                        Tipo
                        <select
                            value={filters.type}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    type:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:filters.campain,
                                    name:filters.name,
                                    ci:filters.ci,
                                    type:e.target.value,
                                    state_gestion:filters.state_gestion,
                                    date_promise:filters.date_promise,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                });
                            }}
                        >
                            <option value={""}>-- Seleccionar --</option>
                            <option value={"TITULAR"}>TITULAR</option>
                            <option value={"GARANTE"}>GARANTE</option>
                        </select>
                    </label>
                    <label>
                        Crédito
                        <input 
                            value={filters.credito}
                            type="value"
                            onChange={(e)=>{

                                setFilters({
                                    ...filters,
                                    credito:e.target.value
                                });

                                if(e.target.value.length>8){
                                    useFilterGestions({
                                        fecha_gestion:filters.fecha_gestion,
                                        campain:filters.campain,
                                        name:filters.name,
                                        ci:filters.ci,
                                        type:filters.type,
                                        state_gestion:filters.state_gestion,
                                        date_promise:filters.date_promise,
                                        agente:filters.agente,
                                        credito:e.target.value,
                                        setData:setData,
                                        loader:setLoading,
                                        gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                    });
                                }
                            }}
                        />
                    </label>

                    <label>
                        Estado gestión
                        <select
                            value={filters.state_gestion}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    state_gestion:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:filters.campain,
                                    name:filters.name,
                                    ci:filters.ci,
                                    type:filters.type,
                                    state_gestion:e.target.value,
                                    date_promise:filters.date_promise,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading
                                });
                            }}
                        >
                            <option>-- Seleccionar --</option>
                            <option value={"COMPROMISO DE PAGO"}>COMPROMISO DE PAGO</option>
                            <option value={"OFERTA DE PAGO"}>OFERTA DE PAGO</option>
                            <option value={"VOLVER A LLAMAR"}>VOLVER A LLAMAR</option>
                            <option value={"MENSAJE A TERCEROS"}>MENSAJE A TERCEROS</option>
                            <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                            <option value={"YA PAGÓ"}>YA PAGÓ</option>
                            <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                            <option value={"CLIENTE SE NIEGA A PAGAR"}>CLIENTE SE NIEGA A PAGAR</option>
                            <option value="CLIENTE INDICA QUE NO ES SU DEUDA">CLIENTE INDICA QUE NO ES SU DEUDA</option>
                            <option value="CONVENIO DE PAGO">CONVENIO DE PAGO</option>
                            <option value="CONTACTO INDICA QUE ESTA EQUIVOCADO">CONTACTO INDICA QUE ESTA EQUIVOCADO</option>
                            <option value="CLIENTE ESCUCHA Y NO HABLA">CLIENTE ESCUCHA Y NO HABLA</option>
                            <option value="CLIENTE ESTA OCUPADO">CLIENTE ESTA OCUPADO</option>
                            <option value="CONTESTA MENOR DE EDAD">CONTESTA MENOR DE EDAD</option>
                            <option value="CORTA LA LLAMADA">CORTA LA LLAMADA</option>
                            <option value="INUBICABLE">INUBICABLE</option>
                            <option value="NO VIVE EN LA MISMA DIRECCIÓN">NO VIVE EN LA MISMA DIRECCIÓN</option>
                            <option value="Recopilación de Información">Recopilación de Información</option>
                            <option value="Documentación para demanda">Documentación para demanda</option>
                            <option value="Presentación demanda">Presentación demanda</option>
                            <option value="Citación judicial">Citación judicial</option>
                            <option value="Ejecución">Ejecución</option>
                            <option value="Peritaje">Peritaje</option>
                            <option value="Embargo">Embargo</option>
                            <option value="Sentencia">Sentencia</option>
                            <option value="Archivo demanda">Archivo demanda</option>
                        </select>
                    </label>
                    <label>
                        Acuerdo
                        <input 
                            value={filters.date_promise}
                            type="date"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    date_promise:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:filters.campain,
                                    name:filters.name,
                                    ci:filters.ci,
                                    type:filters.type,
                                    state_gestion:filters.state_gestion,
                                    date_promise:e.target.value,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                });
                            }}
                        />
                    </label>
                    <label>Días mora</label>
                    <label>
                        Agente
                        <select
                            value={filters.agent}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    agente:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:filters.campain,
                                    name:filters.name,
                                    ci:filters.ci,
                                    type:filters.type,
                                    state_gestion:filters.state_gestion,
                                    date_promise:filters.date_promise,
                                    agente:e.target.value,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:filters.gestion_channel_whatsapp
                                });
                            }}
                        >
                            <option>-- Seleccionar --</option>
                            {
                                agents.map((agent)=>(
                                    <option value={agent.name}>{agent.name}</option>
                                ))
                            }
                            
                        </select>
                    </label>
                    <label>
                        Observación
                        <select
                            value={filters.gestion_channel_whatsapp}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    gestion_channel_whatsapp:e.target.value
                                });

                                useFilterGestions({
                                    fecha_gestion:filters.fecha_gestion,
                                    campain:filters.campain,
                                    name:filters.name,
                                    ci:filters.ci,
                                    type:filters.type,
                                    state_gestion:filters.state_gestion,
                                    date_promise:filters.date_promise,
                                    agente:filters.agente,
                                    credito:filters.credito,
                                    setData:setData,
                                    loader:setLoading,
                                    gestion_channel_whatsapp:e.target.value
                                });
                            }}
                        >
                            <option value="">-- Seleccionar --</option>
                            <option value="whatsapp">Gestión whatsapp</option>
                        </select>
                    </label>
                </div>

                {
                    data.data.map((gestion,index)=>(
                        <div className="Historial__item">
                            <button
                                onClick={(e)=>{
                                    setCurrent(gestion)
                                }}
                            >Ver</button>
                            <label>{gestion.fecha.split(" ")[0]}</label>
                            <label>{gestion.campain_name}</label>
                            <label>{gestion.client_name}</label>
                            <label>{gestion.client_ci}</label>
                            <label>{gestion.type}</label>
                            <label>{gestion.id_credit}</label>
                            <label>{gestion.substate_gestion}</label>
                            <label>{gestion.date_promise}</label>
                            <label>{gestion.dias_vencidos}</label>
                            <label>{`${gestion.byUser.split(" ")[0].substring(0,1)}. ${gestion.byUser.split(" ")[1]}`}</label>
                            <label>{gestion.observation}</label>
                        </div>
                    ))
                }

                <div className="DetailCredit__access" style={{margin:"10px 0"}}>
                    <p>Registros del {data.from}-{data.to} de {data.total}</p>
                    
                    <div>
                    {
                        (data.total>10)
                        ?   
                            <>
                                <button onClick={()=>{
                                    if(data.prev_page_url!==null){
                                        updateData(data.prev_page_url)
                                    }
                                }}>Anterior</button>
                                <button onClick={()=>{
                                    if(data.next_page_url!==null){
                                        updateData(data.next_page_url)
                                    }
                                }}>Siguiente</button>
                            </>
                        : 
                            <></>
                    }
                    </div>
                </div>
                
            </div>

            {
                ('client_name' in current)
                ?
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setCurrent([])}}>Volver</button>
                        <CardCurrentGestion
                            data={current}
                        />
                    </div>
                :   <></>
            }

            {
                (loading)
                ?
                    <Loader/>
                :   <></>
            }

        </div>
    );
}
