import "./CardNotifierModify.css";

export default function CardNotifierModify({message,credito,cartera,user_generate,prev_data,current_data}){
    return (
        <div className="CardNotifierModify">
            <p className="CardNotifierModify__title">{message} | Generado por: {user_generate}</p>
            
            <div className="CardNotifierModify__subhead">
                <p>Nro. crédito: {credito}</p>
                <p>Cartera: {cartera}</p>
            </div>

            <div className="CardNotifierModify__dates">
                <div>
                    <label>Detalle</label>
                    <label>Original</label>
                    <label>Actual</label>
                </div>

                <div>
                    <label>Mora</label>
                    <label>$ {prev_data.mora} USD</label>
                    <label>$ {current_data.mora} USD</label>
                </div>

                <div>
                    <label>Interes</label>
                    <label>$ {prev_data.interes} USD</label>
                    <label>$ {current_data.interes} USD</label>
                </div>

            </div>

            <button className="CardNotifierModify__button--success">Guardar y autorizar</button>
            <button className="CardNotifierModify__button--failed">Rechazar</button>
        </div>
    );
}