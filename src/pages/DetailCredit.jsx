import { NavLink, useLocation, useParams} from "react-router-dom";
import "./pages.css";
import { useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import CardPay from "../components/CardPay/CardPay";
import CardCondonacion from "../components/CardCondonacion/CardCondonacion";
import CardStructure from "../components/CardStructure/CardStructure";
import useVerifyStruct from "../hooks/useVerifyRestruct";
import useVerifyCondonation from "../hooks/useVerifyCondonation";
import Push from "../components/Push/Push";


export default function DetailCredit(){

    const [credit,setCredit]=useState();
    const [pay,setPay]=useState(true);
    const [view_condonation,setViewCondonation]=useState(true);
    const [view_reestructurar,setReestructurar]=useState(true);
    const [viewPush,setPush]=useState();

    const param=new URLSearchParams(useLocation().search);
    const cartera=useParams();

    const clean=setInterval(() => {
            setPush({
                view:false,
                text:''
            })
    },3000);

    useEffect(()=>{
        setPay(false);
        setReestructurar(false);
        setViewCondonation(false);

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

        setPush({
            view:false,
            text:''
        })
    },[]);

    if(!credit) return <></>
    if(!viewPush) return <></>

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
                            <p className="Head">Crédito</p>
                            <span>{credit.sync_id} </span>
                        </div>
                        <div>
                            <p className="Head">Monto total</p>
                            <span>{credit.totalAmount} $</span>
                        </div>
                        <div>
                            <p className="Head">Saldo capital</p>
                            <span>{Number(credit.saldo_capital).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} $</span>
                        </div>
                        <div>
                            <p className="Head">Interés</p>
                            <span>{credit.interes} $</span>
                        </div>
                        <div>
                            <p className="Head">Mora</p>
                            <span>{credit.mora} $</span>
                        </div>
                        <div>
                            <p className="Head">Seguro desgravamen</p>
                            <span>{credit.seguro_desgravamen} $</span>
                        </div>
                        <div>
                            <p className="Head">Gastos de cobranza</p>
                            <span>{credit.gastos_cobranza} $</span>
                        </div>
                        <div>   
                            <p className="Head">Gastos judiciales</p>
                            <span>{credit.gastos_judiciales} $</span>
                        </div>
                        <div>
                            <p className="Head">Otros valores</p>
                            <span>{credit.otros_valores} $</span>
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
                </div>

                <div className="DetailCredit__general">
                    <h3>Actividad reciente</h3>
                    {
                        credit.condonations.map((condonation,index)=>(
                            <div className="DetailCredit__activity" key={index}>
                                <p>Condonación <strong>{condonation.status.toUpperCase()}</strong>, realizada por {condonation.byUser}</p>
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
                                }}>Reestructurar crédito</button>

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
                   
                    <NavLink to={`/dashboard/comprobantes/view/${credit.ci}?cartera=${cartera.id}`}>Comprobantes de pago</NavLink>
                    <NavLink to={`/dashboard/garantes/${param.get('id')}?cartera=${cartera.id}`}>Garantes</NavLink>
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
                    />
            }

            {
                (viewPush.view) &&
                    <Push
                        text={viewPush.text}
                    />
            }
        </div>
    );
}
