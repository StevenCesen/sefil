import { Save } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./FormManagement.css";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";

export default function FormManagement(){

    const store_management=useStoreManagement();
    const store_credits=useStoreFilterManagement();

    const handlerCreateManagement=async(e)=>{
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
            nro_notificacion:store_management.nro_notificacion
        }

        console.log(data_management);
        store_management.clean();
        // Enviar la petición a base de datos para guardar la gestión
        
    }

    const handlerNextCredit=(e)=>{
        e.preventDefault();
        const next_credit=store_credits.getNextCredit();
        if(next_credit){        
            store_management.setCredit(next_credit);
        }else{
            store_management.setView(false);
        }
    }

    return(
        <form 
            className="FormManagement"
            onSubmit={async (e)=>{
                await handlerCreateManagement(e);
            }}
        >
            <button
                onClick={(e)=>{
                    handlerNextCredit(e);
                }}
            >Seguir</button>

            <div className="FormManagement__states">
                <label className="FormManagement__label">
                    Nombre del cliente
                    <input type="text" required placeholder={store_management.client_name} disabled/>
                </label>
                <label className="FormManagement__label">
                    Estado de gestión
                    <select value={store_management.state_gestion} onChange={(e)=>{store_management.setState(e.target.value)}} required>
                        <option value={''}>-- Seleccionar --</option>
                        <option value={'CONTACTADO EFECTIVO'}>CONTACTADO EFECTIVO</option>
                        <option value={'CONTACTADO NO EFECTIVO'}>CONTACTADO NO EFECTIVO</option>
                    </select>
                </label>
                 <label className="FormManagement__label">
                    Subestado de gestión
                    <select value={store_management.substate_gestion} onChange={(e)=>{store_management.setSubstate(e.target.value)}} required>
                        <option value={''}>-- Seleccionar --</option>
                        <option value={'OFERTA DE PAGO'}>OFERTA DE PAGO</option>
                        <option value={'COMPROMISO DE PAGO'}>COMPROMISO DE PAGO</option>
                    </select>
                </label>
            </div>
            <div className="FormManagement__states">
                <label className="FormManagement__label">
                    Fecha de oferta/compromiso/regestión
                    <input value={store_management.promise_date} onChange={(e)=>{store_management.setPromiseDate(e.target.value)}} type="date" required/>
                </label>
                <div className="FormManagement__label">
                    <label>Monto a pagar</label>
                    <div>
                        <label>
                            <input value={store_management.promise_amount} onChange={(e)=>{store_management.setPromiseAmount(e.target.value)}} type="number" min={0.00} step={0.01}/>
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
                <textarea value={store_management.observation} onChange={(e)=>{store_management.setObservation(e.target.value)}} placeholder="Escribe una observación"></textarea>
            </label>
            <button type="submit">
                <Save size={16}/>
                Guardar gestión
            </button>
        </form>
    );
}