import { useEffect, useState } from "react";
import "./CardStructure.css";
import useStruct from "../../hooks/useStruct";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useGenerateQuotes from "../../helpers/Credits/useGenerateQuotes";
import { useStoreStructure } from "../../stores/useStoreStructure";

export default function CardStructure(){
    
    const store_structure=useStoreStructure();

    const [by_number_quote,setNumberQuote]=useState(0);
    const [by_amount_quote,setAmountQuote]=useState(0);
    const [agreement,setAgreement]=useState({});

    const handlerCleanAgreement=({value,parameter_name})=>{
        if(parameter_name==='number'){
            setNumberQuote(value);
            setAmountQuote(0);
        }else{
            setAmountQuote(value);
            setNumberQuote(0);
        }

        setQuoteDetail([]);
    };

    const [quote_detail,setQuoteDetail]=useState([]);

    useEffect(()=>{
        setAgreement({
        valor_cuota:store_structure.amount_fee,
        cuotas_pendientes:0,
        cuota:0,
        fecha:null,
        credito:store_structure.credit_id,
        cartera:store_structure.cartera,
        cobranza:store_structure.gasto_cobranza,
        status:'',
        detail:'',
        totalAmount:store_structure.total_amount
    });
    },[store_structure]);

    if(!store_structure.isViewOn) return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{store_structure.viewOn(false)}}>Volver</button>
            <div className="CardStructure">

                <p>Convenio de pago</p>

                <div className="CardCondonacion__select">
                    <label>Saldo a desglozar:</label>
                    <label>{useFormatterNumber({value:agreement.totalAmount,currency:'USD'})}</label>
                </div>

                <h4>Calcular por número de cuotas</h4>

                <div className="CardCondonacion__select">
                    <label>Número de cuotas:</label>
                    <input 
                        type="number" 
                        value={by_number_quote} 
                        onChange={(e)=>{ 
                            if(e.target.value>=0){
                                handlerCleanAgreement({
                                    value:e.target.value,
                                    parameter_name:'number'
                                });
                            }else{
                                setNumberQuote(0);
                            }
                        }}
                        min={1} 
                        step={1}
                    />
                </div>

                <h4>Calcular por monto de cuota</h4>

                <div className="CardCondonacion__select">
                    <label>Monto de cuota:</label>
                    <input 
                        type="number" 
                        value={by_amount_quote} 
                        onChange={(e)=>{ 
                            if(e.target.value>=0 & e.target.value<=agreement.totalAmount){
                                handlerCleanAgreement({
                                    value:e.target.value,
                                    parameter_name:'amount'
                                });
                            }else{
                                setAmountQuote(agreement.totalAmount);
                            }
                        }}
                        min={1}
                        max={agreement.totalAmount}
                        step={1}
                    />
                </div>

                <div className="CardCondonacion__select">
                    <label>
                        Fecha primer pago:
                        <input
                            type="date" 
                            value={agreement.fecha} 
                            onChange={(e)=>{ 
                                setAgreement({
                                    ...agreement,
                                    fecha:e.target.value
                                });
                            }}
                        />
                    </label>
                    <button
                        className="CardStructure__button--generate"
                        onClick={async (e)=>{
                            setQuoteDetail([]);
                            
                            if(agreement.fecha=="" | agreement.fecha==null){
                                
                            }else{
                                if(by_number_quote>0){
                                    await useGenerateQuotes({
                                        amount:agreement.totalAmount,
                                        cobranza:agreement.cobranza,
                                        parameter_name:'number_quotes',
                                        parameter_value:by_number_quote,
                                        start_date:agreement.fecha,
                                        setQuote:setQuoteDetail
                                    });
                                }else{
                                    await useGenerateQuotes({
                                        amount:agreement.totalAmount,
                                        cobranza:agreement.cobranza,
                                        parameter_name:'amount_quotes',
                                        parameter_value:by_amount_quote,
                                        start_date:agreement.fecha,
                                        setQuote:setQuoteDetail
                                    });
                                }
                            }
                        }}
                    >
                        Generar
                    </button>
                </div>
                
                {
                    <div className="CardCondonacion__quotes">
                        {
                            quote_detail.map((quote,index)=>(
                                <div key={index}>
                                    <label>{quote.cuota}</label>
                                    <input
                                        type="number"
                                        className="desgloce_inputs"
                                        placeholder="0.00"
                                        step={0.01}
                                        defaultValue={quote.valor}
                                        onChange={(e)=>{
                                            
                                        }}
                                        disabled
                                    />
                                    <input 
                                        type="date" 
                                        value={quote.fecha_pago}
                                        disabled
                                    />
                                </div>
                            ))
                        }
                    </div>
                }

                <button 
                    className="CardStructure__button--save"
                    onClick={async (e)=>{
                        e.target.textContent="Guardando...";

                        const data={
                            ...agreement,
                            detail:JSON.stringify(quote_detail),
                            cuota:1,
                            cuotas_pendientes:quote_detail.length-1,
                            fecha:quote_detail[0].fecha_pago,
                            valor_cuota:quote_detail[0].valor
                        }
                        
                        const create_agreement=await useStruct(data,e.target,store_structure.credit_id);
                    }}
                >Guardar cambios</button>
            </div>
        </div>
    );
}