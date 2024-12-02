import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import { useEffect, useRef, useState } from "react";
import useSearch from "../hooks/useSearch.js";
import useFormatterNumber from "../hooks/useFormatterNumber.js";

export default function Clist(){
    const param = useParams();

    const [data_credit,setCredit]=useState();
    const [canton_input,setInput]=useState('');
    const [canton,setCanton]=useState('all');
    const [parroquia,setParroquia]=useState('all');
    const [agents,setAgents]=useState();
    const [agent,setAgent]=useState();

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
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => setCredits(data));
    }

    const updateCredits=(data)=>{
        setCredits({
            ...credits,
            data:data
        })
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

        localStorage.setItem('cartera','syncs');
        setAux(localStorage.getItem('cartera'));

        if(localStorage.getItem('cartera')!=='' & localStorage.getItem('cartera')!==null & param.ci==undefined){
            setAux(localStorage.getItem('cartera'));
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines/${localStorage.getItem('cartera')}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setCredits(data);
                });

            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/listAgents?cartera=syncs`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setAgents(data);
                });

            setCredit([]);

        }else if(param.ci){
            setAgents([]);
            setAgent([]);

            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/syncs/${param.ci}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setCredit(data);
                });
        }

    },[]);

    if(!agents) return <></>  
    if(!agent) return <></>
    if(!data_credit) return <></> 

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
                        <div className="DetailCredit__information">

                            <div className="DetailCredit__datesCredit">
                                <div>
                                    <label>Cliente:</label>
                                    <label>{data_credit.name}</label>
                                </div>
                                <div>
                                    <label>Contrato:</label>
                                    <label>syncs-{data_credit.sync_id}</label>
                                </div>
                                <div>
                                    <label>Estado Sincronización:</label>
                                    <label>{data_credit.status}</label>
                                </div>
                                <div>
                                    <label>Agencia:</label>
                                    <label>{data_credit.Agencia}</label>
                                </div>
                                <div>
                                    <label>Frecuencia:</label>
                                    <label>{data_credit.frequency}</label>
                                </div>
                                <div>
                                    <label>Total pendiente:</label>
                                    <label>{data_credit.total_amount}</label>
                                </div>
                                <div>
                                    <label>Cuotas:</label>
                                    <label>{data_credit.total_fees}</label>
                                </div>
                                <div>
                                    <label>Cuotas pagadas:</label>
                                    <label>{data_credit.paid_fees}</label>
                                </div>
                            </div>

                            <div className="DetailCredit__contacts">
                                <h3>Contactos</h3>
                                <div className="DetailCredit__contactsHead">
                                    <label>Nombre</label>
                                    <label>Tipo</label>
                                    <label>CI</label>
                                </div>

                                {
                                    data_credit.contactos.map((contacto,index)=>(
                                        <div key={index} className="DetailCredit__contactsItem">
                                            <label>{contacto.fullName}</label>
                                            <label>{contacto.type}</label>
                                            <label>{contacto.documento}</label>
                                        </div>
                                    ))
                                }

                            </div>

                            <div className="DetailCredit__gestiones">
                                <h3>Gestiones</h3>
                                <div className="DetailCredit__gestionesHead">
                                    <label>Fecha</label>
                                    <label>Cliente</label>
                                    <label>Campaña</label>
                                    <label>Estado Gest.</label>
                                    <label>Fecha Comp.</label>
                                </div>

                                {
                                    data_credit.gestiones.map((gestion,index)=>(
                                        <div key={index} className="DetailCredit__gestionesItem">
                                            <label>{gestion.fecha}</label>
                                            <label>{gestion.client_name}</label>
                                            <label>{gestion.campain_name}</label>
                                            <label>{gestion.state_gestion}</label>
                                            <label>{gestion.date_promise}</label>
                                        </div>
                                    ))
                                }

                            </div>

                            <div className="DetailCredit__pagos">
                                <h3>Pagos</h3>
                                <div className="DetailCredit__pagosHead">
                                    <label>Cuota</label>
                                    <label>Número de pago</label>
                                    <label>Fecha Pago</label>
                                    <label>Tipo</label>
                                    <label>Monto</label>
                                    <label>Capital</label>
                                    <label>Interés</label>
                                    <label>Mora</label>
                                    <label>Otros</label>
                                </div>
                            </div>

                        </div>
                    </>
                :
                    <>
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
                        </div>

                        <div className="pageConsulta__results">
                            <div className="DetailCredit__pays">
                                <div>
                                    <p>ID</p>
                                    <p>Crédito</p>
                                    <p>Nombre</p>

                                    <p>Monto</p>
                                    <p>Cédula</p>

                                    <label>
                                        Compañia
                                    </label>

                                    <p>Agencia</p>
                                    
                                    <label>
                                        Días de mora
                                        <div class="DetailCredit__pays--filter">
                                            <div>
                                                <label>Min</label>
                                                <input type="number"/>
                                            </div>
                                            <div>
                                                <label>Max</label>
                                                <input type="number"/>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <p>Estado Sinc.</p>

                                    <label>
                                        Agente
                                        <select
                                            value={agent}
                                            onChange={(e)=>{

                                                setAgent(e.target.value);
                                                
                                                if(e.target.value!=='all'){
                                                    setCredits({
                                                        ...credits,
                                                        data:[]
                                                    });

                                                    setMessage('Cargando...');

                                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/distribution?cartera=syncs&id=${e.target.value}`,{
                                                        headers: {
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        }
                                                    })
                                                        .then((response) => response.json())  
                                                        .then((data) => {
                                                            setMessage(`Total ${data.length}`);
                                                            setCredits({
                                                                ...credits,
                                                                data:data
                                                            });
                                                        });
                                                }else{
                                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/syncs/${param.ci}`,{
                                                        headers: {
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        }
                                                    })
                                                        .then((response) => response.json())  
                                                        .then((data) => {
                                                            setCredit(data);
                                                        });
                                                }

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
                                            value={parroquia}
                                            onChange={(e)=>{
                                                setParroquia(e.target.value);
                                                console.log(e.target.value)

                                                if(e.target.value==='vigente'){
                                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filter?estadoNot=Cancelado`,{
                                                        headers: {
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        }
                                                    })
                                                        .then((response) => response.json())  
                                                        .then((data) => {
                                                            updateCredits(data.data)
                                                        });
                                                }else{
                                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filter?estado=${e.target.value}&canton=${canton_input}&empresa=${aux_busines}`,{
                                                        headers: {
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        }
                                                    })
                                                        .then((response) => response.json())  
                                                        .then((data) => {
                                                            updateCredits(data.data)
                                                        });
                                                }
                                            }}
                                        >
                                            <option value={"vigente"}>Vigente</option>
                                            <option value={"Cancelado"}>Cancelado</option>
                                            <option value={"CONVENIO DE PAGO"}>Convenio</option>
                                        </select>
                                    </label>
                                </div>
                                {
                                    <strong>{(message!=="") ? message : ""}</strong>
                                }
                                {
                                    credits.data.map((credit,index)=>(
                                        <div key={index}>
                                            <NavLink to={`/dashboard/clist/${credit.id}`} onClick={(e)=>{
                                                e.preventDefault();
                                                
                                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/syncs/${credit.id}`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        setCredit(data);
                                                        location.hash=`/dashboard/clist/${credit.id}`;
                                                    });
                                                

                                            }}>{credit.id}</NavLink>
                                            <p>{credit.cartera}-{('sync_id' in credit) ? credit.sync_id : credit.credito}</p>
                                            <p>{credit.name}</p>
                                            <p>{useFormatterNumber({value:('total_amount' in credit) ? credit.total_amount : credit.totalAmount,currency:'USD'})}</p>
                                            <p>{credit.ci}</p>
                                            <p>FACES</p>
                                            <p>{('Agencia' in credit) ? credit.Agencia : credit.agency}</p>
                                            <p>{('days_past_due' in credit) ? credit.days_past_due : credit.dias_vencidos}</p>
                                            <p>{credit.status}</p>
                                            <p>{(credit.agent==="") ? "N/D" : credit.agent}</p>
                                            <p>{('collection_state' in credit) ? credit.collection_state : credit.collectionState}</p>
                                        </div> 
                                    ))
                                }


                            </div>

                            {
                                (agent==="all")
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
                    </>
            }
        </div>
    );
}