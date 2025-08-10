import { Save } from "lucide-react";
import "./CardSelectStateCall.css";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";

export default function CardSelectStateCall(){

    const store_call=useStoreProgressCall();

    const handlerSelect=(value)=>{
        store_call.setState(value);
    }

    const handlerSave=(value)=>{
        store_call.setViewSelect(false);
    }

    const handlerAbort=(value)=>{
        store_call.setViewSelect(false);
    }

    if(!store_call.view_select) return <></>

    return(
        <div className="CardSelectStateCall__background">
            <div className="CardSelectStateCall">
                <h3>📞 Estado de la llamada</h3>
                <div className="CardSelectStateCall__states">
                    <button>NO CONTACTADO 🚫</button>
                    <button className="">CONTACTADO ✅</button>
                    <button>SUSPENDIDO POR FALTA DE PAGO 🚫</button>
                    <button>FUERA DE COBERTURA 🚫</button>
                </div>
                <div className="CardSelectStateCall__actions">
                    <button onClick={()=>{handlerAbort()}}>No guardar</button>
                    <button onClick={()=>{handlerSave()}}><Save size={16}/> Guardar llamada</button>
                </div>
            </div>
        </div>
    );
}