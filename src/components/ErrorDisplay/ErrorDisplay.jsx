import CardItemErrorCharge from "../CardItemErrorCharge/CardItemErrorCharge";

export default function ErrorDisplay({ errors }) {
    if (errors.length === 0) return null;

    return (
        <div className="CardAssignCampain__errors">
            <h4>Créditos no asignados ({errors.length})</h4>
            <p>Estos créditos pertenecen a otros agentes</p>
            <div className="CardAssignCampain__headCharge">
                <label></label>
                <label>Nombre</label>
                <label>Agente</label>
                <label>Crédito</label>
                <label>Monto</label>
                <label>Cuotas pendientes</label>
                <label>Días mora</label>
                <label>Estado</label>
            </div>
            {errors.map((credit, index) => (
                <CardItemErrorCharge key={`error-${credit.id || index}`} item={credit} />
            ))}
        </div>
    );
}