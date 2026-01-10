import { useEffect, useState } from "react";
import "./CardCondonacion.css";
import useCondonation from "../../hooks/useCondonation";
import { useStoreCondonation } from "../../stores/useStoreCondonation";

export default function CardCondonacion() {
    const [credit, setValues] = useState();
    const [condonatedValues, setCondonatedValues] = useState({
        capital: 0,
        interes: 0,
        mora: 0,
        seguro_desgravamen: 0,
        gastos_judiciales: 0,
        gastos_cobranza: 0,
        otros_valores: 0
    });
    const store_condonation = useStoreCondonation();

    const handleViewPDF = (data) => {
        store_condonation.setResponse(data);
        store_condonation.setViewPDF(true);
    }

    useEffect(() => {
        // Prellenar valores condonados si es modo edición
        const condonatedVals = {
            capital: parseFloat((store_condonation.condonated_capital || 0).toFixed(2)),
            interes: parseFloat((store_condonation.condonated_interes || 0).toFixed(2)),
            mora: parseFloat((store_condonation.condonated_mora || 0).toFixed(2)),
            seguro_desgravamen: parseFloat((store_condonation.condonated_seguro_desgravamen || 0).toFixed(2)),
            gastos_judiciales: parseFloat((store_condonation.condonated_gastos_judiciales || 0).toFixed(2)),
            gastos_cobranza: parseFloat((store_condonation.condonated_gastos_cobranza || 0).toFixed(2)),
            otros_valores: parseFloat((store_condonation.condonated_otros_valores || 0).toFixed(2))
        };
        
        setCondonatedValues(condonatedVals);
        
        // Calcular valores resultantes (valor actual - valor condonado)
        setValues({
            capital: (Number(store_condonation.capital) - Number(condonatedVals.capital)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9]))?(\. ?0+$)/, '$1'),
            mora: (Number(store_condonation.mora > 0 ? store_condonation.mora : 0) - Number(condonatedVals.mora)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9]))?(\. ?0+$)/, '$1'),
            interes: (Number(store_condonation.interes > 0 ? store_condonation.interes : 0) - Number(condonatedVals.interes)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9]))?(\. ?0+$)/, '$1'),
            seguro_desgravamen: (Number(store_condonation.seguro_desgravamen > 0 ? store_condonation.seguro_desgravamen : 0) - Number(condonatedVals.seguro_desgravamen)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9]))?(\. ?0+$)/, '$1'),
            gastos_judiciales: (Number(store_condonation.gastos_judiciales > 0 ? store_condonation.gastos_judiciales : 0) - Number(condonatedVals.gastos_judiciales)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9]))?(\. ?0+$)/, '$1'),
            gastos_cobranza: (Number(store_condonation.gastos_cobranza > 0 ? store_condonation.gastos_cobranza : 0) - Number(condonatedVals.gastos_cobranza)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9]))?(\. ?0+$)/, '$1'),
            otros_valores: (Number(store_condonation.otros_valores > 0 ? store_condonation.otros_valores : 0) - Number(condonatedVals.otros_valores)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9]))?(\. ?0+$)/, '$1')
        });
    }, [store_condonation]);

    if (!store_condonation.isViewOn) return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={() => { store_condonation.viewOn(false) }}>Volver</button>
            <div className="CardCondonacion">
                <p>Condonación</p>
                <div className="CardCondonacion__content">
                    <div className="CardCondonacion__head">
                        <p>Detalle</p>
                        <p>Valor actual</p>
                        <p>Valor condonado</p>
                        <p>Valor a cancelar</p>
                    </div>

                    <div>
                        <p>Capital</p>
                        <p>$ {store_condonation.capital} USD</p>
                        <input type="number" value={condonatedValues.capital} onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setCondonatedValues({...condonatedValues, capital: val});
                            setValues({
                                ...credit,
                                capital: (Number(store_condonation.capital) - val).toFixed(2).replace(/([0-9]+(\.[ 0-9]+[1-9]))?(\. ?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.capital} USD</p>
                    </div>
                    <div>
                        <p>Interés</p>
                        <p>$ {store_condonation.interes} USD</p>
                        <input type="number" value={condonatedValues.interes} onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setCondonatedValues({...condonatedValues, interes: val});
                            setValues({
                                ...credit,
                                interes: (Number(store_condonation.interes) - val).toFixed(2).replace(/([0-9]+(\.[ 0-9]+[1-9]))?(\. ?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.interes} USD</p>
                    </div>
                    <div>
                        <p>Mora</p>
                        <p>$ {store_condonation.mora} USD</p>
                        <input type="number" value={condonatedValues.mora} onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setCondonatedValues({...condonatedValues, mora: val});
                            setValues({
                                ...credit,
                                mora: (Number(store_condonation.mora) - val).toFixed(2).replace(/([0-9]+(\.[ 0-9]+[1-9]))?(\. ?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.mora} USD</p>
                    </div>
                    <div>
                        <p>Seguro desgravamen</p>
                        <p>$ {store_condonation.seguro_desgravamen} USD</p>
                        <input type="number" value={condonatedValues.seguro_desgravamen} onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setCondonatedValues({...condonatedValues, seguro_desgravamen: val});
                            setValues({
                                ...credit,
                                seguro_desgravamen: (Number(store_condonation.seguro_desgravamen) - val).toFixed(2).replace(/([0-9]+(\.[ 0-9]+[1-9]))?(\. ?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.seguro_desgravamen} USD</p>
                    </div>
                    <div>
                        <p>Gastos judiciales</p>
                        <p>$ {store_condonation.gastos_judiciales} USD</p>
                        <input type="number" value={condonatedValues.gastos_judiciales} onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setCondonatedValues({...condonatedValues, gastos_judiciales: val});
                            setValues({
                                ...credit,
                                gastos_judiciales: (Number(store_condonation.gastos_judiciales) - val).toFixed(2).replace(/([0-9]+(\.[ 0-9]+[1-9]))?(\. ?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.gastos_judiciales} USD</p>
                    </div>
                    <div>
                        <p>Gastos de cobranza</p>
                        <p>$ {store_condonation.gastos_cobranza} USD</p>
                        <input type="number" value={condonatedValues.gastos_cobranza} onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setCondonatedValues({...condonatedValues, gastos_cobranza: val});
                            setValues({
                                ...credit,
                                gastos_cobranza: (Number(store_condonation.gastos_cobranza) - val).toFixed(2).replace(/([0-9]+(\.[ 0-9]+[1-9]))?(\. ?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.gastos_cobranza} USD</p>
                    </div>
                    <div>
                        <p>Otros valores</p>
                        <p>$ {store_condonation.otros_valores} USD</p>
                        <input type="number" value={condonatedValues.otros_valores} onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setCondonatedValues({...condonatedValues, otros_valores: val});
                            setValues({
                                ...credit,
                                otros_valores: (Number(store_condonation.otros_valores) - val).toFixed(2).replace(/([0-9]+(\.[ 0-9]+[1-9]))?(\. ?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.otros_valores} USD</p>
                    </div>
                </div>

                <div className="CardCondonacion__result">
                    <p>Total condonado:</p>
                    <p>$ {(Number(store_condonation.total) - (Number(credit.capital) + Number(credit.mora) + Number(credit.interes) + Number(credit.seguro_desgravamen) + Number(credit.gastos_cobranza) + Number(credit.gastos_judiciales) + Number(credit.otros_valores))).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')}</p>
                </div>

                <div className="CardCondonacion__result">
                    <p>Gasto de cobranza SEFIL:</p>
                    <p>$ {Number(store_condonation.gastos_cobranza_sefil).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')}</p>
                </div>

                <div className="CardCondonacion__result">
                    <p>Total a cancelar:</p>
                    <p>$ {(Number(credit.capital) + Number(credit.mora) + Number(credit.interes) + Number(credit.seguro_desgravamen) + Number(credit.gastos_cobranza) + Number(store_condonation.gastos_cobranza_sefil) + Number(credit.gastos_judiciales) + Number(credit.otros_valores)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')}</p>
                </div>

                <button className="CardCondonacion__save"
                    onClick={(e) => {

                        e.target.textContent = 'Guardando...';

                        const totalAmountPostDates = Number(credit.capital) + Number(credit.mora) + Number(credit.interes) + Number(credit.seguro_desgravamen) + Number(credit.gastos_cobranza) + Number(store_condonation.gastos_cobranza_sefil) + Number(credit.gastos_judiciales) + Number(credit.otros_valores);

                        const data = {
                            credit_id: Number(store_condonation.id),
                            post_dates: {
                                total_amount: Number(totalAmountPostDates.toFixed(2)),
                                capital: Number(credit.capital),
                                interest: Number(credit.interes),
                                mora: Number(credit.mora),
                                safe: Number(credit.seguro_desgravamen),
                                management_collection_expenses: Number(store_condonation.gastos_cobranza_sefil),
                                collection_expenses: Number(credit.gastos_cobranza),
                                legal_expenses: Number(credit.gastos_judiciales),
                                other_values: Number(credit.otros_valores)
                            }
                        };

                        useCondonation(data, e.target, handleViewPDF, store_condonation.update);
                    }}
                >Guardar condonación</button>
            </div>
        </div>
    );
}