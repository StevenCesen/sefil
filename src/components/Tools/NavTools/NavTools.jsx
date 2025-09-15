import { useState } from "react";
import "./NavTools.css";
import { ToolCase } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";

export default function NavTools(){
    
    const [view,setView]=useState(false);
    const credit=useStoreManagement();

    return (
        <div className="NavTools">
            <button onClick={()=>{setView(!view)}} className="NavTools__button"><ToolCase size={20}/> Acciones</button>
            {
                (view)
                ?
                    <div className="NavTools__menu">
                        <button>Condonación</button>
                        <button>Convenio de pago</button>
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