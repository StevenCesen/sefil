import { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import Loader from "../components/Loader/loader";

export default function Gconvenios(){

    const [convenios,setConvenios]=useState();
    const [loading,setLoading]=useState();
    const [filters,setFilters]=useState();
    
    const getFilter=({agente,start_date,end_date,pend_date,nro_cuotas,cartera,state,name,ci})=>{
        let filter="";

        if(agente!==""){
            filter+=`&agente=${agente}`;
        }

        if(start_date!==""){
            start_date=start_date.replaceAll('-','/');
            filter+=`&start_date=${start_date}`;
        }

        if(end_date!==""){
            end_date=end_date.replaceAll('-','/');
            filter+=`&end_date=${end_date}`;
        }

        if(pend_date!==""){
            filter+=`&pend_date=${pend_date}`;
        }

        if(nro_cuotas!==""){
            filter+=`&nro_cuotas=${nro_cuotas}`;
        }

        if(cartera!==""){
            filter+=`&cartera=${cartera}`;
        }

        if(state!==""){
            filter+=`&state=${state}`;
        }

        if(name!==""){
            filter+=`&name=${name}`;
        }

        if(ci!==""){
            filter+=`&ci=${ci}`;
        }
        
        filter=filter.substring(1);
        return filter;
    }

    const updateFilter=({agente,start_date,end_date,pend_date,nro_cuotas,cartera,state,name,ci})=>{
        let filter="";

        if(agente!==""){
            filter+=`&agente=${agente}`;
        }

        if(start_date!==""){
            start_date=start_date.replaceAll('-','/');
            filter+=`&start_date=${start_date}`;
        }
        
        if(end_date!==""){
            end_date=end_date.replaceAll('-','/');
            filter+=`&end_date=${end_date}`;
        }

        if(pend_date!==""){
            filter+=`&pend_date=${pend_date}`;
        }

        if(nro_cuotas!==""){
            filter+=`&nro_cuotas=${nro_cuotas}`;
        }

        if(cartera!==""){
            filter+=`&cartera=${cartera}`;
        }

        if(state!==""){
            filter+=`&state=${state}`;
        }

        if(name!==""){
            filter+=`&name=${name}`;
        }

        if(ci!==""){
            filter+=`&ci=${ci}`;
        }
        
        filter=filter.substring(1);
        
        console.log(filter)

        setLoading(true);

        fetch(`${import.meta.env.VITE_URL_BASE}/pruebaconvenios?${filter}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setConvenios(data);
                setLoading(false);
            });
    }

    useEffect(()=>{

        setLoading(true);
        setFilters({
            agente:"",
            start_date:"",
            end_date:"",
            pend_date:"",
            nro_cuotas:"",
            cartera:"",
            state:'',
            sync_id:'',
            name:'',
            ci:''
        });

        fetch(`${import.meta.env.VITE_URL_BASE}/pruebaconvenios`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setConvenios(data);
                setLoading(false);
            });
    },[]);

    if(!convenios) return <Loader/>

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

            <div className="Convenios">
                <div className="Templates__init">
                    <h4 className="Reports__title">Estado de convenios</h4>
                    <a href={`${import.meta.env.VITE_URL_BASE}/GenConvenios?${getFilter({agente:filters.agente,
                                        start_date:filters.start_date,
                                        end_date:filters.end_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:filters.state})}`} target="_blank" className="Convenio__button">Descargar</a>
                </div>
                <div className="Convenios__items">
                    
                    <div className="Convenios__head">
                        <label>Crédito</label>
                        <label>Titular
                            <input type="text" placeholder="Nombre"
                                value={filters.name}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        name:e.target.value
                                    });

                                    updateFilter({
                                        agente:filters.agente,
                                        end_date:filters.end_date,
                                        start_date:filters.start_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:filters.state,
                                        name:e.target.value,
                                        ci:filters.ci
                                    });
                                }}
                            />
                        </label>
                        <label>Cédula
                            <input type="text" placeholder="Cédula"
                                value={filters.ci}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        ci:e.target.value
                                    });

                                    updateFilter({
                                        agente:filters.agente,
                                        end_date:filters.end_date,
                                        start_date:filters.start_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:filters.state,
                                        ci:e.target.value,
                                        name:filters.name
                                    });
                                }}
                            />
                        </label>
                        <label>
                            Agente convenio
                            <select
                                value={filters.agente}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        agente:e.target.value
                                    });

                                    updateFilter({
                                        agente:e.target.value,
                                        end_date:filters.end_date,
                                        start_date:filters.start_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:filters.state,
                                        ci:filters.ci,
                                        name:filters.name
                                    });
                                }}
                            >
                                <option value="">-- Seleccionar --</option>
                                <option value="Bryan Abrigo">Bryan Abrigo</option>
                                <option value="Cecibel Torres">Cecibel Torres</option>
                                <option value="José Angamarca">José Angamarca</option>
                                <option value="Maria Bravo">María Bravo</option>
                                <option value="Mateo Ojeda">Mateo Ojeda</option>
                            </select>
                        </label>
                        <label>
                            Período
                            <div>
                                <input 
                                    type="date"
                                    value={filters.start_date}
                                    onChange={(e)=>{
                                        setFilters({
                                            ...filters,
                                            start_date:e.target.value
                                        });

                                        updateFilter({
                                            agente:filters.agente,
                                            start_date:e.target.value,
                                            end_date:filters.end_date,
                                            pend_date:filters.pend_date,
                                            nro_cuotas:filters.nro_cuotas,
                                            cartera:filters.cartera,
                                            state:filters.state,
                                            ci:filters.ci,
                                            name:filters.name
                                        });
                                    }}
                                />
                                <input 
                                    type="date"
                                    value={filters.end_date}
                                    onChange={(e)=>{
                                        setFilters({
                                            ...filters,
                                            end_date:e.target.value
                                        });

                                        updateFilter({
                                            agente:filters.agente,
                                            end_date:e.target.value,
                                            start_date:filters.start_date,
                                            pend_date:filters.pend_date,
                                            nro_cuotas:filters.nro_cuotas,
                                            cartera:filters.cartera,
                                            state:filters.state,
                                            ci:filters.ci,
                                            name:filters.name
                                        });
                                    }}
                                />
                            </div>
                        </label>
                        
                        <label>Total cuotas</label>
                        <label>Cuota pagadas</label>
                        <label>Cuotas pendientes</label>
                        <label>
                            Cartera
                            <select
                                value={filters.cartera}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        cartera:e.target.value
                                    });

                                    updateFilter({
                                        agente:filters.agente,
                                        end_date:filters.end_date,
                                        start_date:filters.start_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:e.target.value,
                                        state:filters.state,
                                        ci:filters.ci,
                                        name:filters.name
                                    });
                                }}
                            >
                                <option value={""}>-- Seleccionar --</option>
                                <option value={"SEFIL_1"}>SEFIL 1</option>
                                <option value={"SEFIL_2"}>SEFIL 2</option>
                            </select>
                        </label>
                        <label>
                            Estado convenio
                            <select
                                value={filters.state}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        state:e.target.value
                                    });

                                    updateFilter({
                                        agente:filters.agente,
                                        end_date:filters.end_date,
                                        start_date:filters.start_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:e.target.value,
                                        ci:filters.ci,
                                        name:filters.name
                                    });
                                }}
                            >
                                <option value="">-- Seleccionar --</option>
                                <option value="Autorizado">Convenio vigente</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Anulado">Anulado</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                        </label>
                    </div>

                    {
                        convenios.map((convenio,index)=>(
                            <div className="Convenios__item" style={{backgroundColor:`${(convenio.cuotas_pendientes>0 && convenio.status=='Convenio vigente') ? "#FFA191" : ""}`}} key={index}>
                                <NavLink to={`/dashboard/recaudacion/view/${convenio.cartera}?id=${convenio.id}`} onClick={()=>{localStorage.setItem('hash',location.hash)}}>{convenio.cartera}-{convenio.credito}</NavLink>
                                <label>{convenio.titular}</label>
                                <label>{convenio.cedula}</label>
                                <label>{convenio.agente}</label>
                                <label>{convenio.fecha}</label>
                                <label>{convenio.cuotas_totales}</label>
                                <label>{convenio.cuotas_pagadas}</label>
                                <label>{convenio.cuotas_pendientes}</label>
                                <label>{convenio.cartera}</label>
                                <label>{convenio.status}</label>
                            </div>
                        ))
                    }
                </div>
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