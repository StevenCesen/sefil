import { Save } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./FormManagement.css";

export default function FormManagement(){

    const store_management=useStoreManagement();

    const handlerCreateManagement=async(e)=>{
        e.preventDefault();
        console.log(store_management);
    }

    return(
        <form 
            className="FormManagement"
            onSubmit={async (e)=>{
                await handlerCreateManagement(e);
            }}
        >
            <div className="FormManagement__states">
                <label className="FormManagement__label">
                    Nombre del cliente
                    <input type="text" required placeholder={store_management.client_name} disabled/>
                </label>
                <label className="FormManagement__label">
                    Estado de gestión
                    <select required>
                        <option value={''}>-- Seleccionar --</option>
                        <option value={'CONTACTADO EFECTIVO'}>CONTACTADO EFECTIVO</option>
                        <option value={'CONTACTADO NO EFECTIVO'}>CONTACTADO NO EFECTIVO</option>
                    </select>
                </label>
                 <label className="FormManagement__label">
                    Subestado de gestión
                    <select required>
                        <option value={''}>-- Seleccionar --</option>
                        <option value={'OFERTA DE PAGO'}>OFERTA DE PAGO</option>
                        <option value={'COMPROMISO DE PAGO'}>COMPROMISO DE PAGO</option>
                    </select>
                </label>
            </div>
            <div className="FormManagement__states">
                <label className="FormManagement__label">
                    Fecha de oferta/compromiso/regestión
                    <input type="date" required/>
                </label>
                <div className="FormManagement__label">
                    <label>Monto a pagar</label>
                    <div>
                        <label>
                            <input type="number" min={0.00} step={0.01}/>
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
                <textarea placeholder="Escribe una observación"></textarea>
            </label>
            <button type="submit">
                <Save size={16}/>
                Guardar gestión
            </button>
        </form>
    );
}