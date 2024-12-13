import { useEffect, useState } from "react";
import "./CardSelectState.css";

export default function CardSelectState({mode,current_option}){
    
    const [current,setCurrent]=useState();
    const [view,setView]=useState(false);

    const options=[
        'CONECTADO',
        // 'FUERA DE LÍNEA',
        'EN RECESO',
        'EN ALMUERZO',
        'EN REUNIÓN'
    ];

    useEffect(()=>{
        console.log(mode)
        setView(false);
        setCurrent(current_option);

    },[current_option]);

    return (
        <div className="CardSelectState">
            {
                (mode==='select')
                ?  
                    <div className="CardSelectState__contentSelect">
                        <label
                            onClick={(e)=>{
                                setView(!view);
                            }}
                        >{current}</label>
                        {
                            (view)
                            ?
                                <div className="CardSelectState__select">
                                    {
                                        options.map((option,index)=>(
                                            <label 
                                                key={index}
                                                onClick={(e)=>{
                                                    setView(!view)
                                                    setCurrent(option);
                                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/users/broadcast/${localStorage.getItem('temp_uS')}?state=${option}`,{
                                                        headers: {
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        }
                                                    })
                                                        .then((response) => response.json())  
                                                        .then((data) => {
                                                            console.log(data);
                                                        });
                                                }}
                                            >{option}</label>
                                        ))
                                    }
                                </div>
                            :   <></>
                        }
                    </div>
                :   <></>
            }
        </div>
    );
}