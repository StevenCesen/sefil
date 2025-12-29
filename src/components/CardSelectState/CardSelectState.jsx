import { useEffect, useState } from "react";
import "./CardSelectState.css";
import sendpush from "../../helpers/sendpush";

export default function CardSelectState({mode,current_option}){
    
    const [current,setCurrent]=useState();
    const [view,setView]=useState(false);

    const options=[
        'CONECTADO',
        'EN RECESO',
        'EN ALMUERZO',
        'EN REUNIÓN',
        'EN REVISIÓN'
    ];
    
    useEffect(()=>{
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
                                                    localStorage.setItem('estado',option);

                                                    setView(!view);
                                                    setCurrent(option);
                                                    fetch(`${import.meta.env.VITE_URL_BASE}/users/${localStorage.getItem('temp_uS')}`,{
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        },
                                                        body: JSON.stringify({
                                                            status: option
                                                        })
                                                    })
                                                        .then((response) => response.json())
                                                        .then((data) => {
                                                            sendpush({
                                                                title:'Estado',
                                                                message:'Tu estado ha cambiado',
                                                                type:'Push--sucessful',
                                                                timeout:3000
                                                            });
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