import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import "./TraysManagement.css";

export default function TraysManagement(){
    const filter_management=useStoreFilterManagement();
    return(
        <div className="TraysManagement">
            <button onClick={()=>{
                filter_management.setTray('PENDIENTE');
                filter_management.FilteredCredits(filter_management.getFilterString());
            }}>Pendientes ({filter_management.nro_pending})</button>
            <button onClick={()=>{
                filter_management.setTray('EN PROCESO');
                filter_management.FilteredCredits(filter_management.getFilterString());
            }}>En proceso ({filter_management.nro_processed})</button>
            <button onClick={()=>{
                filter_management.setTray('GESTIONADO');
                filter_management.FilteredCredits(filter_management.getFilterString());
            }}>Gestionados ({filter_management.nro_managements})</button>
            <button onClick={()=>{
                filter_management.setTray('INACTIVE');
                filter_management.FilteredCredits(filter_management.getFilterString());
            }}>Inactivos ({filter_management.nro_inactive})</button>
        </div>
    );
}