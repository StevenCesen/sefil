import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./CardGestion.css"
import CardCall from "../CardCall/CardCall";
import addNotification from "react-push-notification";
import useFormatterNumber from "../../hooks/useFormatterNumber";

export default function CardGestion({currently,next,index,setNext,id_campain,setCancel,setStatusGestion,state_gestion,structure}){
    
    const [call,setCall]=useState(false);
    const [credit,setCredit]=useState(); //Información netamente de la persona actual
    const [contacts,setContacts]=useState(); //Información de garantes
    const [info_credit,setInfo]=useState(); //Información del crédito

    const [data_gestion,setDataGestion]=useState();
    const [historial,setHistorial]=useState();
    const [phone_actual,setPhone]=useState();

    const close=()=>{
        setCall(false);
    }

    const add_id_call=(id)=>{
        let extras=data_gestion.id_calls_extras;
        extras.push(id);

        setDataGestion({
            ...data_gestion,
            id_calls_extras:extras
        });
    }

    useEffect(()=>{
    
        setDataGestion({
            id_campain:id_campain,
            id_call:'', //Llamada con gestión
            id_calls_extras:[],
            id_credit:currently.id,
            state_gestion:'NO CONTACTADO',
            substate_gestion:'NO CONTESTA',
            date_promise:'',
            observation:'',
            byUser:'',
            fecha:'',
            client_name:currently.name
        });

        fetch(`https://sefil.softsen.space/public/api/managments?id_campain=${id_campain}&id_credit=${currently.id}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setHistorial(data.data.data);
            });
        
        setCall(false);
        setPhone('');
        setCredit(currently);
        setInfo({
            id:currently.id,
            name:currently.name,
            ci:currently.ci,
            monthlyFeeAmount:currently.monthlyFeeAmount,
            dias_vencidos:currently.dias_vencidos,
            paymentDate:currently.paymentDate,
            pendingFees:currently.pendingFees,
            paidFees:currently.paidFees,
            totalAmount:currently.totalAmount
        });
        setContacts(JSON.parse(currently.contactos));
        console.log(structure)

    },[currently]);

    if(!historial) return <></>
    if(!credit) return <></>
    if(!contacts) return <></>
    if(!data_gestion) return <></>

    return (
        <div className="Ggestion">
            <div className="Ggestion__dates">
                
                <label>
                    <select
                        onChange={(e)=>{
                            if(e.target.value==='TITULAR'){
                                setCredit(currently)
                            }else{
                                contacts.map((garante,index)=>{
                                    if(garante.ci===e.target.value){
                                        setCredit(garante);
                                    }
                                });
                            }
                        }}
                    >
                        <option value={"TITULAR"}>{info_credit.name} | TITULAR</option>
                        {
                            contacts.map((contact,index)=>(
                                (contact.name!=='') &&
                                    <option key={index} value={contact.ci}>{contact.name} | GARANTE</option>
                            ))
                        }
                    </select>
                </label>

                <div className="DetailCredit__general" style={{marginBottom:'10px',marginTop:'10px'}}>
                    <h3 style={{marginBottom:'-10px'}}>Información del cliente</h3>
                    <div className="DetailCredit__table">
                        <div>
                            <p className="Head">NOMBRE</p>
                            <span>{credit.name}</span>
                        </div>
                        <div>
                            <p className="Head">CÉDULA</p>
                            <span>{credit.ci}</span>
                        </div>
                        <div>
                            <p className="Head">GÉNERO</p>
                            <span>{credit.genero}</span>
                        </div>
                        <div>
                            <p className="Head">PROVINCIA</p>
                            <span>{credit.provincia}</span>
                        </div>
                        <div>
                            <p className="Head">CANTÓN</p>
                            <span>{credit.canton}</span>
                        </div>
                    </div>
                </div>

                <div className="DetailCredit__general">
                    <h3 style={{marginBottom:'-10px'}}>Información del crédito</h3>
                    <div className="DetailCredit__table">
                        <div>
                            <p className="Head">VALOR PENDIENTE</p>
                            <span>{useFormatterNumber({value:info_credit.monthlyFeeAmount,currency:'USD'})}</span>
                        </div>
                        <div>
                            <p className="Head">DÍAS DE MORA</p>
                            <span>{info_credit.dias_vencidos}</span>
                        </div>
                        <div>
                            <p className="Head">FECHA DE PAGO</p>
                            <span>{info_credit.paymentDate}</span>
                        </div>
                        <div>
                            <p className="Head">CUOTAS PENDIENTES</p>
                            <span>{info_credit.pendingFees}</span>
                        </div>
                        <div>
                            <p className="Head">CUOTAS PAGADAS</p>
                            <span>{info_credit.paidFees}</span>
                        </div>
                        <div>
                            <p className="Head">TOTAL ADEUDADO</p>
                            <span>{useFormatterNumber({value:info_credit.totalAmount,currency:'USD'})}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="Ggestion__regist">
                <div className="Ggestion__principal">
                    <div>
                        <h3 className="Ggestion__title">Contactos</h3>
                        
                        <button className="Ggestion__button">Agregar nuevo</button>

                        <div>
                            {/* <p className="Ggestion__subtitle">3 contactos registrados</p> */}
                            
                            {
                                (credit.phone!=='N/D')
                                ?
                                    <div className="Ggestion__contact">
                                        {/* <p>{(credit.phone.length<8) ? `07${credit.phone}` : credit.phone}</p> */}
                                        <p>0978950498</p>
                                        <div>
                                            <button
                                                onClick={async (e)=>{
                                                    const request=await fetch(`originate.php?exten=0978950498&id=9`);
                                                    const response=await request.json();
                                                    console.log(response)
                                                    setPhone(credit.phone)
                                                    setCall(true);
                                                    setCancel(false);
                                                    setStatusGestion(false);
                                                }}
                                            >
                                                <img src="./icons/call.png"/>
                                            </button>
                                            <button>
                                                <img src="./icons/send_waps.png"/>
                                            </button>
                                        </div>
                                    </div>
                                :   <></>
                            }

                            {
                                (credit.phone2!=='N/D')
                                ?
                                    <div className="Ggestion__contact">
                                        {/* <p>{(credit.phone2.length<8) ? `07${credit.phone2}` : credit.phone2}</p> */}
                                        <p>0989822835</p>
                                        <div>
                                            <button
                                                onClick={async (e)=>{
                                                    const request=await fetch(`originate.php?exten=0989822835&id=9`);
                                                    const response=await request.json();
                                                    console.log(response);
                                                    setPhone(credit.phone2)
                                                    setCall(true);
                                                    setCancel(false);
                                                    setStatusGestion(false);
                                                }}
                                            >
                                                <img src="./icons/call.png"/>
                                            </button>
                                            <button>
                                                <img src="./icons/send_waps.png"/>
                                            </button>
                                        </div>
                                    </div>
                                :   <></>
                            }

                            {
                                (credit.phone3!=='N/D')
                                ?
                                    <div className="Ggestion__contact">
                                        <p>{(credit.phone3.length<8) ? `07${credit.phone3}` : credit.phone3}</p>
                                        <div>
                                            <button
                                                onClick={(e)=>{
                                                    setPhone(credit.phone3)
                                                    setCall(true);
                                                    setCancel(false);
                                                    setStatusGestion(false);
                                                }}
                                            >
                                                <img src="./icons/call.png"/>
                                            </button>
                                            <button>
                                                <img src="./icons/send_waps.png"/>
                                            </button>
                                        </div>
                                    </div>
                                :   <></>
                            }

                            {
                                (credit.phone4!=='N/D')
                                ?
                                    <div className="Ggestion__contact">
                                        <p>{(credit.phone4.length<8) ? `07${credit.phone4}` : credit.phone4}</p>
                                        <div>
                                            <button
                                                onClick={(e)=>{
                                                    setPhone(credit.phone4)
                                                    setCall(true);
                                                    setCancel(false);
                                                    setStatusGestion(false);
                                                }}
                                            >
                                                <img src="./icons/call.png"/>
                                            </button>
                                            <button>
                                                <img src="./icons/send_waps.png"/>
                                            </button>
                                        </div>
                                    </div>
                                :   <></>
                            }
                            
                        </div>
                    </div>

                    <div>
                        <h3 className="Ggestion__title">Estado de gestión</h3>
                        <div className="Ggestion__form">
                            <div className="Ggestion__threeGroup">

                                <label className="Ggestion__input">
                                    Nombre del contacto
                                    <input type="text" placeholder="STEVEN RAFAEL CESEN" value={credit.name}/>
                                </label>

                                <label className="Ggestion__select">
                                    Estado
                                    <select 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                state_gestion:e.target.value
                                            })
                                        }}
                                        value={data_gestion.state_gestion}
                                    >
                                        <option value={"NO CONTACTADO"}>NO CONTACTADO</option>
                                        <option value={"CONTACTO EFECTIVO"}>CONTACTADO EFECTIVO</option>
                                    </select>
                                </label>

                                <label className="Ggestion__select">
                                    Subestado
                                    <select 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                substate_gestion:e.target.value
                                            })
                                        }}
                                        value={data_gestion.substate_gestion
                                    }>
                                        <option value={"NO CONTESTA"}>NO CONTESTA</option>
                                        <option value={"CONTACTO ESCUCHA Y NO HABLA"}>CONTACTO ESCUCHA Y NO HABLA</option>
                                    </select>
                                </label>

                            </div>

                            <div className="Ggestion__twoGroup">
                                <label className="Ggestion__input">
                                    Fecha de compromiso
                                    <input 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                date_promise:e.target.value
                                            });
                                        }}
                                        value={data_gestion.data_promise}
                                        type="date" 
                                        placeholder="STEVEN RAFAEL CESEN"
                                    />
                                </label>

                                <label className="Ggestion__select">
                                    Motivo No Pago
                                    <select className="Ggestion__select">
                                        <option value={"NO CONTESTA"}>--Seleccionar--</option>
                                    </select>
                                </label>
                            </div>

                            <div className="Ggestion__oneGroup">
                                <label className="Ggestion__textarea">
                                    Observación
                                    <textarea 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                observation:e.target.value
                                            });
                                        }}
                                        value={data_gestion.observation}
                                        placeholder="Escribe aquí"
                                    >
                                    </textarea>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Ggestion__historial">
                    <h3 className="Ggestion__title">Historial</h3>
                    <div className="Ggestion__historialHead">
                        <label>Fecha</label>
                        <label>Cliente</label>
                        <label>Estado de gestión</label>
                        <label>Compromiso</label>
                        <label>Observación</label>
                        <label>Agente</label>
                    </div>

                    {
                        (historial.length>0)
                        ?   
                            historial.map((item,index)=>(
                                <div key={index} className="Ggestion__historialItem">
                                    <label>{item.fecha}</label>
                                    <label>{item.client_name}</label>
                                    <label>{item.state_gestion}</label>
                                    <label>{item.date_promise}</label>
                                    <label>{item.observation}</label>
                                    <label>{item.byUser}</label>
                                </div>
                            ))
                        :   <></>
                    }
                    
                </div>

                <div className="Ggestion__buttons">
                    <button
                        className="Ggestion__buttons--blank"
                        onClick={(e)=>{
                            if(state_gestion){
                                setNext(index);
                            }else{
                                addNotification({
                                    title: 'Gestión en curso',
                                    subtitle: 'Se ha realizado una llamada y no se ha guardado gestión',
                                    message: 'Por favor, guarde la gestión',
                                    native: false,
                                    backgroundTop: '#FF9619',
                                    backgroundBottom: '#fdb864',
                                    colorTop: 'white',
                                    colorBottom: 'white',
                                    closeButton: 'Cerrar',
                                    duration: 3000,
                                });
                            }
                        }}
                    >
                        Seguir sin guardar
                    </button>
                    <button
                        className="Ggestion__buttons--save"
                        onClick={(e)=>{

                            e.target.textContent="Guardando...";

                            if(data_gestion.observation==='' | data_gestion.date_promise===''){
                                e.target.textContent="Intentar de nuevo";

                                addNotification({
                                    title: 'Datos imcompletos',
                                    subtitle: 'Por favor, llene todos los datos de la gestión',
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
                                setStatusGestion(true);

                                const data_send=data_gestion;
                                data_send.id_calls_extras=JSON.stringify(data_send.id_calls_extras);

                                console.log(data_send);

                                fetch(`https://sefil.softsen.space/public/api/managments`,{
                                    method:'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams(data_send)
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        if(data.state===200){
                                            //setNext(index);
                                            e.target.textContent="Guardado";
                                        }else{
                                            e.target.textContent="Error, inténtalo de nuevo";
                                        }
                                    });
                            }

                        }}
                    >Guardar</button>
                </div>
            </div>
            
            {
                (call) 
                ? 
                    <CardCall
                        phone={phone_actual}
                        id_campain={id_campain}
                        id_credit={info_credit.id}
                        close={close}
                        setCancel={setCancel}
                        addCall={add_id_call}
                    />
                :   <></>
            }
            
        </div>
    );
}