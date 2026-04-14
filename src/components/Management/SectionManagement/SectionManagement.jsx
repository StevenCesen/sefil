import CardManagement from "../CardManagement/CardManagement";
import "./SectionManagement.css";

export default function SectionManagement({managements}){
    return(
        <div className="SectionManagement">
            <div className="SectionManagement__header">
                <label>Fecha</label>
                <label>Agente</label>
                <label>Cliente</label>
                <label>Estado de gestión</label>
                <label>Días de mora</label>
                <label>Fecha compromiso</label>
                <label>Monto compromiso</label>
                <label>Observación</label>
            </div>
            {
                managements.data.map(management=>(
                    <CardManagement
                        key={management.id}
                        management={management}
                    />
                ))
            }
        </div>
    );
}