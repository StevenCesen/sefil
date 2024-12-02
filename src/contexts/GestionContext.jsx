import { createContext, useEffect, useState } from "react";
import useReceiveState from "../hooks/useReceiveState";

const GestionContext=createContext();

function GestionContextProvider({children}){
    const [agents,setAgents]=useState();

    const updateState=(data)=>{
        setAgents(data);
    }

    useEffect(()=>{
        if(localStorage.getItem('rol')==='administrador' | localStorage.getItem('rol')==='super' | localStorage.getItem('rol')==='call'){
            // if(localStorage.getItem('permission').split(',').includes("Cobranza:all")){
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
                            if(agent.name!=='EN ESPERA' & agent.name!=='Vanesa Rodriguez'){
                                agents.push(agent);
                            }
                        });
                        
                        setAgents(agents);
                    });
    
                useReceiveState(updateState);
            // }

        }else{
            setAgents([]) 
        }       

    },[]);

    if(!agents) return <></>

    return (
        <GestionContext.Provider value={{agents,updateState}}>
            {children}
        </GestionContext.Provider>
    );
}

export {GestionContext,GestionContextProvider};