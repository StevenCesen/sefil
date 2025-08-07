export default function InfoCredit({sync_id,agency}){
    return(
        <div className="InfoCredit">
            <h4>Información del crédito</h4>
            <div>
                <h4>Crédito/Contrato:</h4>
                <p>{sync_id}</p>
            </div>
            <div>
                <h4>Agencia:</h4>
                <p>{agency}</p>
            </div>
            <div>
                <h4>Frecuencia:</h4>
                <p>{frequency}</p>
            </div>
            <div>
                <h4>Terminación:</h4>
                <p>{due_date}</p>
            </div>
        </div>
    );
}