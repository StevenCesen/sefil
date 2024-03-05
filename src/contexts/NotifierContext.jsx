import { createContext, useEffect, useState } from "react";
import useNotification from "../hooks/useNotification";

const NotifierContext=createContext();

function NotifierContextProvider({children}){
    const [data_push,setPushes]=useState();

    const updateDataPush=(data)=>{
        setPushes(data)
    }

    const removePush=(id)=>{
        let pushes=JSON.parse(localStorage.getItem('pusher'));
        let new_pushes=[];

        pushes.map((push,index)=>{
            if(Number(push.message.id)!==Number(id)){
                new_pushes.push(push);
            }
        });

        localStorage.setItem('pusher',JSON.stringify(new_pushes));
        setPushes(JSON.parse(localStorage.getItem('pusher')));
    }

    useEffect(()=>{

        if(localStorage.getItem('token')!==''){
            if(localStorage.getItem('rol')==='administrador'){
                
                useNotification(updateDataPush);

                if(localStorage.getItem('pusher')!==null){
                    setPushes(JSON.parse(localStorage.getItem('pusher')));
                }else{
                    setPushes([])
                }

            }else{
                setPushes([])
            }
        }else{
            setPushes([])
        }

    },[]);

    if(!data_push) return <></>

    return (
        <NotifierContext.Provider value={{data_push,updateDataPush,removePush}}>
            {children}
        </NotifierContext.Provider>
    );
}

export {NotifierContext,NotifierContextProvider};