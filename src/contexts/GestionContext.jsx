import { createContext, useEffect, useState } from "react";
import useReceiveState from "../hooks/useReceiveState";

const GestionContext=createContext();

function GestionContextProvider({children}){
    const [agents,setAgents]=useState();

    useEffect(()=>{
        if(localStorage.getItem('rol')==='administrador' | localStorage.getItem('rol')==='super'){
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/users`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    const data_prev=data;
                    let agents=[];
    
                    data_prev.map(agent=> {
                        agent.status='DESCONECTADO';
                        if(agent.name!=='EN ESPERA' & agent.name!=='Vanesa Rodriguez' & agent.name!=='Alexis Ortega' & agent.name!=='Patricio Paéz'){
                            agents.push(agent);
                        }
                    });
                    
                    setAgents(agents);
                });
        }else{
            setAgents([]);
        }

    },[]);

    if(!agents) return <></>

    return (
        <GestionContext.Provider value={{agents}}>
            {children}
        </GestionContext.Provider>
    );
}

export {GestionContext,GestionContextProvider};