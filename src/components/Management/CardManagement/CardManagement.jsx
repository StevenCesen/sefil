import "./CardManagement.css";

export default function CardManagement({management}){
    return (
        <div className="CardManagement">
            <label>{management.create_date}</label>
            <label>{management.user_name}</label>
            <label>{management.client_identification}</label>
            {/* <label>{management.state_gestion}</label> */}
            <label>{management.substate_gestion}</label>
            <label>{management.days_past_due}</label>
            <label>{management.promise_date}</label>
            <label>{management.observation}</label>
        </div>
    );
}