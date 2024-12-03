import { useEffect, useState } from "react";
import "./CardCall.css"
import addNotification from "react-push-notification";
import useBlobToBase64 from "../../hooks/useBlobToBase64";

const states_call=[
    'NO CONTACTADO',
    'CONTACTADO',
    'SUSPENDIDO POR FALTA DE PAGO',
    'NÚMERO NO EXISTE',
    'FUERA DE COBERTURA'
];

export default function CardCall({change,phone,channel,id_credit,cartera,id_campain,setCancel,addCall,addStates,setInit}){
    
    const [data_call,setDataCall]=useState();
    const [time,setTime]=useState();
    const [call_state,setState]=useState();
    const [continue_call,setContinue]=useState();
    const [end_session,setEnd]=useState(false);
    const [view_states,setView]=useState(false);
    const [record,setRecord]=useState();
    const [whats_call,setWhatCall]=useState();

    const [number_in,setIn]=useState();

    const init = ()=>{
        let second=0;
        let minutos=0;
        
        setContinue(
            setInterval(() => {
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
            }, 1000)
        )
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

        setTime({
            second:0,
            minutes:0
        });
        setRecord('');
        setState('');
        setWhatCall(false);
        setView(false);
        setEnd(false);
        setIn("");
        setContinue();

        return () => clearInterval(continue_call);
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
                    onChange={(e)=>{
                        setIn(e.target.value);
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
                    (data_call.state)
                    ?  
                        '(Llamando)'
                    :   '(Llamar)'
                }
            </label>

            <div className="CardCall__count">
                <p>{`${time.minutes}:${time.second}`}</p>
            </div>

            <div className="CardCall__options">
                {
                    (view_states)
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
                    (!view_states)
                    ?
                        <button 
                            onClick={async (e)=>{
                                record.stop();
                                record.addEventListener('dataavailable',async e => {
                                    const base=await useBlobToBase64(e.data);
                                    setDataCall({
                                        ...data_call,
                                        id_record:base
                                    })
                                });
                                
                                try {
                                    
                                    if(!whats_call){
                                        const request=await fetch(`hangup.php?exten=${(number_in==="") ? phone.nro : number_in}&channel=${channel}`);
                                        const response=await request.json();
                                        console.log(response);
                                    }

                                } catch (error) {
                                    console.log(error)
                                }
                                
                                clearInterval(continue_call);
                                setEnd(true);
                                setView(true);
                                setWhatCall(false);
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
                    (!data_call.state)
                    ?
                        <button 
                            onClick={async (e)=>{
                                let recorder,stream;

                                if(((number_in==="") ? phone.nro : number_in)===0){
                                    addNotification({
                                        title: 'Sin número',
                                        subtitle: 'No hay número para realizar la llamada',
                                        message: '',
                                        native: false,
                                        backgroundTop: '#FF9619',
                                        backgroundBottom: '#fdb864',
                                        colorTop: 'white',
                                        colorBottom: 'white',
                                        closeButton: 'Cerrar',
                                        duration: 3000,
                                    });

                                }else{
                                    
                                    setInit(true);

                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/incall`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            console.log(data);
                                        });

                                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                                    recorder = new MediaRecorder(stream);
                                    recorder.start();
                                    setRecord(recorder);

                                    const request=await fetch(`originate.php?exten=${(number_in==="") ? phone.nro : number_in}&id=9&channel=${localStorage.getItem('extension')}`);
                                    const response=await request.json();

                                    init();

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
                    (!data_call.state)
                    ?
                        <button
                            title="Da click, he inicia la llamada dentro de Whatsapp"
                            className="CardCall__button CardCall__button--whats"
                            onClick={async (e)=>{
                                let recorder,stream;
        
                                setInit(true);
                                setWhatCall(true);

                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/incall`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        console.log("ESTADO BROADCAST")
                                        console.log(data)
                                    });

                                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                                recorder = new MediaRecorder(stream);
                                recorder.start();
                                setRecord(recorder);

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
                    (end_session)
                    ?
                    <button 
                        onClick={(e)=>{
                            e.target.textContent='Guardando...';

                            if(call_state===''){
                                e.target.textContent='Intentar de nuevo';
                                addNotification({
                                    title: 'Sin estado de llamada',
                                    subtitle: 'Por favor, selecciona un estado de llamada',
                                    message: '',
                                    native: false,
                                    backgroundTop: '#FF9619',
                                    backgroundBottom: '#fdb864',
                                    colorTop: 'white',
                                    colorBottom: 'white',
                                    closeButton: 'Cerrar',  
                                    duration: 3000,
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
                                

                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/calls`,{
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
                                            addStates(call_state);
                                            setCancel(true);
                                            setView(false);
                                            setTime({
                                                second:0,
                                                minutes:0
                                            });

                                            //Función para tomar el siguiente número
                                            change(phone.index);
                                            setDataCall({
                                                ...data_call,
                                                state:false
                                            });

                                            e.target.textContent="Guardado";

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