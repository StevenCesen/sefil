import { useEffect, useState } from "react";
import "./CardCall.css"
import addNotification from "react-push-notification";

const states_call=[
    'NO CONTACTADO',
    'CONTACTADO',
    'SUSPENDIDO POR FALTA DE PAGO',
    'NÚMERO NO EXISTE'
];

export default function CardCall({change,phone,channel,id_credit,id_campain,setCancel,addCall}){
    
    const [data_call,setDataCall]=useState();
    const [time,setTime]=useState();
    const [call_state,setState]=useState();
    const [continue_call,setContinue]=useState();
    const [end_session,setEnd]=useState(false);
    const [view_states,setView]=useState(false);

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
            id_gestion:''
        });

        setTime({
            second:0,
            minutes:0
        })

        setState('');
        setView(false);
        setEnd(false);

        setContinue();

        return () => clearInterval(continue_call);
    },[]);

    if(!time) return <></>
    if(!data_call) return <></>

    return (
        <div className="CardCall">
            {/* <p>Disponible</p> */}

            {/* <img src="./icons/logo.png"/> */}

            <label>
                <span>{phone.nro}</span>
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

            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                {/* COLGAR */}
                {
                    (!view_states)
                    ?
                        <button 
                            onClick={async (e)=>{
                                const request=await fetch(`hangup.php?exten=${data_call.phone}&channel=${channel}`);
                                const response=await request.json();
                                clearInterval(continue_call);
                                setEnd(true);
                                setView(true);
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
                            style={{marginLeft:'10px'}}
                            onClick={async (e)=>{
                                const request=await fetch(`originate.php?exten=${data_call.phone}&id=9`);
                                const response=await request.json();
                                init();
                                setDataCall({
                                    ...data_call,
                                    state:true
                                });
                            }} 
                            className="CardCall__button CardCall__button--call"
                        >
                            <img
                                src="./icons/call.png"
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
                                    phone:data_call.phone,	
                                    id_credit:data_call.id_credit,
                                    id_campain:data_call.id_campain
                                };

                                fetch(`https://sefil.softsen.space/public/api/calls`,{
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
                                            addCall(data.id_call);
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