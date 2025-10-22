import { useEffect, useState } from "react";
import Loader from "../Loader/loader";
import "./CardCompare.css";
import { useStoreLoader } from "../../stores/useStoreLoader";

const estados_efectivos=[
    'OFERTA DE PAGO',
    'COMPROMISO DE PAGO'
];

export default function CardCompare({agents}){

    const [list_agents,setListAgents]=useState();
    const [agents_compare,setAgents]=useState();
    const [filters,setFilters]=useState();
    const [campains,setCampains]=useState();
    const [results,setResults]=useState();
    const [dataestados,setDataEstados]=useState();
    const [estados,setEstados]=useState();
    const [trays,setTrays]=useState();
    const [select_trays,setSelectTrays]=useState();
    const loader = useStoreLoader();

    const completarEstados = (lista,estadosUnicos) => {
        return estadosUnicos.map(estado => {
            const item = lista.find(e => e.estado === estado);
            return item ? item : { estado, nro: 0 };
        });
    };

    const updateFilter=async ({campain,corte,state,agencia,agente,inicio,fin,trays,group,estado})=>{
        let filter=``;
        
        loader.viewOn(true);

        if(campain!==""){
            filter+=`&campain=${campain}`;
        }

        filter+=`&agentes=${JSON.stringify(agents_compare)}`;

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

        let response=[];

        if(estado==="" & group===""){

            if(trays.length>0){
                let new_trays=JSON.stringify(trays).replaceAll('[','(');
                filter+=`&trays=${new_trays.replaceAll(']',')')}`;
            }

            const request= await fetch(`${import.meta.env.VITE_URL_BASE}/resume/compare?${filter}`,{
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

            const request= await fetch(`${import.meta.env.VITE_URL_BASE}/resume/compareday?${filter}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            response=await request.json();
            
            setResults(response);
        }

        let temp=[],completados=[];

        response.data.map(agente=>{
            temp.push(...agente.estados.items.map(e => e.estado));
        })

        const estadosUnicos = [...new Set(temp)];

        setEstados(estadosUnicos.sort());

        response.data.map(agente=>{
            let complete=completarEstados(agente.estados.items,estadosUnicos);
            completados.push(complete.sort((a, b) => a.estado.localeCompare(b.estado)));
        });

        completados.map(item=>{
            let nro_gestiones=0,nro_gestiones_efectivas=0;
            item.map(estado=>{
                if(estados_efectivos.includes(estado.estado)){
                    nro_gestiones_efectivas+=estado.nro;
                }
    
                nro_gestiones+=estado.nro;
            });

            item.nro_gestiones=nro_gestiones;
            item.nro_gestiones_efectivas=nro_gestiones_efectivas;
        });

        setDataEstados(completados);
        loader.viewOn(false);
    }

    const padDate=(value)=>{
        if(value>10){
            return value;
        }else{
            return `0${value}`;
        }
    }

    useEffect(()=>{
        loader.viewOn(true);
        setListAgents(agents);
        setFilters({
            campain:"",
            state_gestion:"",
            agencia:"",
            agente:"",
            corte:"",
            group:"",
            estado:"",
            inicio:"",
            fin:""
        });

        setResults({
            data:[]
        })

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

        setAgents([]);
        setEstados([]);
    },[]);

    if(!list_agents) return <></>
    if(!agents_compare) return <></>
    if(!campains) return <></>
    if(!estados) return <></>

    return (
        <div className="CardCompare">
            <div className="CardCompare__listagents">
                <h3>Agentes</h3>
                <div className="CardCompare__contentagents">
                    {
                        list_agents.map(agent=>(
                            <label className="CardCompare__agent">
                                <input 
                                    onChange={()=>{
                                        let list=[];
                                        let agents=document.getElementsByName('agent');
                                        agents=[].slice.call(agents);

                                        agents.map((ag)=>{
                                            if(ag.checked){
                                                list.push(ag.value)
                                            }
                                        });

                                        setAgents(list);
                                    }}
                                    value={agent.name}
                                    name="agent"
                                    type="checkbox"
                                />
                                {agent.name}
                            </label>
                        ))
                    }
                </div>

                <div className="Greports__filters">
                    <label>
                        Campaña
                        <select
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    campain:e.target.value
                                });
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
                                }}
                                value={filters.fin} 
                                type="date"/>
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
                                                }else{

                                                    const prev_trays=select_trays;
                                                    const new_trays=[];
                                                    prev_trays.map((tr)=>{
                                                        if(tr!==e.target.value){
                                                            new_trays.push(tr);
                                                        }
                                                    });

                                                    setSelectTrays(new_trays);
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
                    
                    {
                        (agents_compare.length>1 & filters.campain!=="")
                        ?
                            <button
                                className="CardCompare__button"
                                onClick={(e)=>{
                                    updateFilter({
                                        campain:filters.campain,
                                        state:filters.state_gestion,
                                        agencia:filters.agencia,
                                        agente:filters.agente,
                                        corte:filters.corte,
                                        trays:select_trays,
                                        inicio:filters.inicio,
                                        fin:filters.fin,
                                        group:filters.group,
                                        estado:filters.estado
                                    })
                                }}
                            >Comparar</button>
                        :   <></>
                    }
                </div>

                <div style={{marginTop:"20px"}}>
                    <div>

                        <h3>Información general</h3>
                        <div className="" style={{marginBottom:"30px"}}>
                            <div className="CardCompare__itemresult">
                                <div>
                                    <label>Detalle créditos</label>
                                    {
                                        agents_compare.map(agent=>(
                                            <label>{agent}</label>
                                        ))
                                    }
                                </div>
                                {
                                    (results.data.length>0)
                                    ?
                                        <>
                                            <div>
                                                <label># créditos asignados</label>
                                                {
                                                    results.data.map(result=>(
                                                        <label>{result.general[0].nro_asignado}</label>
                                                    ))
                                                }
                                            </div>
                                            <div>
                                                <label># créditos gestionados</label>
                                                {
                                                    results.data.map(result=>(
                                                        <label>{result.general[0].nro_gestionado}</label>
                                                    ))
                                                }
                                            </div>
                                            <div>
                                                <label># créditos gestionados efec.</label>
                                                {
                                                    results.data.map(result=>(
                                                        <label>{result.general[0].nro_gestionado_efectivo}</label>
                                                    ))
                                                }
                                            </div>
                                            <div>
                                                <label># créditos gestionados no efec.</label>
                                                {
                                                    results.data.map(result=>(
                                                        <label>{Number(result.general[0].nro_asignado)-Number(result.general[0].nro_gestionado_efectivo)}</label>
                                                    ))
                                                }
                                            </div>

                                            <div>
                                                <label>Efectividad en créditos gestionados</label>
                                                {
                                                    results.data.map((result,n)=>(
                                                        <label>{((result.general[0].nro_gestionado/result.general[0].nro_asignado)*100).toFixed(2)} %</label>
                                                    ))
                                                }
                                            </div>

                                            <div>
                                                <label>Efectividad en créditos con gestión efectiva</label>
                                                {
                                                    results.data.map(result=>(
                                                        <label>{(result.general[0].nro_gestionado_efectivo/result.general[0].nro_asignado*100).toFixed(2)} %</label>
                                                    ))
                                                }
                                            </div>
                                            
                                            <div>
                                                <label>Efectividad en gestiones</label>
                                                {
                                                    results.data.map((result,n)=>(
                                                        <label>{(dataestados[n].nro_gestiones_efectivas/dataestados[0].nro_gestiones*100).toFixed(2)} %</label>
                                                    ))
                                                }
                                            </div>

                                        </>
                                    :   <></>
                                }
                            </div>
                        </div>
                        
                        <h3>Detalle</h3>
                        <div className="">
                            <div className="CardCompare__itemresult">
                                <div>
                                    <label>Estado</label>
                                    {
                                        agents_compare.map(agent=>(
                                            <label>{agent}</label>
                                        ))
                                    }
                                </div>

                                {
                                    (estados.length>0)
                                    ?
                                        estados.map(estado=>(
                                            <div>
                                                <label>{estado}</label>
                                                {
                                                    dataestados.map(items=>(
                                                        items.map(item=>(
                                                            (item.estado===estado)
                                                            ?
                                                                <label>{item.nro}</label>
                                                            :   <></>
                                                        ))
                                                    ))
                                                }
                                            </div>
                                        ))
                                    :   <></>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}