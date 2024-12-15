import { useRef, useState } from "react";
import "./CardAssignCampain.css";
import { useEffect } from "react";
import FilterRange from "../FilterRange/FilterRange";
import useAssignSearch from "../../hooks/useAssignSearch";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import CardItemCharge from "../CardItemCharge/CardItemCharge";
import useVerifyUnique from "../../hooks/useVerifyUnique";
import addNotification from "react-push-notification";
import useSearchCreditInDistribution from "../../hooks/useSearchCreditInDistribution";
import CardItemErrorCharge from "../CardItemErrorCharge/CardItemErrorCharge";

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
    const [agent_dtsn,setDtsn]=useState();
    const [distributions,setDistributions]=useState();
    const [item_filter,setItems]=useState();
    const [coincidence,setCoincidence]=useState();
    const [view_agents,setViewAgents]=useState();
    const [prev_agencies,setPrevAgencies]=useState();
    const [errors,setErrors]=useState();
    const [total_assign,setTotalAssign]=useState();
    const [view_details,setDetails]=useState();

    const update=(data)=>{
        setCharge(data);
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

    // Para setear los rangos en filtros
    const updateRange=(key,value)=>{
        let copy=item_filter;

        copy[key]=value;
        setItems(item_filter);

        // Usamos el seleccionar de créditos
        // 1) Primero debemos saber cual es modo
        // 2) Enviamos la data del filtro correspondiente: Si es asociaación de cartera entonces es filt, si es transferencia, es user_filt
        useAssignSearch(charge,'',update,true,coincidence,copy.mora,copy.cuota,copy.monto,copy.estado,prev_agencies,copy.estado_gestion,agent.id,data.cartera);
    }

    function chunckArrayInGroups(arr, size) {
        let nro_arry=Math.round(arr.length/size); //Aquí tengo la cantidad de créditos por array
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

        // arrays.push(arr.slice(Math.round(nro_arry)*(size-1)+1)) //OJOOOOOOOOOOOOOOOOOOOOO
        return arrays.slice(0,size);
    }

    useEffect(()=>{
        setMode('manual');
        setTransfer(false);
        setView(false);
        setViewAgents(false);
        setPrevAgencies([]);
        setDtsn('');
        setDetails(false);
        setErrors([]);
        setTotalAssign(0);

        setAgents({
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

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines`,{
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
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/all?cartera=${data.cartera}`,{
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
                    <strong style={{fontWeight:'bold'}}> Agente</strong>
                    <div className="CardAssignCampain__agentsSelect">
                        <div 
                            onClick={(e)=>{
                                setViewAgents(!view_agents);
                            }}
                            className="CardAssignCampain__agentsResult"
                        >
                            <label>{agent.name}</label>
                        </div>
                        {
                            (view_agents)
                            ?
                                <div className="CardAssignCampain__agentsOptions">
                                        <div>
                                            <label
                                                style={{height:"30px",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}}
                                                onClick={(e)=>{
                                                    setAgents({
                                                        id:'',
                                                        name:'-- Todos --'
                                                    });
                                                    setCharge(JSON.parse(localStorage.getItem('filt')));
                                                    setViewAgents(false);
                                                }}
                                            >-- Todos --</label>
                                        </div>
                                    {
                                        JSON.parse(data.agents).map((agent,index)=>(
                                            <div>
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
                                                                    agent.id,
                                                                    data.cartera);
                                                            }
                                                        });

                                                        // Obtenemos la distribución actual del agente
                                                        // fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/distribution?id_campain=${data.id}&id=${agent.id}&cartera=${data.cartera}`,{
                                                        //     headers: {
                                                        //         Accept: 'application/json',
                                                        //         Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        //     }
                                                        // })
                                                        //     .then((response) => response.json())  
                                                        //     .then((data) => {
                                                        //         setCharge(data);
                                                        //         setViewAgents(false);
                                                        //     });

                                                    }}
                                                    title="Ver carga actual"
                                                >
                                                    <img src="/icons/view.png"/>
                                                </button>

                                                {/* <button
                                                    onClick={()=>{

                                                    }}
                                                    title="Agrupar"
                                                >
                                                    <img src="/icons/grou.png"/>
                                                </button> */}
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
                                Agente
                                <select
                                    value={agent_dtsn}
                                    onChange={(e)=>{
                                        setDtsn(e.target.value);
                                    }}
                                >
                                    <option value={""}>-- Seleccionar --</option>
                                    {
                                        JSON.parse(data.agents).map((agent_a,index)=>(
                                            (agent.id!==agent_a.id)
                                            ?
                                                <option value={agent_a.id}>{agent_a.name}</option>
                                            :   <></>
                                        ))
                                    }
                                </select>
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
                {
                    (data.type_assign!=='api')
                    ?
                        <></>
                        // <label>
                        //     <input 
                        //         type="radio"
                        //         name="mode"
                        //         value={"assoc"}
                        //         onChange={(e)=>{
                        //             if(e.target.checked){
                        //                 setMode(e.target.value);
                        //                 setTransfer(false);
                        //             }
                        //         }}
                        //     />
                        //     Asociar cartera
                        //     {
                        //         (mode==='assoc')
                        //         ?
                        //             <select
                        //                 onChange={(e)=>{
                        //                     if(e.target.value!==""){
                        //                         fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/all?cartera=${e.target.value}`,{
                        //                             headers: {
                        //                                 Accept: 'application/json',
                        //                                 Authorization: `Bearer ${localStorage.getItem('token')}`
                        //                             }
                        //                         })
                        //                             .then((response) => response.json())  
                        //                             .then((data) => {
                        //                                 setCharge(data)
                        //                                 // Cacheo los créditos de cartera por si se necesitan para filtrado
                        //                                 localStorage.setItem('filt',JSON.stringify(data));
                        //                             });
                        //                     }
                        //                 }}
                        //             >
                        //                 <option value={""}>--Seleccionar--</option>
                        //                 {
                        //                     business.map((cartera,index)=>(
                        //                         <option key={index} value={cartera.name}>{cartera.name}</option>
                        //                     ))
                        //                 }
                        //             </select>
                        //         :   <></>
                        //     }
                        // </label>
                    :   <></>
                }

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
                {/* <input id="campain" type="file"/> */}
                {
                    // (charge.length>0)
                    // ?
                        <>
                            

                            <input 
                                ref={busc}
                                onChange={(e)=>{  
                                    useAssignSearch(
                                        charge, // Esta es la data que le pasamos para que filtro
                                        e.target.value, //Este es el texto {nombre del cliente o cédula}
                                        update, //Método para actualizar la carga
                                        //================> Listado de filtros
                                        item_filter.filter,
                                        item_filter.mode,
                                        item_filter.mora,
                                        item_filter.cuota,
                                        item_filter.monto,
                                        item_filter.estado,
                                        item_filter.agencia,
                                        item_filter.estado_gestion,
                                        agent.id,
                                        data.cartera
                                    );
                                }}
                                type="text" 
                                placeholder="Ingrese nombre o creditos"
                            />

                            {/* <button 
                                title="Todos los créditos volverán a la carga principal y loa agentes no tendrán créditos"
                                className="CardAssignCampain__file--buttonReset"
                                onClick={(e)=>{
                                    e.target.textContent="Reiniciando";

                                    const dtsn=15;

                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/reset/${data.id}`,{
                                        method:'PUT',
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        },
                                        body:new URLSearchParams({
                                            distributions:""
                                        })
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            e.target.textContent="Reiniciado";
                                        });
                                }}
                            >Reiniciar campaña</button> */}

                            <button
                                onClick={(e)=>{
                                    setDetails(true);
                                }}
                            >Ver detalle cred.</button>
                        </>
                    // :   <></>
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
                                useAssignSearch(charge,'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia,item_filter.estado_gestion);
                            }
                        }}
                        defaultChecked
                    />
                    Coincidir
                </label>

                <label>
                    <input 
                        type="radio"
                        name="coincidence"
                        value={2}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setInit();
                                setCoincidence(e.target.value);
                                useAssignSearch(charge,'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia,item_filter.estado_gestion);
                            }
                        }}
                    />
                    No coincidir
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
                                    <option value={"Castigado"}>Castigado</option>
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
                            <option value={"Judicial"}>MENSAJE A TERCEROS</option>
                            <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                            <option value={"YA PAGÓ"}>YA PAGÓ</option>
                            <option value={"MENSAJE DE TEXTO"}>MENSAJE DE TEXTO</option>
                            <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                            <option value={"CLIENTE SE NIEGA A PAGAR"}>CLIENTE SE NIEGA A PAGAR</option>
                            <option value="CLIENTE INDICA QUE NO ES SU DEUDA">CLIENTE INDICA QUE NO ES SU DEUDA</option>
                            <option value="PASAR A TRAMITE LEGAL">PASAR A TRAMITE LEGAL</option>
                            <option value="VOLVER A LLAMAR">VOLVER A LLAMAR</option>
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
                        Agencias
                        <div>
                            <button
                                onClick={(e)=>{
                                    setView(!view_agencies); 
                                    console.log(prev_agencies);

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

                                    if(agent_origin!=="" & dtsn!==""){
                                        setErrors([]);
                                        
                                        //Enviar el filtro para asignar campaña
                                        // carga.map(carga=>{
                                        //     carga_enviar.push(carga.id);
                                        // });

                                        e.target.textContent="Transfiriendo...";
                                        
                                        console.log({
                                            agent_origin:agent_origin,
                                            agent_destino:dtsn,
                                            carga:JSON.stringify(carga_enviar),
                                            cartera:data.cartera
                                        });

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

                                        if(agent.id!==""){
                                            filters+=`&user=${agent.id}`;
                                        }

                                        if(total_assign>0){
                                            filters+=`&limite=${total_assign}`;
                                        }

                                        filters=filters.substring(1);
                                        console.log(filters)

                                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/${data.id}?${filters}`,{
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
                                                    addNotification({
                                                        title: 'ERR: Cruce',
                                                        subtitle: `${data.errors.length} créditos ya están asignados a otro usuario.`,
                                                        message: ``,
                                                        native: false,
                                                        backgroundTop: '#FF9619',
                                                        backgroundBottom: '#fdb864',
                                                        colorTop: 'white',
                                                        colorBottom: 'black',
                                                        closeButton: 'Cerrar',
                                                        duration: 8000,
                                                    });
                                                }else{
                                                    addNotification({
                                                        title: 'Éxito',
                                                        subtitle: 'Carga transferida',
                                                        message: '',
                                                        native: false,
                                                        backgroundTop: '#009793',
                                                        backgroundBottom: '#459d9a',
                                                        colorTop: 'white',
                                                        colorBottom: 'white',
                                                        closeButton: 'Cerrar',
                                                        duration:3000,
                                                    });

                                                    updateCredits(data);
                                                }
                                                e.target.textContent="Transferir carga";
                                            });

                                    }else if(agent_origin===""){
                                        addNotification({
                                            title: 'ERR: Sin agente origen',
                                            subtitle: `No hay un agente origen para transferir la carga.`,
                                            message: `Elija un agente`,
                                            native: false,
                                            backgroundTop: '#FF9619',
                                            backgroundBottom: '#fdb864',
                                            colorTop: 'white',
                                            colorBottom: 'black',
                                            closeButton: 'Cerrar',
                                            duration: 8000,
                                        });
                                    }else{
                                        addNotification({
                                            title: 'ERR: Sin agente destino',
                                            subtitle: `No hay un agente de destino para transferir la carga.`,
                                            message: `Elija un agente`,
                                            native: false,
                                            backgroundTop: '#FF9619',
                                            backgroundBottom: '#fdb864',
                                            colorTop: 'white',
                                            colorBottom: 'black',
                                            closeButton: 'Cerrar',
                                            duration: 8000,
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
                        // <div>
                        //     <label>
                        //         Total (<strong style={{fontWeight:"bold"}}>{charge.length}</strong>)
                        //         <input 
                        //             type="number"
                        //             value={total_assign}
                        //             onChange={(e)=>{
                        //                 if(e.target.value!==0 & e.target.value<=charge.length){
                        //                     setTotalAssign(e.target.value);
                        //                 }
                        //             }}
                        //         />
                        //     </label>

                        //     <button
                        //         onClick={(e)=>{
                                    
                        //             e.target.textContent="Asignando...";

                        //             //De toda la carga solo elijo los créditos que tienen el campo SEARCH: TRUE
                        //             let results=charge; //O toda la carga disponible

                        //             let data_agent=[];

                        //             /*
                        //             ================================================================================
                        //             1. ASIGNACIÓN EN PARTES IGUALES A TODOS LOS AGENTES
                        //             -   Si no hay agente asignado, reparto toda la carga en partes iguales para 
                        //                 todos los agentes que estén en la campaña
                        //             ================================================================================
                        //             */
                        //             if(agent.id===''){
                        //                 let agents=JSON.parse(data.agents);

                        //                 const data_per_agent=chunckArrayInGroups(results,agents.length);
                                        
                        //                 data_per_agent.map((datap,n)=>{
                        //                     const distribution=distributions;

                        //                     // Créditos que no están asignados aún
                        //                     const no_self=[];

                        //                     // Créditos que ya se encuentran asignados
                        //                     const self=[];

                        //                     distribution.map((dis)=>{
                        //                         if(Number(dis.agent_id)===Number(agents[n].id)){
                        //                             datap.map((result)=>{
                        //                                 const [state,message]=useVerifyUnique({id_credit:result.id,agent_id:Number(agents[n].id),data_self:dis.distribution,mode:1});
                                                        
                        //                                 if(state){
                        //                                     no_self.push(result);
                        //                                 }else{
                        //                                     self.push(result);
                        //                                 }
                        //                             })
                        //                         }
                        //                     });

                        //                     // Ahora comprobamos que de los créditos no asignados a el agente mismo, no se encuentren asignados en otro agente
                        //                     // Créditos asignados a otros agentes
                        //                     const other_agent=[];

                        //                     // Créditos que se pueden asignar al agente actual
                        //                     const unique=[];
                        //                     const other_datas=[];

                        //                     distribution.map((dis)=>{
                        //                         if(Number(dis.agent_id)!==Number(agents[n].id)){
                        //                             other_datas.push(dis.distribution);
                        //                         }
                        //                     });

                        //                     no_self.map(result=>{
                        //                         const [state,message]=useVerifyUnique({id_credit:result.id,agent_id:Number(agents[n].id),data_self:other_datas,mode:2});
                                                        
                        //                         if(state){
                        //                             unique.push(result);
                        //                         }else{
                        //                             other_agent.push(result);
                        //                         }
                        //                     });

                        //                     console.log(other_agent);

                        //                     if(self.length>0){
                        //                         if(other_agent.length>0){
                        //                             addNotification({
                        //                                 title: 'Créditos duplicados',
                        //                                 subtitle: `Se encontraron ${self.length} créditos ya asignados al agente y ${other_agent.length} créditos asignados a otros agentes.`,
                        //                                 message: `Se asignaron ${unique.length} créditos`,
                        //                                 native: false,
                        //                                 backgroundTop: '#FF9619',
                        //                                 backgroundBottom: '#fdb864',
                        //                                 colorTop: 'white',
                        //                                 colorBottom: 'black',
                        //                                 closeButton: 'Cerrar',
                        //                                 duration: 8000,
                        //                             });
                                                    
                        //                         }else{
                        //                             addNotification({
                        //                                 title: 'Créditos duplicados',
                        //                                 subtitle: `Se encontraron ${self.length} créditos ya asignados al agente.`,
                        //                                 message: `Se asignaron ${unique.length} créditos`,
                        //                                 native: false,
                        //                                 backgroundTop: '#FF9619',
                        //                                 backgroundBottom: '#fdb864',
                        //                                 colorTop: 'white',
                        //                                 colorBottom: 'black',
                        //                                 closeButton: 'Cerrar',
                        //                                 duration: 8000,
                        //                             });
                        //                         }
                        //                     }else if(other_agent.length>0){
                        //                         addNotification({
                        //                             title: 'Créditos duplicados',
                        //                             subtitle: `Se encontraron ${other_agent.length} créditos asignados a otros agentes.`,
                        //                             message: `Se asignaron ${unique.length} créditos`,
                        //                             native: false,
                        //                             backgroundTop: '#FF9619',
                        //                             backgroundBottom: '#fdb864',
                        //                             colorTop: 'white',
                        //                             colorBottom: 'black',
                        //                             closeButton: 'Cerrar',
                        //                             duration: 8000,
                        //                         });
                        //                     }

                        //                     distribution.map((dis)=>{
                        //                         if(Number(dis.agent_id)===Number(agents[n].id)){
                        //                             unique.map(result=>{
                        //                                 dis.distribution.push({
                        //                                     id:result.id,
                        //                                     cartera:result.cartera
                        //                                 });
            
                        //                                 dis.pending.push({
                        //                                     id:result.id,
                        //                                     cartera:result.cartera
                        //                                 });
                        //                             });
                        //                         }
                        //                     });
                                            
                        //                     data_agent=distribution;
                        //                 });

                        //             }else{

                        //                 const distribution=distributions;
                        //                 // Créditos que no están asignados aún
                        //                 const no_self=[];

                        //                 // Créditos que ya se encuentran asignados
                        //                 const self=[];

                        //                 distribution.map((dis,n)=>{
                        //                     dis.distribution.map(cred=>{
                        //                         cred.agent_id=dis.agent_id;
                        //                     });

                        //                     if(Number(dis.agent_id)===Number(agent.id)){
                        //                         results.map((result)=>{
                        //                             const [state,message,agent_id]=useVerifyUnique({id_credit:result.id,agent_id:Number(agent.id),data_self:dis.distribution,mode:1});
                                                    
                        //                             result.agent_id=agent_id;

                        //                             if(state){
                        //                                 no_self.push(result);
                        //                             }else{
                        //                                 self.push(result);
                        //                             }
                        //                         })
                        //                     }
                        //                 });

                        //                 // Ahora comprobamos que de los créditos no asignados a el agente mismo, no se encuentren asignados en otro agente
                        //                 // Créditos asignados a otros agentes
                        //                 const other_agent=[];

                        //                 // Créditos que se pueden asignar al agente actual
                        //                 const unique=[];
                        //                 const other_datas=[];

                        //                 distribution.map((dis,n)=>{
                        //                     dis.distribution.map(cred=>{
                        //                         cred.agent_id=dis.agent_id;
                        //                     })

                        //                     if(Number(dis.agent_id)!==Number(agent.id)){
                        //                         other_datas.push(dis.distribution);
                        //                     }
                        //                 });

                        //                 no_self.map(result=>{
                        //                     const [state,message,agent_id]=useVerifyUnique({id_credit:result.id,agent_id:Number(agent.id),data_self:other_datas,mode:2});
                                            
                        //                     result.agent_id=agent_id;

                        //                     if(state){
                        //                         unique.push(result);
                        //                     }else{
                        //                         other_agent.push(result);
                        //                     }
                        //                 });

                        //                 const names_agents=JSON.parse(data.agents);
                        //                 let erros=[];
                                        
                        //                 other_agent.map((credito)=>{
                        //                     names_agents.map((agt=>{
                        //                         if(credito.agent_id===agt.id){
                        //                             credito.agent_id=agt.name;
                        //                             erros.push(credito);
                        //                         }
                        //                     }))
                        //                 });

                        //                 setErrors(erros);

                        //                 if(self.length>0){
                        //                     if(other_agent.length>0){
                        //                         addNotification({
                        //                             title: 'Créditos duplicados',
                        //                             subtitle: `Se encontraron ${self.length} créditos ya asignados al agente y ${other_agent.length} créditos asignados a otros agentes.`,
                        //                             message: `Se asignaron ${unique.length} créditos`,
                        //                             native: false,
                        //                             backgroundTop: '#FF9619',
                        //                             backgroundBottom: '#fdb864',
                        //                             colorTop: 'white',
                        //                             colorBottom: 'black',
                        //                             closeButton: 'Cerrar',
                        //                             duration: 8000,
                        //                         });
                                                
                        //                     }else{
                        //                         addNotification({
                        //                             title: 'Créditos duplicados',
                        //                             subtitle: `Se encontraron ${self.length} créditos ya asignados al agente.`,
                        //                             message: `Se asignaron ${unique.length} créditos`,
                        //                             native: false,
                        //                             backgroundTop: '#FF9619',
                        //                             backgroundBottom: '#fdb864',
                        //                             colorTop: 'white',
                        //                             colorBottom: 'black',
                        //                             closeButton: 'Cerrar',
                        //                             duration: 8000,
                        //                         });
                        //                     }
                        //                 }else if(other_agent.length>0){
                        //                     addNotification({
                        //                         title: 'Créditos duplicados',
                        //                         subtitle: `Se encontraron ${other_agent.length} créditos asignados a otros agentes.`,
                        //                         message: `Se asignaron ${unique.length} créditos`,
                        //                         native: false,
                        //                         backgroundTop: '#FF9619',
                        //                         backgroundBottom: '#fdb864',
                        //                         colorTop: 'white',
                        //                         colorBottom: 'black',
                        //                         closeButton: 'Cerrar',
                        //                         duration: 8000,
                        //                     });
                        //                 }

                        //                 // if(total_assign>0){
                        //                 //     carga=carga.slice(0,total_assign)
                        //                 // }
    
                        //                 // console.log(carga);

                        //                 distribution.map((dis)=>{
                        //                     if(Number(dis.agent_id)===Number(agent.id)){
                        //                         unique.map(result=>{
                        //                             dis.distribution.push({
                        //                                 id:result.id,
                        //                                 cartera:result.cartera
                        //                             });
        
                        //                             dis.pending.push({
                        //                                 id:result.id,
                        //                                 cartera:result.cartera
                        //                             });
                        //                         });
                        //                     }
                        //                 });
                                        
                        //                 data_agent=distribution;
                        //             }

                        //             // Aquí debo comprobar que no se este asignando créditos que ya están asignados a otros agentes
                        //             // fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/${data.id}`,{
                        //             //     method:'PUT',
                        //             //     headers: {
                        //             //         Accept: 'application/json',
                        //             //         Authorization: `Bearer ${localStorage.getItem('token')}`
                        //             //     },
                        //             //     body:new URLSearchParams({
                        //             //         distributions:JSON.stringify(data_agent),
                        //             //         charge_inicial:JSON.stringify([])
                        //             //     })
                        //             // })
                        //             //     .then((response) => response.json())  
                        //             //     .then((data) => {
                        //             //         addNotification({
                        //             //             title: 'Éxito',
                        //             //             subtitle: 'Asignación correcta',
                        //             //             message: '',
                        //             //             native: false,
                        //             //             backgroundTop: '#009793',
                        //             //             backgroundBottom: '#459d9a',
                        //             //             colorTop: 'white',
                        //             //             colorBottom: 'white',
                        //             //             closeButton: 'Cerrar',
                        //             //             duration:3000,
                        //             //         });
                        //             //         setDistributions(data_agent);
                        //             //         updateCredits(data.data);
                        //             //         e.target.textContent="Asignar";
                        //             //     });

                        //         }}
                        //     >Asignar</button>
                        // </div>
                        
                }
            </div>
            
            {/* Para visualizar el detalle de los créditos */}
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

/**
 * 
 *  Cargar datos ({
        (data.type_assign==='api') 
        ?   (charge.length===0)
            ?   'Cargando...' 
            :   (<strong style={{fontWeight:"bold"}}>{charge.length}</strong>)
        :   (<strong style={{fontWeight:"bold"}}>{charge.length}</strong>)
    })
 */