import { useEffect, useState } from "react";
import "./CardUserState.css";

export default function CardUserState({name,state,time,mode,data,name_campain}){

    const [calc_time,setContinue]=useState();
    const [times,setTime]=useState({
        second:Number(0),
        minutes:Number(0),
        hour:Number(0)
    });

    const init = ({hour,sec,min})=>{
        let second=sec;
        let minutos=min;
        let hours=hour;

        setTime({
            second:Number(0),
            minutes:Number(0),
            hour:Number(0)
        });
        
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
    }

    useEffect(()=>{

        let second=Number(time.split(':')[2]);
        let minutos=Number(time.split(':')[1]);
        let hours=Number(time.split(':')[0]);
        
        const timer=setInterval(() => {
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

        return () => clearInterval(timer);
    
    },[state]);

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
            {/* <p>{name_campain}</p> */}
            {
                (mode==='complete')
                ?
                    <>
                        <p>{data.nro_credits}</p>
                        <p>{data.nro_gestions}</p>
                        <p>{data.nro_gestions_dia}</p>
                        <p>{data.nro_gestions_efec}</p>
                        <p>{data.nro_gestions_efec_dia}</p>
                        <p>{data.nro_pendientes}</p>
                        <p>{data.nro_proceso}</p>
                        <p>{data.nro_calls_acum}</p>
                        <p>{data.nro_calls}</p>
                    </>
                :
                    <></>
            }
        </div>
    );

}