import { Save } from "lucide-react";
import "./CardSelectStateCall.css";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";
import { useRef, useState } from "react";
import createCall from "../../../helpers/Calls/createCall";
import sendpush from "../../../helpers/sendpush";
import { useStoreManagement } from "../../../stores/useStoreManagement";

export default function CardSelectStateCall() {
    const store_call = useStoreProgressCall();
    const store_management=useStoreManagement();

    // Estado para controlar qué botón está seleccionado
    const [selectedState, setSelectedState] = useState(store_call.state_call);
    const button=useRef();

    const handlerSelect = (value) => {
        setSelectedState(value);
        store_call.setState(value);
    };

    const handlerSave = async (e) => {
        // const data_call={
        //     state_call:store_call.state_call,
        //     duration_call:Number(store_call.duration),	
        //     phone:store_call.phone_number,
        //     id_credit:store_call.credit_id,
        //     id_campain:store_call.campain_id,
        //     id_record:store_call.record_audio
        // };

        const data_call=new FormData();
        data_call.append('state_call',store_call.state_call);
        data_call.append('duration_call',Number(store_call.duration));
        data_call.append('phone',store_call.phone_number);
        data_call.append('id_credit',store_call.credit_id);
        data_call.append('id_campain',store_call.campain_id);
        data_call.append('record',store_call.record_audio);

        console.log(data_call);

        if(store_call.state_call===''){
            sendpush({
                title:'Sin estado de llamada',
                message:'Seleccione un estado para la llamada',
                type:'Push--warning',
                timeout:2000
            });
        }else{
            e.target.textContent='Guardando...';
            // button.current.setAttribute('disabled','');
            // e.target.setAttribute('disabled','');
            
            const id_call=await createCall({e,data_call});

            store_management.setIdCall(id_call);
            
            store_call.clean();
            // button.current.removeAttribute('disabled');
            // e.target.removeAttribute('disabled');
            setSelectedState('');
        }
    };

    const handlerAbort = () => {
        store_call.setViewSelect(false);
        setSelectedState('');
    };

    if (!store_call.view_select) return <></>;

    // Array de estados para mapear los botones
    const buttonStates = [
        { value: 'NO CONTACTADO', label: 'NO CONTACTADO 🚫' },
        { value: 'CONTACTADO', label: 'CONTACTADO ✅' },
        { value: 'SUSPENDIDO POR FALTA DE PAGO', label: 'SUSPENDIDO POR FALTA DE PAGO 🚫' },
        { value: 'FUERA DE COBERTURA', label: 'FUERA DE COBERTURA 🚫' }
    ];

    return (
        <div className="CardSelectStateCall__background">
            <div className="CardSelectStateCall">
                <h3>📞 Estado de la llamada</h3>
                <div className="CardSelectStateCall__states">
                    {buttonStates.map((button) => (
                        <button
                            key={button.value}
                            onClick={() => handlerSelect(button.value)}
                            className={selectedState === button.value ? 'CardSelectStateCall--select' : ''}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
                <div className="CardSelectStateCall__actions">
                    {/* <button ref={button} onClick={handlerAbort}>No guardar</button> */}
                    <button onClick={(e)=>{handlerSave(e)}}>
                        <Save size={16} /> Guardar llamada
                    </button>
                </div>
            </div>
        </div>
    );
}