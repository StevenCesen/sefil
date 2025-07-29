import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import useFormatterNumber from "../hooks/useFormatterNumber";
import Loader from "../components/Loader/loader";
import { Line, Bar,Doughnut} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import CardCompare from "../components/CardCompare/CardCompare";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
      datalabels: {
        color: 'white',
        display: function(context) {
          return context.dataset.data[context.dataIndex] > 15;
        },
        font: {
        size:10,
          weight: 'bold'
        },
        formatter: function(value, context) {
            
            // return context.chart.data.dataset[context.dataIndex];
        }
      }
    }
};

const estados_efectivos=[
    'OFERTA DE PAGO',
    'COMPROMISO DE PAGO',
    'MENSAJE A TERCEROS',
    'MENSAJE EN BUZÓN DEL CLIENTE',
    'YA PAGÓ',
    'SOLICITA REFINANCIAMIENTO',
    'CLIENTE SE NIEGA A PAGAR',
    'CLIENTE INDICA QUE NO ES SU DEUDA',
    'CORTA LA LLAMADA',
    'CONTESTA MENOR DE EDAD',
    'VOLVER A LLAMAR',
    'CONVENIO DE PAGO',
    'YA PAGO',
    'MENSAJE DE WHATSAPP',
    'MENSAJE DE TEXTO'
];

const estados_no_efectivos=[
    'CONTACTO INDICA QUE ESTA EQUIVOCADO',
    'NO CONTESTA',
    'SUSPENDIDO POR FALTA DE PAGO',
    'NUMERO INCORRECTO',
    'FUERA DEL AREA DE COBERTURA',
    'NO VIVE EN LA MISMA DIRECCIÓN',
    'DEBE PASAR A TRAMITE LEGAL',
    'INUBICABLE'
];

