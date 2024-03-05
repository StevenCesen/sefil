import { useEffect, useState } from "react";
import "./CardNotifierModify.css";

export default function CardNotifierModify({title,message,credito,cartera,user_generate,prev_data,current_data}){

    const [condonation,setCondonation]=useState({});
    const [restruct,setRestruct]=useState({});

    useEffect(()=>{
        
        if(title.toLowerCase()==='condonación'){
            setCondonation({
                capital:current_data.capital,
                mora:current_data.mora,
                interes:current_data.interes,
                seguro_desgravamen:current_data.seguro_desgravamen,
                gastos_cobranza:current_data.gastos_cobranza,
                gastos_judiciales:current_data.gastos_judiciales
            });
        }else if(title.toLowerCase()==='reestructuración'){
            setRestruct({
                nro_cuotas:current_data.totalFees,
                fecha:current_data.paymentDate,
                cuota:current_data.monthlyFeeAmount,
                total:current_data.totalAmount
            });
        }

    },[]);

    return (
        <div className="CardNotifierModify">

            <span>{title}</span>

            <p className="CardNotifierModify__title">{message} | Generado por: {user_generate}</p>
            
            <p className="CardNotifierModify__title">Datos generados por el agente: </p>


            <div className="CardNotifierModify__subhead">
                <p>Nro. crédito: {credito}</p>
                <p>Cartera: {cartera}</p>
            </div>

            {
                (title.toLowerCase()==='condonación')
                ?
                    <div className="CardNotifierModify__dates">
                        <div className="CardNotifierModify__datesCondonacion--head">
                            <label>Detalle</label>
                            <label>Original</label>
                            <label>Condonado</label>
                        </div>
                        
                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Saldo capital</label>
                            <label>$ {prev_data.capital} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.capital}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            capital:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Mora</label>
                            <label>$ {prev_data.mora} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.mora}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            mora:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Interes</label>
                            <label>$ {prev_data.interes} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.interes}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            interes:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Seguro desgravamen</label>
                            <label>$ {prev_data.seguro_desgravamen} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.seguro_desgravamen}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            seguro_desgravamen:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Gastos de cobranza</label>
                            <label>$ {prev_data.gastos_cobranza} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.gastos_cobranza}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            gastos_cobranza:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Gastos judiciales</label>
                            <label>$ {prev_data.gastos_judiciales} USD</label>
                            <label>$ 
                                <input type="number" value={condonation.gastos_judiciales}
                                    onChange={(e)=>{
                                        setCondonation({
                                            ...condonation,
                                            gastos_judiciales:e.target.value
                                        });
                                    }}
                                />
                            </label>
                        </div>

                    </div>
                :
                    <div className="CardNotifierModify__dates">
                        <div className="CardNotifierModify__datesRestruct">
                            <label>
                                Número de cuotas:
                            </label>
                            <input type="number" value={restruct.nro_cuotas} 
                                onChange={(e)=>{
                                    setRestruct({
                                        ...restruct,
                                        nro_cuotas:e.target.value
                                    });
                                }} 
                            />
                        </div>

                        <div className="CardNotifierModify__datesRestruct">
                            <label>
                                Fecha de pago:
                            </label>
                            <input type="date" value={restruct.fecha} 
                                onChange={(e)=>{
                                    setRestruct({
                                        ...restruct,
                                        fecha:e.target.value
                                    });
                                }} 
                            />
                        </div>

                        <div className="CardNotifierModify__datesRestruct">
                            <label>
                                Valor de cuota:
                            </label>
                            <input type="number" value={restruct.cuota}
                                onChange={(e)=>{
                                    setRestruct({
                                        ...restruct,
                                        cuota:e.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="CardNotifierModify__datesRestruct">
                            <label>
                                Total:
                            </label>
                            <input type="number" value={restruct.total}
                                onChange={(e)=>{
                                    setRestruct({
                                        ...restruct,
                                        total:e.target.value
                                    });
                                }}
                            />
                        </div>
                    </div>
            }

            <div className="CardNotifierModify__buttons">
                <button className="CardNotifierModify__button--success">Guardar y autorizar</button>
                <button className="CardNotifierModify__button--failed">Rechazar</button>
            </div>
        </div>
    );
}