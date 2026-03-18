import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./InfoValues.css";

export default function InfoValues({capital,interest,mora,seguro,gasto_cobranza_sefil,gasto_cobranza,gastos_judiciales,otros_valores}){
    return(
        <div className="InfoValues">
            <h4>📟 Desgloce</h4>
            <div>
                <h4>Saldo capital:</h4>
                <p>{useFormatterNumber({value:(capital>0) ? capital : 0,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Interés:</h4>
                <p>{useFormatterNumber({value:(interest>0) ? interest : 0,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Mora:</h4>
                <p>{useFormatterNumber({value:(mora>0) ? mora : 0,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Seguro desgravamen:</h4>
                <p>{useFormatterNumber({value:(seguro>0) ? seguro : 0,currency:'USD'})}</p>
            </div>
            {
                (gasto_cobranza_sefil>0)
                ?
                    <div>
                        <h4>Gasto de cobranza SEFIL:</h4>
                        <p>{useFormatterNumber({value:(gasto_cobranza_sefil>0) ? gasto_cobranza_sefil : 0,currency:'USD'})}</p>
                    </div>
                :   <></>
            }
            <div>
                <h4>Gasto de cobranza:</h4>
                <p>{useFormatterNumber({value:(gasto_cobranza>0) ? gasto_cobranza : 0,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Gastos judiciales:</h4>
                <p>{useFormatterNumber({value:(gastos_judiciales>0) ? gastos_judiciales : 0,currency:'USD'})}</p>
            </div>
            <div>
                <h4>Otros valores:</h4>
                <p>{useFormatterNumber({value:(otros_valores>0) ? otros_valores : 0,currency:'USD'})}</p>
            </div>
        </div>
    );
}