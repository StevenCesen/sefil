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

const render = (status) => {
    return <h1>{status}</h1>;
};

export default function DetailCredit(){

    const [credit,setCredit]=useState();

    const [pay,setPay]=useState(true);

    const [view_condonation,setViewCondonation]=useState(true);

    const [view_reestructurar,setReestructurar]=useState(true);

    const [viewPush,setPush]=useState();

    const [viewGastos,setGastos]=useState({
        status:true,
        credito:0,
        id:0,
        valor_gasto:'',
        sync:''
    });

    const [viewPDFGastos,setPDF]=useState(true);

    const param=new URLSearchParams(useLocation().search);
    const cartera=useParams();

    const [prev_gasto,setPrev]=useState(0);

    const clean=setInterval(() => {
        setPush({
            view:false,
            text:''
        })
    },3000);


    const updateGastos=({credito,valor_gasto,id})=>{
        setGastos({
            ...viewGastos,
            status:true,
            credito:credito,
            id:id,
            valor_gasto:valor_gasto
        });
    }

    useEffect(()=>{
        setPay(false);
        setReestructurar(false);
        setViewCondonation(false);
        setGastos(false);
        setPDF(false);

        fetch(`https://sefil.softsen.space/public/api/credit/view?cartera=${cartera.id}&credit=${param.get('id')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCredit(data);
            });
        
        fetch(`https://sefil.softsen.space/public/api/gastos?credito=${param.get('id')}`,{
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
                        sync:data.id.sync
                    });
                }
            });
        
        fetch(`https://sefil.softsen.space/public/api/genGastos?cartera=${cartera.id}&credito=${param.get('id')}`,{
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
                        fetch(`https://sefil.softsen.space/public/api/credit/view?cartera=${cartera.id}&credit=${e.target.value}`,{
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
                            <span>{credit.sync_id} </span>
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
                        <div>   
                            <p className="Head">Gastos judiciales</p>
                            <span>{useFormatterNumber({value:credit.gastos_judiciales,currency:'USD'})}</span>
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
                                <p>Condonación <strong>{condonation.status.toUpperCase()}</strong>, realizada por {condonation.byUser}. Valor total condonado {useFormatterNumber({
                                    value:(Number(JSON.parse(condonation.postDates).capital)+Number(JSON.parse(condonation.postDates).mora)+Number(JSON.parse(condonation.postDates).interes)+Number(JSON.parse(condonation.postDates).seguro_desgravamen)+Number(JSON.parse(condonation.postDates).gastos_cobranza)+Number(JSON.parse(condonation.postDates).gastos_judiciales)),
                                    currency:'USD'
                                })}</p>
                                <span>{condonation.fecha}</span>
                            </div>
                        ))
                    }
                    {
                        credit.restructs.map((restruct,index)=>(
                            <div className="DetailCredit__activity" key={index}>
                                <p key={index}>Reestructuración <strong>{restruct.status.toUpperCase()}</strong>, realizada por {restruct.byUser}</p>
                                <span>{restruct.fecha}</span>
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
                        (localStorage.getItem('hash')!=='#/dashboard/consulta') &&
                            (viewGastos.status===true) ?
                                <button 
                                    onClick={(e)=>{
                                        //Aquí actualizamos el estado para que desaparezca el botón
                                        setPDF(true);

                                        fetch(`https://sefil.softsen.space/public/api/gastos/${viewGastos.id}`,{
                                            method:'PUT',
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                if('status' in data){
                                                    setGastos({
                                                        ...viewGastos,
                                                        status:false
                                                    });
                                                }
                                            });
                                    }}
                                >Generar gastos de cobranza</button>
                            : (Number(credit.totalAmount)>0.00) &&
                                <p
                                    style={{marginBottom:10,fontSize:14}}
                                >Gastos: {useFormatterNumber({value:prev_gasto,currency:'USD'})}</p>
                            
                    }
                    {
                        (Number(credit.totalAmount)>0.00 & localStorage.getItem('hash')!=='#/dashboard/consulta') ?
                            <>
                                <button onClick={e=>{
                                    setPay(!pay);
                                }}>Pago</button>

                                <button onClick={async e=>{
                                    if(await useVerifyStruct(param.id)){
                                        setReestructurar(!view_reestructurar);
                                    }else{
                                        setPush({
                                            view:true,
                                            text:'No se puede, hay un proceso de reestructuración no autorizado aún.'
                                        });
                                    }
                                }}>Convenio de pago</button>

                                <button onClick={async e=>{
                                    if(await useVerifyCondonation(param.id)){
                                        setViewCondonation(!view_condonation);
                                    }else{
                                        setPush({
                                            view:true,
                                            text:'No se puede, hay un proceso de condonación no autorizado aún.'
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
                            <NavLink to={`/dashboard/comprobantes/view/${credit.ci}?cartera=${cartera.id}&name=${credit.name}`}>Comprobantes de pago</NavLink>
                    }
                    <NavLink to={`/dashboard/garantes/${param.get('id')}?cartera=${cartera.id}&name=${credit.name}`}>Garantes</NavLink>
                </div>
            
            </div>

            {
                (view_reestructurar) &&
                    <CardStructure
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
                        total={Number(credit.totalAmount)}
                        set={setViewCondonation}
                        id={param.get('id')}
                        cartera={cartera.id}
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
                    />
            }

            {
                (viewPush.view) &&
                    <Push
                        text={viewPush.text}
                    />
            }
            {
                (viewPDFGastos) &&
                    <div className="CardPay"> 
                        <button className="CardCondonacion__close" onClick={()=>{setPDF(false)}}>Volver</button>
                        <PDFViewer width={'500px'} height={'300px'}>
                            <PDFgastos
                                // nro_voucher={25}
                                // credito={`${param.get('id')}-${viewGastos.sync}`}
                                // name={credit.name}
                                // ci={credit.ci}
                                // valor_gasto={useFormatterNumber({value:JSON.parse(viewGastos.valor_gasto).value,currency:'USD'})}
                                nro_voucher={25}
                                credito={`6-2028262282`}
                                name={'STEVEN RAFAEL CESEN'}
                                ci={'1150575338'}
                                valor_gasto={useFormatterNumber({value:25.64,currency:'USD'})}
                            />
                        </PDFViewer>
                    </div>
            }
        </div>
    );
}
