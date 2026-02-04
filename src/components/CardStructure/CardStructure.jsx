import { useEffect, useState } from "react";
import "./CardStructure.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useGenerateQuotes from "../../helpers/Credits/useGenerateQuotes";
import { useStoreStructure } from "../../stores/useStoreStructure";
import { useStoreLoader } from "../../stores/useStoreLoader";
import sendpush from "../../helpers/sendpush";
import createAgreement from "../../helpers/Credits/createAgreement";
import updateAgreement from "../../helpers/Credits/updateAgreement";

export default function CardStructure(){
    
    const store_structure=useStoreStructure();
    const loader = useStoreLoader();

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
            fecha:'',
            credito:store_structure.credit_id,
            cartera:store_structure.cartera,
            cobranza:store_structure.gasto_cobranza,
            status:'',
            detail:'',
            totalAmount:store_structure.total_amount
        });
        if(store_structure.view === 'edit' && store_structure.existing_fees?.length > 0){
            setQuoteDetail(store_structure.existing_fees);
            if(store_structure.existing_fees.length > 0){
                setNumberQuote(store_structure.existing_fees.length);
                setAmountQuote(parseFloat(store_structure.existing_fees[0].valor));
            }
        }
    },[store_structure]);

    if(!store_structure.isViewOn || store_structure.view === 'edit') return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{store_structure.viewOn(false)}}>Volver</button>
            <div className="CardStructure" style={{width:"350px"}}>

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
                                sendpush({
                                    title:'ERR: Sin Fecha.',
                                    message:'Se debe ingresar la fecha de la primer cuota.',
                                    type:'Push--danger',
                                    timeout:5000
                                })
                            }else if(by_amount_quote===0 & by_number_quote===0){
                                sendpush({
                                    title:'ERR: Sin datos.',
                                    message:'Se debe ingresar el número de cuotas o el monto de la cuota.',
                                    type:'Push--danger',
                                    timeout:5000
                                })
                            }else{
                                if(by_number_quote>0){
                                    await useGenerateQuotes({
                                        amount:agreement.totalAmount,
                                        cobranza:agreement.cobranza,
                                        parameter_name:'number_quotes',
                                        parameter_value:by_number_quote,
                                        start_date:agreement.fecha,
                                        setQuote:setQuoteDetail,
                                        isEdit: store_structure.view === 'edit'
                                    });
                                }else{
                                    await useGenerateQuotes({
                                        amount:agreement.totalAmount,
                                        cobranza:agreement.cobranza,
                                        parameter_name:'amount_quotes',
                                        parameter_value:by_amount_quote,
                                        start_date:agreement.fecha,
                                        setQuote:setQuoteDetail,
                                        isEdit: store_structure.view === 'edit'
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
                        e.target.setAttribute('disabled', '');
                        
                        if(quote_detail.length===0){
                            sendpush({
                                title:'ERR: Sin desgloce.',
                                message:'Se debe generar el desgloce de cuotas.',
                                type:'Push--danger',
                                timeout:5000
                            });
                            e.target.textContent="Guardar cambios";
                            e.target.removeAttribute('disabled');
                        }else if(agreement.fecha=="" || agreement.fecha==null){
                            sendpush({
                                title:'ERR: Sin Fecha.',
                                message:'Se debe ingresar la fecha de la primer cuota.',
                                type:'Push--danger',
                                timeout:5000
                            });
                            e.target.textContent="Guardar cambios";
                            e.target.removeAttribute('disabled');
                        }else if(by_amount_quote===0 && by_number_quote===0){
                            sendpush({
                                title:'ERR: Sin datos.',
                                message:'Se debe ingresar el número de cuotas o el monto de la cuota.',
                                type:'Push--danger',
                                timeout:5000
                            });
                            e.target.textContent="Guardar cambios";
                            e.target.removeAttribute('disabled');
                        }else{
                            loader.viewOn(true);

                            const fee_detail = quote_detail.map(quote => ({
                                payment_date: quote.fecha_pago,
                                payment_value:  parseFloat(quote.valor),
                                payment_amount: parseFloat(quote.valor),
                                payment_status: "PENDIENTE"
                            }));
                            
                            const data = {
                                credit_id: parseInt(store_structure.credit_id),
                                total_amount: parseFloat(agreement.totalAmount),
                                fee_amount: parseFloat(quote_detail[0].valor),
                                fee_detail: fee_detail
                            };

                            try {
                                let result;

                                if(store_structure.agreement_id && store_structure.view === 'edit') {
                                    result = await updateAgreement(store_structure.agreement_id, data);
                                } else {
                                    result = await createAgreement(data);
                                }
                                
                                loader.viewOn(false);
                                
                                if(result.code === 1){
                                    sendpush({
                                        title:'Éxito',
                                        message: store_structure.view === 'edit' 
                                            ? 'Convenio de pago actualizado exitosamente'
                                            : 'Convenio de pago creado exitosamente',
                                        type:'Push--sucessful',
                                        timeout:3000
                                    });
                                    e.target.textContent = store_structure.view === 'edit' 
                                        ? "Cambios guardados"
                                        : "Guardado correctamente";
                                    
                                    // Cerrar modal después de 2 segundos
                                    setTimeout(() => {
                                        store_structure.viewOn(false);
                                    }, 2000);
                                } else {
                                    sendpush({
                                        title:'Error',
                                        message: result.message || 'Error al guardar convenio de pago',
                                        type:'Push--danger',
                                        timeout:5000
                                    });
                                    e.target.textContent="Inténtalo de nuevo";
                                    e.target.removeAttribute('disabled');
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                loader.viewOn(false);
                                sendpush({
                                    title:'Error',
                                    message:'Error al guardar convenio de pago',
                                    type:'Push--danger',
                                    timeout:5000
                                });
                                e.target.textContent="Inténtalo de nuevo";
                                e.target.removeAttribute('disabled');
                            }
                        }
                    }}
                >Guardar cambios</button>
            </div>
        </div>
    );
}