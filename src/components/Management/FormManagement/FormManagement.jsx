import { Save } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./FormManagement.css";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import { useEffect, useRef, useState } from "react";
import { useStoreTemplate } from "../../../stores/useStoreTemplates";
import createManagement from "../../../helpers/Managements/createManagement";
import sendpush from "../../../helpers/sendpush";
import { useViewStruct } from "../../../stores/useViewStruct";

export default function FormManagement(){
    const store_management=useStoreManagement();
    const store_credits=useStoreFilterManagement();
    const store_templates=useStoreTemplate();
    const store_view_struct=useViewStruct();
    const button=useRef();
    const [isSaving, setIsSaving] = useState(false);

    const selectedParent = store_templates.current_template.find(item => item.name === store_management.state);
    const selectedOptions = selectedParent?.children || [];

    const handleSaveManagement=async(e)=>{
        e.preventDefault();

        const data_management={
            campain_id:store_management.campain_id,
            call_collection:JSON.stringify(store_management.call_collection),
            credit_id:store_management.credit_id,
            client_id:store_management.client_id,
            state:store_management.state,
            substate:store_management.substate,
            promise_date:store_management.promise_date,
            observation:store_management.observation,
            days_past_due:store_management.days_past_due,
            paid_fees:store_management.paid_fees,
            pending_fees:store_management.pending_fees,
            managed_amount:store_management.monto,
            promise_amount:store_management.promise_amount,
            created_by:Number(localStorage.getItem('temp_uS')),
            nro_notification:store_management.nro_notification
        }

        if(store_management.call_id){
            data_management.call_id = store_management.call_id;
        }

        setIsSaving(true);
        button.current.textContent='Guardando...';

        const create_management=await createManagement({data_management});

        if(create_management.code===1){
            button.current.textContent='Guardar gestión';
            setIsSaving(false);

            sendpush({
                title:'Estado de gestión.',
                message:'Se ha guardado la gestión correctamente.',
                type:'Push--sucessful',
                timeout:3000
            });

            store_management.clean();
            store_management.addManagement(create_management.result);
            store_management.setMessage('Gestionado recién');

        }else{

            sendpush({
                title:'Error en validaciones',
                message:create_management.message,
                type:'Push--warning',
                timeout:3000
            });

            button.current.textContent='Intentar de nuevo';
            setIsSaving(false);
        }
    }

    const handleNextCredit=async (e)=>{
        e.preventDefault();
        store_management.clean();
        store_view_struct.clean();

        let next_credit=store_credits.getNextCredit();

        if(next_credit){        
            store_management.setCredit(next_credit);
        }else if(store_credits.credits.next_page_url!==null){
            const first_credit=await store_credits.getNextPage({next_page_url:store_credits.credits.next_page_url});
            store_management.setCredit(first_credit);
        }else if(store_credits.credits.first_page_url!==null){
            const first_credit=await store_credits.getNextPage({next_page_url:store_credits.credits.first_page_url});
            store_management.setCredit(first_credit);
        }else{
            store_management.setView(false);
        }
    }
    
    useEffect(()=>{
        store_templates.setTemplate();
    },[store_management.credit_id]);

    return(
        <form 
            className="FormManagement"
            onSubmit={async (e)=>{
                await handleSaveManagement(e);
            }}
        >
            <button
                onClick={async (e)=>{
                    await handleNextCredit(e);
                }}
            >Seguir</button>

            <div className="FormManagement__states">
                <label className="FormManagement__label">
                    Nombre del cliente
                    <input 
                        type="text" 
                        required 
                        value={store_management.client_name} 
                        readOnly
                    />
                </label>
                <label className="FormManagement__label">
                    Estado de gestión
                    <select
                        value={store_management.state}
                        onChange={(e) => {
                            const newState = e.target.value;
                            store_management.setState(newState);
                            store_management.setSubstate('');
                        }}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {store_templates.current_template.map(item => (
                            <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </label>

                <label className="FormManagement__label">
                    Subestado de gestión
                    <select
                        value={store_management.substate}
                        onChange={(e) => store_management.setSubstate(e.target.value)}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {
                            selectedOptions.map(option => (
                                <option key={option.id} value={option.name}>{option.name}</option>
                            ))
                        }
                    </select>
                </label>
            </div>
            <div className="FormManagement__states">
                <label className="FormManagement__label">
                    Fecha de oferta/compromiso/regestión
                    <input 
                        value={store_management.promise_date} 
                        onChange={(e)=>{store_management.setPromiseDate(e.target.value)}} 
                        type="date" 
                        required
                    />
                </label>
                {
                    (store_management.substate==='NOTIFICADO' || store_management.substate==='ENTREGADO AVISO DE COBRANZA')
                    ?
                        <div className="FormManagement__label">
                            Nro. notificación
                            <input
                                value={store_management.nro_notification}
                                onChange={(e)=>{store_management.setNroNotification(e.target.value)}}
                            />
                        </div>
                    :   <></>
                }
                <div className="FormManagement__label">
                    <label>Monto a pagar</label>
                    <div>
                        <label>
                            <input 
                                value={store_management.promise_amount} 
                                onChange={(e)=>{store_management.setPromiseAmount(e.target.value)}} 
                                type="number" 
                                min={0.00} 
                                step={0.01}
                            />
                        </label>
                        <label>
                            <input type="checkbox"/>
                            Total
                        </label>
                    </div>
                </div>
            </div>
            <label>
                Observaciones
                <textarea 
                    value={store_management.observation} 
                    onChange={(e)=>{store_management.setObservation(e.target.value)}} 
                    placeholder="Escribe una observación"
                ></textarea>
            </label>
            {
                (store_management.credit?.sync_status === 'ACTIVE')
                &&
                    <button ref={button} type="submit" disabled={isSaving}>
                        <Save size={16}/>
                        Guardar gestión
                    </button>
            }
        </form>
    );
}