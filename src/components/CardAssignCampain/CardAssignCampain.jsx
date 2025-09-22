import { useRef, useState } from "react";
import "./CardAssignCampain.css";
import { useEffect } from "react";
import FilterRange from "../FilterRange/FilterRange";
import useAssignSearch from "../../hooks/useAssignSearch";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import CardItemCharge from "../CardItemCharge/CardItemCharge";
import useSearchCreditInDistribution from "../../hooks/useSearchCreditInDistribution";
import CardItemErrorCharge from "../CardItemErrorCharge/CardItemErrorCharge";
import sendpush from "../../helpers/sendpush";

const agencias=[
    "-- Todas --",
    "catacocha",
    "palanda",
    "cariamanga",
    "zamora",
    "zumba",
    "piñas",
    "celica",
    "catamayo",
    "malacatos",
    "santa rosa",
    "oficina las pitas",
    "oficina centro",
    "oficina norte",
    "san miguel de los bancos",
    "milagro",
    "santo domingo",
    "el carmen",
    "cayambe",
    "pasaje",
    "tumbaco",
    "la troncal",
    "amaguaña",
    "naranjal",
    "quinche",
    "quininde"
];

export default function CardAssignCampain({data,updateCredits}){
    const [transfer,setTransfer]=useState(false);
    const [mode,setMode]=useState('manual');
    const [view_agencies,setView]=useState(false);
    const [business,setBusiness]=useState();
    const [charge,setCharge]=useState();

    const [agent,setAgents]=useState();
    const [agents_origin,setOrigns]=useState();

    const [agent_dtsn,setDtsn]=useState();
    const [agents_dtsn,setDtsns]=useState();

    const [creditos,setCreditos]=useState();

    const [distributions,setDistributions]=useState();
    const [item_filter,setItems]=useState();
    const [coincidence,setCoincidence]=useState();
    const [view_agents,setViewAgents]=useState();
    const [view_dtns,setViewDtns]=useState();
    const [prev_agencies,setPrevAgencies]=useState();
    const [errors,setErrors]=useState();
    const [total_assign,setTotalAssign]=useState();
    const [view_details,setDetails]=useState();

    const ref_origin=useRef();
    const ref_destino=useRef();

    const update=(data)=>{
        setCharge(data);
    }

    const addMore=(data)=>{

    }

    const setInit=()=>{
        let copy=charge;

        copy.map(item=>{
            item.search=true;
        });

        setCharge(copy);
    }

    const busc=useRef();

    const calcTotal=(data)=>{
        let count=0;

        data.map((item)=>{
            (item.search) && count++
        })

        return count;
    }

    const updateRange=(key,value)=>{
        let copy=item_filter;

        copy[key]=value;
        setItems(item_filter);

        useAssignSearch(
            charge,
            '',
            update,
            true,
            coincidence,
            copy.mora,
            copy.cuota,
            copy.monto,
            copy.estado,
            prev_agencies,
            copy.estado_gestion,
            (agents_origin.length>0) ? agents_origin : agent.id,
            data.cartera);
    }

    function chunckArrayInGroups(arr, size) {
        let nro_arry=Math.round(arr.length/size);
        let arrays=[];
        let ult=0;

        for (let i= 0; i < nro_arry; i++) {
            if(i!==(nro_arry-1)){
                arrays.push(arr.slice(ult,nro_arry*(i+1)));
                ult=nro_arry*(i+1);
            }else{
                arrays.push(arr.slice(ult,arr[arr.length-1]));
            }
        }

        return arrays.slice(0,size);
    }

    useEffect(()=>{
        setMode('manual');
        setTransfer(false);
        setView(false);
        setViewAgents(false);
        setViewDtns(false);
        setPrevAgencies([]);
        setDtsn('');
        setDetails(false);
        setErrors([]);
        setTotalAssign(0);
        setOrigns([]);
        setDtsns([]);

        setAgents({
            id:'',
            name:'-- Seleccionar --'
        });

        setDtsn({
            id:'',
            name:'-- Seleccionar --'
        });

        setDistributions(data.distributions);
        setCharge([]);
        setCoincidence('1');
        setItems({
            filter:false,
            mode:'',
            mora:'',
            cuota:'',
            monto:'',
            estado:'',
            estado_gestion:'',
            agencia:[]
        });
        setCreditos([]);

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
        
        // Compruebo si esta campaña no es de tipo SINCRONIZACIÓN API
        if(data.type_assign==='api'){
            
            setCharge([]);

        }else{
            fetch(`${import.meta.env.VITE_URL_BASE}/credit/all?cartera=${data.cartera}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setCharge(data);
                    setMode('assoc')
                    localStorage.setItem('filt',JSON.stringify(data));
                });
        }
    },[]);

    if(!business) return <></>
    if(!charge) return <></>
    if(!distributions) return <></>

    return (
        <div className="CardAssignCampain">
            <p className="CardAssignCampain__head">Asignación de campaña | {data.name} ({data.totals} CRÉDITOS)</p>

            <label className="CardAssignCampain__searchCredit">
                <strong style={{fontWeight:'bold'}}> Buscar crédito</strong>
                <input 
                    onChange={async (e)=>{

                        if(e.target.value.split('-')[1]!==undefined){
                            let iden_credito=e.target.value.split('-')[1];
        
                            if(iden_credito.length>7){
                                const result=await useSearchCreditInDistribution({
                                    value:iden_credito,
                                    distribution:data,
                                    cartera:data.cartera,
                                    setAgent:setAgents,
                                    setCredit:update
                                });
                            }
                        }
                        
                    }}
                    type="search" 
                    placeholder="Número de crédito"
                />
                <div>
                    <span>Historial de asignación</span>
                </div>
            </label>

            <div className="CardAssignCampain__agents">
                <label>
                    <strong style={{fontWeight:'bold'}}> Agente origen</strong>
                    <div className="CardAssignCampain__agentsSelect">
                        <div 
                            onClick={(e)=>{
                                setViewAgents(!view_agents);
                            }}
                            className="CardAssignCampain__agentsResult"
                        >
                            <label ref={ref_origin}>{agent.name}</label>
                        </div>
                        {
                            (view_agents)
                            ?
                                <div className="CardAssignCampain__agentsOptions">
                                    {
                                        JSON.parse(data.agents).map((agent,index)=>(
                                            <div className={(agents_origin.includes(agent.id)) ? "CardAssign--agentchoose" : ""}>
                                                <label>{agent.name.split(" ")[0].substring(0,1)}. {agent.name.split(" ")[1]}</label>
                                                <button
                                                    onClick={(e)=>{
                                                        setAgents({
                                                            id:agent.id,
                                                            name:agent.name 
                                                        });

                                                        setViewAgents(false);
                                                    
                                                        data.distributions.map((agente)=>{
                                                            if(Number(agente.agent_id)===Number(agent.id)){
                                                                //setCharge(agente.distribution)
                                                                useAssignSearch(
                                                                    charge,
                                                                    '',
                                                                    update,
                                                                    true,
                                                                    coincidence,
                                                                    item_filter.mora,
                                                                    item_filter.cuota,
                                                                    item_filter.monto,
                                                                    item_filter.estado,
                                                                    prev_agencies,
                                                                    item_filter.estado_gestion,
                                                                    (agents_origin.length>0) ? agents_origin : agent.id,
                                                                    data.cartera);
                                                            }
                                                        });

                                                    }}
                                                    title="Ver carga actual"
                                                >
                                                    <img src="/icons/view.png"/>
                                                </button>

                                                <button
                                                    title="Agrupar"
                                                >
                                                    <img 
                                                        src="/icons/grou.png"
                                                        onClick={(e)=>{
                                                            let copy=agents_origin;
                                                            let new_copy=[];

                                                            if(e.target.parentElement.parentElement.matches('.CardAssign--agentchoose')){
                                                                console.log("YA LA TENGO")
                                                                e.target.parentElement.parentElement.classList.remove('CardAssign--agentchoose');
                                                                
                                                                copy.map(id=>{
                                                                    
                                                                    if(Number(id)!==Number(agent.id)){
                                                                        new_copy.push(id)
                                                                    }else{
                                                                        let texto=ref_origin.current.textContent;
                                                                            texto=texto.replace(agent.name,'');
                                                                        ref_origin.current.textContent=texto;
                                                                    }
                                                                });
                                                            
                                                                setOrigns(new_copy);

                                                            }else{
                                                                e.target.parentElement.parentElement.classList.add('CardAssign--agentchoose');
                                                                copy.push(agent.id);
                                                                new_copy=copy;
                                                                setOrigns(copy);
                                                                let texto=ref_origin.current.textContent;
                                                                    texto+=`,${agent.name}`;
                                                                    texto=texto.replace('-- Seleccionar --,','');
                                                                ref_origin.current.textContent=texto;
                                                            }

                                                            useAssignSearch(
                                                                charge,
                                                                '',
                                                                update,
                                                                true,
                                                                coincidence,
                                                                item_filter.mora,
                                                                item_filter.cuota,
                                                                item_filter.monto,
                                                                item_filter.estado,
                                                                prev_agencies,
                                                                item_filter.estado_gestion,
                                                                (new_copy.length>0) ? new_copy : agent.id,
                                                                data.cartera);
                                                            }}
                                                    />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            :   <></>
                        }
                    </div>
                </label>
                {
                    (transfer & mode!=='assoc')
                    ?   
                        <>
                            <p>a</p>
                            <label>
                                <strong style={{fontWeight:'bold'}}> Agente destino</strong>
                                <div className="CardAssignCampain__agentsSelect">
                                    <div 
                                        onClick={(e)=>{
                                            setViewDtns(!view_dtns);
                                        }}
                                        className="CardAssignCampain__agentsResult"
                                    >
                                        <label ref={ref_destino}>-- Seleccionar--</label>
                                    </div>
                                    {
                                        (view_dtns)
                                        ?
                                            <div className="CardAssignCampain__agentsOptions">
                                                {
                                                    JSON.parse(data.agents).map((agent,index)=>(
                                                        <div className={(agents_dtsn.includes(agent.id)) ? "CardAssign--agentchoose" : ""}>
                                                            <label>{agent.name.split(" ")[0].substring(0,1)}. {agent.name.split(" ")[1]}</label>
                                                            <button
                                                                title="Agrupar"
                                                            >
                                                                <img 
                                                                    src="/icons/grou.png"
                                                                    onClick={(e)=>{
                                                                        let copy=agents_dtsn;
                                                                        let new_copy=[];

                                                                        if(e.target.parentElement.parentElement.matches('.CardAssign--agentchoose')){
                                                                            e.target.parentElement.parentElement.classList.remove('CardAssign--agentchoose');
                                                                            copy.map(id=>{
                                                                                
                                                                                if(Number(id)!==Number(agent.id)){
                                                                                    new_copy.push(id);
                                                                                }else{
                                                                                    let texto=ref_destino.current.textContent;
                                                                                        texto=texto.replace(agent.name,'');
                                                                                    ref_destino.current.textContent=texto;
                                                                                }
                                                                            });

                                                                            setDtsns(new_copy);

                                                                        }else{
                                                                            e.target.parentElement.parentElement.classList.add('CardAssign--agentchoose');
                                                                            copy.push(agent.id);
                                                                            new_copy=copy;
                                                                            setDtsns(copy);
                                                                            let texto=ref_destino.current.textContent;
                                                                                    texto+=`,${agent.name}`;
                                                                                texto=texto.replace('-- Seleccionar--,','');
                                                                            ref_destino.current.textContent=texto;
                                                                        }
                                                                    }}
                                                                />
                                                            </button>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        :   <></>
                                    }
                                </div>
                            </label>
                        </>
                    :   (mode==='assoc') 
                        ?
                            <></>
                        :   <></>
                }
            </div>
            
            <span><strong style={{fontWeight:'bold'}}> Forma de asignación</strong></span>
            
            <div className="CardAssignCampain__radius">
                <label>
                    <input 
                        type="checkbox"
                        name="mode"
                        value={"transfer"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(true);
                            }else{
                                setMode('assoc');
                                setTransfer(false);
                            }
                        }}
                    />
                    Transferir carga
                </label>
            </div>
            
            <label
                className="CardAssignCampain__file">
                Cargar datos (<strong style={{fontWeight:"bold"}}>{charge.total}</strong>)
                {
                        <>
                            <input 
                                ref={busc}
                                onChange={(e)=>{  
                                    useAssignSearch(
                                        charge, // Esta es la data que le pasamos para que filtro
                                        e.target.value, //Este es el texto {nombre del cliente o cédula}
                                        update, //Método para actualizar la carga
                                        item_filter.filter,
                                        item_filter.mode,
                                        item_filter.mora,
                                        item_filter.cuota,
                                        item_filter.monto,
                                        item_filter.estado,
                                        item_filter.agencia,
                                        item_filter.estado_gestion,
                                        (agents_origin.length>0) ? agents_origin : agent.id,
                                        data.cartera,
                                        setCreditos
                                    );
                                }}
                                type="text" 
                                placeholder="Ingrese nombre o creditos"
                            />

                            <button
                                onClick={(e)=>{
                                    setDetails(true);
                                }}
                            >Ver detalle cred.</button>
                        </>
                }
                <div style={{display:'none'}}>
                    {
                        (charge.length>0)
                        ?   
                            <>
                            </>
                        :   <></> 
                    }
                </div>
            </label>

            <span style={{marginTop:"10px"}}><strong style={{fontWeight:'bold', marginTop:"20px"}}>Filtrado de datos</strong></span>

            <div className="CardAssignCampain__radius">
                <label>
                    <input 
                        type="radio"
                        name="coincidence"
                        value={1}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setInit();
                                setCoincidence(e.target.value);
                                useAssignSearch(
                                    charge,
                                    '',
                                    update,
                                    true,
                                    e.target.value,
                                    item_filter.mora,
                                    item_filter.cuota,
                                    item_filter.monto,
                                    item_filter.estado,
                                    item_filter.agencia,
                                    item_filter.estado_gestion
                                );
                            }
                        }}
                        defaultChecked
                    />
                    Coincidir
                </label>
            </div>

            <div className="CardAssignCampain__filters">
                
                <div className="CardAssignCampain__ranges">
                    <FilterRange
                        filter={updateRange}
                        key_val={"mora"}
                        title={"Días de mora"}
                    />

                    <FilterRange
                        filter={updateRange}
                        key_val={"cuota"}
                        title={"Cuotas pendientes"}
                    />
                    
                    <FilterRange
                        filter={updateRange}
                        key_val={"monto"}
                        title={"Monto total"}
                    />

                </div>
                
                <div className="CardAssignCampain__selects">

                    <label>
                        Estado crédito
                        <select
                            value={item_filter.estado}
                            onChange={(e)=>{
                                setItems({
                                    ...item_filter,
                                    estado:e.target.value
                                });

                                updateRange('estado',e.target.value);
                            }}
                        >
                            <option value={""}>-- Seleccionar --</option>
                            <option value={"Vencido"}>Vencido</option>
                            <option value={"Vigente"}>Vigente</option>
                            {
                                (data.type_assign==='api')
                                ?
                                    <>
                                        <option value={"Vencido en tramite judicial"}>Vencido en trámite judicial</option>
                                        <option value={"Castigado"}>Castigado</option>
                                    </>
                                :   <></>
                            }
                            <option value={"Judicial"}>Judicial</option>
                        </select>
                    </label>

                    <label>
                        Estado gestión
                        <select
                            value={item_filter.estado_gestion}
                            onChange={(e)=>{
                                setItems({
                                    ...item_filter,
                                    estado_gestion:e.target.value
                                });

                                updateRange('estado_gestion',e.target.value);
                            }}
                        >
                            <option value={""}>-- Seleccionar --</option>
                            <option value={"PENDIENTE"}>PENDIENTE</option>
                            <option value={"EN PROCESO"}>EN PROCESO</option>
                            <option value={"COMPROMISO DE PAGO"}>COMPROMISO DE PAGO</option>
                            <option value={"OFERTA DE PAGO"}>OFERTA DE PAGO</option>
                            <option value={"MENSAJE A TERCEROS"}>MENSAJE A TERCEROS</option>
                            <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                            <option value={"YA PAGÓ"}>YA PAGÓ</option>
                            <option value={"MENSAJE DE TEXTO"}>MENSAJE DE TEXTO</option>
                            <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                            <option value={"CLIENTE SE NIEGA A PAGAR"}>CLIENTE SE NIEGA A PAGAR</option>
                            <option value={"SUSPENDIDO POR FALTA DE PAGO"}>SUSPENDIDO POR FALTA DE PAGO</option>
                            <option value={"FUERA DEL AREA DE COBERTURA"}>FUERA DEL AREA DE COBERTURA</option>
                            <option value={"CLIENTE INDICA QUE NO ES SU DEUDA"}>CLIENTE INDICA QUE NO ES SU DEUDA</option>
                            <option value={"NUMERO INCORRECTO"}>NUMERO INCORRECTO</option>
                            <option value={"PASAR A TRAMITE LEGAL"}>PASAR A TRAMITE LEGAL</option>
                            <option value={"VOLVER A LLAMAR"}>VOLVER A LLAMAR</option>
                            <option value={"NO CONTESTA"}>NO CONTESTA</option>
                            <option value={"CONVENIO DE PAGO"}>CONVENIO DE PAGO</option>
                            <option value={"CONTACTO INDICA QUE ESTA EQUIVOCADO"}>CONTACTO INDICA QUE ESTA EQUIVOCADO</option>
                            <option value={"CLIENTE ESCUCHA Y NO HABLA"}>CLIENTE ESCUCHA Y NO HABLA</option>
                            <option value={"CLIENTE ESTA OCUPADO"}>CLIENTE ESTA OCUPADO</option>
                            <option value={"CONTESTA MENOR DE EDAD"}>CONTESTA MENOR DE EDAD</option>
                            <option value={"CORTA LA LLAMADA"}>CORTA LA LLAMADA</option>
                            <option value={"INUBICABLE"}>INUBICABLE</option>
                            <option value={"NO VIVE EN LA MISMA DIRECCIÓN"}>NO VIVE EN LA MISMA DIRECCIÓN</option>
                            <option value={"Recopilación de Información"}>Recopilación de Información</option>
                            <option value={"Presentación demanda"}>Presentación demanda</option>
                            <option value={"Citación judicial"}>Citación judicial</option>
                            <option value={"Ejecución"}>Ejecución</option>
                            <option value={"Peritaje"}>Peritaje</option>
                            <option value={"Embargo"}>Embargo</option>
                            <option value={"Sentencia"}>Sentencia</option>
                            <option value={"Archivo demanda"}>Archivo demanda</option>
                            <option value={"NOTIFICADO EXTRAJUDICIAL"}>NOTIFICADO EXTRAJUDICIAL</option>
                            <option value={"Envío notificación"}>Envío notificacion</option>
                            <option value={"Continuar con gestión extrajudicial"}>Continuar con gestión extrajudicial</option>
                        </select>
                    </label>

                    <label>
                        Agencias
                        <div>
                            <button
                                onClick={(e)=>{
                                    setView(!view_agencies); 
                                }}
                            >--Seleccionar</button>
                            {
                                (view_agencies)
                                ?
                                    <div>
                                        {
                                            agencias.map((agencia,index)=>(
                                                <label key={index}>
                                                    <input
                                                        value={agencia}
                                                        type="checkbox"
                                                        onChange={(e)=>{
                                                            if(e.target.checked){
                                                                
                                                                if(e.target.value==="-- Todas --"){
                                                                    setPrevAgencies([]);
                                                                    useAssignSearch(charge,'',update,true,coincidence,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,[],item_filter.estado_gestion,agent.id,data.cartera);
                                                                }else{
                                                                    // Lo agrego
                                                                    let copy=prev_agencies;
                                                                    copy.push(e.target.value);
                                                                    setPrevAgencies(copy);
                                                                    useAssignSearch(charge,'',update,true,coincidence,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,copy,item_filter.estado_gestion,agent.id,data.cartera);
                                                                }
                                                            }else{
                                                                // Lo quito
                                                                let copy=prev_agencies;
                                                                let new_copy=[];

                                                                copy.map((agency)=>{
                                                                    if(agency!==e.target.value){
                                                                        new_copy.push(agency);
                                                                    }
                                                                })
                                                                
                                                                setPrevAgencies(new_copy);

                                                                useAssignSearch(charge,'',update,true,coincidence,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,new_copy,item_filter.estado_gestion,agent.id,data.cartera);
                                                            }
                                                        
                                                        }}

                                                        defaultChecked={(prev_agencies.includes(agencia)) ? true : false}

                                                    />
                                                    {agencia.toUpperCase()}
                                                </label> 
                                            ))
                                        }          
                                    </div>
                                :   <></>
                            }
                        </div>
                    </label>

                </div>

            </div>

            {
                (errors.length>0)
                ?
                    <div className="CardAssignCampain__errors">
                        <h4>Créditos no asignados ({errors.length})</h4>
                        <p>Estos créditos pertenecen a otros agentes</p>
                        <div className="CardAssignCampain__headCharge">
                            <label></label>
                            <label>Nombre</label>
                            <label>Agente</label>
                            <label>Crédito</label>
                            <label>Monto</label>
                            <label>Cuotas pendientes</label>
                            <label>Días mora</label>
                            <label>Estado</label>
                        </div>
                        {
                            errors.map((credit,index)=>(
                                <CardItemErrorCharge
                                    item={credit}
                                />
                            ))
                        }
                    </div>
                :   <></>
            }

            <div className="CardAssignCampain__footer">
                {
                    (transfer)
                    ?
                        <div>
                            <label>
                                Total (<strong style={{fontWeight:"bold"}}>{charge.total}</strong>)
                                <input 
                                    type="number"
                                    value={total_assign}
                                    onChange={(e)=>{
                                        if(e.target.value!==0 & e.target.value<=charge.total){
                                            setTotalAssign(e.target.value);
                                        }
                                    }}
                                />
                            </label>
                            <button
                                onClick={(e)=>{
                                    const distribution=distributions;
                                    
                                    const agent_origin=agent.id;
                                    const dtsn=agent_dtsn;

                                    let carga=charge.data;

                                    // Si hay un total a asignar corto la carga
                                    if(total_assign>0){
                                        carga=carga.slice(0,total_assign)
                                    }

                                    let carga_enviar=[];

                                    if(agents_dtsn.length>0){
                                        setErrors([]);

                                        e.target.textContent="Transfiriendo...";

                                        let filters="";

                                        if(item_filter.mora!==""){
                                            if(item_filter.mora.min!=="" & Number(item_filter.mora.min)!==0){
                                                filters+=`&mora_min=${item_filter.mora.min}`;
                                            }
                                            if(item_filter.mora.max!=="" & Number(item_filter.mora.max)!==0){
                                                filters+=`&mora_max=${item_filter.mora.max}`;
                                            }
                                        }

                                        if(item_filter.monto!==""){
                                            if(item_filter.monto.min!=="" & Number(item_filter.monto.min)!==0){
                                                filters+=`&monto_min=${item_filter.monto.min}`;
                                            }
                            
                                            if(item_filter.monto.max!=="" & Number(item_filter.monto.max)!==0){
                                                filters+=`&monto_max=${item_filter.monto.max}`;
                                            }
                                        }

                                        if(item_filter.cuota!==""){
                                            if(item_filter.cuota.min!=="" & Number(item_filter.cuota.min)!==0){
                                                filters+=`&cuotas_min=${item_filter.cuota.min}`;
                                            }
                            
                                            if(item_filter.cuota.max!=="" & Number(item_filter.cuota.max)!==0){
                                                filters+=`&cuotas_max=${item_filter.cuota.max}`;
                                            }
                                        }

                                        if(item_filter.estado_gestion!==""){
                                            filters+=`&management=${item_filter.estado_gestion}`;
                                        }

                                        if(item_filter.estado!==""){
                                            filters+=`&state=${item_filter.estado}`;
                                        }

                                        if(prev_agencies.length>0){
                                            filters+=`&agencias=${JSON.stringify(prev_agencies)}`;
                                        }

                                        if(agents_origin.length>0){
                                            filters+=`&users=${JSON.stringify(agents_origin)}`;
                                        }else{
                                            filters+=`&user=${agent.id}`;
                                        }

                                        if(agents_dtsn.length>1){
                                            filters+=`&destinos=${JSON.stringify(agents_dtsn)}`;
                                        }else{
                                            filters+=`&destino=${agents_dtsn[0]}`;
                                        }

                                        if(total_assign>0){
                                            filters+=`&limite=${total_assign}`;
                                        }

                                        if(creditos.length>0){
                                            filters+=`&creditos=${JSON.stringify(creditos)}`;
                                        }

                                        filters=filters.substring(1);

                                        fetch(`${import.meta.env.VITE_URL_BASE}/campains/${data.id}?${filters}`,{
                                            method:'PUT',
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            },
                                            body:new URLSearchParams({
                                                agent_origin:agent_origin,
                                                agent_destino:dtsn,
                                                carga:JSON.stringify(carga_enviar),
                                                cartera:data.cartera
                                            })
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                if(data.errors.length>0){
                                                    sendpush({
                                                        title:'ERR: Cruce.',
                                                        message:'Existen créditos ya asignados a otro agente.',
                                                        type:'Push--danger',
                                                        timeout:5000
                                                    });

                                                }else{
                                                    sendpush({
                                                        title:'Éxito.',
                                                        message:'Carga transferida.',
                                                        type:'Push--sucessful',
                                                        timeout:3000
                                                    });

                                                    updateCredits(data);
                                                }
                                                e.target.textContent="Transferir carga";
                                            });
                                    }else{
                                        sendpush({
                                            title:'ERR: Sin agente destino.',
                                            message:'No hay un agente de destino para transferir la carga.',
                                            type:'Push--danger',
                                            timeout:5000
                                        });
                                    }
                                }}
                            >
                                Transferir carga
                            </button>
                        </div>
                    :
                        <label>
                            Total (<strong style={{fontWeight:"bold"}}>{charge.total}</strong>)
                        </label>
                }
            </div>
            {
                (view_details)
                ?   
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setDetails(false)}}>Ocultar</button>
                        <div style={{width:"100%",padding:"0 10px",height:"500px",overflowY:'auto'}}>
                            <div className="CardAssignCampain__headCharge">
                                <label></label>
                                <label>Nombre</label>
                                <label>Cédula</label>
                                <label>Crédito</label>
                                <label>Monto</label>
                                <label>Cuotas pendientes</label>
                                <label>Días mora</label>
                                <label>Estado</label>
                            </div>
                            {
                                charge.data.map((credit,index)=>(
                                    <CardItemCharge
                                        item={credit}
                                    />
                                ))
                            }
                        </div>
                    </div>
                :   <></>
            }

        </div>
    );
}