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

export default function Comprobantes(){
    const param = useParams();
    const cartera=new URLSearchParams(useLocation().search);

    const [comprobantes,setComprobantes]=useState({
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

    useEffect(()=>{
        if(param.id!==undefined){
            useSearch(param.id,cartera.get('cartera'),setCredits);
            setVal(param.id);
        }
    },[]);

    return (
        <div className="pageConsulta">
            <div className="pageConsulta__search">
                <label>
                    Buscar cliente
                    <input onKeyUp={(e)=>{
                        const ci=e.target.value;
                        useSearch(ci,'',setCredits);
                        setCredit(0);
                    }} onChange={(e)=>{setVal(e.target.value)}} value={val} placeholder="Nombre o número de cédula"/>
                </label>
                {
                    (credit===0) &&
                        <div className="pageConsulta__prevResult">
                            {
                                credits.data.map((credit,index)=>(
                                    <button onClick={()=>{
                                        setCredit(credit.id);
                                        useSearchVouchers(credit.id,cartera.get('cartera'),setComprobantes);
                                    }} key={index}>
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
                        <p>Crédito</p>
                        <p>Cédula</p>
                        <p>Fecha</p>
                        <p>Forma de pago</p>
                        <p>Monto</p>
                        <p>Acciones</p>
                    </div>

                    {
                        comprobantes.data.map((comprobante,index)=>(
                            <div>
                                <p>{comprobante.id}</p>
                                <p>{comprobante.credito}</p>
                                <p></p>
                                <p>{comprobante.fecha}</p>
                                <p>{comprobante.forma_pago}</p>
                                <p>$ {Number(comprobante.valor_recibido)-Number(comprobante.valor_devuelto)} USD</p>
                                <div>
                                    <button onClick={(e)=>{
                                        fetch(`https://sefil.softsen.space/public/api/vouchers/${comprobante.id}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                if('status' in data){
                                                    console.log("Cantidad excedida, pedir permiso a administrador?");
                                                }else{
                                                    data.name=data.name[0].name;
                                                    data.ci=data.ci[0].ci;
                                                    data.agente=data.agente[0].name;
                                                    setComprobante(data);
                                                    setView(true);
                                                }
                                            });
                                    }}>Reimprimir comprobante</button>
                                </div>
                            </div> 
                        ))
                    }


                </div>

                {
                    (comprobantes.total>10) &&
                        <div className="DetailCredit__access">
                            <p>Registros del {comprobantes.from}-{comprobantes.to} de {comprobantes.total}</p>
                            <div>
                            {
                                comprobantes.links.map((button,index)=>(
                                    (index===0)?
                                        <NavLink key={index} onClick={()=>{updateData(button.url)}}>Anterior</NavLink>
                                    : 
                                        (index===(comprobantes.links.length-1)) ?
                                            <NavLink key={index} onClick={()=>{updateData(button.url)}}>Siguiente</NavLink>
                                        :
                                            <></>
                                ))
                            }
                            </div>
                        </div>
                }

            </div>
            
            {
                (view) &&
                    <div className="CardPay">
                        <button onClick={()=>{setView(!view)}}>Volver</button>
                        <PDFViewer width={'500px'} height={'500px'}>
                            <PDF 
                                nro_voucher={comprobante.id}
                                type_print={"COPIA"}
                                forma_pago={comprobante.forma_pago}
                                insitucion_financiera={comprobante.insitucion_financiera}
                                codigo_deposito={comprobante.codigo_deposito}
                                name={comprobante.name}
                                ci={comprobante.ci}

                                mora={(comprobante.tipo_transaccion==='parcial') ? comprobante.detalle.mora : comprobante.prevDates.mora}
                                interes={(comprobante.tipo_transaccion==='parcial') ? comprobante.detalle.interes : comprobante.prevDates.interes}
                                seguro_desgravamen={(comprobante.tipo_transaccion==='parcial') ? comprobante.detalle.seguro_desgravamen : comprobante.prevDates.seguro_desgravamen}
                                gastos_judiciales={(comprobante.tipo_transaccion==='parcial') ? comprobante.detalle.gastos_judiciales : comprobante.prevDates.gastos_judiciales}
                                saldo_capital={(comprobante.tipo_transaccion==='parcial') ? comprobante.detalle.saldo_capital : comprobante.prevDates.saldo_capital}
                                gastos_cobranza={(comprobante.tipo_transaccion==='parcial') ? comprobante.detalle.gastos_cobranza : comprobante.prevDates.gastos_cobranza}
                                otros_valores={(comprobante.tipo_transaccion==='parcial') ? comprobante.detalle.otros_valores : comprobante.prevDates.otros_valores}
                                total={comprobante.totalAmount}

                                valor_recibido={comprobante.valor_recibido}
                                valor_devuelto={Number(comprobante.valor_devuelto).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}

                                fecha={comprobante.fecha}
                                agente={comprobante.agente.substring(0,1)+'. '+comprobante.agente.split(' ')[1]}
                            />
                        </PDFViewer>
                    </div>
            }
        </div>
    );
}