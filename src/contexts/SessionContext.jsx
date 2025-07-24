import { createContext, useEffect, useState } from "react";
import useSessions from "../hooks/useSessions";
import useLogout from "../hooks/useLogout";
import Push from "../components/Push/Push";

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
                
                        Push({
                            title:'Sesión por expirar',
                            message:`Tu sesión se cerrará en un minuto por falta de actividad.`,
                            timeout:5000,
                            type:300
                        });

                    }else if((current_time - localStorage.getItem('timestamp_cc'))>=900000 & localStorage.getItem('estado')==='CONECTADO'){
                        useLogout(null);
                        addNotification({
                            title: 'Sesión cerrada',
                            subtitle: `Tu sesión se cerró por falta de actividad`,
                            message: ``,
                            native: false,
                            backgroundTop: '#FF9619',
                            backgroundBottom: '#fdb864',
                            colorTop: 'white',
                            colorBottom: 'black',
                            closeButton: 'Cerrar',
                            duration: 5000,
                        });

                        Push({
                            title:'Sesión cerrada',
                            message:`Tu sesión se cerró por falta de actividad.`,
                            timeout:5000,
                            type:400
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