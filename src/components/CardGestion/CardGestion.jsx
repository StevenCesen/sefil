import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./CardGestion.css"
import CardCall from "../CardCall/CardCall";

export default function CardGestion({currently,next,index,setNext,id_campain}){
    
    const [call,setCall]=useState(false);
    const [credit,setCredit]=useState();
    const [data_call,setDataCall]=useState();
    const [data_gestion,setDataGestion]=useState();
    const [historial,setHistorial]=useState();
    const [phone_actual,setPhone]=useState();

    const close=()=>{
        setCall(false);
    }

    useEffect(()=>{
        setDataCall({
            phone:'',
            state:'',
            duration:'',
            id_credit:'',
            fecha:'',
            id_campain:'',
            id_record:'',
            id_gestion:''
        });

        setDataGestion({
            id_campain:id_campain,
            id_call:'1',
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

    },[currently]);

    if(!historial) return <></>
    if(!credit) return <></>
    if(!data_call) return <></>
    if(!data_gestion) return <></>
   

    return (
        <div className="Ggestion">
            <div className="Ggestion__dates">
                <label>
                    <select>
                        <option value={credit.id}>{credit.name} | TITULAR</option>
                        {
                            JSON.parse(credit.contactos).map((contact,index)=>(
                                (contact.name!=='') &&
                                    <option value={credit.id}>{contact.name} | GARANTE</option>
                            ))
                        }
                    </select>
                </label>

                <div className="DetailCredit__general">
                    <h3>Información del cliente</h3>
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
                    <h3>Información del crédito</h3>
                    <div className="DetailCredit__table">
                        <div>
                            <p className="Head">VALOR PENDIENTE</p>
                            <span>{credit.monthlyFeeAmount}</span>
                        </div>
                        <div>
                            <p className="Head">DÍAS DE MORA</p>
                            <span>{credit.dias_vencidos}</span>
                        </div>
                        <div>
                            <p className="Head">FECHA DE PAGO</p>
                            <span>{credit.paymentDate}</span>
                        </div>
                        <div>
                            <p className="Head">CUOTAS PENDIENTES</p>
                            <span>{credit.pendingFees}</span>
                        </div>
                        <div>
                            <p className="Head">CUOTAS PAGADAS</p>
                            <span>{credit.paidFees}</span>
                        </div>
                        <div>
                            <p className="Head">TOTAL ADEUDADO</p>
                            <span>{credit.totalAmount}</span>
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
                                        <p>{credit.phone}</p>
                                        <div>
                                            <button
                                                onClick={(e)=>{
                                                    setPhone(credit.phone)
                                                    setCall(true);
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
                                        <p>{credit.phone2}</p>
                                        <div>
                                            <button
                                                onClick={(e)=>{
                                                    setPhone(credit.phone2)
                                                    setCall(true);
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
                                        <p>{credit.phone3}</p>
                                        <div>
                                            <button
                                                onClick={(e)=>{
                                                    setPhone(credit.phone3)
                                                    setCall(true);
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
                                        <p>{credit.phone4}</p>
                                        <div>
                                            <button
                                                onClick={(e)=>{
                                                    setPhone(credit.phone4)
                                                    setCall(true);
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
                                    <input type="text" placeholder="STEVEN RAFAEL CESEN" value={data_gestion.client_name}/>
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

                <button
                    onClick={(e)=>{
                        e.target.textContent="Guardando...";

                        if(data_gestion.observation===''){
                            e.target.textContent="Guardar y continuar";
                            setNext(index);
                        }else{
                            fetch(`https://sefil.softsen.space/public/api/managments`,{
                                method:'POST',
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                },
                                body:new URLSearchParams(data_gestion)
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    if(data.state===200){
                                        setNext(index);
                                        e.target.textContent="Guardado";
                                    }else{
                                        e.target.textContent="Error, inténtalo de nuevo";
                                    }
                                });
                        }

                    }}
                >Guardar y continuar</button>
            </div>
            
            {
                (call) 
                ? 
                    <CardCall
                        phone={phone_actual}
                        close={close}
                    />
                :   <></>
            }
            
        </div>
    );
}