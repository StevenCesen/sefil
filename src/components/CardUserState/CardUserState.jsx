import { useEffect, useState } from "react";
import "./CardUserState.css";

export default function CardUserState({name,state,time,mode,data,name_campain}){

    const [calc_time,setContinue]=useState();
    const [times,setTime]=useState();

    const init = ({hour,sec,min})=>{
        let second=sec;
        let minutos=min;
        let hours=hour;
        // let second=times.second;
        // let minutos=times.minutes;
        
        setContinue(
            setInterval(() => {
                second++;
    
                if(second<60){

                    setTime({
                        second:(second<10) ? `0${second}` : second,
                        minutes:(minutos<10) ? `0${minutos}` : minutos,
                        hour:(hours<10) ? `0${hours}` : hours
                    });

                }else if(minutos<59){
                    second=0;
                    minutos++;
                    
                    setTime({
                        minutes:(minutos<10) ? `0${minutos}` : minutos,
                        second:(second<10) ? `0${second}` : second,
                        hour:(hours<10) ? `0${hours}` : hours
                    });
                }else if(hours<24){
                    second=0;
                    minutos=0;
                    hours++;

                    setTime({
                        minutes:(minutos<10) ? `0${minutos}` : minutos,
                        second:(second<10) ? `0${second}` : second,
                        hour:(hours<10) ? `0${hours}` : hours
                    });
                }else{
                    second=0;
                    minutos=0;
                    hours=0;
                }
            }, 1000)
        )
    }

    useEffect(()=>{

        

        // setTime({
        //     second:Number(time.split(':')[2]),
        //     minutes:Number(time.split(':')[1]),
        //     hour:Number(time.split(':')[0])
        //     // second:0,
        //     // minutes:0
        // });

        init({
            sec:Number(time.split(':')[2]),
            min:Number(time.split(':')[1]),
            hour:Number(time.split(':')[0])
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
                        ?   "CardUserState__state--disconnect"
                        :   (state==='CONECTADO')
                            ?   "CardUserState__state--connect"
                            :   (state==='EN PAUSA'  | state==='EN RECESO' | state==='EN ALMUERZO' | state==='EN REUNIÓN')
                                ?   "CardUserState__state--pause"
                                :   "CardUserState__state--active"
                    }
                `}
            >{state}</p>

            <p>{`${(state!=='FUERA DE LÍNEA') ? times.hour+":"+times.minutes+":"+times.second : " - "}`}</p>
            <p>{name_campain}</p>
            {
                (mode==='complete') 
                ?
                    <>
                        <p>{data.nro_credits}</p>
                        <p>{data.nro_gestions}</p>
                        <p>{data.nro_gestions_efec}</p>
                        <p>{data.nro_pendientes}</p>
                        <p>{data.nro_proceso}</p>
                        <p>{data.nro_calls}</p>
                    </>
                : 
                    <></>
            }
        </div>
    );

}