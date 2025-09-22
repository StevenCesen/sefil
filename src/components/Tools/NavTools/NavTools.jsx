import { useState } from "react";
import "./NavTools.css";
import { ToolCase } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import { useStoreStructure } from "../../../stores/useStoreStructure";

export default function NavTools(){
    
    const [view,setView]=useState(false);
    const credit=useStoreManagement();
    const store_structure=useStoreStructure();

    return (
        <div className="NavTools">
            <button onClick={()=>{setView(!view)}} className="NavTools__button"><ToolCase size={20}/> Acciones</button>
            {
                (view)
                ?
                    <div className="NavTools__menu">
                        <button >Condonación</button>
                        <button onClick={()=>{
                            store_structure.viewOn(true);
                            store_structure.setInfoCredit({
                                total_amount:credit.credit.total_amount,
                                cartera:credit.cartera,
                                credit_id:credit.credit.id,
                                gasto_cobranza:credit.credit.gasto_cobranza_sefil
                            });
                        }} >Convenio de pago</button>
                        {
                            (credit.credit.collection_state==='CONVENIO DE PAGO')
                            ?
                                <button>Ver convenio</button>
                            :   <></>
                        }
                    </div>
                :   <></>
            }
        </div>
    );
}