export default function Greports(){
    const [campains,setCampains]=useState();
    const [agents,setAgents]=useState();
    const [current,setCurrent]=useState();
    const [filters,setFilters]=useState();
    const [loading,setLoading]=useState();
    const [results,setResults]=useState();
    const [labels_x,setLabelX]=useState();
    const [view_compare,setCompare]=useState();
    const [trays,setTrays]=useState();
    const [select_trays,setSelectTrays]=useState();
    const [data,setData]=useState();
    const [Efectividad_gestiones,setEfectividad]=useState();

    const updateFilter=async ({campain,corte,inicio,fin,state,agencia,agente,trays,group,estado,type_agent})=>{
        let filter=``;
        setLoading(true);

        if(campain!==""){
            filter+=`&campain=${campain}`;
        }

        // if(state!==""){
        //     filter+=`&estado=${state}`;
        // }

        // if(agencia!==""){
        //     filter+=`&agencia=${agencia}`;
        // }

        if(agente!==""){
            filter+=`&agente=${agente}`;
        }

        if(corte!==""){
            corte=corte.replaceAll('-','/');
            filter+=`&fecha_corte=${corte}`;
        }

        if(inicio!==""){
            inicio=inicio.replaceAll('-','/');
            filter+=`&fecha_inicio=${inicio}`;
        }

        if(fin!==""){
            fin=fin.replaceAll('-','/');
            filter+=`&fecha_fin=${fin}`;
        }

        if(type_agent!==""){
            filter+=`&tipo_agente=${type_agent}`;
        }

        let response=[];

        if(estado==="" & group===""){
            if(trays.length>0){
                let new_trays=JSON.stringify(trays).replaceAll('[','(');
                filter+=`&trays=${new_trays.replaceAll(']',')')}`;
            }

            const request= await fetch(`${import.meta.env.VITE_URL_BASE}/resume/repo?${filter}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            response=await request.json();

            setResults(response);

        }else{

            if(trays.length>0){
                filter+=`&trays=${JSON.stringify(trays)}`;
            }

            if(group!==""){
                filter+=`&group=${group}`;
            }
    
            if(estado!=="" & estado!=="TODOS"){
                filter+=`&estado=${estado}`;
            }

            const request= await fetch(`${import.meta.env.VITE_URL_BASE}/resume/currentday?${filter}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            response=await request.json();
            setResults(response);
        }

        const label_y=[];

        response.data_desgloce.map((item,n)=>{
            label_y.push({
                label:item.estado,
                data:[
                    item.nro
                ],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                datalabels: {
                    anchor: 'center',
                    align: 'start',
                }
            })
        });

        let total_gestiones=0,total_gestiones_efectivas=0;

        response.data_desgloce.map((item)=>{
            if(estados_efectivos.includes(item.estado)){
                total_gestiones_efectivas+=item.nro;
            }

            total_gestiones+=item.nro;
        });

        setEfectividad({
            nro_gestiones:total_gestiones,
            nro_gestiones_efectivas:total_gestiones_efectivas
        });

        setLabelX(label_y);

        setLoading(false);
    }

    const padDate=(value)=>{
        if(value>10){
            return value;
        }else{
            return `0${value}`;
        }
    }

    useEffect(()=>{

        setFilters({
            campain:"",
            state_gestion:"",
            agencia:"",
            agente:"",
            corte:"",
            inicio:"",
            fin:"",
            group:"",
            estado:"",
            type_agent:""
        });

        setEfectividad({
            nro_gestiones:0,
            nro_gestiones_efectivas:0
        });

        setCompare(false);

        setTrays(['PENDIENTE','EN PROCESO','GESTIONADO']);
        setSelectTrays([]);

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data.data);
            });

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
        setResults([]);
    },[]);

    if(!campains) return <Loader/>
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
                <h3 style={{color:"var(--color-1)"}}>Reporte de gestiones</h3>
                
                <div className="Greports__filters">
                    <div>
                        <label>
                            Campaña
                            <select
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        campain:e.target.value
                                    });

                                    updateFilter({
                                        campain:e.target.value,
                                        state:filters.state_gestion,
                                        agencia:filters.agencia,
                                        agente:filters.agente,
                                        corte:filters.corte,
                                        inicio:filters.inicio,
                                        fin:filters.fin,
                                        trays:select_trays,
                                        group:filters.group,
                                        estado:filters.estado,
                                        type_agent:filters.type_agent
                                    })
                                }}
                                value={filters.campain}
                            >
                                <option value={""}>-- Seleccionar --</option>
                                {
                                    campains.map((campain,n)=>(
                                        <option key={n} value={campain.id}>{campain.name}</option>
                                    ))
                                }
                            </select>
                        </label>
                        
                        <label>
                            Fecha inicio
                            <input
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        inicio:e.target.value
                                    });

                                    updateFilter({
                                        campain:filters.campain,
                                        state:filters.state_gestion,
                                        agencia:filters.agencia,
                                        agente:filters.agente,
                                        corte:filters.corte,
                                        inicio:e.target.value,
                                        fin:filters.fin,
                                        trays:select_trays,
                                        group:filters.group,
                                        estado:filters.estado,
                                        type_agent:filters.type_agent
                                    });
                                }}
                                value={filters.inicio} 
                                type="date"/>
                        </label>

                        <label>
                            Fecha fin
                            <input
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        fin:e.target.value
                                    });

                                    updateFilter({
                                        campain:filters.campain,
                                        state:filters.state_gestion,
                                        agencia:filters.agencia,
                                        agente:filters.agente,
                                        corte:filters.corte,
                                        fin:e.target.value,
                                        inicio:filters.inicio,
                                        trays:select_trays,
                                        group:filters.group,
                                        estado:filters.estado,
                                        type_agent:filters.type_agent
                                    });
                                }}
                                value={filters.fin} 
                                type="date"/>
                        </label>

                        <label>
                            Tipo agente
                            <select
                                value={filters.type_agent}
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        type_agent:e.target.value
                                    });

                                    updateFilter({
                                        campain:filters.campain,
                                        state:filters.state_gestion,
                                        agencia:filters.agencia,
                                        agente:filters.agente,
                                        corte:filters.corte,
                                        fin:e.target.value,
                                        inicio:filters.inicio,
                                        trays:select_trays,
                                        group:filters.group,
                                        estado:filters.estado,
                                        type_agent:e.target.value
                                    });
                                }}
                            >
                                <option value={""}>Todos</option>
                                <option value={"call"}>Call Center</option>
                                <option value={"campo"}>Campo</option>
                            </select>
                        </label>

                        <label>
                            Agente
                            <select
                                onChange={(e)=>{
                                    setFilters({
                                        ...filters,
                                        agente:e.target.value
                                    });

                                    updateFilter({
                                        campain:filters.campain,
                                        state:filters.state_gestion,
                                        agencia:filters.agencia,
                                        agente:e.target.value,
                                        corte:filters.corte,
                                        inicio:filters.inicio,
                                        fin:filters.fin,
                                        trays:select_trays,
                                        group:filters.group,
                                        estado:filters.estado,
                                        type_agent:filters.type_agent
                                    });
                                }}
                                value={filters.agente}
                            >
                                <option value={""}>-- Seleccionar --</option>
                                {
                                    agents.map((agent,n)=>(
                                        <option key={n} value={agent.name}>{agent.name}</option>
                                    ))
                                }
                            </select>
                        </label>
        
                        <label>
                            Bandeja
                            <div>
                                {
                                    trays.map((tray)=>(
                                        <label>
                                            <input 
                                                value={tray} 
                                                type="checkbox"
                                                onChange={(e)=>{
                                                    if(e.target.checked){

                                                        const prev_trays=select_trays;
                                                        prev_trays.push(e.target.value);

                                                        setSelectTrays(prev_trays);
                                                        updateFilter({
                                                            campain:filters.campain,
                                                            state:filters.state_gestion,
                                                            agencia:filters.agencia,
                                                            agente:filters.agente,
                                                            corte:filters.corte,
                                                            inicio:filters.inicio,
                                                            fin:filters.fin,
                                                            trays:prev_trays,
                                                            group:filters.group,
                                                            estado:filters.estado,
                                                            type_agent:filters.type_agent
                                                        });
                                                    }else{

                                                        const prev_trays=select_trays;
                                                        const new_trays=[];
                                                        prev_trays.map((tr)=>{
                                                            if(tr!==e.target.value){
                                                                new_trays.push(tr);
                                                            }
                                                        });

                                                        setSelectTrays(new_trays);
                                                        updateFilter({
                                                            campain:filters.campain,
                                                            state:filters.state_gestion,
                                                            agencia:filters.agencia,
                                                            agente:filters.agente,
                                                            corte:filters.corte,
                                                            inicio:filters.inicio,
                                                            fin:filters.fin,
                                                            trays:new_trays,
                                                            group:filters.group,
                                                            estado:filters.estado,
                                                            type_agent:filters.type_agent
                                                        });
                                                    }
                                                }}
                                            />
                                            {tray}
                                        </label>
                                    ))
                                }
                            </div>
                        </label>

                        {
                            (filters.inicio===(`${new Date().getFullYear()}-${padDate(new Date().getMonth()+1)}-${padDate(new Date().getDate())}`) | filters.fin===(`${new Date().getFullYear()}-${padDate(new Date().getMonth()+1)}-${padDate(new Date().getDate())}`))
                            ?
                                <>
                                    <label>
                                        Subestados gestión (en el día)
                                        <select
                                            value={filters.estado}
                                            onChange={(e)=>{
                                                setFilters({
                                                    ...filters,
                                                    estado:e.target.value
                                                });

                                                updateFilter({
                                                    campain:filters.campain,
                                                    state:filters.state_gestion,
                                                    agencia:filters.agencia,
                                                    agente:filters.agente,
                                                    corte:filters.corte,
                                                    trays:select_trays,
                                                    inicio:filters.inicio,
                                                    fin:filters.fin,
                                                    group:filters.estado,
                                                    estado:e.target.value,
                                                    type_agent:filters.type_agent
                                                });
                                            }}
                                        >
                                            <option value="">-- Seleccionar --</option>
                                            <option value={"TODOS"}>TODOS</option>
                                            <option value={"COMPROMISO DE PAGO"}>COMPROMISO DE PAGO</option>
                                            <option value={"MENSAJE A TERCEROS"}>MENSAJE A TERCEROS</option>
                                            <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                                            <option value={"YA PAGÓ"}>YA PAGÓ</option>
                                            <option value={"MENSAJE DE TEXTO"}>MENSAJE DE TEXTO</option>
                                            <option value={"NO CONTESTA"}>NO CONTESTA</option>
                                            <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                                            <option value={"NUMERO INCORRECTO"}>NUMERO INCORRECTO</option>
                                            <option value={"FUERA DEL AREA DE COBERTURA"}>FUERA DEL AREA DE COBERTURA</option>
                                            <option value={"SUSPENDIDO POR FALTA DE PAGO"}>SUSPENDIDO POR FALTA DE PAGO</option>
                                            <option value={"CLIENTE SE NIEGA A PAGAR"}>CLIENTE SE NIEGA A PAGAR</option>
                                            <option value={"CLIENTE INDICA QUE NO ES SU DEUDA"}>CLIENTE INDICA QUE NO ES SU DEUDA</option>
                                            <option value={"PASAR A TRAMITE LEGAL"}>PASAR A TRAMITE LEGAL</option>
                                            <option value={"VOLVER A LLAMAR"}>VOLVER A LLAMAR</option>
                                            <option value={"CONVENIO DE PAGO"}>CONVENIO DE PAGO</option>
                                            <option value={"CONTACTO INDICA QUE ESTA EQUIVOCADO"}>CONTACTO INDICA QUE ESTA EQUIVOCADO</option>
                                            <option value={"CLIENTE ESCUCHA Y NO HABLA"}>CLIENTE ESCUCHA Y NO HABLA</option>
                                            <option value={"CLIENTE ESTA OCUPADO"}>CLIENTE ESTA OCUPADO</option>
                                            <option value={"CONTESTA MENOR DE EDAD"}>CONTESTA MENOR DE EDAD</option>
                                            <option value={"CORTA LA LLAMADA"}>CORTA LA LLAMADA</option>
                                            <option value={"INUBICABLE"}>INUBICABLE</option>
                                            <option value={"NO VIVE EN LA MISMA DIRECCIÓN"}>NO VIVE EN LA MISMA DIRECCIÓN</option>
                                        </select>
                                    </label>
                                </>
                            :   <></>
                        }
                    </div>

                    <button
                        onClick={()=>{
                            setCompare(true);
                        }}
                    >Módulo para comparar</button>
                </div>

                {
                    ('data_general' in results)
                    ?
                        <div className="Greports__contentResults">
                            <div>
                                <h3>Información general</h3>
                                <div className="Greports__results">
                                    <div className="Greports__general">
                                        <div>
                                            <label># créditos asignados</label>
                                            <label>{results.data_general[0].nro_asignado}</label>
                                        </div>
                                        <div>
                                            <label># créditos gestionados</label>
                                            <label>{results.data_general[0].nro_gestionado}</label>
                                        </div>
                                        <div>
                                            <label># créditos gestionados efec.</label>
                                            <label>{results.data_general[0].nro_gestionado_efectivo}</label>
                                        </div>
                                        <div>
                                            <label># créditos gestionados no efec.</label>
                                            <label>{Number(results.data_general[0].nro_gestionado)-Number(results.data_general[0].nro_gestionado_efectivo)}</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <h3>Detalle Gestiones Efectivas</h3>
                                <div className="Greports__results">
                                    <div className="Greports__general">
                                        {
                                            results.data_desgloce.map((item,n)=>(
                                                (estados_efectivos.includes(item.estado))
                                                ?
                                                    <div key={n}>
                                                        <label>{item.estado}</label>
                                                        <label>{item.nro}</label>
                                                    </div>
                                                :   <></>
                                            ))
                                        }
                                    </div>
                                </div>
                                
                                <h3>Detalle Gestiones No Efectivas</h3>
                                <div className="Greports__results">
                                    <div className="Greports__general">
                                        {
                                            results.data_desgloce.map((item,n)=>(
                                                (estados_no_efectivos.includes(item.estado))
                                                ?
                                                    <div key={n}>
                                                        <label>{item.estado}</label>
                                                        <label>{item.nro}</label>
                                                    </div>
                                                :   <></>
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="Greports__item">
                                    <label>Efectividad en créditos gestionados</label>
                                    <label>{(((Number(results.data_general[0].nro_gestionado))/results.data_general[0].nro_asignado)*100).toFixed(2)} %</label>
                                </div>
                                <div className="Greports__item">
                                    <label>Efectividad en créditos con gestión efectiva</label>
                                    <label>{(Number(results.data_general[0].nro_gestionado_efectivo)/Number(results.data_general[0].nro_asignado)*100).toFixed(2)} %</label>
                                </div>
                                <div className="Greports__item">
                                    <label>Efectividad en gestiones</label>
                                    <label>{((Number(Efectividad_gestiones.nro_gestiones_efectivas)/Number(Efectividad_gestiones.nro_gestiones))*100).toFixed(2)} %</label>
                                </div>
                            </div>
                            <div>
                                <Bar
                                    key={1}
                                    id={"general"}
                                    width={"100%"}
                                    title="RESUMEN GENERAL"
                                    height={"30px"}
                                    data={
                                        {
                                            labels:['RESULTADOS GENERALES'],
                                            datasets:[
                                                {
                                                    label:'Créditos asignados',
                                                    data:[
                                                        Number(results.data_general[0].nro_asignado)
                                                    ],
                                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                                    datalabels: {
                                                        anchor: 'center',
                                                        align: 'start',
                                                    }
                                                },
                                                {
                                                    label:'Créditos gestionados',
                                                    data:[Number(results.data_general[0].nro_gestionado_efectivo)+Number(results.data_general[0].nro_gestionado_no_efectivo)],
                                                    backgroundColor: 'rgba(53, 162, 235, 0.5)'
                                                },
                                                {
                                                    label:'Créditos con gestión efectiva',
                                                    data:[results.data_general[0].nro_gestionado_efectivo],
                                                    backgroundColor: 'rgba(0,255,0, 0.3)'
                                                },
                                                {
                                                    label:'Créditos con gestión no efectiva',
                                                    data:[results.data_general[0].nro_gestionado_no_efectivo],
                                                    backgroundColor: 'rgba(0,255,0, 0.3)'
                                                }
                                            ]
                                        }
                                    }
                                    options={options}
                                />

                                <Bar
                                    key={1}
                                    id={"general"}
                                    width={"100%"}
                                    title="RESUMEN GENERAL"
                                    height={"30px"}
                                    data={
                                        {
                                            labels:['NRO. CRÉDITOS GESTIONADOS POR ESTADO'],
                                            datasets:labels_x
                                        }
                                    }
                                    options={options}
                                />
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

            {
                (view_compare)
                ?
                    <div className="CardPay">
                        <button 
                            className="CardCondonacion__close" 
                            style={{
                                top:"10px",
                                right:"10px"
                            }}
                            onClick={()=>{
                                setCompare(!view_compare);
                            }}
                        >
                            Volver
                        </button>
                        <CardCompare
                            agents={agents}
                        />
                    </div>
                :   <></>
            }

        </div>
    );
}