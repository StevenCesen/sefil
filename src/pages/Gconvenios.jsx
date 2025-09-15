import { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import Loader from "../components/Loader/loader";

export default function Gconvenios(){

    const [convenios,setConvenios]=useState();
    const [loading,setLoading]=useState();
    const [filters,setFilters]=useState();
    
    const getFilter=({agente,ult_date,pend_date,nro_cuotas,cartera,state})=>{
        let filter="";

        if(agente!==""){
            filter+=`&agente=${agente}`;
        }

        if(ult_date!==""){
            ult_date=ult_date.replaceAll('-','/');
            filter+=`&ult_date=${ult_date}`;
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
        
        filter=filter.substring(1);
        return filter;
    }

    const updateFilter=({agente,ult_date,pend_date,nro_cuotas,cartera,state})=>{
        let filter="";

        if(agente!==""){
            filter+=`&agente=${agente}`;
        }

        if(ult_date!==""){
            ult_date=ult_date.replaceAll('-','/');
            filter+=`&ult_date=${ult_date}`;
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
        
        filter=filter.substring(1);
        
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
            ult_date:"",
            pend_date:"",
            nro_cuotas:"",
            cartera:"",
            state:''
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
                                        ult_date:filters.ult_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:filters.state})}`} target="_blank" className="Convenio__button">Descargar</a>
                </div>
                <div className="Convenios__items">
                    
                    <div className="Convenios__head">
                        <label>Crédito</label>
                        <label>Titular</label>
                        <label>Cédula</label>
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
                                        ult_date:filters.ult_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:filters.state
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
                            Fecha creación
                            <input 
                                type="date"
                                value={filters.ult_date}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        ult_date:e.target.value
                                    });

                                    updateFilter({
                                        agente:filters.agente,
                                        ult_date:e.target.value,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:filters.state
                                    });
                                }}
                            />
                        </label>
                        <label>
                            Fecha pago pendiente
                        </label>
                        <label>
                            Nro. cuotas
                            <input 
                                type="number" 
                                step={1}
                                value={filters.nro_cuotas}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        nro_cuotas:e.target.value
                                    });

                                    updateFilter({
                                        agente:filters.agente,
                                        ult_date:filters.ult_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:e.target.value,
                                        cartera:filters.cartera,
                                        state:filters.state
                                    });
                                }}
                            />
                        </label>
                        <label>Cuota pendiente</label>
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
                                        ult_date:filters.ult_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:e.target.value,
                                        state:filters.state
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
                                        ult_date:filters.ult_date,
                                        pend_date:filters.pend_date,
                                        nro_cuotas:filters.nro_cuotas,
                                        cartera:filters.cartera,
                                        state:e.target.value
                                    });
                                }}
                            >
                                <option value="">-- Seleccionar --</option>
                                <option value="Autorizado">Autorizado</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Anulado">Anulado</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                        </label>
                    </div>

                    {
                        convenios.map((convenio,index)=>(
                            <div className="Convenios__item" key={index}>
                                <NavLink to={`/dashboard/recaudacion/view/${convenio.cartera}?id=${convenio.id}`} onClick={()=>{localStorage.setItem('hash',location.hash)}}>{convenio.cartera}-{convenio.credito}</NavLink>
                                <label>{convenio.titular}</label>
                                <label>{convenio.cedula}</label>
                                <label>{convenio.agente}</label>
                                <label>{convenio.fecha}</label>
                                <label>{convenio.fecha_pago_vencido}</label>
                                <label>{convenio.nro_cuotas}</label>
                                <label>{convenio.cuota_vencida}</label>
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