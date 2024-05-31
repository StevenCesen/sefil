import { useState } from "react";
import "./CardAssignCampain.css";
import { useEffect } from "react";
import FilterRange from "../FilterRange/FilterRange";

export default function CardAssignCampain({data}){

    const [transfer,setTransfer]=useState(false);
    const [mode,setMode]=useState('manual');
    const [view_agencies,setView]=useState(false);
    const [business,setBusiness]=useState();
    const [charge,setCharge]=useState();
    const [agent,setAgents]=useState();
    const [distributions,setDistributions]=useState();

    useEffect(()=>{
        setMode('manual');
        setTransfer(false);
        setView(false);
        setAgents('');
        setDistributions(JSON.parse(data.distributions));
        setCharge({
            current_page:1,
            data:[],
            first_page_url:'',
            from:1,
            last_page:0,
            last_page_url:'',
            links:[],
            next_page_url:'',
            path:'',
            per_page:0,
            prev_page_url:'',
            to:0,
            total:0,
            acumulado:0,
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
            <p className="CardAssignCampain__head">Asignación de campaña</p>
            
            <div className="CardAssignCampain__agents">
                <label>
                    Agente
                    <select
                        onChange={(e)=>{
                            setAgents(e.target.value)
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
                                        fetch(`https://sefil.softsen.space/public/api/credit?cartera=${e.target.value}&estado=Cancelado`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
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
                Cargar datos ({charge.total})
                {/* <input id="campain" type="file"/> */}
                <div>
                    {
                        (charge.total>0)
                        ?   
                            <>
                                <div className="CardAssignCampain__headCharge">
                                    <input 
                                        type="checkbox"
                                        onChange={(e)=>{
                                            const prev_charge=charge.data;

                                            if(e.target.checked){
                                                prev_charge.map((credit)=>{
                                                    credit.select=true;
                                                })
                                            }else{
                                                prev_charge.map((credit)=>{
                                                    credit.select=false;
                                                })
                                            }
                                            
                                            setCharge({
                                                ...charge,
                                                data:prev_charge
                                            });

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
                                    charge.data.map((credit,index)=>(
                                        <div className="CardAssignCampain__itemCharge">
                                            <input 
                                                type="checkbox"
                                                checked={credit.select}
                                            />
                                            <label>{credit.name}</label>
                                            <label>{credit.ci}</label>
                                            <label>{credit.credito}</label>
                                            <label>{credit.totalAmount}</label>
                                            <label>{credit.pendingFees}</label>
                                            <label>{credit.dias_vencidos}</label>
                                            <label>{credit.collectionState}</label>
                                        </div>
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
                        name="mode"
                        value={"manual"}
                        onChange={(e)=>{
                            if(e.target.checked){
                            
                            }
                        }}
                    />
                    Coincidir
                </label>

                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"transfer"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                
                            }
                        }}
                    />
                    No coincidir
                </label>
            </div>

            <div className="CardAssignCampain__filters">
                
                <div className="CardAssignCampain__ranges">
                    <FilterRange
                        title={"Días de mora"}
                    />
                    <FilterRange
                        title={"Cuotas pendientes"}
                    />
                    <FilterRange
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

                        const dates={
                            agent_id:agent,
                            total:charge.data.length,
                            distribution:charge.data
                        };

                        const copy_distributions=distributions;

                        copy_distributions.push(dates);
                        
                        fetch(`https://sefil.softsen.space/public/api/campains/${data.id}`,{
                            method:'PUT',
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            },
                            body:new URLSearchParams({distributions:JSON.stringify(copy_distributions)})
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