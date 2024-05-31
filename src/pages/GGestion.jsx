import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import CardCall from "../components/CardCall/CardCall";
import { GestionContext } from "../contexts/GestionContext";

export default function GGestion(){
    const param=useParams();

    const [call,setCall]=useState(false);
    const [credit,setCredit]=useState();
    const data_context=useContext(GestionContext);

    useEffect(()=>{
        setCall(false);
        data_context.searchCredit(param.ci);
        setCredit(data_context.credit);
    },[]);

    if(!credit) return <></>

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

            <div className="Ggestion">
                <div className="Ggestion__dates">
                    {
                        console.log(credit)
                    }
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
                                <p className="Ggestion__subtitle">3 contactos registrados</p>
                                
                                {
                                    (credit.phone!=='N/D')
                                    ?
                                        <div className="Ggestion__contact">
                                            <p>{credit.phone}</p>
                                            <div>
                                                <button>
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
                                                <button>
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
                                                <button>
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
                                                <button>
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
                                        <select>
                                            <option value={"CONTACTO EFECTIVO"}>NO CONTACTADO</option>
                                            <option value={"CONTACTO EFECTIVO"}>CONTACTADO EFECTIVO</option>
                                        </select>
                                    </label>

                                    <label className="Ggestion__select">
                                        Subestado
                                        <select>
                                            <option value={"NO CONTESTA"}>NO CONTESTA</option>
                                            <option value={"CONTACTO ESCUCHA Y NO HABLA"}>CONTACTO ESCUCHA Y NO HABLA</option>
                                        </select>
                                    </label>

                                </div>

                                <div className="Ggestion__twoGroup">
                                    <label className="Ggestion__input">
                                        Fecha de compromiso
                                        <input type="date" placeholder="STEVEN RAFAEL CESEN"/>
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
                                        <textarea placeholder="Escribe aquí">
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

                        <div className="Ggestion__historialItem">
                            <label>2024/05/13 10:20:05</label>
                            <label>STEVEN RAFAEL CESEN PACCHA</label>
                            <label>YA PAGO</label>
                            <label>2024/05/17</label>
                            <label>Cliente realizo el pago ayer. Su Hermana realizó el depósito a la cuenta de Loja.</label>
                            <label>C. TORRES</label>
                        </div>
                        <div className="Ggestion__historialItem">
                            <label>2024/05/13 10:20:05</label>
                            <label>STEVEN RAFAEL CESEN PACCHA</label>
                            <label>YA PAGO</label>
                            <label>2024/05/17</label>
                            <label>Cliente realizo el pago ayer. Su Hermana realizó el depósito a la cuenta de Loja.</label>
                            <label>C. TORRES</label>
                        </div>
                        <div className="Ggestion__historialItem">
                            <label>2024/05/13 10:20:05</label>
                            <label>STEVEN RAFAEL CESEN PACCHA</label>
                            <label>YA PAGO</label>
                            <label>2024/05/17</label>
                            <label>Cliente realizo el pago ayer. Su Hermana realizó el depósito a la cuenta de Loja.</label>
                            <label>C. TORRES</label>
                        </div>
                    </div>

                    <button>Guardar y continuar</button>
                </div>

            </div>

            {
                (call) 
                ? 
                    <CardCall/>
                :   <></>
            }
            
        </div>
    );
}