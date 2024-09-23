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
        useAssignSearch(
            ((mode==='assoc' | data.type_assign==='api') & (agent.id==="" | JSON.parse(localStorage.getItem('user_filt')).length==0)) 
                ? JSON.parse(localStorage.getItem('filt')) 
                : JSON.parse(localStorage.getItem('user_filt')),'',update,true,coincidence,copy.mora,copy.cuota,copy.monto,copy.estado,copy.agencia);
    }

    function chunckArrayInGroups(arr, size) {
        let nro_arry=arr.length/size; //Aquí tengo la cantidad de créditos por array
        let arrays=[];
        let count=0;
        let array=[];
    
        for (let i= 0; i < arr.length; i++) {
            if(count<Math.round(nro_arry)){
                array.push(arr[i]);
                count++;
            }else{
                array.push(arr[i])
                count=0;
                arrays.push(array);
                array=[]
            }    
        }

        arrays.push(arr.slice(Math.round(nro_arry)*(size-1)+2))
        return arrays;
    }

    useEffect(()=>{
        setMode('manual');
        setTransfer(false);
        setView(false);
        setViewAgents(false);
        setPrevAgencies([]);
        setDtsn('');

        setAgents({
            id:'',
            name:'-- Seleccionar --'
        });

        setDistributions(JSON.parse(data.distributions));
        setCharge([]);
        setCoincidence('1');
        setItems({
            filter:false,
            mode:'',
            mora:'',
            cuota:'',
            monto:'',
            estado:'Vencido',
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
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/syncs`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    localStorage.setItem('filt',JSON.stringify(data));
                    setCharge(data);
                });
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
            <p className="CardAssignCampain__head">Asignación de campaña | {data.name}</p>

            <label className="CardAssignCampain__searchCredit">
                Buscar crédito
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
                    Agente

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

                                                        // Obtenemos la distribución actual del agente
                                                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/distribution?id_campain=${data.id}&id=${agent.id}`,{
                                                            headers: {
                                                                Accept: 'application/json',
                                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                                            }
                                                        })
                                                            .then((response) => response.json())  
                                                            .then((data) => {
                                                                const credits=JSON.parse(data[0].distributions);

                                                                credits.map((items)=>{
                                                                    if(items.agent_id===Number(agent.id)){
                                                                        localStorage.setItem('user_filt',JSON.stringify(items.distribution));
                                                                        setCharge(items.distribution);
                                                                        setViewAgents(false);
                                                                    }
                                                                });
                                                            });

                                                    }}
                                                    title="Ver carga actual"
                                                >
                                                    <img src="/icons/view.png"/>
                                                </button>

                                                <button
                                                    onClick={()=>{

                                                    }}
                                                    title="Agrupar"
                                                >
                                                    <img src="/icons/grou.png"/>
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
            
            <span>Forma de asignación</span>
            
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
                Cargar datos ({
                    (data.type_assign==='api') 
                    ?   (charge.length===0)
                        ?   'Cargando...' 
                        :   charge.length
                    :   charge.length
                })
                {/* <input id="campain" type="file"/> */}
                {
                    // (charge.length>0)
                    // ?
                        <>
                            <input 
                                ref={busc}
                                onChange={(e)=>{  
                                    useAssignSearch(
                                        ((mode==='assoc' | data.type_assign==='api') & (agent.id==="" | JSON.parse(localStorage.getItem('user_filt')).length==0)) 
                                            ?   JSON.parse(localStorage.getItem('filt')) 
                                            :   JSON.parse(localStorage.getItem('user_filt')), // Esta es la data que le pasamos para que filtro
                                        
                                        e.target.value, //Este es el texto {nombre del cliente o cédula}
                                        
                                        update, //Método para actualizar la carga
                                        //================> Listado de filtros
                                        item_filter.filter,
                                        item_filter.mode,
                                        item_filter.mora,
                                        item_filter.cuota,
                                        item_filter.monto,
                                        item_filter.estado,
                                        item_filter.agencia
                                    );
                                }}
                                type="text" 
                                placeholder="Ingrese nombre o creditos"
                            />

                            <button 
                                title="Todos los créditos volverán a la carga principal y loa agentes no tendrán créditos"
                                onClick={(e)=>{
                                    e.target.textContent="Reiniciando";

                                    let distribution_init=[];

                                    JSON.parse(data.agents).map((agent)=>{
                                        distribution_init.push({
                                            agent_id:agent.id,
                                            total:0,
                                            distribution:[],
                                            pending:[],
                                            processed:[],
                                            inprocess:[]
                                        });
                                    });

                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/reset/${data.id}`,{
                                        method:'PUT',
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        },
                                        body:new URLSearchParams({
                                            distributions:JSON.stringify(distribution_init)
                                        })
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setDistributions(distribution_init);
                                            updateCredits(data.data);
                                            e.target.textContent="Reiniciado";
                                        });

                                }}
                            >Reiniciar campaña</button>
                        </>
                    // :   <></>
                }
                <div>
                    {
                        (charge.length>0)
                        ?   
                            <>
                                <div className="CardAssignCampain__headCharge">
                                    <input 
                                        type="checkbox"
                                        onChange={(e)=>{
                                            const prev_charge=charge;
                                            let results=[];

                                            if(e.target.checked){
                                                prev_charge.map((credit)=>{
                                                    credit.select=true;
                                                    results.push(credit);
                                                });
                                            }else{
                                                prev_charge.map((credit)=>{
                                                    credit.select=false;
                                                    results.push(credit);
                                                });
                                            }
                                            
                                            setCharge(results);
                                        }}
                                    />
                                    <label>Nombre</label>
                                    <label>Cédula</label>
                                    <label>Crédito</label>
                                    <label>Monto</label>
                                    <label>Cuotas pendientes</label>
                                    <label>Días mora</label>
                                    <label>Estado</label>
                                </div>
                                {
                                    charge.map((credit,index)=>(
                                        <CardItemCharge
                                            item={credit}
                                        />
                                    ))
                                }

                            </>
                        :   <></> 
                    }
                </div>
            </label>

            <span>Filtrado de datos</span>

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
                                    ((mode==='assoc' | data.type_assign==='api') & (agent.id==="" | JSON.parse(localStorage.getItem('user_filt')).length==0)) 
                                        ? JSON.parse(localStorage.getItem('filt')) 
                                        : JSON.parse(localStorage.getItem('user_filt')),'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia);
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
                                useAssignSearch(
                                    ((mode==='assoc' | data.type_assign==='api') & (agent.id==="" | JSON.parse(localStorage.getItem('user_filt')).length==0)) 
                                        ? JSON.parse(localStorage.getItem('filt')) 
                                        : JSON.parse(localStorage.getItem('user_filt')),'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia);
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
                        Estado
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
                                                                    useAssignSearch(
                                                                        ((mode==='assoc' | data.type_assign==='api') & (agent.id==="" | JSON.parse(localStorage.getItem('user_filt')).length==0)) 
                                                                            ? JSON.parse(localStorage.getItem('filt')) 
                                                                            : JSON.parse(localStorage.getItem('user_filt')),'',update,true,coincidence,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,[]);
                                                                }else{
                                                                    // Lo agrego
                                                                    let copy=prev_agencies;
                                                                    copy.push(e.target.value);
                                                                    setPrevAgencies(copy);
                                                                    useAssignSearch(
                                                                        ((mode==='assoc' | data.type_assign==='api') & (agent.id==="" | JSON.parse(localStorage.getItem('user_filt')).length==0)) 
                                                                            ? JSON.parse(localStorage.getItem('filt')) 
                                                                            : JSON.parse(localStorage.getItem('user_filt')),'',update,true,coincidence,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,copy);
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

                                                                useAssignSearch(
                                                                    ((mode==='assoc' | data.type_assign==='api') & (agent.id==="" | JSON.parse(localStorage.getItem('user_filt')).length==0)) 
                                                                        ? JSON.parse(localStorage.getItem('filt')) 
                                                                        : JSON.parse(localStorage.getItem('user_filt')),'',update,true,coincidence,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,new_copy);
                                                            }
                                                        
                                                        }}
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

            <div className="CardAssignCampain__footer">
                {
                    (transfer)
                    ?
                        <button
                            onClick={(e)=>{
                                const agent_origin=agent.id;
                                const dtsn=agent_dtsn;

                                const distribution=distributions;
                                let carga=charge;

                                // Copio lo que tiene el origen
                                distribution.map((dis)=>{
                                    if(Number(dis.agent_id)===Number(agent_origin)){

                                        let distribution=[];
                                        let pending=[];
                                        let inprocess=[];
                                        let processed=[];

                                        let ids=[];

                                        carga.map((car)=>{
                                            ids.push(car.id)
                                        });

                                        dis.distribution.map((item)=>{
                                            if(ids.includes(item.id)===false){
                                                distribution.push({
                                                    id:item.id,
                                                    cartera:item.cartera
                                                });
                                            }
                                        })

                                        dis.pending.map((item)=>{
                                            if(ids.includes(item.id)===false){
                                                pending.push({
                                                    id:item.id,
                                                    cartera:item.cartera
                                                });
                                            }
                                        })
                                        dis.inprocess.map((item)=>{
                                            if(ids.includes(item.id)===false){
                                                inprocess.push({
                                                    id:item.id,
                                                    cartera:item.cartera
                                                });
                                            }
                                        })
                                        dis.processed.map((item)=>{
                                            if(ids.includes(item.id)===false){
                                                processed.push({
                                                    id:item.id,
                                                    cartera:item.cartera
                                                });
                                            }
                                        })

                                        dis.distribution=distribution;
                                        dis.pending=pending;
                                        dis.inprocess=inprocess;
                                        dis.processed=processed;
                                        dis.total=distribution.length;
                                    }
                                });

                                //Actualizo el destino
                                distribution.map((dis)=>{
                                    if(Number(dis.agent_id)===Number(dtsn)){
                                        carga.map((cred)=>{
                                            dis.pending.push({
                                                id:cred.id,
                                                cartera:cred.cartera
                                            });
                                            dis.distribution.push({
                                                id:cred.id,
                                                cartera:cred.cartera
                                            });
                                        });

                                        dis.total+=Number(carga.length);
                                    }
                                });

                                e.target.textContent="Transfiriendo...";

                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/${data.id}`,{
                                    method:'PUT',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams({
                                        distributions:JSON.stringify(distribution),
                                        charge_inicial:JSON.stringify(distribution)
                                    })
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
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
                                        setDistributions(distribution);
                                        updateCredits(data.data);
                                        e.target.textContent="Transferir carga";
                                    });
                            }}
                        >
                            Transferir carga
                        </button>
                    :
                        <button
                            onClick={(e)=>{
                                
                                e.target.textContent="Asignando...";

                                //De toda la carga solo elijo los créditos que tienen el campo SEARCH: true
                                let results=charge;

                                let data_agent=[];

                                //Si no hay agente asignado, reparto toda la carga en partes iguales para todos los agentes que estén en la campaña
                                if(agent.id===''){
                                    let agents=JSON.parse(data.agents);

                                    const data_per_agent=chunckArrayInGroups(results,agents.length);
                                    
                                    data_per_agent.map((datap,n)=>{
                                        const distribution=distributions;

                                        // Créditos que no están asignados aún
                                        const no_self=[];

                                        // Créditos que ya se encuentran asignados
                                        const self=[];

                                        distribution.map((dis)=>{
                                            if(Number(dis.agent_id)===Number(agents[n].id)){
                                                datap.map((result)=>{
                                                    const [state,message]=useVerifyUnique({id_credit:result.id,agent_id:Number(agents[n].id),data_self:dis.distribution,mode:1});
                                                    
                                                    if(state){
                                                        no_self.push(result);
                                                    }else{
                                                        self.push(result);
                                                    }
                                                })
                                            }
                                        });

                                        // Ahora comprobamos que de los créditos no asignados a el agente mismo, no se encuentren asignados en otro agente
                                        // Créditos asignados a otros agentes
                                        const other_agent=[];

                                        // Créditos que se pueden asignar al agente actual
                                        const unique=[];
                                        const other_datas=[];

                                        distribution.map((dis)=>{
                                            if(Number(dis.agent_id)!==Number(agents[n].id)){
                                                other_datas.push(dis.distribution);
                                            }
                                        });

                                        no_self.map(result=>{
                                            const [state,message]=useVerifyUnique({id_credit:result.id,agent_id:Number(agents[n].id),data_self:other_datas,mode:2});
                                                    
                                            if(state){
                                                unique.push(result);
                                            }else{
                                                other_agent.push(result);
                                            }
                                        });

                                        if(self.length>0){
                                            if(other_agent.length>0){
                                                addNotification({
                                                    title: 'Créditos duplicados',
                                                    subtitle: `Se encontraron ${self.length} créditos ya asignados al agente y ${other_agent.length} créditos asignados a otros agentes.`,
                                                    message: `Se asignaron ${unique.length} créditos`,
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
                                                    title: 'Créditos duplicados',
                                                    subtitle: `Se encontraron ${self.length} créditos ya asignados al agente.`,
                                                    message: `Se asignaron ${unique.length} créditos`,
                                                    native: false,
                                                    backgroundTop: '#FF9619',
                                                    backgroundBottom: '#fdb864',
                                                    colorTop: 'white',
                                                    colorBottom: 'black',
                                                    closeButton: 'Cerrar',
                                                    duration: 8000,
                                                });
                                            }
                                        }else if(other_agent.length>0){
                                            addNotification({
                                                title: 'Créditos duplicados',
                                                subtitle: `Se encontraron ${other_agent.length} créditos asignados a otros agentes.`,
                                                message: `Se asignaron ${unique.length} créditos`,
                                                native: false,
                                                backgroundTop: '#FF9619',
                                                backgroundBottom: '#fdb864',
                                                colorTop: 'white',
                                                colorBottom: 'black',
                                                closeButton: 'Cerrar',
                                                duration: 8000,
                                            });
                                        }

                                        distribution.map((dis)=>{
                                            if(Number(dis.agent_id)===Number(agents[n].id)){
                                                unique.map(result=>{
                                                    dis.distribution.push({
                                                        id:result.id,
                                                        cartera:result.cartera
                                                    });
        
                                                    dis.pending.push({
                                                        id:result.id,
                                                        cartera:result.cartera
                                                    });
                                                });
                                            }
                                        });
                                        
                                        data_agent=distribution;
                                    });

                                }else{

                                    const distribution=distributions;
                                    // Créditos que no están asignados aún
                                    const no_self=[];

                                    // Créditos que ya se encuentran asignados
                                    const self=[];

                                    distribution.map((dis)=>{
                                        if(Number(dis.agent_id)===Number(agent.id)){
                                            results.map((result)=>{
                                                const [state,message]=useVerifyUnique({id_credit:result.id,agent_id:Number(agent.id),data_self:dis.distribution,mode:1});
                                                
                                                if(state){
                                                    no_self.push(result);
                                                }else{
                                                    self.push(result);
                                                }
                                            })
                                        }
                                    });

                                    // Ahora comprobamos que de los créditos no asignados a el agente mismo, no se encuentren asignados en otro agente
                                    // Créditos asignados a otros agentes
                                    const other_agent=[];

                                    // Créditos que se pueden asignar al agente actual
                                    const unique=[];
                                    const other_datas=[];

                                    distribution.map((dis)=>{
                                        if(Number(dis.agent_id)!==Number(agent.id)){
                                            other_datas.push(dis.distribution);
                                        }
                                    });

                                    no_self.map(result=>{
                                        const [state,message]=useVerifyUnique({id_credit:result.id,agent_id:Number(agent.id),data_self:other_datas,mode:2});
                                                
                                        if(state){
                                            unique.push(result);
                                        }else{
                                            other_agent.push(result);
                                        }
                                    });

                                    if(self.length>0){
                                        if(other_agent.length>0){
                                            addNotification({
                                                title: 'Créditos duplicados',
                                                subtitle: `Se encontraron ${self.length} créditos ya asignados al agente y ${other_agent.length} créditos asignados a otros agentes.`,
                                                message: `Se asignaron ${unique.length} créditos`,
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
                                                title: 'Créditos duplicados',
                                                subtitle: `Se encontraron ${self.length} créditos ya asignados al agente.`,
                                                message: `Se asignaron ${unique.length} créditos`,
                                                native: false,
                                                backgroundTop: '#FF9619',
                                                backgroundBottom: '#fdb864',
                                                colorTop: 'white',
                                                colorBottom: 'black',
                                                closeButton: 'Cerrar',
                                                duration: 8000,
                                            });
                                        }
                                    }else if(other_agent.length>0){
                                        addNotification({
                                            title: 'Créditos duplicados',
                                            subtitle: `Se encontraron ${other_agent.length} créditos asignados a otros agentes.`,
                                            message: `Se asignaron ${unique.length} créditos`,
                                            native: false,
                                            backgroundTop: '#FF9619',
                                            backgroundBottom: '#fdb864',
                                            colorTop: 'white',
                                            colorBottom: 'black',
                                            closeButton: 'Cerrar',
                                            duration: 8000,
                                        });
                                    }

                                    distribution.map((dis)=>{
                                        if(Number(dis.agent_id)===Number(agent.id)){
                                            unique.map(result=>{
                                                dis.distribution.push({
                                                    id:result.id,
                                                    cartera:result.cartera
                                                });
    
                                                dis.pending.push({
                                                    id:result.id,
                                                    cartera:result.cartera
                                                });
                                            });
                                        }
                                    });
                                    
                                    data_agent=distribution;

                                }

                                // Aquí debo comprobar que no se este asignando créditos que ya están asignados a otros agentes
                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains/${data.id}`,{
                                    method:'PUT',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams({
                                        distributions:JSON.stringify(data_agent),
                                        charge_inicial:JSON.stringify([])
                                    })
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        addNotification({
                                            title: 'Éxito',
                                            subtitle: 'Asignación correcta',
                                            message: '',
                                            native: false,
                                            backgroundTop: '#009793',
                                            backgroundBottom: '#459d9a',
                                            colorTop: 'white',
                                            colorBottom: 'white',
                                            closeButton: 'Cerrar',
                                            duration:3000,
                                        });
                                        setDistributions(data_agent);
                                        updateCredits(data.data);
                                        e.target.textContent="Asignar";
                                    });

                            }}
                        >Asignar</button>
                }
            </div>
        </div>
    );
}