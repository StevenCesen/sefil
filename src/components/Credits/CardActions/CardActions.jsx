import "./CardActions.css";

export default function CardActions({}){
    return(
        <div className="CardActions">
            <h2>Acciones</h2>
            <div className="CardActions__actions">
                <button className="CardActions__action">Bajar pago</button>
                <button className="CardActions__action">Generar gasto de cobranza</button>
                <button className="CardActions__action">Generar condonación</button>
                <button className="CardActions__action">Generar convenio de pago</button>
                <button className="CardActions__action">Subir gasto judicial</button>
            </div>
        </div>
    );
}