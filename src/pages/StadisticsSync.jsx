import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import { useEffect, useRef, useState } from "react";
import useSearch from "../hooks/useSearch.js";
import useFormatterNumber from "../hooks/useFormatterNumber.js";
import useSearchSyncs from "../hooks/useSearchSync.js";
import Loader from "../components/Loader/loader.jsx";

export default function Stadistics(){
    const param = useParams();

    const [data_credit,setCredit]=useState();
    const [canton_input,setInput]=useState('');
    const [parroquia,setParroquia]=useState('all');
    const [agents,setAgents]=useState();
    const [agent,setAgent]=useState();
    const [filter,setFilter]=useState();
    const [loading,setLoading]=useState();
    const [total,setTotal]=useState(0);
    const [total_general,setTotalGeneral]=useState(0);

    const [message,setMessage]=useState("");

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

    const [aux_busines,setAux]=useState("");

    const updateData=(url)=>{
        let complemento=getFilters({
            mora:filter.mora,
            estado:filter.estado,
            agente:filter.agente,
            con_gestion:filter.con_gestion
        });

        setLoading(true);

        url=`${url}&campain=29&cartera=syncs${complemento}`;

        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                let total=data.total;

                // data.data.map((item)=>{
                //     if(item.con_gestion=="SI"){
                //         total+=Number(item.payment_value);
                //     }
                // });

                setTotal(total);

                setCredits(data.info);
                setLoading(false);
        });
    }

    const updateCredits=(data)=>{
        setCredits({
            ...credits,
            data:data
        })
    }

    const getFilters=({mora,estado,agente,con_gestion})=>{
        let filter_apply="";

        if(Number(mora.min)!==0 & mora.min!==""){
            filter_apply+=`&mora_min=${mora.min}`
        }

        if(Number(mora.max)!==0 & mora.max!==""){
            filter_apply+=`&mora_max=${mora.max}`
        }

        if(estado!==""){
            filter_apply+=`&estado=${estado}`
        }

        if(agente!==""){
            filter_apply+=`&agente=${agente}`
        }

        if(con_gestion!==""){
            filter_apply+=`&con_gestion=${con_gestion}`
        }

        return filter_apply;
    }

    const setFilters=({mora,estado,agente,con_gestion})=>{
        let filter_apply="";
        setLoading(true);

        if(Number(mora.min)!==0 & mora.min!==""){
            filter_apply+=`&mora_min=${mora.min}`
        }

        if(Number(mora.max)!==0 & mora.max!==""){
            filter_apply+=`&mora_max=${mora.max}`
        }

        if(estado!==""){
            filter_apply+=`&estado=${estado}`
        }

        if(agente!==""){
            filter_apply+=`&agente=${agente}`
        }

        if(con_gestion!==""){
            filter_apply+=`&con_gestion=SI`
        }

        console.log(filter_apply);

        // console.log(`${import.meta.env.VITE_URL_BASE}/campains/stadistics?campain=28&cartera=syncs${filter_apply}`);
        fetch(`${import.meta.env.VITE_URL_BASE}/campains/stadistics?campain=29&cartera=syncs${filter_apply}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                let total=data.total.total;
                console.log(data);

                // data.info.data.map((item)=>{
                //     if(item.con_gestion=="SI"){
                //         total+=Number(item.payment_value);
                //     }
                // });

                setTotal(total);
                setTotalGeneral(data.total.total_general)
                setCredits(data.info);
                setLoading(false);
            });
    }

    useEffect(()=>{
        setInput('');
        setAgent("all");
        
        setCredits({
            ...credits,
            data:[],
            links:[]
        });
        setMessage("");

        setFilter({
            mora:{
                min:0,
                max:0
            },
            estado:"",
            agente:"",
            con_gestion:"SI"
        });

        setTotal(0);

        localStorage.setItem('cartera','syncs');
        setAux(localStorage.getItem('cartera'));
        setLoading(true);

        if(localStorage.getItem('cartera')!=='' & localStorage.getItem('cartera')!==null & param.ci==undefined){
            setAux(localStorage.getItem('cartera'));

            //  Seleccionamos la campaña
            fetch(`${import.meta.env.VITE_URL_BASE}/campains/stadistics?campain=29`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    let total=data.total.total;
                    console.log(data);

                    // data.info.data.map((item)=>{
                    //     if(item.dias_mora>=61){
                    //         total+=Number(item.payment_value);
                    //     }
                    // });

                    setTotal(total);
                    setTotalGeneral(data.total.total_general)
                    setCredits(data.info);
                });

            //  Seleccionamos los agentes
            fetch(`${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=syncs`,{
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

            setCredit([]);

        }else if(param.ci){
            setAgents([]);
            setAgent([]);

            fetch(`${import.meta.env.VITE_URL_BASE}/campains/gestionwithpays?campain=28&id_credito=${param.ci}&cartera=syncs`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setCredit(data);
                    setLoading(false);
                });
        }

    },[]);

    if(!agents) return <Loader/>
    if(!agent) return <Loader/>
    if(!data_credit) return <Loader/>

    return (
        <div className="pageConsulta">

            {
                (param.ci)
                ?
                    <>
                        <div className="DetailCredit__head">
                            <NavLink 
                                to="" 
                                onClick={(e)=>{
                                    e.preventDefault();
                                    history.go(-1) 
                                }}
                            >Regresar</NavLink>
                        </div>

                        <div>
                            <p><strong>Contrato:</strong> {data_credit.contrato}</p>
                        </div>

                        <div className="DetailCredit__stadisticCredit">
                            <div className="DetailCredit__stadisticGestiones">
                                <div className="DetailCredit__stadisticGestionesHead">
                                    <label>Fecha gestión</label>
                                    <label>Agente</label>
                                    <label>Contacto</label>
                                    <label>Cédula</label>
                                    <label>Cliente tipo</label>
                                    <label>Estado</label>
                                    <label>Fecha compromiso</label>
                                    <label>Observaciones</label>
                                </div>

                                {
                                    data_credit.gestiones.map((gestion)=>(
                                        <div className="DetailCredit__stadisticGestionesItem">
                                            <label>{gestion.fecha}</label>
                                            <label>{gestion.byUser}</label>
                                            <label>{gestion.client_name}</label>
                                            <label>{gestion.client_ci}</label>
                                            <label>{gestion.type}</label>
                                            <label>{gestion.substate_gestion}</label>
                                            <label>{gestion.date_promise}</label>
                                            <label>{gestion.observation}</label>
                                        </div>
                                    ))
                                }

                            </div>
                            <div className="DetailCredit__stadisticPagos">
                                <div className="DetailCredit__stadisticPagosHead">
                                    <label>Fecha pago</label>
                                    <label>Código</label>
                                    <label>Con gestión</label>
                                    <label>Cuota</label>
                                    <label>Tipo</label>
                                    <label>Monto</label>
                                </div>
                                {
                                    data_credit.pagos.map(pago=>(
                                        <div className="DetailCredit__stadisticPagosItem">
                                            <label>{pago.payment_date}</label>
                                            <label>{pago.payment_id}</label>
                                            <label>{
                                                (pago.con_gestion) 
                                                ?   <span className="DetailCredit__stadisticPagosItem--successful">SI</span> 
                                                :   <span className="DetailCredit__stadisticPagosItem--non">NO</span>
                                            }</label>
                                            <label>{pago.fee_id}</label>
                                            <label>{pago.payment_type}</label>
                                            <label>{useFormatterNumber({value:pago.payment_value,currency:'USD'})}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </>
                :
                    <>
                        <div className="pageConsulta__search">
                            <h4 className="Reports__title">Pagos con gestión</h4>
                        </div>

                        <div className="pageConsulta__search">
                            <h4 className="Reports__title" style={{color:"black"}}>Total general con gestión: {useFormatterNumber({value:total_general,currency:'USD'})}</h4>
                        </div>

                        <div className="pageConsulta__results">
                            <div className="DetailCredit__stadistics">
                                <div className="DetailCredit__stadisticsHead">
                                    <p>ID</p>
                                    <p>Crédito</p>
                                    <p>Agencia</p>
                                    <p>Nombre</p>
                                    <p>Cédula</p>
                                    <label>
                                        Estado crédito
                                        <select
                                            onChange={(e)=>{
                                                setFilter({
                                                    ...filter,
                                                    estado:e.target.value
                                                });
                                                setFilters({
                                                    mora:filter.mora,
                                                    estado:e.target.value,
                                                    agente:filter.agente,
                                                    con_gestion:filter.con_gestion
                                                });
                                            }}
                                        >
                                            <option value={""}>-- Selecionar --</option>
                                            <option value={"vigente"}>Vigente</option>
                                            <option value={"vencido"}>Vencido</option>
                                            <option value={"Cancelado"}>Cancelado</option>
                                            <option value={"Castigado"}>Castigado</option>
                                            <option value={"CONVENIO DE PAGO"}>Convenio</option>
                                        </select>
                                    </label>
                                    <p>Campaña</p>
                                    <p>Número de cuotas pagadas</p>
                                    <label>
                                        Días de mora
                                        <div class="DetailCredit__pays--filter">
                                            <div>
                                                <label>Min</label>
                                                <input 
                                                    onKeyDown={(e)=>{
                                                        console.log(e)

                                                        if (e.key === 'Enter') {
                                                            setFilters({
                                                                mora:{
                                                                    min:e.target.value,
                                                                    max:filter.mora.max
                                                                },
                                                                estado:filter.estado,
                                                                agente:filter.agente
                                                            });
                                                        }else{
                                                            setFilter({
                                                                ...filter,
                                                                mora:{
                                                                    min:e.target.value,
                                                                    max:filter.mora.max
                                                                }
                                                            });
                                                        }

                                                        // setFilter({
                                                        //     ...filter,
                                                        //     mora:{
                                                        //         min:e.target.value,
                                                        //         max:filter.mora.max
                                                        //     }
                                                        // });
                                                    }}
                                                    type="text"
                                                />
                                            </div>
                                            <div>
                                                <label>Max</label>
                                                <input 
                                                    type="text"
                                                    onKeyDown={(e)=>{
                                                        if (e.key === 'Enter') {
                                                            setFilters({
                                                            mora:{
                                                                max:e.target.value,
                                                                min:filter.mora.min
                                                            },
                                                            estado:filter.estado,
                                                            agente:filter.agente
                                                        });
                                                        }else{
                                                            setFilter({
                                                            ...filter,
                                                            mora:{
                                                                max:e.target.value,
                                                                min:filter.mora.min
                                                            }
                                                        });
                                                        }
                                                        

                                                        
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </label>
                                    <p>
                                        Gestiones efectivas
                                        <select
                                            value={filter.con_gestion}
                                            onChange={(e)=>{
                                                setFilter({
                                                    ...filter,
                                                    con_gestion:e.target.value
                                                });
                                                setFilters({
                                                    mora:filter.mora,
                                                    estado:filter.estado,
                                                    agente:filter.agente,
                                                    con_gestion:e.target.value
                                                });
                                            }}
                                        >
                                            <option value={""}>-- Seleccionar --</option>
                                            <option value={"SI"}>Con gestión</option>
                                        </select>
                                    </p>
                                    <p>Gestiones no efectivas</p>
                                    <p>
                                        Total pagado con gestión
                                        <p style={{marginTop:"10px",color:"white",fontSize:"16px"}}>{useFormatterNumber({value:total,currency:'USD'})}</p>
                                    </p>
                                    <p>Total pagado sin gestión</p>
                                    <p>Total pagado</p>

                                    <label>
                                        Agente
                                        <select
                                            onChange={(e)=>{
                                                setFilter({
                                                    ...filter,
                                                    agente:e.target.value
                                                });

                                                setFilters({
                                                    mora:filter.mora,
                                                    estado:filter.estado,
                                                    agente:e.target.value,
                                                    con_gestion:filter.con_gestion
                                                });
                                            }}
                                        >
                                            <option value={""}>-- Seleccionar agente --</option>
                                            {
                                                agents.map((agent)=>(
                                                    <option value={agent.id}>{agent.name}</option>
                                                ))
                                            }
                                        </select>
                                    </label>
                                </div>
                                {
                                    <strong>{(message!=="") ? message : ""}</strong>
                                }
                                {
                                    credits.data.map((credit,index)=>(
                                        <div className="DetailCredit__stadisticsItems" key={index}>
                                            <NavLink to={`/dashboard/stadistics/${credit.id}`} onClick={(e)=>{
                                                e.preventDefault();
                                                setLoading(true);
                                                console.log(credit.id)
                                                fetch(`${import.meta.env.VITE_URL_BASE}/campains/gestionwithpays?campain=29&id_credito=${credit.id}&cartera=syncs`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        console.log(data);
                                                        setCredit(data);
                                                        setLoading(false);
                                                        location.hash=`/dashboard/stadistics/${credit.id}`;
                                                    });

                                            }}>{credit.id}</NavLink>
                                            <p>{credit.agency}</p>
                                            <p>syncs-{credit.credito}</p>
                                            <p>{credit.nombre} <strong style={{fontWeight:'bold'}}>{credit.tipo}</strong></p>
                                            <p>{credit.ci}</p>
                                            <p>{credit.estado}</p>
                                            <p>FACES MAYO 2025</p>
                                            <p>{credit.cuotas_pagadas}</p>
                                            <p>{credit.dias_vencidos}</p>
                                            {
                                                (credit.con_gestion=="SI")
                                                ?
                                                    <p className="DetailCredit__stadisticsItems--successful">{(credit.id_gestion_previa>0) ? 2 : 1}</p>
                                                :   <p>{0}</p>
                                            }
                                            <p>{0}</p>
                                            {
                                                (credit.payment_value>0 & credit.con_gestion=="SI")
                                                ?   <p className="DetailCredit__stadisticsItems--successful">{useFormatterNumber({value:credit.payment_value,currency:'USD'})}</p>
                                                :   <p>{useFormatterNumber({value:0,currency:'USD'})}</p>
                                            }
                                            {
                                                (credit.total_amount>0 & credit.con_gestion=="NO")
                                                ?
                                                    <p>{useFormatterNumber({value:credit.payment_value,currency:'USD'})}</p>
                                                :   <p>{useFormatterNumber({value:0,currency:'USD'})}</p>
                                            }
                                            <p>{useFormatterNumber({value:credit.payment_value,currency:'USD'})}</p>
                                            <p>{(credit.user_id==="") ? "N/D" : credit.user_id}</p>
                                        </div> 
                                    ))
                                }
                            </div>

                            {
                                (agent==="all")
                                ?
                                    <div className="DetailCredit__access" style={{marginBottom:"20px"}}>
                                        <p>Registros del {credits.from}-{credits.to} de {credits.total}</p>
                                        <div>
                                        {
                                            credits.links.map((button,index)=>(
                                                (index===0)?
                                                    <NavLink key={index} onClick={()=>{

                                                        updateData(button.url);

                                                    }}>Anterior</NavLink>
                                                : 
                                                    (index===(credits.links.length-1)) ?
                                                        <NavLink key={index} onClick={()=>{
                                                            updateData(button.url);
                                                        }}>Siguiente</NavLink>
                                                    :
                                                        <></>
                                            ))
                                        }
                                        </div>
                                    </div>
                                :   <></>
                            }

                        </div>
                    </>
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