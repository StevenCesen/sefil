import { createContext, useEffect, useState } from "react";

const GestionContext=createContext();

function GestionContextProvider({children}){
    const [credits,setPushes]=useState();
    const [credit,setCredit]=useState();

    const addCredits=(data)=>{
        setPushes(data);
    }

    const updateDataPush=(data)=>{
        setPushes(data)
    }

    const searchCredit=(id)=>{
        credits.map(credit=>{
            if(Number(id)===Number(credit.id)){
                setCredit(credit)
                // return credit;
            }
        })
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

        if(localStorage.getItem('rol')==='gestor'){
            fetch(`https://sefil.softsen.space/public/api/gestion/campains?id=${localStorage.getItem('temp_uS')}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    
                    const credits_gen=JSON.parse(data[0].distributions);

                    credits_gen.map((items)=>{
                        if(items.agent_id===localStorage.getItem('temp_uS')){
                            setPushes(items.distribution);
                        }
                    });
                });
        }else{
            setPushes([])
        }

    },[]);

    if(!credits) return <></>

    return (
        <GestionContext.Provider value={{credits,credit,addCredits,searchCredit,removePush}}>
            {children}
        </GestionContext.Provider>
    );
}

export {GestionContext,GestionContextProvider};