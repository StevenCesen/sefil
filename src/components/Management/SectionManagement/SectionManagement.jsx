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
                            create_date:management.fecha,
                            user_name:management.byUser,
                            client_identification:management.client_ci,
                            state_gestion:management.state_gestion,
                            substate_gestion:management.substate_gestion,
                            days_past_due:management.dias_vencidos,
                            promise_date:management.date_promise,
                            observation:management.observation
                        }}
                    />
                ))
            }
        </div>
    );
}