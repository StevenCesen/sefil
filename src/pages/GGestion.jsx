import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import CardCall from "../components/CardCall/CardCall";

export default function GGestion(){
    const param=useParams();

    const [call,setCall]=useState(false);

    useEffect(()=>{
        console.log(param.ci)
        setCall(false);
    });

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
                    <label>
                        <select>
                            <option value={"289"}>TITULAR | 2020283736</option>
                        </select>
                    </label>

                    <div className="DetailCredit__general">
                        <h3>Información del cliente</h3>
                        <div className="DetailCredit__table">
                            <div>
                                <p className="Head">NOMBRE</p>
                                <span>{"STEVEN RAFAEL CESEN"}</span>
                            </div>
                            <div>
                                <p className="Head">CÉDULA</p>
                                <span>{"1150575338"}</span>
                            </div>
                            <div>
                                <p className="Head">GÉNERO</p>
                                <span>{"MASCULINO"}</span>
                            </div>
                            <div>
                                <p className="Head">PROVINCIA</p>
                                <span>{"LOJA"}</span>
                            </div>
                            <div>
                                <p className="Head">CANTÓN</p>
                                <span>{"LOJA"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="DetailCredit__general">
                        <h3>Información del crédito</h3>
                        <div className="DetailCredit__table">
                            <div>
                                <p className="Head">VALOR PENDIENTE</p>
                                <span>{"$ 235.35"}</span>
                            </div>
                            <div>
                                <p className="Head">DÍAS DE MORA</p>
                                <span>{"15"}</span>
                            </div>
                            <div>
                                <p className="Head">FECHA DE PAGO</p>
                                <span>{"2024/8/5"}</span>
                            </div>
                            <div>
                                <p className="Head">CUOTAS PENDIENTES</p>
                                <span>{"2"}</span>
                            </div>
                            <div>
                                <p className="Head">CUOTAS PAGADAS</p>
                                <span>{"10"}</span>
                            </div>
                            <div>
                                <p className="Head">TOTAL ADEUDADO</p>
                                <span>{"$ 470.7"}</span>
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
                                <div className="Ggestion__contact">
                                    <p>0978950498</p>
                                    <div>
                                        <button>
                                            <img src="./icons/call.png"/>
                                        </button>
                                        <button>
                                            <img src="./icons/send_waps.png"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="Ggestion__contact">
                                    <p>0978950498</p>
                                    <div>
                                        <button>
                                            <img src="./icons/call.png"/>
                                        </button>
                                        <button>
                                            <img src="./icons/send_waps.png"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="Ggestion__contact">
                                    <p>0978950498</p>
                                    <div>
                                        <button>
                                            <img src="./icons/call.png"/>
                                        </button>
                                        <button>
                                            <img src="./icons/send_waps.png"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="Ggestion__title">Estado de gestión</h3>
                            <div className="Ggestion__form">
                                <div className="Ggestion__threeGroup">

                                    <label className="Ggestion__input">
                                        Nombre del contacto
                                        <input type="text" placeholder="STEVEN RAFAEL CESEN"/>
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
                ? <></>
                : <CardCall/>
            }
            
        </div>
    );
}