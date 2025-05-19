import { createContext, useEffect, useState } from "react";
import useReceiveState from "../hooks/useReceiveState";

const GestionContext=createContext();

function GestionContextProvider({children}){
    const [agents,setAgents]=useState();
    const [campains,setCampains]=useState();
    const [campain,setCampain]=useState();

    const returnData=(data)=>{
        return data;
    }

    useEffect(()=>{
        
        if(localStorage.getItem('rol')!==null & localStorage.getItem('rol')!==undefined){

            /**
             * ======================   SETEAMOS LAS CAMPAÑAS   ======================
             */
            fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    let camps=[];

                    data.data.map(campa=>{
                        if(campa.state==='ACTIVA'){
                            camps.push(campa);
                        }
                    });

                    setCampains(camps);

                    localStorage.setItem('filter_campain',camps[camps.length-1].name);
                    localStorage.setItem('campain_id',camps[camps.length-1].id);
                    setCampain(camps[camps.length-1]);
                });

            /**
             * ======================   SETEAMOS LOS AGENTES   ======================
             */
            fetch(`${import.meta.env.VITE_URL_BASE}/users/monitor?campain=${localStorage.getItem('campain_id')}&cartera=syncs`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setAgents(data);
                });

            /**
             * ======================   SETEAMOS EL MANEJADOR DE EVENTOS PUSHER   ======================
             */
            // useReceiveState(updateData())

        }else{
            setAgents([]);
            setCampains([]);
            setCampain([]);
        }

    },[]);

    if(!agents) return <></>
    if(!campains) return <></>
    if(!campain) return <></>

    return (
        <GestionContext.Provider value={{agents,campains,campain,setAgents}}>
            {children}
        </GestionContext.Provider>
    );
}

export {GestionContext,GestionContextProvider};