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
                <label>Observación</label>
            </div>
            {
                managements.data.map(management=>(
                    <CardManagement
                        key={management.id}
                        management={{
                            create_date:management.created_at,
                            user_name:management.created_by,
                            client_identification:management.client_id,
                            state_gestion:management.state,
                            substate_gestion:management.substate,
                            days_past_due:management.days_past_due,
                            promise_date:management.promise_date,
                            observation:management.observation
                        }}
                    />
                ))
            }
        </div>
    );
}