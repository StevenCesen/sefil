import { ExternalLinkIcon } from "lucide-react";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./InfoValues.css";
import CardEditJudicial from "../../CardEditJudicial/CardEditJudicial";
import { useState } from "react";

export default function InfoValues({capital,interest,mora,seguro,gasto_cobranza_sefil,gasto_cobranza,gastos_judiciales,otros_valores,edit_judicial,credit_id,cartera,setTotalAmount}){
    
    const [view_judicial,setView_judicial]=useState(false);
    
    const setNewJudicial = (new_gastos_judiciales,total_amount)=>{
        setTotalAmount(total_amount,new_gastos_judiciales);
    }

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
                <h4>
                    Gastos judiciales:
                    {
                        (edit_judicial)
                        ?
                            <button 
                                className="InfoValues__externalLink" 
                                title="Ver historial y editar"
                                onClick={() =>{setView_judicial(true)}}
                            >
                                <ExternalLinkIcon/>
                            </button>
                        :
                            <></>
                    }
                </h4>
                <p>
                    {useFormatterNumber({value:gastos_judiciales,currency:'USD'})}
                </p>
            </div>
            <div>
                <h4>Otros valores:</h4>
                <p>{useFormatterNumber({value:otros_valores,currency:'USD'})}</p>
            </div>

            {
                (view_judicial)
                ?
                    <CardEditJudicial
                        id={credit_id}
                        cartera={cartera}
                        totalAmount={capital+interest+mora+seguro+gasto_cobranza_sefil+gasto_cobranza+gastos_judiciales+otros_valores}
                        gastos_judiciales={gastos_judiciales}
                        setNew={setNewJudicial}
                        close={()=>{setView_judicial(false)}}
                    />
                :
                    <></>
            }

        </div>
    );
}