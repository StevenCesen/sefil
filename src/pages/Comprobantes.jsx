import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import { useEffect, useRef, useState } from "react";
import useSearch from "../hooks/useSearch.js";
import useMenu from "../hooks/useMenu.js";
import "../components/CardUsuarios/CardUsuarios.css"
import PDF from "../components/PDF.jsx";
import { PDFViewer } from "@react-pdf/renderer";
import useSearchVouchers from "../hooks/useSearchVouchers.js";
import addNotification from "react-push-notification";
import useFormatterNumber from "../hooks/useFormatterNumber.js";
import useRol from "../hooks/useRol.js";
import CardReverse from "../components/CardReverse/CardReverse.jsx";

export default function Comprobantes(){
    const param = useParams();
    const cartera=new URLSearchParams(useLocation().search);

    const [comprobantes,setComprobantes]=useState([]);
    
    const [comprobante,setComprobante]=useState({});

    const [view,setView]=useState(false);

    const [credit,setCredit]=useState(0);

    const [val,setVal]=useState('');

    const [credits,setCredits]=useState({
        current_page:1,
        data:[],
        first_page_url:'',
        from:1,
        last_page:0,
        last_page_url:'',
        links:[],
        next_page_url:'',
        path:'',
        per_page:0,
        prev_page_url:'',
        to:0,
        total:0,
        acumulado:0,
    });

    const [business,setBusiness]=useState();

    const [view_reverse,setReverse]=useState(false);

    const updateReverse=()=>{
        setReverse(false);
    }

    const [message_nro,setMessage]=useState(true);

    const [aux_busines,setAux]=useState("");

    const menu=useRef();

    const updateData=(url)=>{
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => setComprobantes(data));
    }

    const updateCredits=(data)=>{
        setCredits({
            ...credits,
            data:data
        })
    }

    useEffect(()=>{
        if(param.id!==undefined){
            useSearch(param.id,cartera.get('cartera'),updateCredits,setCredits);
            setVal(param.id);
        }

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
            });
        setAux("");
        setMessage(true);
        setReverse(false);
    },[]);

    if(!business) return <></> 

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
                <NavLink 
                    to="" 
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1) 
                    }}
                >Regresar</NavLink>
            </div>

            {
                (cartera.get('cartera')) &&
                    <p style={{fontSize:'16px',marginBottom:20,fontFamily:'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',fontWeight:'100'}}><strong style={{fontWeight:'600',color:'var(--color-1)'}}>NOMBRE DEL CLIENTE:</strong> {cartera.get('name')}</p>
            }

            <div className="pageConsulta__search">
                <label>
                    Buscar cliente
                    <input onKeyUp={(e)=>{
                        const ci=e.target.value;
                        useSearch(ci,aux_busines,updateCredits,setCredits);
                        
                        if(ci.length>2){
                            setCredit(0);
                        }else{
                            setCredit(1);
                        }
                    }} onChange={(e)=>{setVal(e.target.value)}} value={val} placeholder="Número de cédula"/>
                </label>

                <label>
                    Empresa
                    <select onChange={(e)=>{
                        if(e.target.value!=='default'){
                            setAux(e.target.value);
                        }
                    }}>
                            <option value={"default"}>--Seleccionar--</option>
                        {
                            business.map((bus,index)=>(
                                <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                            ))
                        }
                    </select>
                </label>
                {
                    (credit===0) &&
                        <div className="pageConsulta__prevResult">
                            {
                                credits.data.map((credit,index)=>(
                                    (credit.ci===val) &&
                                        <button key={index} onClick={()=>{
                                            setCredit(credit.id);
                                            setMessage(false);

                                            if(param.id!==undefined){
                                                useSearchVouchers(credit.id,cartera.get('cartera'),setComprobantes);
                                            }else{
                                                useSearchVouchers(credit.id,aux_busines,setComprobantes);
                                            }
                                        }}>
                                            <p>{credit.name}</p>
                                            <p className="pageConsulta__prevResult--space"> | </p>
                                            <p>{credit.ci}</p>
                                            <p className="pageConsulta__prevResult--space"> | </p>
                                            <p>{credit.credito}</p>
                                        </button>
                                ))
                            }
                        </div>
                }
            </div>

            <div className="pageConsulta__results">
                <div className="DetailCredit__comprobantes">
                    <div>
                        <p>ID</p>
                        <p>Fecha pago</p>
                        <p>Fecha depósito</p>
                        <p>Capital</p>
                        <p>Interes</p>
                        <p>Mora</p>
                        <p>Seguro</p>
                        <p>Judicial</p>
                        <p>Cobranza</p>
                        <p>Otros valores</p>
                        <p>Monto</p>
                        
                        {/* Aquí van gastos de cobranza si tiene */}
                        {/* Aquí van valores de condonación si tiene */}
                        {/* Aquí  */}

                        <p>Acciones</p>
                    </div>

                    {
                        (comprobantes.length>0) ?
                            comprobantes.map((comprobante,index)=>(
                                <div key={index}>
                                    {
                                        (comprobante.id==='FACES') 
                                        ?
                                            <p>{comprobante.id}</p>
                                        :
                                            <button
                                                onClick={(e)=>{
                                                    if(useRol()!=='administrador'){
                                                        addNotification({
                                                            title: 'No autorizado',
                                                            subtitle: 'No puedes acceder a esta opción',
                                                            message: '',
                                                            native: false,
                                                            backgroundTop: '#FF9619',
                                                            backgroundBottom: '#fdb864',
                                                            colorTop: 'white',
                                                            colorBottom: 'white',
                                                            closeButton: 'Cerrar',
                                                            duration: 3000,
                                                        });
                                                    }else{
                                                        setReverse(true);
                                                        setComprobante({
                                                            id:comprobante.id,
                                                            name:comprobante.name,
                                                            fecha:comprobante.fecha
                                                        })
                                                    }
                                                }}
                                            >{comprobante.id}</button>
                                    }
                                    <p>{comprobante.fecha}</p>
                                    <p>{comprobante.fecha_deposito}</p>
                                    {/* <p>{comprobante.forma_pago.toUpperCase()}</p> */}
                                    <p>{(comprobante.tipo_transaccion==='parcial') ? useFormatterNumber({value:Number(JSON.parse(comprobante.detalle).saldo_capital),currency:'USD'}) : useFormatterNumber({value:JSON.parse(comprobante.prevDates).saldo_capital,currency:'USD'})}</p>
                                    <p>{(comprobante.tipo_transaccion==='parcial') ? useFormatterNumber({value:JSON.parse(comprobante.detalle).interes,currency:'USD'}) : useFormatterNumber({value:JSON.parse(comprobante.prevDates).interes,currency:'USD'})}</p>
                                    <p>{(comprobante.tipo_transaccion==='parcial') ? useFormatterNumber({value:JSON.parse(comprobante.detalle).mora,currency:'USD'}) : useFormatterNumber({value:JSON.parse(comprobante.prevDates).mora,currency:'USD'})}</p>
                                    <p>{(comprobante.tipo_transaccion==='parcial') ? useFormatterNumber({value:JSON.parse(comprobante.detalle).seguro_desgravamen,currency:'USD'}) : useFormatterNumber({value:JSON.parse(comprobante.prevDates).seguro_desgravamen,currency:'USD'})}</p>
                                    <p>{(comprobante.tipo_transaccion==='parcial') ? useFormatterNumber({value:JSON.parse(comprobante.detalle).gastos_judiciales,currency:'USD'}) : useFormatterNumber({value:JSON.parse(comprobante.prevDates).gastos_judiciales,currency:'USD'})}</p>
                                    <p>{(comprobante.tipo_transaccion==='parcial') ? useFormatterNumber({value:JSON.parse(comprobante.detalle).gastos_cobranza,currency:'USD'}) : useFormatterNumber({value:JSON.parse(comprobante.prevDates).gastos_cobranza,currency:'USD'})}</p>
                                    <p>{(comprobante.tipo_transaccion==='parcial') ? useFormatterNumber({value:JSON.parse(comprobante.detalle).otros_valores,currency:'USD'}) : useFormatterNumber({value:JSON.parse(comprobante.prevDates).otros_valores,currency:'USD'})}</p>
                                    <p>{useFormatterNumber({value:(Number(comprobante.valor_recibido)-Number(comprobante.valor_devuelto)),currency:'USD'})}</p>
                                    <div>
                                        {
                                            (comprobante.id!=='FACES') &&
                                                <button onClick={(e)=>{
                                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/vouchers/${comprobante.id}`,{
                                                        headers: {
                                                            Accept: 'application/json',
                                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                                        }
                                                    })
                                                        .then((response) => response.json())  
                                                        .then((data) => {
                                                            if('status' in data){
                                                                addNotification({
                                                                    title: 'No autorizado',
                                                                    subtitle: 'No se pudo recibir información de este comprobante',
                                                                    message: 'Cantidad excedida, se ha notificado al administrador',
                                                                    native: false,
                                                                    backgroundTop: '#FF9619',
                                                                    backgroundBottom: '#fdb864',
                                                                    colorTop: 'white',
                                                                    colorBottom: 'white',
                                                                    closeButton: 'Cerrar',
                                                                    duration: 5000,
                                                                });
                                                            
                                                            }else{
                                                            
                                                                data.name=data.name[0].name;
                                                                data.ci=data.ci[0].ci;
                                                                data.agente=data.agente;
                                                                
                                                                setComprobante(data);
                                                                setView(true);
                                                            }
                                                        });
                                                }}>Reimprimir comprobante</button>
                                        }
                                    </div>
                                </div> 
                            ))
                        : <></>
                    }

                    <div>
                        {
                            (credits.data.length>0 & message_nro)
                            ?
                                (credits.data[0].nro_vouchers===1)
                                ?
                                    <p>{credits.data[0].nro_vouchers} comprobante asociado</p>
                                :
                                    <p>{credits.data[0].nro_vouchers} comprobantes asociados</p>
                            : <></>
                        }
                    </div>


                </div>

                {
                    // (comprobantes.total>10) &&
                    //     <div className="DetailCredit__access">
                    //         <p>Registros del {comprobantes.from}-{comprobantes.to} de {comprobantes.total}</p>
                    //         <div>
                    //         {
                    //             comprobantes.links.map((button,index)=>(
                    //                 (index===0)?
                    //                     <NavLink key={index} onClick={()=>{updateData(button.url)}}>Anterior</NavLink>
                    //                 : 
                    //                     (index===(comprobantes.links.length-1)) ?
                    //                         <NavLink key={index} onClick={()=>{updateData(button.url)}}>Siguiente</NavLink>
                    //                     :
                    //                         <></>
                    //             ))
                    //         }
                    //         </div>
                    //     </div>
                }

            </div>
            
            {
                (view) &&
                
                    <div className="CardPay">
                        <button onClick={()=>{setView(!view)}}>Volver</button>
                        <PDFViewer width={'500px'} height={'500px'}>
                            <PDF 
                                nro_voucher={comprobante.id}
                                type_print={"ORIGINAL"}
                                credito={comprobante.sync}
                                forma_pago={comprobante.forma_pago}
                                insitucion_financiera={comprobante.institucion_financiera}
                                codigo_deposito={comprobante.codigo_deposito}
                                name={comprobante.name}
                                ci={comprobante.ci}

                                mora={(comprobante.tipo_transaccion==='parcial') ? Number(comprobante.detalle.mora).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') : Number(comprobante.prevDates.mora).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}
                                interes={(comprobante.tipo_transaccion==='parcial') ? Number(comprobante.detalle.interes).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') : Number(comprobante.prevDates.interes).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}
                                seguro_desgravamen={(comprobante.tipo_transaccion==='parcial') ? Number(comprobante.detalle.seguro_desgravamen).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') : Number(comprobante.prevDates.seguro_desgravamen).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}
                                gastos_judiciales={(comprobante.tipo_transaccion==='parcial') ? Number(comprobante.detalle.gastos_judiciales).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') : Number(comprobante.prevDates.gastos_judiciales).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}
                                saldo_capital={(comprobante.tipo_transaccion==='parcial') ? Number(comprobante.detalle.saldo_capital).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') : Number(comprobante.prevDates.saldo_capital).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}
                                gastos_cobranza={(comprobante.tipo_transaccion==='parcial') ? Number(comprobante.detalle.gastos_cobranza).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') : Number(comprobante.prevDates.gastos_cobranza).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}
                                otros_valores={(comprobante.tipo_transaccion==='parcial') ? Number(comprobante.detalle.otros_valores).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') : Number(comprobante.prevDates.otros_valores).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}
                                total={comprobante.totalAmount}

                                valor_recibido={comprobante.valor_recibido}
                                valor_devuelto={Number(comprobante.valor_devuelto).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}

                                fecha={comprobante.fecha}
                                agente={comprobante.agente.substring(0,1)+'. '+comprobante.agente.split(' ')[1]}
                            />
                        </PDFViewer>
                    </div>
            }

            {
                (view_reverse) &&
                    <div className="CardPay">
                        <button onClick={()=>{setReverse(!view_reverse)}}>Volver</button>
                        <CardReverse
                            id={comprobante.id}
                            name={comprobante.name}
                            fecha={comprobante.fecha}
                            update={updateReverse}
                        />
                    </div>
            }
        </div>
    );
}