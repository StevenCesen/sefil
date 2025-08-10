import { useEffect, useState } from "react";
import "./CardCall.css"
import useBlobToBase64 from "../../hooks/useBlobToBase64";
import sendpush from "../../helpers/sendpush";

const states_call=[
    'NO CONTACTADO',
    'CONTACTADO',
    'SUSPENDIDO POR FALTA DE PAGO',
    'NÚMERO NO EXISTE',
    'FUERA DE COBERTURA'
];

export default function CardDial({change,phone,channel,id_credit,cartera,id_campain,setCancel,addCall,addStates,setInit}){
    
    const [data_call,setDataCall]=useState();
    const [time,setTime]=useState();
    const [call_state,setState]=useState();
    const [continue_call,setContinue]=useState();
    const [status_call,setStatusCall]=useState();
    const [record,setRecord]=useState({});
    const [whats_call,setWhatCall]=useState();

    const [number_in,setIn]=useState();

    const init = ()=>{
        let second=0;
        let minutos=0;
        
        setContinue(
            setInterval(() => {
                if(localStorage.getItem('state_call')=="true"){
                    second++;

                    if(second<60){
                        setTime({
                            ...time,
                            second:(second<10) ? `0${second}` : second,
                            minutes:(minutos<10) ? `0${minutos}` : minutos
                        });
                    }else{
                        second=0;
                        minutos++;
                        
                        setTime({
                            ...time,
                            minutes:(minutos<10) ? `0${minutos}` : minutos,
                            second:(second<10) ? `0${second}` : second
                        })
                    }
                }
            }, 1000)
        );
    }

    const status=(recorder)=>{
        setInterval(async () => {
            if(localStorage.getItem('state_call')=="true"){
                const request=await fetch(`status_channel.php?channel=${channel}&exten=${(number_in==="") ? phone.nro : number_in}`);
                const response=await request.json();
                
                if('destino' in response){
                    if(response.destino==='Up'){
                        localStorage.setItem('progreso','(En conversación)');
                    }else{
                        localStorage.setItem('progreso','(Llamando)');
                    }
                }

                if(response.estado=='Busy'){
                    
                    try {
                        const hangup=await fetch(`hangup.php?exten=${(number_in==="") ? phone.nro : number_in}&channel=${channel}`);
                        const respo=await hangup.json();
                    } catch (error) {
                        recorder.stop();

                        recorder.addEventListener('dataavailable',async e => {
                            const base=await useBlobToBase64(e.data);
                            setDataCall({
                                ...data_call,
                                id_record:base,
                                state:false
                            }); 
                        });
                        
                        localStorage.setItem('state_call',"setState");
                        localStorage.setItem('progreso',"(Terminado)");
                        setEnd(true);
                        setView(true);
                        setWhatCall(false);
                    }
                
                }
            }
        }, 3000);
    }

    useEffect(()=>{
        setDataCall({
            phone:phone.nro,
            state:'',
            duration:'',
            id_credit:id_credit,
            id_campain:id_campain,
            id_record:'',
            id_gestion:'',
            cartera:localStorage.getItem('cartera')
        });

        localStorage.setItem('state_call',false);
        localStorage.setItem('progreso','(Llamar)');

        setTime({
            second:0,
            minutes:0
        });
        setRecord('');
        setState('');
        setWhatCall(false);
        
        // setEnd(false);
        setIn("");
        setContinue();

        return () => {
            [continue_call,status_call].map((interval)=>{
                clearInterval(interval);
            });
        };
    
    },[phone]);

    if(!time) return <></>
    if(!data_call) return <></>

    return (
        <div className="CardCall">
            <p>
                Marcador
                <input 
                    type="text"
                    style={{color:"white !important"}}
                    placeholder="0XXXXXX"
                    value={number_in}
                    onChange={(e)=>{
                        if(localStorage.getItem('state_call')=="false"){
                            setIn(e.target.value);
                        }else{
                            sendpush({
                                title:'ERR: Llamada en progreso.',
                                message:'Termine o guarde la llamada para digitar otro número.',
                                type:'Push--danger',
                                timeout:3000
                            });
                        }
                    }}
                />
            </p>

            {/* <img src="./icons/logo.png"/> */}

            <label>
                <span
                    onClick={(e)=>{
                        useClickToCopy(e.target.textContent);
                    }}
                >{(number_in==="") ? phone.nro : number_in}</span>
                {
                    localStorage.getItem('progreso')
                }
            </label>

            <div className="CardCall__count">
                <p>{`${time.minutes}:${time.second}`}</p>
            </div>

            <div className="CardCall__options">
                {
                    (localStorage.getItem('state_call')==='setState')
                    ?   
                        states_call.map((state,index)=>(
                            <button
                                key={index}
                                onClick={(e)=>{
                                    setState(state);
                                }}
                            >{state}</button>
                        ))
                    :   <></>
                }
            </div>

            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'10px'}}>
                {/* COLGAR */}
                {
                    (localStorage.getItem('state_call')==="true")
                    ?
                        <button 
                            onClick={async (e)=>{
                                localStorage.setItem('timestamp_cc',new Date().getTime());
                                try {
                                    if(!whats_call){
                                        const request=await fetch(`hangup.php?exten=${(number_in==="") ? phone.nro : number_in}&channel=${channel}`);
                                        const response=await request.json();
                                    }

                                    record.stop();
                                    record.addEventListener('dataavailable',async e => {
                                        const base=await useBlobToBase64(e.data);
                                        setDataCall({
                                            ...data_call,
                                            id_record:base
                                        })
                                    });

                                } catch (error) {
                                    clearInterval(continue_call);
                                    clearInterval(status_call);
                                    // setEnd(true);
                                    setView(true);
                                    setWhatCall(false);
                                }
                                localStorage.setItem('progreso','(Recien marcado)');
                                clearInterval(continue_call);
                                clearInterval(status_call);
                                // setEnd(true);
                                // setView(true);
                                setWhatCall(false);
                                localStorage.setItem('state_call',"setState");
                            }} 
                            className="CardCall__button CardCall__button--exit"
                        >
                            <img
                                src="./icons/phone.png"
                            />
                        </button>
                    : <></>
                }
                {/* LLAMAR */}
                {
                    (localStorage.getItem('state_call')==="false")
                    ?
                        <button 
                            onClick={async (e)=>{
                                let recorder,stream;
                                localStorage.setItem('timestamp_cc',new Date().getTime());

                                if(((number_in==="") ? phone.nro : number_in)===0){
        
                                    sendpush({
                                        title:'ERR: Sin número.',
                                        message:'No hay número para realizar la llamada.',
                                        type:'Push--sucessful',
                                        timeout:3000
                                    });

                                }else{
                                    
                                    setInit(true);
                                    localStorage.setItem('state_call',true);
                                    localStorage.setItem('progreso','(Llamando)');

                                    fetch(`${import.meta.env.VITE_URL_BASE}/incall`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            
                                        });

                                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                                    recorder = new MediaRecorder(stream);
                                    recorder.start();
                                    setRecord(recorder);

                                    sendpush({
                                        title:'Estado de llamada.',
                                        message:'Se ha iniciado la grabación de llamada.',
                                        type:'Push--sucessful',
                                        timeout:3000
                                    });

                                    try {
                                        const request=await fetch(`originate.php?exten=${(number_in==="") ? phone.nro : number_in}&id=9&channel=${localStorage.getItem('extension')}`);
                                        const response=await request.json();
                                    } catch (error) {
                                        
                                    }

                                    init();
                                    status(recorder);

                                    setDataCall({
                                        ...data_call,
                                        state:true
                                    });
                                }
                            }}
                            className="CardCall__button CardCall__button--call"
                        >
                            <img
                                src="./icons/call.png"
                            />
                        </button>
                    :   <></>
                }

                {
                    (localStorage.getItem('state_call')==="false")
                    ?
                        <button
                            title="Da click, he inicia la llamada dentro de Whatsapp"
                            className="CardCall__button CardCall__button--whats"
                            onClick={async (e)=>{
                                let recorder,stream;
                                localStorage.setItem('timestamp_cc',new Date().getTime());
                                
                                setInit(true);
                                setWhatCall(true);
                                localStorage.setItem('progreso','(Grabando, ve a WhatsApp)');

                                fetch(`${import.meta.env.VITE_URL_BASE}/incall`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        localStorage.setItem('state_call',true);
                                    });

                                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                                recorder = new MediaRecorder(stream);
                                recorder.start();
                                setRecord(recorder);

                                sendpush({
                                    title:'Estado de llamada.',
                                    message:'Se ha iniciado la grabación de llamada.',
                                    type:'Push--sucessful',
                                    timeout:3000
                                });

                                init();

                                setDataCall({
                                    ...data_call,
                                    state:true
                                });
                            }}
                        >
                            <img
                                src="./icons/send_waps.png"
                            />
                        </button>
                    :   <></>
                }
            </div>

            <div className="CardCall__footer">
                {
                    (localStorage.getItem('state_call')==="setState")
                    ?
                    <button 
                        onClick={(e)=>{
                            e.target.textContent='Guardando...';

                            if(call_state===''){
                                e.target.textContent='Intentar de nuevo';
                                
                                sendpush({
                                    title:'ERR: Sin estado de llamada.',
                                    message:'Por favor, selecciona un estado de llamada.',
                                    type:'Push--warning',
                                    timeout:3000
                                });

                            }else{

                                const data_send={
                                    state_call:call_state,
                                    duration_call:Number(time.minutes)*60+Number(time.second),	
                                    phone:(number_in!=="") ? number_in: data_call.phone ,	
                                    id_credit:data_call.id_credit,
                                    id_campain:data_call.id_campain,
                                    id_record:data_call.id_record,
                                    cartera:data_call.cartera
                                };
                                
                                console.log(data_send);

                                fetch(`${import.meta.env.VITE_URL_BASE}/calls`,{
                                    method:'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams(data_send)
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        if(data.state===200){
                                            setInit(false);
                                            addCall(data.id_call);
                                            clearInterval(continue_call);
                                            clearInterval(status_call);
                                            addStates(call_state);
                                            setCancel(true);
                                            // setView(false);
                                            setTime({
                                                second:0,
                                                minutes:0
                                            });

                                            //Función para tomar el siguiente número
                                            if(number_in===""){
                                                change(phone.index);
                                            }

                                            setDataCall({
                                                ...data_call,
                                                state:false
                                            });

                                            localStorage.setItem('progreso',"(Recien marcado)");
                                            localStorage.setItem('state_call',"false");

                                            e.target.textContent="Guardado";

                                            sendpush({
                                                title:'Estado de llamada.',
                                                message:'Se ha guardado la llamada correctamente.',
                                                type:'Push--sucessful',
                                                timeout:3000
                                            });

                                        }else{
                                            e.target.textContent="Intentar de nuevo";
                                        }
                                    });
                            }
                        }}
                        className="CardCall__button CardCall__button--save"
                    >Guardar</button>
                    :   <></>
                }
            </div>
        </div>
    );
}