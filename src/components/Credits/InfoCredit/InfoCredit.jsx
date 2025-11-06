import "./InfoCredit.css";

export default function InfoCredit({business,sync_id,agency,frequency,due_date,collection_state,monthly_fee_amount,info_extra}){
    console.log(info_extra)
    return(
        <div className="InfoCredit">
            <h4>📓 Información del crédito</h4>
            <div>
                <h4>Crédito/Contrato:</h4>
                <p>{business}-{sync_id}</p>
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
                <h4>Estado del crédito:</h4>
                <p>{collection_state}</p>
            </div>
            <div>
                <h4>Terminación:</h4>
                <p>{due_date}</p>
            </div>
            {
                (info_extra)
                ?
                    <>
                        <div>
                            <h4>Estado en campaña:</h4>
                            <p>{info_extra.sync_status}</p>
                        </div>
                        <div>
                            <h4>Agente asignado:</h4>
                            <p>{info_extra.agent}</p>
                        </div>
                    </>
                :   <></>
            }
            {
                (business==='syncs')
                ?
                    <div>
                        <h4>Valor cuota:</h4>
                        <p>{monthly_fee_amount}</p>
                    </div>
                :   <></>
            }
        </div>
    );
}