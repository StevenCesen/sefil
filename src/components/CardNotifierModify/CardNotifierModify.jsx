import { useContext, useEffect, useState } from "react";
import "./CardNotifierModify.css";
import { NotifierContext } from "../../contexts/notifierContext";

export default function CardNotifierModify({title,message,credito,cartera,user_generate,prev_data,current_data,id,name,ci}){

    const [condonation,setCondonation]=useState({});
    const [restruct,setRestruct]=useState({});
    const dataContext=useContext(NotifierContext);

    useEffect(()=>{
        
        if(title.toLowerCase()==='condonación'){
            setCondonation({
                capital:(Number(prev_data.capital)-Number(current_data.capital)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                mora:(Number(prev_data.mora)-Number(current_data.mora)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                interes:(Number(prev_data.interes)-Number(current_data.interes)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                seguro_desgravamen:(Number(prev_data.seguro_desgravamen)-Number(current_data.seguro_desgravamen)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                gastos_cobranza:(Number(prev_data.gastos_cobranza)-Number(current_data.gastos_cobranza)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'),
                gastos_judiciales:(Number(prev_data.gastos_judiciales)-Number(current_data.gastos_judiciales)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
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

            <p className="CardNotifierModify__title">CLIENTE: {name}</p>

            <p className="CardNotifierModify__title">CÉDULA: {ci}</p>

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

                        <div className="CardNotifierModify__datesCondonacion">
                            <label>Total condonado</label>
                            <label>$ {((Number(condonation.capital)+Number(condonation.mora)+Number(condonation.interes)+Number(condonation.seguro_desgravamen)+Number(condonation.gastos_cobranza)+Number(condonation.gastos_judiciales))).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}</label>
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
                                        nro_cuotas:e.target.value,
                                        cuota:(Number(restruct.total)/Number(e.target.value)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
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
                <button 
                    className="CardNotifierModify__button--success"
                    onClick={(e)=>{
                        e.target.textContent="Autorizando...";
                        const data=restruct;
                        data.cartera=cartera;
                        data.credito=credito;

                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/estructurar/${id}`,{
                            method:'PUT',
                            body:new URLSearchParams(data),
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                console.log(data);
                                dataContext.removePush(id);
                            });

                    }}
                >Guardar y autorizar</button>

                <button className="CardNotifierModify__button--failed">Rechazar</button>
            </div>
        </div>
    );
}