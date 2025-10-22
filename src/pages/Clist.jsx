/**
 * =====================================================
 *                  ELIMINAR COMPONENTE
 * =====================================================
 */
import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useState } from "react";
import useFormatterNumber from "../hooks/useFormatterNumber.js";
import useSearchSyncs from "../hooks/useSearchSync.js";

export default function Clist(){
    const param = useParams();

    const [data_credit,setCredit]=useState();
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

    const [filter,setFilter]=useState();

    const genFilter=({mora_min,mora_max,user_id,state,sync_status})=>{
        let filter="";

        if(mora_max!==""){
            filter+=`&mora_max=${mora_max}`;
        }

        if(mora_min!==""){
            filter+=`&mora_min=${mora_min}`;
        }

        if(user_id!=""){
            filter+=`&user_id=${user_id}`
        }

        if(state!=""){
            filter+=`&collection_state=${state}`
        }

        if(sync_status!=""){
            filter+=`&sync_status=${sync_status}`
        }

        return filter;
    }

    const updateData=({mora_min,mora_max,user_id,state,sync_status})=>{
        let filter=genFilter({mora_min,mora_max,user_id,state,sync_status});
        
        fetch(`${import.meta.env.VITE_URL_BASE}/cclist?${filter}`,{
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

    const updateCredits=(data)=>{
        setCredits({
            ...credits,
            data:data
        })
    }

    useEffect(()=>{
        setAgent("all");
        
        setCredits({
            ...credits,
            data:[],
            links:[]
        });
        setMessage("");
        setFilter({
            mora_min:'',
            mora_max:'',
            user_id:'',
            state:'',
            sync_status:''
        });

        localStorage.setItem('cartera','syncs');

        if(localStorage.getItem('cartera')!=='' & localStorage.getItem('cartera')!==null & param.ci==undefined){
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

            fetch(`${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=syncs`,{
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

            fetch(`${import.meta.env.VITE_URL_BASE}/syncs/${param.ci}`,{
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
                                        <label>Estado Crédito:</label>
                                        <label>{data_credit.collection_state}</label>
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
                                        <label>Fecha terminación:</label>
                                        <label>{data_credit.due_date}</label>
                                    </div>
                                    <div>
                                        <label>Días en mora:</label>
                                        <label>{data_credit.days_past_due}</label>
                                    </div>
                                    <div>
                                        <label>Cuotas:</label>
                                        <label>{data_credit.total_fees}</label>
                                    </div>
                                    <div>
                                        <label>Cuotas pagadas:</label>
                                        <label>{data_credit.paid_fees}</label>
                                    </div>
                                    <div>
                                        <label>Valor cuota:</label>
                                        <label>{useFormatterNumber({value:data_credit.monthly_fee_amount,currency:'USD'})}</label>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <label>Capital:</label>
                                        <label>{useFormatterNumber({value:data_credit.saldo_capital,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Interés:</label>
                                        <label>{useFormatterNumber({value:data_credit.interes,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Mora:</label>
                                        <label>{useFormatterNumber({value:data_credit.mora,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Seguro desgravamen:</label>
                                        <label>{useFormatterNumber({value:data_credit.seguro_desgravamen,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Gastos judiciales:</label>
                                        <label>{useFormatterNumber({value:data_credit.gastos_judiciales,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Gastos de cobranza:</label>
                                        <label>{useFormatterNumber({value:data_credit.gastos_cobranza,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Otros valores:</label>
                                        <label>{useFormatterNumber({value:data_credit.otros_valores,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Valor cuota:</label>
                                        <label>{useFormatterNumber({value:data_credit.monthly_fee_amount,currency:'USD'})}</label>
                                    </div>
                                    <div>
                                        <label>Total pendiente:</label>
                                        <label>{useFormatterNumber({value:data_credit.total_amount,currency:'USD'})}</label>
                                    </div>
                                </div>
                            </div>

                            <div className="DetailCredit__contacts">
                                <h3>Contactos</h3>
                                <div className="DetailCredit__contactsHead">
                                    <label>Nombre</label>
                                    <label>Tipo</label>
                                    <label>CI</label>
                                    <label></label>
                                </div>

                                {
                                    data_credit.contactos.map((contacto,index)=>(
                                        <div key={index} className="DetailCredit__contactsItem">
                                            <label>{contacto.fullName}</label>
                                            <label>{contacto.type}</label>
                                            <label>{contacto.documento}</label>
                                            <label>
                                                <img 
                                                    src="./icons/arrowDown.png"
                                                    onClick={(e)=>{
                                                        if(e.target.parentElement.nextElementSibling.style.display==="block"){
                                                            e.target.parentElement.nextElementSibling.style.display="none";
                                                        }else{
                                                            e.target.parentElement.nextElementSibling.style.display="block";
                                                        }
                                                    }}
                                                />
                                            </label>

                                            {
                                            
                                                <div>
                                                    {
                                                        (contacto.mobile_phones!=="")
                                                        ?
                                                            contacto.mobile_phones.split(',').map(phone=>(
                                                                <p><strong>MÓVIL:</strong> {phone}</p>
                                                            ))
                                                        : ""
                                                    }
                                                </div>
                                            
                                            }

                                        </div>
                                    ))
                                }

                            </div>

                            <div className="DetailCredit__gestiones">
                                <h3>Gestiones</h3>
                                <div className="DetailCredit__gestionesHead">
                                    <label>Fecha</label>
                                    <label>Cédula</label>
                                    <label>Estado Gest.</label>
                                    <label>Compromiso</label>
                                    <label>Observ.</label>
                                </div>

                                {
                                    data_credit.gestiones.map((gestion,index)=>(
                                        <div key={index} className="DetailCredit__gestionesItem">
                                            <label>{gestion.fecha}</label>
                                            <label>{gestion.client_ci}</label>
                                            <label>{gestion.substate_gestion}</label>
                                            <label>{gestion.date_promise}</label>
                                            <label><strong>{gestion.byUser.toUpperCase()}: </strong><br/>{gestion.observation}</label>
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

                                {
                                    data_credit.pagos.map((pago,index)=>(
                                        <div key={index} className="DetailCredit__pagosItem">
                                            <label>{pago.fee_id}</label>
                                            <label>{pago.payment_id}</label>
                                            <label>{pago.payment_date}</label>
                                            <label>{pago.payment_type}</label>
                                            <label>{pago.payment_value}</label>
                                            <label>{pago.capital}</label>
                                            <label>{pago.interes}</label>
                                            <label>{pago.mora}</label>
                                            <label>{pago.otros}</label>
                                        </div>
                                    ))
                                }

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
                                    useSearchSyncs(ci,'syncs',updateCredits,setCredits);
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
                                                <input 
                                                    type="number"
                                                    defaultValue={filter.mora_min}
                                                    onKeyDown={(e)=>{
                                                        setFilter({
                                                            ...filter,
                                                            mora_min:e.target.value
                                                        });

                                                        if(e.key==='Enter'){
                                                            updateData({
                                                                mora_max:filter.mora_max,
                                                                user_id:filter.user_id,
                                                                state:filter.state,
                                                                mora_min:e.target.value,
                                                                sync_status:filter.sync_status
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label>Max</label>
                                                <input 
                                                    type="number"
                                                    defaultValue={filter.mora_max}
                                                    onKeyDown={(e)=>{
                                                        setFilter({
                                                            ...filter,
                                                            mora_max:e.target.value
                                                        });

                                                        if(e.key==='Enter'){
                                                            updateData({
                                                                mora_min:filter.mora_max,
                                                                user_id:filter.user_id,
                                                                state:filter.state,
                                                                mora_max:e.target.value,
                                                                sync_status:filter.sync_status
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label>
                                        Estado Sinc.
                                        <select
                                            value={filter.sync_status}
                                            onChange={(e)=>{
                                                setFilter({
                                                    ...filter,
                                                    sync_status:e.target.value
                                                });

                                                updateData({
                                                    mora_max:filter.mora_max,
                                                    user_id:filter.user_id,
                                                    state:filter.state,
                                                    mora_min:filter.mora_min,
                                                    sync_status:e.target.value
                                                });
                                            }}
                                        >
                                            <option value={""}>-- Seleccionar --</option>
                                            <option value={"ACTIVE"}>ACTIVO</option>
                                            <option value={"INACTIVE"}>INACTIVO</option>
                                        </select>
                                    </label>

                                    <label>
                                        Agente
                                        <select
                                            value={filter.user_id}
                                            onChange={(e)=>{


                                                setFilter({
                                                    ...filter,
                                                    user_id:e.target.value
                                                });

                                                updateData({
                                                    mora_max:filter.mora_max,
                                                    user_id:e.target.value,
                                                    state:filter.state,
                                                    mora_min:filter.mora_min,
                                                    sync_status:filter.sync_status
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
                                            value={filter.state}
                                            onChange={(e)=>{
                                                setFilter({
                                                    ...filter,
                                                    state:e.target.value
                                                });

                                                updateData({
                                                    mora_max:filter.mora_max,
                                                    user_id:filter.user_id,
                                                    state:e.target.value,
                                                    mora_min:filter.mora_min,
                                                    sync_status:filter.sync_status
                                                });

                                            }}
                                        >
                                            <option value={""}>-- Seleccionar --</option>
                                            <option value={"vigente"}>Vigente</option>
                                            <option value={"vencido"}>Vencido</option>
                                            <option value={"Castigado"}>Castigado</option>
                                            <option value={"Cancelado"}>Cancelado</option>
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
                                                
                                                fetch(`${import.meta.env.VITE_URL_BASE}/syncs/${credit.id}`,{
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
                                            <p>{credit.name} <strong style={{fontWeight:'bold'}}>{('type' in credit) ? credit.type : credit.tipo}</strong></p>
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
                                                    <NavLink key={index} onClick={()=>{
                                                        console.log(button)
                                                        if(button.url!==null){
                                                            fetch(`${button.url}${genFilter({
                                                            mora_min:filter.mora_min,
                                                            mora_max:filter.mora_max,
                                                            user_id:filter.user_id,
                                                            state:filter.state,
                                                            sync_status:filter.sync_status
                                                        })}`,{
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
                                                    }}>Anterior</NavLink>
                                                :   
                                                    (index===(credits.links.length-1)) ?
                                                        <NavLink key={index} onClick={()=>{

                                                            if(button.url!==null){
                                                            fetch(`${button.url}${genFilter({
                                                            mora_min:filter.mora_min,
                                                            mora_max:filter.mora_max,
                                                            user_id:filter.user_id,
                                                            state:filter.state,
                                                            sync_status:filter.sync_status
                                                        })}`,{
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
        </div>
    );
}