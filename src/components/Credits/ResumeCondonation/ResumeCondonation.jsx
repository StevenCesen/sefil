import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./ResumeCondonation.css";

export default function ResumeCondonation({condonation}){
    return (
        <div className="ResumeCondonation">
            <h4>Condonación</h4>
            <p>Solicitado por: {condonation.byUser}</p>
            <p>Autorizado por: María Bravo</p>
            <p>Fecha generación: {condonation.fecha}</p>
            <span>DETALLE CONDONADO:</span>

            <div className="ResumeCondonation__detail">
                <p>Capital:             {useFormatterNumber({currency:'USD',value: JSON.parse(condonation.prevDates).capital - JSON.parse(condonation.postDates).capital })}</p>
                <p>Interés:             {useFormatterNumber({currency:'USD',value: JSON.parse(condonation.prevDates).interes - JSON.parse(condonation.postDates).interes })}</p>
                <p>Mora:                {useFormatterNumber({currency:'USD',value: JSON.parse(condonation.prevDates).mora - JSON.parse(condonation.postDates).mora })}</p>
                <p>Seguro desgravamen:  {useFormatterNumber({currency:'USD',value: JSON.parse(condonation.prevDates).seguro_desgravamen - JSON.parse(condonation.postDates).seguro_desgravamen })}</p>
                <p>Gastos judiciales:   {useFormatterNumber({currency:'USD',value: JSON.parse(condonation.prevDates).gastos_judiciales - JSON.parse(condonation.postDates).gastos_judiciales })}</p>
                <p>Gastos de cobranza:  {useFormatterNumber({currency:'USD',value: JSON.parse(condonation.prevDates).gastos_cobranza - JSON.parse(condonation.postDates).gastos_cobranza })}</p>
                <p>Otros valores:       {useFormatterNumber({currency:'USD',value: (('otros_valores' in JSON.parse(condonation.prevDates)) ? JSON.parse(condonation.prevDates).otros_valores - JSON.parse(condonation.postDates).otros_valores : 0) })}</p>
            </div>
            <span>TOTAL A PAGAR: 
                {
                    useFormatterNumber({ currency:'USD',
                        value:
                        Number(JSON.parse(condonation.postDates).capital) +
                        Number(JSON.parse(condonation.postDates).interes) +
                        Number(JSON.parse(condonation.postDates).mora)    +
                        Number(JSON.parse(condonation.postDates).seguro_desgravamen)  +
                        Number(JSON.parse(condonation.postDates).gastos_judiciales)   +
                        Number(JSON.parse(condonation.postDates).gastos_cobranza)     +
                        Number(('otros_valores' in JSON.parse(condonation.prevDates)) ? JSON.parse(condonation.postDates).otros_valores : 0)
                    })
                }
            </span>
        </div>
    );
}