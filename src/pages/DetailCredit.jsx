import { NavLink, useLocation, useParams} from "react-router-dom";
import "./pages.css";
import { useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import CardPay from "../components/CardPay/CardPay";
import CardCondonacion from "../components/CardCondonacion/CardCondonacion";
import CardStructure from "../components/CardStructure/CardStructure";
import useVerifyStruct from "../hooks/useVerifyRestruct";
import useVerifyCondonation from "../hooks/useVerifyCondonation";
import MyMapComponent from "../components/Map/Map";
import useFormatterNumber from "../hooks/useFormatterNumber";
import { PDFViewer } from "@react-pdf/renderer";
import PDFgastos from "../components/PDFgastos";
import PDFcondonacion from "../components/PDFcondonacion";
import CardConfirm from "../components/CardConfirm/CardConfirm";
import CardEditJudicial from "../components/CardEditJudicial/CardEditJudicial";
import addNotification from "react-push-notification";

const render = (status) => {
    return <h1>{status}</h1>;
};

export default function DetailCredit(){

    const [credit,setCredit]=useState();

    const [pay,setPay]=useState(true);

    const [view_condonation,setViewCondonation]=useState(true);

    const [viewPDFCondonation,setPDFcondonation]=useState(false);

    const [value_condonacion,setData]=useState([]);

    const [view_reestructurar,setReestructurar]=useState(true);

    const [viewPush,setPush]=useState();

    const [viewGastos,setGastos]=useState({
        status:true,
        credito:0,
        id:0,
        valor_gasto:'',
        sync:'',
        fecha:'',
        clave_acceso:'',
        email:'',
        valor:''
    });

    const [viewPDFGastos,setPDF]=useState(true);

    const [edit_judicial,setEditJudicial]=useState();

    const [pre_edit,setEdit]=useState(false);

    const param=new URLSearchParams(useLocation().search);
    const cartera=useParams();

    const view=()=>{
        setPDFcondonation(true);
    }

    const updateGastosJudiciales=(value,total)=>{
        setCredit({
            ...credit,
            gastos_judiciales:value,
            totalAmount:total
        });
    }

    const [prev_gasto,setPrev]=useState(0);

    const clean=setInterval(() => {
        setPush({
            view:false,
            text:''
        })
    },3000);


    const updateCredit=({capital,interes,mora,seguro_desgravamen,gastos_judiciales,gastos_cobranza,otros_valores,totalAmount})=>{
        setCredit({
            ...credit,
            saldo_capital:capital,
            interes:interes,
            mora:mora,
            seguro_desgravamen:seguro_desgravamen,
            gastos_judiciales:gastos_judiciales,
            gastos_cobranza:gastos_cobranza,
            otros_valores:otros_valores,
            totalAmount:totalAmount
        });
    };

    const updateGastos=({credito,valor_gasto,id,fecha,clave_acceso})=>{
        setGastos({
            ...viewGastos,
            status:true,
            credito:credito,
            id:id,
            valor_gasto:valor_gasto,
            fecha:fecha,
            clave_acceso:clave_acceso
        });
    }


    const updateFac=({status,valor_gasto,email,fecha,clave_acceso})=>{
        setGastos({
            ...viewGastos,
            status:status,
            valor:valor_gasto,
            email:email,
            fecha:fecha,
            clave_acceso:clave_acceso
        });
    }

    useEffect(()=>{

        setData({
            ci:"",
            name:"",
            credito:"",
            by_user:"",
            fecha:"",
            postDates:JSON.stringify({
                mora:"",
                interes:"",
                capital:"",
                seguro_desgravamen:"",
                gastos_cobranza:"",
                gastos_judiciales:"",
                otros_valores:""
            }),
            prevDates:JSON.stringify({
                mora:"",
                interes:"",
                capital:"",
                seguro_desgravamen:"",
                gastos_cobranza:"",
                gastos_judiciales:"",
                otros_valores:""
            })
        });

        setPay(false);
        setReestructurar(false);
        setViewCondonation(false);
        setPDFcondonation(false);
        setGastos(false);
        setPDF(false);
        setEdit(false);
        setEditJudicial(false);

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/view?cartera=${cartera.id}&credit=${param.get('id')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCredit(data);
            });
        
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/gastos?credito=${param.get('id')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                if(data.id===false){
                    setGastos({
                        ...viewGastos,
                        status:false
                    });
                }else{
                    setGastos({
                        ...viewGastos,
                        status:true,
                        credito:data.id.credito,
                        id:data.id.id,
                        valor_gasto:data.id.postDates,
                        sync:data.id.sync,
                        fecha:'',
                        clave_acceso:'',
                        valor:''
                    });
                }
            });
        
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/genGastos?cartera=${cartera.id}&credito=${param.get('id')}`,{
            method:'GET',
            headers: {
                Accept: 'application/json'
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setPrev(data.gastos);
            });

        setPush({
            view:false,
            text:''
        });

    },[]);

    if(!credit) return <></>
    if(!viewPush) return <></>
    if(!viewGastos) return <></>

    return (
        <div className="DetailCredit">
            <div className="DetailCredit__head">
                <NavLink 
                    to="" 
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1) 
                    }}
                >Regresar</NavLink>
            </div>
            
            <div className="DetailCredit__head">
                <div>
                    <p>Titular</p>
                    <label>{credit.name} | {credit.ci}</label>
                </div>
                <div>
                    <p>Créditos asociados</p>
                    <select onChange={(e)=>{
                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/view?cartera=${cartera.id}&credit=${e.target.value}`,{
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                //Tenemos que actualizar la URI
                                setCredit(data);
                            });
                    }}>
                        <option value={param.id}>TITULAR | {credit.credito}</option>
                        {
                            credit.reference_credits.map((reference,index)=>(
                                <option key={index} value={reference.id}>{reference.type} | {reference.credito}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className="DetailCredit__dates">

                <div className="DetailCredit__general">
                    <h3>Información del crédito</h3>
                    
                    <div className="DetailCredit__table">
                        <div>
                            <p className="Head Head--se">Cartera</p>
                            <span>{cartera.id} </span>
                        </div>
                        <div>
                            <p className="Head Head--se">Estado</p>
                            <span>{credit.status} </span>
                        </div>
                        <div>
                            <p className="Head Head--se">Crédito</p>
                            <span>{cartera.id}-{credit.credito} </span>
                        </div>
                        <div>
                            <p className="Head Head--se">Fecha de emisión</p>
                            <span>{credit.emision} </span>
                        </div>
                        <div>
                            <p className="Head Head--se">Días vencidos</p>
                            <span>{credit.dias_vencidos} </span>
                        </div>
                        <div>
                            <p className="Head Head--pr">Monto total</p>
                            <span>{useFormatterNumber({
                                value:Number(credit.totalAmount),
                                currency:'USD'
                            })} </span>
                        </div>
                        <div>
                            <p className="Head">Saldo capital</p>
                            <span>{useFormatterNumber({value:credit.saldo_capital,currency:'USD'})}</span>
                        </div>
                        <div>
                            <p className="Head">Interés</p>
                            <span>{useFormatterNumber({value:credit.interes,currency:'USD'})}</span>
                        </div>
                        <div>
                            <p className="Head">Mora</p>
                            <span>{useFormatterNumber({value:credit.mora,currency:'USD'})}</span>
                        </div>
                        <div>
                            <p className="Head">Seguro desgravamen</p>
                            <span>{useFormatterNumber({value:credit.seguro_desgravamen,currency:'USD'})}</span>
                        </div>
                        <div>
                            <p className="Head">Gastos de cobranza</p>
                            <span>{useFormatterNumber({value:credit.gastos_cobranza,currency:'USD'})}</span>
                        </div>
                        <div className="Details__newbutton">   
                            <p className="Head">Gastos judiciales</p>
                            <span>{useFormatterNumber({value:credit.gastos_judiciales,currency:'USD'})}</span>
                            <div
                                onClick={(e)=>{
                                    setEditJudicial(true);
                                }}
                            >

                            </div>
                        </div>
                        <div>
                            <p className="Head">Otros valores</p>
                            <span>{useFormatterNumber({value:credit.otros_valores,currency:'USD'})}</span>
                        </div>
                    </div>
                </div>

                <div className="DetailCredit__general">
                    <h3>Información del cliente</h3>
                    <div className="DetailCredit__table">
                        <div>
                            <p className="Head">Provincia</p>
                            <span>{credit.provincia.toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="Head">Cantón</p>
                            <span>{credit.canton.toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="Head">Parroquia</p>
                            <span>{credit.parroquia.toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="Head">Agencia</p>
                            <span>{credit.agency}</span>
                        </div>
                        <div>
                            <p className="Head">Dirección</p>
                            <span>{credit.direccion}</span>
                        </div>
                    </div>
                    
                    <div className="DetailCredit__general" style={{marginTop:10}}>
                        <h3>Ubicación del titular</h3>
                        <Wrapper apiKey="AIzaSyDqk_2FCNezPuFgd8Zaeu2s1idsDpdC1Qc" render={render}>
                            <MyMapComponent
                                center={{lat:parseFloat(credit.latitud),lng:parseFloat(credit.longitud)}}
                                zoom={15}
                            />
                        </Wrapper>
                    </div>

                </div>

                <div className="DetailCredit__general">
                    <h3>Actividad reciente</h3>
                    {
                        credit.condonations.map((condonation,index)=>(
                            <div className="DetailCredit__activity" key={index}>
                                <p>Condonación <strong>{condonation.status.toUpperCase()}</strong>, realizada por {condonation.byUser}. Valor total a cancelar {useFormatterNumber({
                                    value:(
                                        Number(JSON.parse(condonation.postDates).capital)+
                                        Number(JSON.parse(condonation.postDates).mora)+
                                        Number(JSON.parse(condonation.postDates).interes)+
                                        Number(JSON.parse(condonation.postDates).seguro_desgravamen)+
                                        Number(JSON.parse(condonation.postDates).gastos_cobranza)+
                                        Number(JSON.parse(condonation.postDates).gastos_judiciales)),
                                    currency:'USD'
                                })}</p>
                                <span>{condonation.fecha}</span>
                            </div>
                        ))
                    }
                    {
                        credit.restructs.map((restruct,index)=>(
                            <div className="DetailCredit__activity" key={index}>
                                <p key={index}>Convenio de pago con estado <strong>{restruct.status.toUpperCase()}</strong>, realizado por {restruct.byUser}</p>
                                <span>{restruct.fecha}</span>
                                <p style={{margin:"10px 0",fontSize:"14px"}}>Fecha de pago: {restruct.fecha_pago}</p>
                                <div style={{marginTop:"10px",borderTop:"1px solid grey",borderLeft:"1px solid grey",borderRight:"1px solid grey"}}>
                                    {
                                        JSON.parse(restruct.detail).map((cuota)=>(
                                            <div style={{display:"grid",justifyContent:"center",alignItems:"center",gridTemplateColumns:"15% 40% 45%",height:"30px",textAlign:"center",borderBottom:"1px solid grey"}}>
                                                <p>{cuota.cuota}</p>
                                                <p>{useFormatterNumber({value:cuota.valor,currency:'USD'})}</p>
                                                <p>{cuota.estado}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                    {
                        (credit.restructs.length===0 & credit.condonations.length===0) ?
                            <p>No hay actividad reciente</p>
                        : <></>
                    }
                </div>
                
                <div className="DetailCredit__actions">
                    <h3>Acciones</h3>
    
                    {
                        (localStorage.getItem('hash')!=='#/dashboard/consulta') 
                        ?
                            (viewGastos.status===true & credit.status!=='Convenio de pago') ?
                                <>
                                    <p
                                        style={{marginBottom:10,fontSize:14}}
                                    >Gastos: {useFormatterNumber({value:prev_gasto,currency:'USD'})}</p>
                                    <button 
                                        onClick={(e)=>{
                                            e.target.textContent='Facturando...';
                                            //Aquí actualizamos el estado para que desaparezca el botón
                                            // setPDF(true);
                                            setEdit(true);
                                        }}
                                    >Generar gastos de cobranza</button>
                                </>

                            : (Number(credit.totalAmount)>0.00 & credit.status!=='Convenio de pago') 
                                ?
                                    <p
                                        style={{marginBottom:10,fontSize:14}}
                                    >Gastos: {useFormatterNumber({value:prev_gasto,currency:'USD'})}</p>
                                :   <></>
                        :   <></>
                    }
                    {
                        (Number(credit.totalAmount)>0.00 & localStorage.getItem('hash')!=='#/dashboard/consulta') ?
                            <>
                                <button onClick={e=>{
                                    setPay(!pay);
                                }}>Pago</button>

                                <button onClick={async e=>{
                                    if(await useVerifyStruct(param.get('id'))){
                                        setReestructurar(!view_reestructurar);
                                    }else{
                                        addNotification({
                                            title: 'ERROR',
                                            subtitle: 'Crédito con convenio',
                                            message: 'No se puede, hay un convenio ya creado',
                                            native: false,
                                            backgroundTop: '#FF9619',
                                            backgroundBottom: '#fdb864',
                                            colorTop: 'white',
                                            colorBottom: 'white',
                                            closeButton: 'Cerrar',
                                            duration: 3500
                                        });
                                    }
                                }}>Convenio de pago</button>

                                <button onClick={async e=>{
                                    if(await useVerifyCondonation(param.get('id'))){
                                        setViewCondonation(!view_condonation);
                                    }else{
                                        addNotification({
                                            title: 'ERROR',
                                            subtitle: 'Crédito con condonación',
                                            message: 'No se puede, ya se ha registrado una condonación',
                                            native: false,
                                            backgroundTop: '#FF9619',
                                            backgroundBottom: '#fdb864',
                                            colorTop: 'white',
                                            colorBottom: 'white',
                                            closeButton: 'Cerrar',
                                            duration: 3500
                                        });
                                        clean;
                                    }
                                }}>Condonar crédito</button>
                            </>
                        : 
                            <></>
                    }
                    {
                        (localStorage.getItem('permission').split(',').includes("Comprobantes:all")) &&
                            <NavLink to={`/dashboard/comprobantes/view/${credit.ci}?cartera=${cartera.id}&name=${credit.name}&credito=${param.get('id')}`}>Comprobantes de pago</NavLink>
                    }
                    {
                        (localStorage.getItem('permission').split(',').includes("User:all") | localStorage.getItem('permission').split(',').includes("User:minimize")) &&
                            <NavLink to={`/dashboard/glist/${param.get('id')}?cartera=${cartera.id}`}>Historial de gestiones</NavLink>
                    }
                    <NavLink to={`/dashboard/garantes/${param.get('id')}?cartera=${cartera.id}&name=${credit.name}`}>Garantes</NavLink>
                </div>
            
            </div>

            {
                (view_reestructurar) &&
                    <CardStructure
                        original_dates={{
                            totalAmount:credit.totalAmount,
                            saldo_capital:credit.saldo_capital,
                            mora:credit.mora,
                            interes:credit.interes,
                            seguro_desgravamen:credit.seguro_desgravamen,
                            gastos_judiciales:credit.gastos_judiciales,
                            gastos_cobranza:credit.gastos_cobranza,
                            otros_valores:credit.otros_valores
                        }}
                        total={credit.totalAmount}
                        set={setReestructurar}
                        id={param.get('id')}
                        cartera={cartera.id}
                    />
            }

            {
                (view_condonation) &&
                    <CardCondonacion 
                        capital={credit.saldo_capital}
                        mora={credit.mora}
                        interes={credit.interes}
                        seguro_desgravamen={credit.seguro_desgravamen}
                        gastos_judiciales={credit.gastos_judiciales}
                        gastos_cobranza={credit.gastos_cobranza}
                        otros_valores={credit.otros_valores}
                        total={Number(credit.totalAmount)}
                        set={setViewCondonation}
                        id={param.get('id')}
                        cartera={cartera.id}
                        setData={setData}
                        view={view}
                        update={updateCredit}
                    />
            }

            {
                (pay) &&
                    <CardPay 
                        setPay={setPay} 
                        data={credit} 
                        id={param.get('id')}
                        cartera={cartera.id}
                        setGastos={updateGastos}
                        setPDF={setPDF}
                        setCredit={setCredit}
                        estado={credit.status}
                        data_convenio={(credit.status==='Convenio de pago') ? credit.restructs : []}
                    />
            }

            {
                (viewPush.view) &&
                    <Push
                        text={viewPush.text}
                    />
            }

            {
                (pre_edit) &&
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setEdit(false)}}>Volver</button>
                        <CardConfirm
                            id={viewGastos.id}
                            cartera={cartera.id}
                            value={Number(JSON.parse(viewGastos.valor_gasto).value)}
                            name={credit.name}
                            ci={credit.ci}
                            direccion={credit.direccion}
                            telefono={credit.phone}
                            email={credit.email}
                            setGastos={updateFac}
                            setView={setEdit}
                            setPDF={setPDF}
                        />
                    </div>
            }

            {
                (viewPDFGastos) &&
                    <div className="CardPay"> 
                        <button className="CardCondonacion__close" onClick={()=>{setPDF(false)}}>Volver</button>
                        <PDFViewer width={'800px'} height={'600px'}>
                            <PDFgastos
                                nro_voucher={25}
                                credito={`${param.get('id')}-${viewGastos.sync}`}
                                name={credit.name}
                                ci={credit.ci}
                                direccion={credit.direccion}
                                fecha={viewGastos.fecha}
                                clave_acceso={viewGastos.clave_acceso}
                                valor_gasto={useFormatterNumber({value:Number(viewGastos.valor),currency:'USD'})}
                            />
                        </PDFViewer>
                    </div>

            }

            {
                (viewPDFCondonation) &&
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setPDFcondonation(false)}}>Volver</button>
                        <PDFViewer width={'800px'} height={'600px'}>
                            <PDFcondonacion
                                ci={value_condonacion.ci}
                                credito={value_condonacion.credito}
                                name={value_condonacion.name}
                                fecha={value_condonacion.fecha}
                                prevDates={value_condonacion.prevDates}
                                postDates={value_condonacion.postDates}
                                user_auth={value_condonacion.by_user}
                            />
                        </PDFViewer>
                    </div>
            }

            {
                (edit_judicial) &&
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setEditJudicial(false)}}>Volver</button>
                        
                        <CardEditJudicial
                            id={param.get('id')}
                            cartera={cartera.id}
                            gastos_judiciales={credit.gastos_judiciales}
                            totalAmount={credit.totalAmount}
                            setNew={updateGastosJudiciales}
                            close={setEditJudicial}
                        />
                    
                    </div>
            }
        </div>
    );
}
