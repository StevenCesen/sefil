import { Save } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./FormManagement.css";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import { useEffect, useRef } from "react";
import { useStoreTemplate } from "../../../stores/useStoreTemplates";
import createManagement from "../../../helpers/Managements/createManagement";
import sendpush from "../../../helpers/sendpush";
import { useViewStruct } from "../../../stores/useViewStruct";
import { useStoreLoader } from "../../../stores/useStoreLoader";

export default function FormManagement(){
    const store_management=useStoreManagement();
    const store_credits=useStoreFilterManagement();
    const store_templates=useStoreTemplate();
    const store_view_struct=useViewStruct();
    const store_loader=useStoreLoader();
    const button=useRef();

    const selectedOptions = store_templates.current_template.find(item => item.title === store_management.state_gestion)?.options || [];

    const handleSaveManagement=async(e)=>{
        e.preventDefault();

        const data_management={
            id_campain:store_management.campain_id,
            id_call:store_management.id_call,
            id_calls_extras:JSON.stringify(store_management.id_calls_extras),
            id_credit:store_management.credit_id,
            state_gestion:store_management.state_gestion,
            substate_gestion:store_management.substate_gestion,
            date_promise:store_management.promise_date,
            observation:store_management.observation,
            client_name:store_management.client_name,
            client_ci:store_management.client_ci,
            type:store_management.client_type,
            dias_vencidos:store_management.dias_vencidos,
            cartera:store_management.cartera,
            monto:store_management.monto,
            monto_pagar:store_management.promise_amount,
            nro_notification:store_management.nro_notificacion
        }

        store_loader.viewOn(true);

        const create_management=await createManagement({data_management});

        store_loader.viewOn(false);

        if(create_management.status===200){
            sendpush({
                title:'Estado de gestión.',
                message:'Se ha guardado la gestión correctamente.',
                type:'Push--sucessful',
                timeout:3000
            });

            store_management.clean();
            store_management.addManagement(create_management.management);
            store_management.setMessage('Gestionado recién');

        }else{
            sendpush({
                title:'Estado de gestión.',
                message:create_management.message,
                type:'Push--warning',
                timeout:3000
            });
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
        store_templates.setTemplate({
            role: localStorage.getItem('rol'),
            days_past_due:store_management.dias_vencidos
        });
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
                        value={store_management.state_gestion}
                        onChange={(e) => {
                            const newState = e.target.value;
                            store_management.setState(newState);
                            store_management.setSubstate(''); // Reset substate on change
                        }}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {store_templates.current_template.map(item => (
                            <option key={item.title} value={item.title}>{item.title}</option>
                        ))}
                    </select>
                </label>

                <label className="FormManagement__label">
                    Subestado de gestión
                    <select
                        value={store_management.substate_gestion}
                        onChange={(e) => store_management.setSubstate(e.target.value)}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {
                            selectedOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
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
                    (store_management.substate_gestion==='NOTIFICADO' || store_management.substate_gestion==='ENTREGADO AVISO DE COBRANZA')
                    ?   
                        <div className="FormManagement__label">
                            Nro. notificación
                            <input 
                                value={store_management.nro_notificacion} 
                                onChange={(e)=>{store_management.setNroNotificacion(e.target.value)}}
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
                (store_management.credit.status==='ACTIVE')
                ?   
                    <button ref={button} type="submit">
                        <Save size={16}/>
                        Guardar gestión
                    </button>
                :   <></>
            }
        </form>
    );
}