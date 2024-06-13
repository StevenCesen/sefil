import { useEffect, useState } from "react";
import "./CardSelectState.css";

export default function CardSelectState({mode,current_option}){
    
    const [current,setCurrent]=useState();
    const [view,setView]=useState(false);
    const options=[
        'DISPONIBLE',
        'DESCONECTADO',
        'EN PAUSA',
        'EN LLAMADA',
        'EN RECESO',
        'EN REUNIÓN'
    ];

    useEffect(()=>{
        setView(false);
        setCurrent(current_option);
    },[]);

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
                                                    setCurrent(option);
                                                    fetch(`https://sefil.softsen.space/public/api/users/broadcast/${localStorage.getItem('temp_uS')}?state=${option}`,{
                                                        headers: {
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        }
                                                    })
                                                        .then((response) => response.json())  
                                                        .then((data) => {
                                                            console.log(data)
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