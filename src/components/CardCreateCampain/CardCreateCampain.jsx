import { useEffect, useState } from "react";
import "./CardCreateCampain.css"
import addNotification from "react-push-notification";

export default function CardCreateCampain({setData}){

    const [campain,setCampain]=useState({
        name:"",
        fecha_init:"",
        fecha_finish:"",
        data:[],
        cartera:""
    });

    const [agents,setAgents]=useState();
    const [business,setBusiness]=useState();
    const [new_business,setNew]=useState();

    useEffect(()=>{
        setCampain({
            name:"",
            fecha_init:"",
            fecha_finish:"",
            data:[],
            cartera:"SEFIL_1",
            type_assign:'manual'
        });

        setNew(false);
        
        //Bajamos los agentes
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/users/agents`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {

                const data_prev=data;

                data_prev.map(agent=> {
                    agent.status=false
                });

                setAgents(data_prev);
            });
        
        //Bajamos las carteras
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
    },[]);

    if(!agents) return <></>
    if(!business) return <></>
    if(!campain) return <></>

    return (
        <div className="CardCreateCampain">
            <p>Crear campaña</p>

            <label className="CardCreateCampain__input">
                Nombre
                <input
                    value={campain.name} 
                    onChange={(e)=>{
                        setCampain({
                            ...campain,
                            name:e.target.value
                        })
                    }}
                    type="text" 
                    placeholder="Escribe aquí"
                />
            </label>

            <div className="CardCreateCampain__agents">
                <label>Agentes</label>
                <div className="CardCreateCampain__content">

                    {
                        agents.map((agent,index)=>(
                            <label key={index}>
                                <input 
                                    key={index}
                                    onChange={(e)=>{
                                        const data_prev=agents;
                    
                                        data_prev.map(agent_actual=> {
                                            if(agent.id===agent_actual.id){
                                                agent_actual.status=e.target.checked;   
                                            }
                                        });
                                        setAgents(data_prev);
                                    }}

                                    value={agent.id}
                                    type="checkbox"
                                    
                                />
                                {agent.name}
                            </label>
                        ))
                    }

                </div>
            </div>

            <div className="CardCreateCampain__form">
                <label className="CardCreateCampain__select">
                    Empresa
                    <select
                        value={campain.cartera}
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                cartera:e.target.value
                            });
                            
                            if(e.target.value==="OTRA"){
                                setNew(true);
                            }else{
                                setNew(false);
                            }
                        }}
                    >
                        {
                            business.map((bus,index)=>(
                                (bus.name!=='CARTERA VENDIDA')
                                ?
                                    <option key={index} value={bus.name}>{bus.name}</option>
                                : <></>
                            ))
                        }
                        <option value={"OTRA"}>--OTRA EMPRESA--</option>
                    </select>
                    {
                        (new_business)
                        ?   
                            <label>
                                Nueva empresa
                                <input 
                                    type="text" 
                                    value={campain.cartera}
                                    onChange={(e)=>{
                                        setCampain({
                                            ...campain,
                                            cartera:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        :   <></>
                    }
                </label>

                <label className="CardCreateCampain__select">
                    Cargar datos
                    <select
                        value={campain.type_assign}
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                type_assign:e.target.value
                            });
                        }}
                    >
                        <option value={"manual"}>Carga manual</option>
                        <option value={"api"}>Sincronización | Web Service</option>
                    </select>
                </label>

                <label className="CardCreateCampain__input">
                    Fecha de inicio
                    <input
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                fecha_init:e.target.value
                            })
                        }}
                        value={campain.fecha_init} 
                        type="date"/>
                </label>
                
                <label className="CardCreateCampain__input">
                    Fecha de fin
                    <input 
                        onChange={(e)=>{
                            setCampain({
                                ...campain,
                                fecha_finish:e.target.value
                            })
                        }}
                        value={campain.fecha_finish} 
                        type="date"
                    />
                </label>
            </div>

            <div className="CardCreateCampain__footer">
                <button 
                    onClick={(e)=>{
                        
                        e.target.textContent='Creando campaña...';
                        const agents_select=[];
                        const distributions=[];

                        agents.map(agent=>{
                            if(agent.status){
                                agents_select.push({
                                    id:agent.id,
                                    name:agent.name
                                });

                                distributions.push({
                                    agent_id:agent.id,
                                    total:0,
                                    distribution:[],
                                    pending:[],
                                    processed:[],
                                    inprocess:[]
                                });
                            }
                        });

                        const data={
                            agents:JSON.stringify(agents_select),
                            name:campain.name,
                            cartera:campain.cartera,
                            fecha_init:campain.fecha_init,
                            fecha_finish:campain.fecha_finish,
                            distributions:JSON.stringify(distributions),
                            charge_inicial:JSON.stringify([]),
                            type_assign:campain.type_assign
                        };

                        console.log(data)

                        if(campain.name!=='' & campain.fecha_init!='' & campain.fecha_finish!=''){
                            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/campains`,{
                                method:'POST',
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                },
                                body:new URLSearchParams(data)
                            })
                                .then((response) => response.json())  
                                .then((data) => {
    
                                    e.target.textContent='Campaña creada';
    
                                    setData(data.data);
                                    setCampain({
                                        name:"",
                                        fecha_init:"",
                                        fecha_finish:"",
                                        data:[],
                                        cartera:"SEFIL_1",
                                        type_assign:"manual"
                                    });
    
                                });

                            addNotification({
                                title: 'Éxito',
                                subtitle: 'Campaña creada correctamente',
                                message: '',
                                native: false,
                                backgroundTop: '#009793',
                                backgroundBottom: '#459d9a',
                                colorTop: 'white',
                                colorBottom: 'white',
                                closeButton: 'Cerrar',
                                duration:3000,
                            });

                        }else{
                            e.target.textContent='Guardar';

                            addNotification({
                                title: 'Datos imcompletos',
                                subtitle: 'Por favor, llene todos los datos de la nueva campaña',
                                message: '',
                                native: false,
                                backgroundTop: '#FF9619',
                                backgroundBottom: '#fdb864',
                                colorTop: 'white',
                                colorBottom: 'white',
                                closeButton: 'Cerrar',
                                duration: 3000,
                            });
                            
                        }
                    }}

                    className="CardCreateCampain__button CardCreateCampain__button--save"

                >Guardar</button>
            </div>
        </div>
    );
}