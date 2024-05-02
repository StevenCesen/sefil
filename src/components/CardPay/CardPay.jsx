import { useEffect, useRef, useState } from "react";
import "./CardPay.css";
import { PDFViewer } from "@react-pdf/renderer";
import PDF from "../PDF";
import usePrelacion from "../../hooks/usePrelacion";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useUpdateCredit from "../../hooks/useUpdateCredit";

export default function CardPay({setPay,data,id,cartera,setGastos,setPDF,setCredit}){

    const [pay,setData]=useState();

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

    const [cobranza,setCobranza]=useState();

    const [idVouch,setVouch]=useState(0);

    const [preview,setPreview]=useState(false);

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
            //fecha_pago:`${new Date().getFullYear()}-${((new Date().getMonth()+1)>10) ? new Date().getMonth()+1 : `0${new Date().getMonth()+1}`}-${((new Date().getDate())>10) ? new Date().getDate() : `0${new Date().getDate()}`}`,
            fecha_pago:'',
            tipo_transaccion:'total',
            institucion_financiera:'Banco de Loja | AHORROS',
            valor_devuelto:0,
            valor_recibido:0,
            codigo_deposito:0,
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
        setPreview(false);
        setCobranza({
            status:false,
            value:data.gastos_cobranza
        });

    },[]);  

    if(!pay) return <></>
    if(!cobranza) return <></>

    return(
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{
                setPay()
                // if(pay.tipo_transaccion==='total' & pay.valor_recibido!==0){
                //     setPDF(true)
                // }
            }}>Volver</button>
            <div className="CardPay__contentPay">

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
                                    ref.current.value=0;
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
                                    <option value="Banco de Loja | AHORROS">Banco de Loja | AHORROS</option>
                                    <option value="Banco de Loja | CORRIENTE">Banco de Loja | CORRIENTE</option>
                                    <option value="SERVIPAGOS_BL">SERVIPAGOS_BL</option>
                                    <option value="PAGO ÁGIL_BL">PAGO ÁGIL_BL</option>
                                    <option value="CACPE Loja">CACPE Loja</option>
                                    <option value="BanEcuador">BanEcuador</option>
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
                                <input type="text" value={pay.codigo_deposito} onChange={(e)=>{
                                    setData({
                                        ...pay,
                                        codigo_deposito:e.target.value.trim()
                                    });
                                }} />
                            </div>
                    }

                    <div>
                        <p>
                            <label>Fecha de depósito</label>
                            <label>:</label>
                        </p>
                        <input type="date" value={pay.fecha_pago} onChange={(e)=>{
                            setData({
                                ...pay,
                                fecha_pago:e.target.value
                            });
                        }} />
                    </div>

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
                        <p>{useFormatterNumber({value:pay.detalle.mora,currency:'USD'})} $</p>
                        
                    </div>
                    <div>
                        <p>
                            <label>Interés</label>
                            <label>:</label>
                        </p>
                        <p>{useFormatterNumber({value:pay.detalle.interes,currency:'USD'})} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Seguro desgravamen</label>
                            <label>:</label>
                        </p>
                        <p>{useFormatterNumber({value:pay.detalle.seguro_desgravamen,currency:'USD'})} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Gastos judiciales</label>
                            <label>:</label>
                        </p>
                        <p>{useFormatterNumber({value:pay.detalle.gastos_judiciales,currency:'USD'})} $</p>
                    </div>
                    <div>
                        <p>
                            <label>Capital</label>
                            <label>:</label>
                        </p>
                        <p>{useFormatterNumber({value:pay.detalle.saldo_capital,currency:'USD'})}</p>
                    </div>
                    <div>
                        <p>
                            <label>Gastos de cobranza</label>
                            <label>:</label>
                        </p>
                        <p>{useFormatterNumber({value:pay.detalle.gastos_cobranza,currency:'USD'})}</p>
                    </div>
                    <div>
                        <p>
                            <label>Otros valores</label>
                            <label>:</label>
                        </p>
                        <p>{useFormatterNumber({value:pay.detalle.otros_valores,currency:'USD'})}</p>
                    </div>
                    
                    <div>
                        {
                            <>
                                <p>
                                    <label>Total</label>
                                    <label>:</label>
                                </p>
                                
                                <p>{useFormatterNumber({
                                    value:pay.detalle.totalAmount,
                                    currency:'USD'
                                })}</p>
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
                                    <input type="text" placeholder="0" ref={ref} onChange={(e)=>{
                                        if(pay.tipo_transaccion==='parcial'){
                                            
                                            setData({
                                                ...pay,
                                                valor_recibido:Number(e.target.value)
                                            });

                                            usePrelacion(e.target.value,data,setPrelacion,updateDetalle);
                                            
                                        }else{
                                            if(pay.forma_pago==='efectivo'){
                                                console.log(data.totalAmount)
                                                setData({
                                                    ...pay,
                                                    valor_recibido:e.target.value,
                                                    valor_devuelto:(Number(e.target.value)>Number(data.totalAmount)) ? String((Number(e.target.value)-Number(data.totalAmount)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')) : 0
                                                })
                                            }
                                        }

                                    }}/>
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
                                data_send.mora=String(prelacion.mora.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.interes=String(prelacion.interes.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.seguro_desgravamen=String(prelacion.seguro_desgravamen.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.gastos_judiciales=String(prelacion.gastos_judiciales.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.saldo_capital=String(prelacion.saldo_capital.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.gastos_cobranza=String(prelacion.gastos_cobranza.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.totalAmount=String(prelacion.totalAmount.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.otros_valores=String(prelacion.otros_valores.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));

                                data_send.detalle.saldo_capital=String((Number(data.saldo_capital)-Number(prelacion.saldo_capital)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.detalle.interes=String((Number(data.interes)-Number(prelacion.interes)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.detalle.mora=String((Number(data.mora)-Number(prelacion.mora)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.detalle.seguro_desgravamen=String((Number(data.seguro_desgravamen)-Number(prelacion.seguro_desgravamen)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.detalle.gastos_cobranza=String((Number(data.gastos_cobranza)-Number(prelacion.gastos_cobranza)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.detalle.gastos_judiciales=String((Number(data.gastos_judiciales)-Number(prelacion.gastos_judiciales)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.detalle.otros_valores=String((Number(data.otros_valores)-Number(prelacion.otros_valores)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
                                data_send.detalle.totalAmount=String((Number(prelacion.totalAmount)).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));

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
                            data_encode.fecha_pago=pay.fecha_pago;

                            // AGREGAR EL SALDO DEL CRÉDITO QUE QUEDA DEBIENDO
                            if(data_encode.forma_pago!=='efectivo' & data_encode.codigo_deposito===0){
                                e.target.textContent='Error, falta código de transacción.'
                            }else if(data_encode.tipo_transaccion==='total' & (Number(data_encode.valor_recibido)<Number(data.totalAmount))){
                                e.target.textContent='Error, valor recibido no es correcto, inténtalo de nuevo.';
                            }else if(data_encode.valor_recibido==='0'){
                                e.target.textContent='Error, falta valor recibido.';
                            }else if(data_encode.fecha_pago===''){
                                e.target.textContent='Error, falta fecha de pago.';
                            }else{ 
                                //console.log(data_encode)
                                //Compruebo si no existe el mismo codigo de deposito
                                if(data_encode.forma_pago!=='efectivo'){
                                    
                                    fetch(`https://sefil.softsen.space/public/api/vouchers/verify?institucion=${data_encode.institucion_financiera}&codigo=${data_encode.codigo_deposito.trim()}`,{
                                            headers: {
                                                Accept: 'application/json'
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then(async (data) => {
                                                /*========================================================EL CÓDIGO DE DEPOSITO ES ÚNICO Y NO EXISTE AÚN EN BASE================================================*/
                                                if(data.state===200){
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
                                                            
                                                            /*========================================================PAGO EXITOSO================================================*/
                                                            if(data.status===200){

                                                                if('id' in data.gasto){
                                                                    //setPreview(true);
                                                                    setGastos({
                                                                        credito:data.gasto.credito,
                                                                        id:data.gasto.id,
                                                                        valor_gasto:data.gasto.postDates
                                                                    });
                                                                }

                                                                setVouch({
                                                                    id:data.id,
                                                                    sync:data.sync
                                                                });
                                                                e.target.textContent='Pago registrado';
                                                                title.current.textContent='COMPROBANTE DE PAGO';
                                                                setActive(false);
                                                                useUpdateCredit(cartera,id,setCredit);

                                                            }else{
                                                                e.target.textContent='Error, inténtalo de nuevo';
                                                            }
                                                        });
                                                }else{
                                                    e.target.textContent='Código de depósito repetido, inténtalo de nuevo.';
                                                }

                                            });
                                }else{
                                    /*========================================================PAGO EXITOSO================================================*/
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

                                                    if('id' in data.gasto){
                                                        //setPreview(true);
                                                        setGastos({
                                                            credito:data.gasto.credito,
                                                            id:data.gasto.id,
                                                            valor_gasto:data.gasto.postDates,
                                                            fecha:'',
                                                            clave_acceso:''
                                                        });
                                                    }

                                                    setVouch({
                                                        id:data.id,
                                                        sync:data.sync
                                                    });

                                                    e.target.textContent='Pago registrado';
                                                    title.current.textContent='COMPROBANTE DE PAGO';

                                                    setActive(false);
                                                    //Actualizar datos del crédito
                                                    useUpdateCredit(cartera,id,setCredit);
                                                }else{
                                                    e.target.textContent='Error, inténtalo de nuevo';
                                                }
                                            });
                                }
                        
                            }
  
                        }}>Registrar pago</button>
                    :
                        <button 
                            className="CardPay__button"
                            onClick={(e)=>{
                                e.target.textContent="Procesando...";
                                fetch(`https://sefil.softsen.space/public/api/credit/reverse/${idVouch.id}`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then(async (data) => {
                                        if(data.status===200){
                                            location.reload();
                                        }
                                    });
                            }}
                        >Revertir cobro</button>
                }

            </div>

            {
                (active===false) &&
                    <PDFViewer width={'500px'} height={'500px'}>
                        <PDF 
                            nro_voucher={idVouch.id}
                            type_print={"ORIGINAL"}
                            tipo_transaccion={send.tipo_transaccion}
                            forma_pago={send.forma_pago}
                            insitucion_financiera={send.institucion_financiera}
                            codigo_deposito={send.codigo_deposito}
                            name={data.name}
                            ci={data.ci}
                            credito={idVouch.sync}
                            
                            mora={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).mora : JSON.parse(send.prevDates).mora}
                            interes={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).interes : JSON.parse(send.prevDates).interes}
                            seguro_desgravamen={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).seguro_desgravamen : JSON.parse(send.prevDates).seguro_desgravamen}
                            gastos_judiciales={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).gastos_judiciales : JSON.parse(send.prevDates).gastos_judiciales}
                            saldo_capital={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).saldo_capital : JSON.parse(send.prevDates).saldo_capital}
                            gastos_cobranza={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).gastos_cobranza : JSON.parse(send.prevDates).gastos_cobranza}
                            otros_valores={(send.tipo_transaccion==='parcial') ? JSON.parse(send.detalle).otros_valores : JSON.parse(send.prevDates).otros_valores}

                            valor_recibido={(send.forma_pago==='efectivo' & send.tipo_transaccion!=='parcial') ? pay.valor_recibido : (send.tipo_transaccion==='total') ? Number(data.totalAmount)+Number(pay.valor_devuelto) : send.valor_recibido}
                            valor_devuelto={send.valor_devuelto}

                            fecha={new Date().toLocaleDateString()}
                            agente={localStorage.getItem('name').substring(0,1)+localStorage.getItem('name').split(' ')[1]}
                        />
                    </PDFViewer>
            }

        </div>
    );
}