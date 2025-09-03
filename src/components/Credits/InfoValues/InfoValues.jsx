import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./InfoValues.css";

export default function InfoValues({capital,interest,mora,seguro,gasto_cobranza_sefil,gasto_cobranza,gastos_judiciales,otros_valores}){
    return(
        <div className="InfoValues">
            <h4>📟 Desgloce</h4>
            <div>
                <h4>Saldo capital:</h4>
                <p>{useFormatterNumber({value:capital,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Interés:</h4>
                <p>{useFormatterNumber({value:interest,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Mora:</h4>
                <p>{useFormatterNumber({value:mora,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Seguro desgravamen:</h4>
                <p>{useFormatterNumber({value:seguro,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Gasto de cobranza SEFIL:</h4>
                <p>{useFormatterNumber({value:gasto_cobranza_sefil,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Gasto de cobranza:</h4>
                <p>{useFormatterNumber({value:gasto_cobranza,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Gastos judiciales:</h4>
                <p>{useFormatterNumber({value:gastos_judiciales,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Otros valores:</h4>
                <p>{useFormatterNumber({value:otros_valores,currency:'USD'})}</p>
            </div>
        </div>
    );
}