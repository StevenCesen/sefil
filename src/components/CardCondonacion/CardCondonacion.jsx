import { useEffect, useState } from "react";
import "./CardCondonacion.css";
import useCondonation from "../../hooks/useCondonation";
import { useStoreCondonation } from "../../stores/useStoreCondonation";

export default function CardCondonacion() {
    const [credit, setValues] = useState();
    const store_condonation = useStoreCondonation();

    const handleViewPDF = (data) => {
        store_condonation.setResponse(data);
        store_condonation.setViewPDF(true);
    }

    useEffect(() => {
        setValues({
            capital: store_condonation.capital,
            mora: (store_condonation.mora > 0) ? store_condonation.mora : 0,
            interes: (store_condonation.interes > 0) ? store_condonation.interes : 0,
            seguro_desgravamen: (store_condonation.seguro_desgravamen > 0) ? store_condonation.seguro_desgravamen : 0,
            gastos_judiciales: (store_condonation.gastos_judiciales > 0) ? store_condonation.gastos_judiciales : 0,
            gastos_cobranza: (store_condonation.gastos_cobranza > 0) ? store_condonation.gastos_cobranza : 0,
            otros_valores: (store_condonation.otros_valores > 0) ? store_condonation.otros_valores : 0
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
                        <input type="number" onChange={(e) => {
                            setValues({
                                ...credit,
                                capital: (Number(store_condonation.capital) - Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.capital} USD</p>
                    </div>
                    <div>
                        <p>Interés</p>
                        <p>$ {store_condonation.interes} USD</p>
                        <input type="number" onChange={(e) => {
                            setValues({
                                ...credit,
                                interes: (Number(store_condonation.interes) - Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.interes} USD</p>
                    </div>
                    <div>
                        <p>Mora</p>
                        <p>$ {store_condonation.mora} USD</p>
                        <input type="number" onChange={(e) => {
                            setValues({
                                ...credit,
                                mora: (Number(store_condonation.mora) - Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.mora} USD</p>
                    </div>
                    <div>
                        <p>Seguro desgravamen</p>
                        <p>$ {store_condonation.seguro_desgravamen} USD</p>
                        <input type="number" onChange={(e) => {
                            setValues({
                                ...credit,
                                seguro_desgravamen: (Number(store_condonation.seguro_desgravamen) - Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.seguro_desgravamen} USD</p>
                    </div>
                    <div>
                        <p>Gastos judiciales</p>
                        <p>$ {store_condonation.gastos_judiciales} USD</p>
                        <input type="number" onChange={(e) => {
                            setValues({
                                ...credit,
                                gastos_judiciales: (Number(store_condonation.gastos_judiciales) - Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.gastos_judiciales} USD</p>
                    </div>
                    <div>
                        <p>Gastos de cobranza</p>
                        <p>$ {store_condonation.gastos_cobranza} USD</p>
                        <input type="number" onChange={(e) => {
                            setValues({
                                ...credit,
                                gastos_cobranza: (Number(store_condonation.gastos_cobranza) - Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
                            })
                        }} placeholder="0.00" min={0} step={0.1} />
                        <p>$ {credit.gastos_cobranza} USD</p>
                    </div>
                    <div>
                        <p>Otros valores</p>
                        <p>$ {store_condonation.otros_valores} USD</p>
                        <input type="number" onChange={(e) => {
                            setValues({
                                ...credit,
                                otros_valores: (Number(store_condonation.otros_valores) - Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
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

                        const data = {
                            prevDates: JSON.stringify({
                                mora: (store_condonation.mora > 0) ? store_condonation.mora : 0,
                                interes: (store_condonation.interes > 0) ? store_condonation.interes : 0,
                                capital: store_condonation.capital,
                                seguro_desgravamen: (store_condonation.seguro_desgravamen > 0) ? store_condonation.seguro_desgravamen : 0,
                                gastos_cobranza: (store_condonation.gastos_cobranza > 0) ? store_condonation.gastos_cobranza : 0,
                                gastos_judiciales: (store_condonation.gastos_judiciales > 0) ? store_condonation.gastos_judiciales : 0,
                                otros_valores: (store_condonation.otros_valores > 0) ? store_condonation.otros_valores : 0
                            }),
                            postDates: JSON.stringify(credit),
                            totalAmount: String(Number(credit.capital) + Number(credit.mora) + Number(credit.interes) + Number(credit.seguro_desgravamen) + Number(credit.gastos_cobranza) + Number(credit.gastos_judiciales) + Number(credit.otros_valores)),
                            saldo_capital: credit.capital,
                            interes: credit.interes,
                            mora: credit.mora,
                            seguro_desgravamen: credit.seguro_desgravamen,
                            gastos_cobranza: credit.gastos_cobranza,
                            gastos_judiciales: credit.gastos_judiciales,
                            otros_valores: (credit.otros_valores > 0) ? credit.otros_valores : 0,
                            credito: Number(store_condonation.id),
                            cartera: store_condonation.cartera
                        }
                        useCondonation(data, e.target, store_condonation.id, handleViewPDF);
                    }}
                >Guardar condonación</button>
            </div>
        </div>
    );
}