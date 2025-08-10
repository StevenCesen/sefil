import "./InfoValues.css";

export default function InfoValues({capital,interest,mora,seguro,gasto_cobranza_sefil,gasto_cobranza,gastos_judiciales,otros_valores}){
    return(
        <div className="InfoValues">
            <h4>📟 Desgloce</h4>
            <div>
                <h4>Saldo capital:</h4>
                <p>{capital}</p>
            </div>
            <div>
                <h4>Interés:</h4>
                <p>{interest}</p>
            </div>
            <div>
                <h4>Mora:</h4>
                <p>{mora}</p>
            </div>
            <div>
                <h4>Seguro desgravamen:</h4>
                <p>{seguro}</p>
            </div>
            <div>
                <h4>Gasto de cobranza SEFIL:</h4>
                <p>{gasto_cobranza_sefil}</p>
            </div>
            <div>
                <h4>Gasto de cobranza:</h4>
                <p>{gasto_cobranza}</p>
            </div>
            <div>
                <h4>Gastos judiciales:</h4>
                <p>{gastos_judiciales}</p>
            </div>
            <div>
                <h4>Otros valores:</h4>
                <p>{otros_valores}</p>
            </div>
        </div>
    );
}