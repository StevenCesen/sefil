import { useLocation, useParams } from "react-router-dom";
import "./ManagementHistorial.css";
import {useEffect, useState } from "react";
import CardCurrentGestion from "../../components/CardCurrentGestion/CardCurrentGestion";
import useFilterGestions from "../../hooks/useFilterGestions";
import useReturnFilter from "../../hooks/useReturnFilter";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader/loader";
import SelectManagementStates from "../../components/SelectManagementStates/SelectManagementStates";
import BackButton from "../../components/BackButton/BackButton";

export default function ManagementHistorial(){
    const [campains,setCampains]=useState();
    const [current,setCurrent]=useState();
    const [agents,setAgents]=useState();
    const [filters,setFilters]=useState();
    const [loading,setLoading]=useState();
    const { fetchWithAuth } = useFetch();

    const params=new URLSearchParams(useLocation().search);
    const param=useParams();

    const [data,setData]=useState();

    const updateData=(url)=>{
        setLoading(true);
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/';
                    return;
                }
                return response.json();
            })
	        .then((response) => {
                if (!response) return;

                const data = response.result;

                if(param.ci){
                    data.meta.path+=`?credit=${param.ci}&cartera=${params.get('cartera')}`;

                    if(data.links.next!==null){
                        const page_param_next = data.links.next.split('?')[1];
                        data.links.next=`${data.meta.path}&${page_param_next}`;
                    }

                    if(data.links.prev!==null){
                        const page_param_prev = data.links.prev.split('?')[1];
                        data.links.prev=`${data.meta.path}&${page_param_prev}`;
                    }
                }else{
                    const filter=useReturnFilter({
                        state: filters.state,
                        substate: filters.substate,
                        observation: filters.observation,
                        promise_date: filters.promise_date,
                        created_by: filters.created_by,
                        days_past_due: filters.days_past_due,
                        paid_fees: filters.paid_fees,
                        pending_fees: filters.pending_fees,
                        client_id: filters.client_id,
                        client_name: filters.client_name,
                        client_ci: filters.client_ci,
                        credit_id: filters.credit_id,
                        campain_id: filters.campain_id,
                        created_at: filters.created_at,
                        client_type: filters.client_type
                    });

                    if(data.links.next!==null){
                        data.links.next+=`&${filter}`;
                    }

                    if(data.links.prev!==null){
                        data.links.prev+=`&${filter}`;
                    }
                }

                setData(data);
                setLoading(false);
            });
    }

    useEffect(()=>{

        setFilters({
            state: "",
            substate: "",
            observation: "",
            promise_date: "",
            created_by: "",
            days_past_due: "",
            paid_fees: "",
            pending_fees: "",
            client_id: "",
            client_name: "",
            client_ci: "",
            credit_id: "",
            campain_id: "",
            created_at: "",
            client_type: ""
        });

        setLoading(false);

        fetch(`${import.meta.env.VITE_URL_BASE}/users?agents=true&is_active=1`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/';
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (!data) return;
                setAgents(data.result.data);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/';
                    return;
                }
                return response.json();
            })
            .then((response) => {
                if (!response) return;
                setCampains(response.result.data);

                if(param.ci!==undefined){
                    fetch(`${import.meta.env.VITE_URL_BASE}/managements?credit_id=${param.ci}`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => {
                            if (response.status === 401) {
                                localStorage.removeItem('token');
                                localStorage.removeItem('role');
                                window.location.href = '/';
                                return;
                            }
                            return response.json();
                        })
                        .then((response) => {
                            if (!response) return;

                            const data = response.result;
                            data.meta.path+=`?credit_id=${param.ci}`;

                            if(data.links.next!==null){
                                const page_param_next = data.links.next.split('?')[1];
                                data.links.next=`${data.meta.path}&${page_param_next}`;
                            }

                            if(data.links.prev!==null){
                                const page_param_prev = data.links.prev.split('?')[1];
                                data.links.prev=`${data.meta.path}&${page_param_prev}`;
                            }

                            setData(data);
                        });
                }else{
                    fetch(`${import.meta.env.VITE_URL_BASE}/managements`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => {
                            if (response.status === 401) {
                                localStorage.removeItem('token');
                                localStorage.removeItem('role');
                                window.location.href = '/';
                                return;
                            }
                            return response.json();
                        })
                        .then((response) => {
                            if (!response) return;
                            setData(response.result);
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
        <div className="ManagementHistorial">
            <BackButton />

            <div style={{paddingBottom:"20px"}}>
                <h3 style={{color:"var(--color-1)"}}>Historial de gestiones</h3>

                <div className="ManagementHistorial__filters">
                    <label></label>

                    <label>
                        Fecha gestión
                        <input
                            value={filters.created_at}
                            type="date"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    created_at: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    created_at: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        />
                    </label>

                    <label>
                        Campaña
                        <select
                            value={filters.campain_id}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    campain_id:e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    campain_id: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        >
                            <option value="">-- Seleccionar --</option>
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
                            value={filters.client_name}
                            type="text"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    client_name: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    client_name: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        />
                    </label>

                    <label>
                        Cédula
                        <input
                            value={filters.client_ci}
                            type="text"
                            placeholder="Cédula"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    client_ci: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    client_ci: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        />
                    </label>

                    <label>
                        Tipo
                        <select
                            value={filters.client_type}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    client_type: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    client_type: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        >
                            <option value="">-- Seleccionar --</option>
                            <option value="TITULAR">TITULAR</option>
                            <option value="GARANTE">GARANTE</option>
                        </select>
                    </label>

                    <label>
                        Crédito
                        <input
                            value={filters.credit_id}
                            type="text"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    credit_id: e.target.value
                                });

                                if(e.target.value.length > 0){
                                    useFilterGestions({
                                        ...filters,
                                        credit_id: e.target.value,
                                        setData,
                                        loader: setLoading,
                                        fetchWithAuth
                                    });
                                }
                            }}
                        />
                    </label>

                    <SelectManagementStates
                        value={filters.substate}
                        onChange={(_, value) => {
                            setFilters({
                                ...filters,
                                substate: value
                            });

                            useFilterGestions({
                                ...filters,
                                substate: value,
                                setData,
                                loader: setLoading,
                                fetchWithAuth
                            });
                        }}
                    />

                    <label>
                        Fecha Acuerdo
                        <input
                            value={filters.promise_date}
                            type="date"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    promise_date: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    promise_date: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        />
                    </label>

                    <label>
                        Días mora
                        <input
                            value={filters.days_past_due}
                            type="number"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    days_past_due: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    days_past_due: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        />
                    </label>

                    <label>
                        Agente
                        <select
                            value={filters.created_by}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    created_by: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    created_by: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        >
                            <option value="">-- Seleccionar --</option>
                            {
                                agents.map((agent)=>(
                                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                                ))
                            }
                        </select>
                    </label>

                    <label>
                        Observación
                        <input
                            value={filters.observation}
                            type="text"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    observation: e.target.value
                                });

                                useFilterGestions({
                                    ...filters,
                                    observation: e.target.value,
                                    setData,
                                    loader: setLoading,
                                    fetchWithAuth
                                });
                            }}
                        />
                    </label>
                </div>

                {
                    data.data.map((gestion,index)=>(
                        <div key={index} className={`ManagementHistorial__item ${(gestion.is_wweb) ? "ManagementHistorial__item--wweb" : ""}`}>
                            <button
                                onClick={(e)=>{
                                    setCurrent(gestion)
                                }}
                            >Ver</button>
                            <label>{gestion.created_at}</label>
                            <label>{gestion.campain_name}</label>
                            <label>{gestion.client_name}</label>
                            <label>{gestion.client_ci}</label>
                            <label>{gestion.client_type}</label>
                            <label>{gestion.credit.sync_id}</label>
                            <label>{(gestion.substate==='NOTIFICADO' || gestion.substate==='ENTREGADO AVISO DE COBRANZA') ? <strong>{`${gestion.substate} - Nro. Not: ${gestion.nro_notification}`}</strong> : gestion.substate}</label>
                            <label>{gestion.promise_date ? gestion.promise_date.split(" ")[0] : ''}</label>
                            <label>{gestion.days_past_due}</label>
                            <label>{gestion.created_by_name}</label>
                            <label>{gestion.observation}</label>
                        </div>
                    ))
                }

                <div className="ManagementHistorial__pagination">
                    <p>Registros del {data.meta.from}-{data.meta.to} de {data.meta.total}</p>

                    <div>
                    {
                        (data.meta.total>10)
                        ?
                            <>
                                <button onClick={()=>{
                                    if(data.links.prev!==null){
                                        updateData(data.links.prev)
                                    }
                                }}>Anterior</button>
                                <button onClick={()=>{
                                    if(data.links.next!==null){
                                        updateData(data.links.next)
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
                            management_id={current.id}
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
