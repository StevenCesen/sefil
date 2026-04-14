import "./CardManagement.css";

export default function CardManagement({management}){
    return (
        <div className="CardManagement">
            <label>{management.created_at}</label>
            <label>{management.created_by_name}</label>
            <label>{management.client_name}</label>
            <label>{management.substate}</label>
            <label>{management.days_past_due}</label>
            <label>{management.promise_date}</label>
            <label>{management.promise_amount !== null && management.promise_amount !== undefined ? `$${Number(management.promise_amount).toFixed(2)}` : '-'}</label>
            <label>{management.observation}</label>
        </div>
    );
}