import { useState } from "react";
import "./CardAssignCampain.css";
import { useEffect } from "react";
import FilterRange from "../FilterRange/FilterRange";
import useAssignSearch from "../../hooks/useAssignSearch";
import useFormatterNumber from "../../hooks/useFormatterNumber";

export default function CardAssignCampain({data}){

    const [transfer,setTransfer]=useState(false);
    const [mode,setMode]=useState('manual');
    const [view_agencies,setView]=useState(false);
    const [business,setBusiness]=useState();
    const [charge,setCharge]=useState();
    const [agent,setAgents]=useState();
    const [distributions,setDistributions]=useState();
    const [item_filter,setItems]=useState();
    const [coincidence,setCoincidence]=useState();

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

    const updateRange=(key,value)=>{
        let copy=item_filter;

        copy[key]=value;
        setItems(item_filter);

        useAssignSearch(charge,'',update,true,coincidence,copy.mora,copy.cuota,copy.monto,copy.estado,copy.agencia);
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
        setAgents('');
        setDistributions(JSON.parse(data.distributions));
        setCharge([]);
        setCoincidence('1');
        setItems({
            filter:false,
            mode:'',
            mora:'',
            cuota:'',
            monto:'',
            estado:'',
            agencia:''
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
                    <select
                        onChange={(e)=>{
                            setAgents(e.target.value);
                            fetch(`https://sefil.softsen.space/public/api/gestion/campains?id=${e.target.value}`,{
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    const credits=JSON.parse(data[0].distributions);
                                    credits.map((items)=>{
                                        if(items.agent_id===e.target.value){
                                            setCharge({
                                                ...charge,
                                                data:items.distribution,
                                                total:items.distribution.length
                                            });
                                        }
                                    });
                                });
                        }}
                        value={agent}
                    >
                        <option value={""}>--Seleccionar--</option>
                        {
                            JSON.parse(data.agents).map((agent,index)=>(
                                <option 
                                    key={index}
                                    value={agent.id}
                                >{agent.name}</option>
                            ))
                        }
                    </select>
                </label>
                {
                    (transfer & mode!=='assoc')
                    ?   
                        <>
                            <p>a</p>
                            <label>
                                Agente
                                <select>
                                    <option value={"Cecibel Torres"}>Cecibel Torres</option>
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
                        value={"manual"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(false);
                            }
                        }}
                    />
                    Manual
                </label>

                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"assoc"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
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
                                                data.map((credit)=>{
                                                    credit.search=true;
                                                });

                                                setCharge(data)
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
                Cargar datos ({calcTotal(charge)})
                {/* <input id="campain" type="file"/> */}
                {
                    (charge.length>0)
                    ?
                        <input 
                            onChange={(e)=>{
                                // DATA, VALOR A BUSCAR, FUNCION DE ACTUALIZACIÓN, FILTER_MODO,MODO, DIAS_MORA, CUOTAS, MONTO, ESTADO, AGENCIA
                                useAssignSearch(
                                    charge,
                                    e.target.value,
                                    update,
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
                    :   <></>
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
                                    <label>Cuotas penientes</label>
                                    <label>Días mora</label>
                                    <label>Estado</label>
                                </div>
                                {
                                    charge.map((credit,index)=>(
                                        (credit.search===true)
                                        ?
                                            <div className="CardAssignCampain__itemCharge">
                                                <input 
                                                    type="checkbox"
                                                    checked={credit.select}
                                                />
                                                <label>{credit.name}</label>
                                                <label>{credit.ci}</label>
                                                <label>{credit.credito}</label>
                                                <label>{useFormatterNumber({value:credit.totalAmount,currency:'USD'})}</label>
                                                <label>{credit.pendingFees}</label>
                                                <label>{credit.dias_vencidos}</label>
                                                <label>{credit.collectionState}</label>
                                            </div>
                                        :   <></>
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
                                useAssignSearch(charge,'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia);
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
                                useAssignSearch(charge,'',update,true,e.target.value,item_filter.mora,item_filter.cuota,item_filter.monto,item_filter.estado,item_filter.agencia);
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
                        <select>
                            <option>Vencido</option>
                            <option>Vigente</option>
                            <option>Judicial</option>
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
                                        <label>
                                            
                                            <input
                                                type="checkbox"
                                            />
                                            OFICINA LOJA CENTRO
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                            />
                                            OFICINA LAS PITAS
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                            />
                                            GUALAQUIZA
                                        </label>
                                    </div>
                                :   <></>
                            }
                        </div>
                    </label>
                </div>

            </div>

            <div className="CardAssignCampain__footer">
                <button
                    onClick={(e)=>{
                        
                        e.target.textContent="Asignando...";

                        //De toda la carga solo elijo los créditos que tienen el campo SEARCH: true
                        let results=[];
                        charge.map((credit)=>{
                            if(credit.search){
                                results.push(credit);
                            }
                        });

                        let data_agent=[];

                        //Si no hay agente asignado, reparto toda la carga en partes iguales para todos los agentes que estén en la campaña
                        if(agent===''){
                            let agents=JSON.parse(data.agents);

                            const data_per_agent=chunckArrayInGroups(results,JSON.parse(data.agents).length);

                            data_per_agent.map((data,n)=>{
                                data_agent.push({
                                    agent_id:agents[n].id,
                                    total:data.length,
                                    distribution:data,
                                    pending:data, //Créditos que no están gestionados
                                    processed:[], //Créditos que ya han sido gestionados
                                    inprocess:[] //Créditos que se hicieron llamadas pero fueron no efectivas, es decir, si no es CONTACTADO se puede seguir al siguiente crédito sin guardar gestión
                                });
                            });  

                        }else{
                            const distribution=JSON.parse(data.distributions);
                            
                            // console.log(data)
                            // console.log(agent);
                            // console.log(results);

                            distribution.map((dis)=>{
                                if(Number(dis.agent_id)===Number(agent)){
                                    dis.distribution=results;
                                    dis.pending=results;
                                }
                            });

                            data_agent=distribution;
                        }
                        
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
                                e.target.textContent="Asignado";
                            });

                    }}
                >Asignar</button>
            </div>
        </div>
    );
}