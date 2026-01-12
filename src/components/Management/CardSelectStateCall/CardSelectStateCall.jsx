import { Save } from "lucide-react";
import "./CardSelectStateCall.css";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";
import { useRef, useState } from "react";
import createCall from "../../../helpers/Calls/createCall";
import sendpush from "../../../helpers/sendpush";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import uploadFile from "../../../helpers/Calls/uploadFile";

export default function CardSelectStateCall() {
    const store_call = useStoreProgressCall();
    const store_management=useStoreManagement();

    const [selectedState, setSelectedState] = useState(store_call.state_call);
    const buttonRef=useRef();

    const handlerSelect = (value) => {
        setSelectedState(value);
        store_call.setState(value);
    };

    const handlerSave = async (e) => {
        e.preventDefault();

        if(store_call.state_call===''){
            sendpush({
                title:'Sin estado de llamada',
                message:'Seleccione un estado para la llamada',
                type:'Push--warning',
                timeout:2000
            });
            return;
        }

        buttonRef.current.textContent='Guardando...';

        const data_call={
            state:store_call.state_call,
            duration:Number(store_call.duration),
            channel:store_call.channel,
            phone_number:store_call.phone_number,
            created_by:localStorage.getItem('temp_uS'),
            client_id:store_management.client_id,
            credit_id:store_call.credit_id,
            campain_id:store_call.campain_id
        }

        // Subir archivo de audio si existe
        if(store_call.record_audio){
            try {
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
                
                // Asegurar que el archivo tenga la extensión correcta
                const audioFile = store_call.record_audio;
                const fileWithExtension = audioFile.name.includes('.') 
                    ? audioFile 
                    : new File([audioFile], `${audioFile.name}.webm`, { type: audioFile.type });
                
                const data_upload = new FormData();
                data_upload.append('record', fileWithExtension);
                data_upload.append('date', formattedDate);

                const uploadResponse = await fetch(`${import.meta.env.VITE_URL_PBX}/audios/upload`, {
                    method: 'POST',
                    body: data_upload
                });

                const uploadResult = await uploadResponse.json();

                if(uploadResult.code !== 1 || !uploadResult.result?.relative_path){
                    sendpush({
                        title:'Error al subir audio',
                        message: uploadResult.message || 'No se pudo subir el archivo de audio',
                        type:'Push--error',
                        timeout:3000
                    });
                    buttonRef.current.textContent='Intentar de nuevo';
                    return;
                }
                
                data_call.media_path = uploadResult.result.relative_path;
            } catch (error) {
                console.error('Error uploading audio:', error);
                sendpush({
                    title:'Error al subir audio',
                    message:'Error de conexión al subir el archivo',
                    type:'Push--error',
                    timeout:3000
                });
                buttonRef.current.textContent='Intentar de nuevo';
                return;
            }
        }

        const id_call=await createCall({data_call});

        if(id_call){
            store_management.setIdCall(id_call);
            store_call.clean();
            setSelectedState('');
            buttonRef.current.textContent='Guardar llamada';
        }else{
            buttonRef.current.textContent='Intentar de nuevo';
        }
    };

    if (!store_call.view_select) return <></>;

    const buttonStates = [
        { value: 'NO CONTACTADO', label: 'NO CONTACTADO' },
        { value: 'CONTACTADO', label: 'CONTACTADO' },
        { value: 'SUSPENDIDO POR FALTA DE PAGO', label: 'SUSPENDIDO POR FALTA DE PAGO' },
        { value: 'FUERA DE COBERTURA', label: 'FUERA DE COBERTURA' }
    ];

    return (
        <div className="CardSelectStateCall__background">
            <div className="CardSelectStateCall">
                <h3>Estado de la llamada</h3>
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
                    <button ref={buttonRef} onClick={handlerSave}>
                        <Save size={16} /> Guardar llamada
                    </button>
                </div>
            </div>
        </div>
    );
}