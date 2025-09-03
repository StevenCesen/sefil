import { createContext, useEffect, useState } from "react";
import useSessions from "../hooks/useSessions";
import useLogout from "../hooks/useLogout";
import sendpush from "../helpers/sendpush";

const SessionContext=createContext();

function SessionContextProvider({children}){
    const [counter,setCounter]=useState(0);

    useEffect(()=>{

        if(useSessions()){
            let count=0;

            const timer=setInterval(() => {

                const current_time=new Date().getTime();

                if(Number(localStorage.getItem('temp_uS'))!==2 & Number(localStorage.getItem('temp_uS'))!==19){
                    if((current_time - localStorage.getItem('timestamp_cc'))>=840000 & localStorage.getItem('estado')==='CONECTADO' & (current_time - localStorage.getItem('timestamp_cc'))<=843000){
        
                        sendpush({
                            title:'Sesión por expirar.',
                            message:'Tu sesión se cerrará en un minuto por falta de actividad.',
                            type:'Push--warning',
                            timeout:5000
                        });

                    }else if((current_time - localStorage.getItem('timestamp_cc'))>=900000 & localStorage.getItem('estado')==='CONECTADO'){
                        useLogout(null);
                        sendpush({
                            title:'Sesión cerrada.',
                            message:'Tu sesión se cerró por falta de actividad.',
                            type:'Push--warning',
                            timeout:5000
                        });
                    }
                }

            }, 1000);

            document.addEventListener('click',(e)=>{
                count=0;
                localStorage.setItem('timestamp_cc',new Date().getTime());
            });
            
            return () => clearInterval(timer);
        }
        
    },[]);

    return (
        <SessionContext.Provider value={{}}>
            {children}
        </SessionContext.Provider>
    );
}

export {SessionContext,SessionContextProvider};