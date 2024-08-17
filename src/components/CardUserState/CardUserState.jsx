import { useEffect, useState } from "react";
import "./CardUserState.css";

export default function CardUserState({name,state,time,mode,data,name_campain}){

    const [calc_time,setContinue]=useState();
    const [times,setTime]=useState();

    const init = ({sec,min})=>{
        let second=sec;
        let minutos=min;
        // let second=times.second;
        // let minutos=times.minutes;
        
        setContinue(
            setInterval(() => {
                second++;
    
                if(second<60){
                    setTime({
                        ...times,
                        second:(second<10) ? `0${second}` : second,
                        minutes:(minutos<10) ? `0${minutos}` : minutos
                    });
                }else{
                    second=0;
                    minutos++;
                    
                    setTime({
                        ...times,
                        minutes:(minutos<10) ? `0${minutos}` : minutos,
                        second:(second<10) ? `0${second}` : second
                    })
                }
            }, 1000)
        )
    }

    useEffect(()=>{

        setTime({
            second:Number(time.split(':')[1]),
            minutes:Number(time.split(':')[0])
            // second:0,
            // minutes:0
        });

        init({
            sec:Number(time.split(':')[1]),
            min:Number(time.split(':')[0])
        });

        return () => clearInterval(calc_time);

    },[time]);

    if(!times) return <></>

    return (
        <div className={`CardUserState ${(mode==='complete') ? "CardUserState__complete" : ""}`}>
            <p>{name}</p>

            <p 
                className={`
                    CardUserState__state
                    ${
                        (state==='FUERA DE LÍNEA') 
                        ?  "CardUserState__state--disconnect"
                        : (state==='CONECTADO')
                            ? "CardUserState__state--connect"
                            : (state==='EN PAUSA'  | state==='EN RECESO' | state==='EN ALMUERZO' | state==='EN REUNIÓN')
                                ? "CardUserState__state--pause"
                                : "CardUserState__state--active"
                    
                    }
                `}
            >{state}</p>

            <p>{`${(state!=='FUERA DE LÍNEA') ? times.minutes+":"+times.second : " - "}`}</p>
            <p>{name_campain}</p>
            {
                (mode==='complete') 
                ?
                    <>
                        <p>{data.nro_credits}</p>
                        <p>{data.nro_gestions}</p>
                        <p>{data.nro_calls}</p>
                        <p>{data.nro_efec}</p>
                        <p>{data.nro_no_efec}</p>
                    </>
                : 
                    <></>
            }
        </div>
    );

}