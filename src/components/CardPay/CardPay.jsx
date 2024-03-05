import { useEffect, useRef, useState } from "react";
import "./CardPay.css";
import { PDFViewer } from "@react-pdf/renderer";
import PDF from "../PDF";
import usePrelacion from "../../hooks/usePrelacion";

export default function CardPay({setPay,data,id,cartera}){

    const [pay,setData]=useState({
        tipo_transaccion:'total',
        forma_pago:'',
        valor_recibido:'',
        valor_devuelto:'',
        institucion_financiera:'',
        codigo_deposito:'',
        credito:id,
        detalle:{
            totalAmount:0.00,
            saldo_capital:0.00,
            interes:0.00,
            mora:0.00,
            seguro_desgravamen:0.00,
            gastos_cobranza:0.00,
            gastos_judiciales:0.00,
            otros_valores:0.00
        }
    });

    const [send,setSend]=useState({
        prevDates:{
            mora:'',
            interes:'',
            seguro_desgravamen:'',
            gastos_judiciales:'',
            saldo_capital:'',
            gastos_cobranza:'',
            totalAmount:'',
            otros_valores:''
        },
        tipo_transaccion:'',
        forma_pago:'',
        valor_recibido:'',
        valor_devuelto:'',
        institucion_financiera:'',
        codigo_deposito:'',
        credito:id,
        detalle:{
            totalAmount:0.00,
            saldo_capital:0.00,
            interes:0.00,
            mora:0.00,
            seguro_desgravamen:0.00,
            gastos_cobranza:0.00,
            gastos_judiciales:0.00,
            otros_valores:0.00
        }
    });

    const title=useRef();

    const [active,setActive]=useState(true);

    const [prelacion,setPrelacion]=useState({
        totalAmount:0,
        saldo_capital:0.00,
        interes:0.00,
        mora:0.00,
        seguro_desgravamen:0.00,
        gastos_cobranza:0.00,
        gastos_judiciales:0.00,
        otros_valores:0.00
    });

    const [idVouch,setVouch]=useState(0);

    const ref=useRef();

    const updateDetalle=(detalle)=>{
        setData({
            ...pay,
            detalle:detalle
        });
    };

    useEffect(()=>{
        setData({
            ...pay,
            forma_pago:'efectivo',
            tipo_transaccion:'total',
            institucion_financiera:'Banco de Loja',
            valor_devuelto:'0',
            valor_recibido:'0',
            codigo_deposito:'0',
            credito:id,
            detalle:{
                totalAmount:data.totalAmount,
                saldo_capital:data.saldo_capital,
                interes:data.interes,
                mora:data.mora,
                seguro_desgravamen:data.seguro_desgravamen,
                gastos_cobranza:data.gastos_cobranza,
                gastos_judiciales:data.gastos_judiciales,
                otros_valores:data.otros_valores
            }
        });
        setActive(true);
    },[]);  

    return(
        <div className="CardPay">
            
            <div className="CardPay__contentPay">
                <button onClick={()=>{setPay()}}>Volver</button>

                <div className="CardPay__head">
                    <h3 ref={title}>PAGO</h3>
                    <img src="./icons/logo.png"/>
                </div>

                <div className="CardPay__detailPay">
                    <div>
                        <p>
                            <label>Tipo de transacción</label>
                            <label>:</label>
                        </p>
                        
                        {
                            (active) ?
                                <select value={pay.tipo_transaccion} onChange={(e)=>{
                                    setData({
                                        ...pay,
                                        tipo_transaccion:e.target.value
                                    });
                                }}>
                                    <option value="total">Pago total</option>
                                    <option value="parcial">Pago parcial</option>
                                </select>
                            :
                                <p>{pay.tipo_transaccion.toUpperCase()}</p>
                        }
                        
                    </div>
                    
                    <div>
                        <p>
                            <label>Forma de pago</label>
                            <label>:</label>
                        </p>
                        
                        <select value={pay.forma_pago} onChange={(e)=>{
                            setData({
                                ...pay,
                                forma_pago:e.target.value
                            })
                        }}>
                            <option value="efectivo">Efectivo</option>
                            <option value="deposito">Depósito</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                        
                    </div>

                    {
                        (pay.forma_pago!=='efectivo') &&
                            <div>
                                <p>
                                    <label>Institución financiera</label>
                                    <label>:</label>
                                </p>
                                
                                <select value={pay.institucion_financiera} onChange={(e)=>{
                                    setData({
                                        ...pay,
                                        institucion_financiera:e.target.value
                                    });   
                                }}>
                                    <option value="Banco de Loja">Banco de Loja</option>
                                    <option value="Banco Pichincha">Banco Pichincha</option>
                                    <option value="Banco de Guayaquil">Banco de Guayaquil</option>
                                </select>
                            </div>
                    }
                    {
                        (pay.forma_pago!=='efectivo') &&
                            <div>
                                <p>
                                    <label>Código de depósito/transferencia</label>
                                    <label>:</label>
                                </p>
                                <input type="number" value={pay.codigo_deposito} onChange={(e)=>{
                                    setData({
                                        ...pay,
                                        codigo_deposito:e.target.value
                                    });
                                }} />
                            </div>
                    }

                    <div>
                        <p>
                            <label>Nombre</label>
                            <label>:</label>
                        </p>
                        <p>{data.name}</p>
                    </div>
                    <div>
                        <p>
                            <label>Cédula</label>
                            <label>:</label>
                        </p>
                        <p>{data.ci}</p>
                    </div>
                    <div>
                        <p>
                            <label>Mora</label>
                            <label>:</label>
                        </p>
                        <p>{Number(pay.detalle.mora).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</p>
                        
                    </div>
                    <div>
                        <p>
                            <label>Interés</label>
                            <label>:</label>
                        </p>
                        <p>{Number(pay.detalle.interes).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Seguro desgravamen</label>
                            <label>:</label>
                        </p>
                        <p>{Number(pay.detalle.seguro_desgravamen).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Gastos judiciales</label>
                            <label>:</label>
                        </p>
                        <p>{Number(pay.detalle.gastos_judiciales).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Capital</label>
                            <label>:</label>
                        </p>
                        <p>{Number(pay.detalle.saldo_capital).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Gastos de cobranza</label>
                            <label>:</label>
                        </p>
                        <p>{Number(pay.detalle.gastos_cobranza).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Otros valores</label>
                            <label>:</label>
                        </p>
                        <p>{pay.detalle.otros_valores} $</p>
                    </div>
                    <div>
                        {
                            <>
                                <p>
                                    <label>Total</label>
                                    <label>:</label>
                                </p>
                                <p>{Number(pay.detalle.totalAmount).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</p>
                            </> 
                        }
                    </div>

                    {
                        (pay.forma_pago==='efectivo' | pay.tipo_transaccion==='parcial') ?
                            <>
                                <div>
                                    <p>
                                        <label>Valor recibido</label>
                                        <label>:</label>
                                    </p>
                                    <input type="number" placeholder="0" ref={ref} onChange={(e)=>{
                                        if(pay.tipo_transaccion==='parcial'){
                                            setData({
                                                ...pay,
                                                valor_recibido:e.target.value
                                            })
                                            usePrelacion(e.target.value,data,setPrelacion,updateDetalle);
                                        }else{
                                            if(pay.forma_pago==='efectivo'){
                                                setData({
                                                    ...pay,
                                                    valor_recibido:e.target.value,
                                                    valor_devuelto:String((e.target.value-Number(data.totalAmount)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'))
                                                })
                                            }
                                        }

                                    }} min={Number(data.totalAmount)} step={0.1}/>
                                </div>
                            </>
                        :   <></>
                    }
                    {
                        (pay.tipo_transaccion==='total') ?
                            (pay.forma_pago==='efectivo') 
                            ?
                                <div>
                                    <p>
                                        <label>Valor devuelto</label>
                                        <label>:</label>
                                    </p>
                                
                                    <input type="number" value={Number(pay.valor_devuelto).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} disabled/>
                                </div>
                            :
                                <div>
                                    <p>
                                        <label>Diferencia</label>
                                        <label>:</label>
                                    </p>
                                
                                    <input 
                                        type="number" 
                                        onChange={(e)=>[
                                            setData({
                                                ...pay,
                                                valor_devuelto:Number(e.target.value).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
                                            })
                                        ]}
                                        value={Number(pay.valor_devuelto).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}/>
                                </div>

                        :   <></>
                    }
                </div>

                {
                    (active) ?
                        <button className="CardPay__button" onClick={(e)=>{
                            e.target.textContent='Registrando pago...';

                            let data_send={
                                prevDates:{
                                    mora:data.mora,
                                    interes:data.interes,
                                    seguro_desgravamen:data.seguro_desgravamen,
                                    gastos_judiciales:data.gastos_judiciales,
                                    saldo_capital:data.saldo_capital,
                                    gastos_cobranza:data.gastos_cobranza,
                                    totalAmount:data.totalAmount,
                                    otros_valores:data.otros_valores
                                },
                                tipo_transaccion:pay.tipo_transaccion,
                                forma_pago:pay.forma_pago,
                                valor_recibido:'',
                                valor_devuelto:'',
                                institucion_financiera:pay.institucion_financiera,
                                codigo_deposito:pay.codigo_deposito,
                                credito:id,
                                detalle:{
                                    totalAmount:0.00,
                                    saldo_capital:0.00,
                                    interes:0.00,
                                    mora:0.00,
                                    seguro_desgravamen:0.00,
                                    gastos_cobranza:0.00,
                                    gastos_judiciales:0.00,
                                    otros_valores:0.00
                                }
                            }

                            if(pay.tipo_transaccion==='parcial'){
                                data_send.tipo_transaccion=pay.tipo_transaccion;
                                data_send.mora=String(prelacion.mora);
                                data_send.interes=String(prelacion.interes);
                                data_send.seguro_desgravamen=String(prelacion.seguro_desgravamen);
                                data_send.gastos_judiciales=String(prelacion.gastos_judiciales);
                                data_send.saldo_capital=String(prelacion.saldo_capital);
                                data_send.gastos_cobranza=String(prelacion.gastos_cobranza);
                                data_send.totalAmount=String(prelacion.totalAmount);
                                data_send.otros_valores=String(prelacion.otros_valores);

                                data_send.detalle.saldo_capital=String(Number(data.saldo_capital)-Number(prelacion.saldo_capital));
                                data_send.detalle.interes=String(Number(data.interes)-Number(prelacion.interes));
                                data_send.detalle.mora=String(Number(data.mora)-Number(prelacion.mora));
                                data_send.detalle.seguro_desgravamen=String(Number(data.seguro_desgravamen)-Number(prelacion.seguro_desgravamen));
                                data_send.detalle.gastos_cobranza=String(Number(data.gastos_cobranza)-Number(prelacion.gastos_cobranza));
                                data_send.detalle.gastos_judiciales=String(Number(data.gastos_judiciales)-Number(prelacion.gastos_judiciales));
                                data_send.detalle.otros_valores=String(Number(data.otros_valores)-Number(prelacion.otros_valores));
                                data_send.detalle.totalAmount=String(Number(prelacion.totalAmount));

                                data_send.valor_recibido=ref.current.value;
                                data_send.valor_devuelto=0;

                            }else if(pay.forma_pago==='efectivo'){
                                data_send.valor_recibido=ref.current.value;
                                data_send.valor_devuelto=pay.valor_devuelto;

                            }else{
                                data_send.valor_recibido=Number(data.totalAmount)+Number(pay.valor_devuelto);
                                data_send.valor_devuelto=pay.valor_devuelto;
                            }

                            setSend(data_send);
                            
                            let data_encode=data_send;
                            data_encode.prevDates=JSON.stringify(data_encode.prevDates);
                            data_encode.detalle=JSON.stringify(data_encode.detalle);
                            data_encode.cartera=cartera;

                            // AGREGAR EL SALDO DEL CRÉDITO QUE QUEDA DEBIEND

                            console.log(data_encode)
                            fetch(`https://sefil.softsen.space/public/api/credit/pay/${id}`,{
                                method:'PUT',
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                },
                                body:new URLSearchParams(data_encode)
                            })
                                .then((response) => response.json())  
                                .then(async (data) => {
                                    
                                    if(data.status===200){
                                        setVouch(data.id);
                                        e.target.textContent='Pago registrado';
                                        title.current.textContent='COMPROBANTE DE PAGO';
                                        setActive(false);
                                    }else{
                                        e.target.textContent='Error, inténtalo de nuevo';
                                    }
                                });
  
                        }}>Registrar pago</button>
                    :
                        <></>
                }

            </div>

            {
                (active===false) &&
                    <PDFViewer width={'500px'} height={'500px'}>
                        <PDF 
                            nro_voucher={idVouch}
                            type_print={"ORIGINAL"}
                            tipo_transaccion={send.tipo_transaccion}
                            forma_pago={send.forma_pago}
                            insitucion_financiera={send.institucion_financiera}
                            codigo_deposito={send.codigo_deposito}
                            name={data.name}
                            ci={data.ci}
                            
                            mora={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).mora : JSON.parse(send.prevDates).mora}
                            interes={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).interes : JSON.parse(send.prevDates).interes}
                            seguro_desgravamen={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).seguro_desgravamen : JSON.parse(send.prevDates).seguro_desgravamen}
                            gastos_judiciales={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).gastos_judiciales : JSON.parse(send.prevDates).gastos_judiciales}
                            saldo_capital={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).saldo_capital : JSON.parse(send.prevDates).saldo_capital}
                            gastos_cobranza={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).gastos_cobranza : JSON.parse(send.prevDates).gastos_cobranza}
                            otros_valores={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).otros_valores : JSON.parse(send.prevDates).otros_valores}

                            valor_recibido={(send.forma_pago==='efectivo' & send.tipo_transaccion!=='parcial') ? pay.valor_recibido : (send.tipo_transaccion==='total') ? Number(data.totalAmount)+Number(pay.valor_devuelto) : send.valor_recibido}
                            valor_devuelto={pay.valor_devuelto}

                            fecha={new Date().toLocaleDateString()}
                            agente={localStorage.getItem('name').substring(0,1)+localStorage.getItem('name').split(' ')[1]}
                        />
                    </PDFViewer>
            }

        </div>
    );
}