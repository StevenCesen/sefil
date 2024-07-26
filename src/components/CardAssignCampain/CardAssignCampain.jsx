import { useState } from "react";
import "./CardAssignCampain.css";
import { useEffect } from "react";
import FilterRange from "../FilterRange/FilterRange";
import useAssignSearch from "../../hooks/useAssignSearch";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import CardItemCharge from "../CardItemCharge/CardItemCharge";


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
        useAssignSearch((mode==='assoc') ? JSON.parse(localStorage.getItem('filt')) : JSON.parse(localStorage.getItem('user_filt')),'',update,true,coincidence,copy.mora,copy.cuota,copy.monto,copy.estado,copy.agencia);
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
            estado:'Cartera Vendida',
            agencia:[]
        });

        fetch("https://sefil.softsen.space/public/api/bussines",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
            });
    },[]);

    if(!business) return <></>
    if(!charge) return <></>
    if(!distributions) return <></>

    return (
        <div className="CardAssignCampain">
            <p className="CardAssignCampain__head">Asignación de campaña | {data.name}</p>
            
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
                            
                                                        const credits=distributions;
                            
                                                        credits.map((items)=>{
                                                            if(items.agent_id===Number(agent.id)){
                                                                localStorage.setItem('user_filt',JSON.stringify(items.distribution));
                                                                setCharge(items.distribution);
                                                                setViewAgents(false);
                                                            }
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
                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"assoc"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(false);
                            }
                        }}
                    />
                    Asociar cartera
                    {
                        (mode==='assoc')
                        ?
                            <select
                                onChange={(e)=>{
                                    if(e.target.value!==""){
                                        fetch(`https://sefil.softsen.space/public/api/credit/all?cartera=${e.target.value}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                setCharge(data)
                                                // Cacheo los créditos de cartera por si se necesitan para filtrado
                                                localStorage.setItem('filt',JSON.stringify(data));
                                            });
                                    }
                                }}
                            >
                                <option value={""}>--Seleccionar--</option>
                                {
                                    business.map((cartera,index)=>(
                                        <option key={index} value={cartera.name}>{cartera.name}</option>
                                    ))
                                }
                            </select>
                        :   <></>
                    }
                </label>

                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"transfer"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(true);
                            }
                        }}
                    />
                    Transferir carga
                </label>
            </div>
            
            <label 
                className="CardAssignCampain__file">
                Cargar datos ({charge.length})
                {/* <input id="campain" type="file"/> */}
                {
                    // (charge.length>0)
                    // ?
                        <>
                            <input 
                                onChange={(e)=>{
                                    useAssignSearch(
                                        (mode==='assoc') ? JSON.parse(localStorage.getItem('filt')) : JSON.parse(localStorage.getItem('user_filt')), // Esta es la data que le pasamos para que filtre
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
                                placeholder="Ingrese nombre o cédula"
                            />
                            {/* <button>Limpiar</button> */}
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
                                useAssignSearch((mode==='assoc') ? JSON.parse(localStorage.getItem('filt')) : JSON.parse(localStorage.getItem('user_filt')),'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia);
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
                                useAssignSearch((mode==='assoc') ? JSON.parse(localStorage.getItem('filt')) : JSON.parse(localStorage.getItem('user_filt')),'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia);
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
                            <option value={"Cartera Vendida"}>Vencido</option>
                            <option value={"Vigente"}>Vigente</option>
                            <option value={"JUDICIAL"}>Judicial</option>
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
                                                                // Lo agrego
                                                                let copy=prev_agencies;
                                                                copy.push(e.target.value);
                                                                setPrevAgencies(copy);
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
                                                            }

                                                            useAssignSearch((mode==='assoc') ? JSON.parse(localStorage.getItem('filt')) : JSON.parse(localStorage.getItem('user_filt')),'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,prev_agencies);
                                                        
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
                                let carga=[];

                                // Copio lo que tiene el origen
                                distribution.map((dis)=>{
                                    if(Number(dis.agent_id)===Number(agent_origin)){
                                        carga=dis.distribution;
                                        dis.distribution=[];
                                        dis.pending=[];
                                        dis.inprocess=[];
                                        dis.processed=[];
                                        dis.total=0;
                                    }
                                });

                                //Actualizo el destino
                                distribution.map((dis)=>{
                                    if(Number(dis.agent_id)===Number(dtsn)){
                                        carga.map((cred)=>{
                                            dis.pending.push(cred);
                                            dis.distribution.push(cred);
                                        });

                                        dis.total+=Number(carga.length);
                                    }
                                });

                                e.target.textContent="Transfiriendo...";

                                fetch(`https://sefil.softsen.space/public/api/campains/${data.id}`,{
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
                                        setDistributions(distribution);
                                        updateCredits(data.data);
                                        e.target.textContent="Transferencia correcta";
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
                                    console.log(agents)

                                    const data_per_agent=chunckArrayInGroups(results,agents.length);

                                    console.log(data_per_agent);

                                    data_per_agent.map((datap,n)=>{

                                        const distribution=distributions;

                                        distribution.map((dis)=>{
                                            if(Number(dis.agent_id)===Number(agents[n].id)){
                                                datap.map((result)=>{
                                                    dis.distribution.push(result);
                                                    dis.pending.push(result);
                                                })

                                                dis.total+=datap.length;
                                                data_agent.push(dis);
                                            }
                                        });
                                    });  

                                }else{

                                    const distribution=distributions;

                                    distribution.map((dis)=>{
                                        if(Number(dis.agent_id)===Number(agent.id)){
                                            results.map((result)=>{
                                                dis.distribution.push(result);
                                                dis.pending.push(result);
                                            })
                                        }
                                    });

                                    data_agent=distribution;
                                }

                                // Aquí debo comprobar que no se este asignando créditos que ya están asignados a otros agentes
                                console.log(data_agent);

                                fetch(`https://sefil.softsen.space/public/api/campains/${data.id}`,{
                                    method:'PUT',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams({
                                        distributions:JSON.stringify(data_agent),
                                        charge_inicial:JSON.stringify(charge)
                                    })
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        setDistributions(data_agent);
                                        updateCredits(data.data);
                                        e.target.textContent="Asignado";
                                    });

                            }}
                        >Asignar</button>
                }
            </div>
        </div>
    );
}