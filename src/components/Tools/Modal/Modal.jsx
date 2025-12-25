import { X } from "lucide-react";
import "./Modal.css";
import NavTools from "../NavTools/NavTools";
import NavMetrics from "../NavMetrics/NavMetrics";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import sendpush from "../../../helpers/sendpush";

export default function Modal({children,view,setView,title}){

    const store_management=useStoreManagement();

    if(!view) return <></>
    
    return(
        <div className="Modal custom-scroll">
            <div className="Modal__head">
                <h3>{title}</h3>
                <div>
                    {/* <NavMetrics/> */}
                    <NavTools/>
                    <label>
                        <X size={18} color="black" onClick={()=>{
                            if(store_management.call_collection.length>0){
                                sendpush({
                                    title:'Gestión en proceso',
                                    message:'No puede cerrar el panel de gestión, hay llamadas guardadas y no se ha guardado la gestión.',
                                    type:'Push--warning',
                                    timeout:3000
                                });
                                return;
                            }
                            store_management.clean();
                            setView()
                        }}/>
                    </label>
                </div>
            </div>
            {children}
        </div>
    );
}