import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function GGestion(){
    const param=useParams();

    useEffect(()=>{
        console.log(param.ci)
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
                                <p className="Head">Provincia</p>
                                <span>{"LOJA"}</span>
                            </div>
                            <div>
                                <p className="Head">Género</p>
                                <span>{"FEMENINO"}</span>
                            </div>
                            <div>
                                <p className="Head">Provincia</p>
                                <span>{"LOJA"}</span>
                            </div>
                            <div>
                                <p className="Head">Cantón</p>
                                <span>{"LOJA"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="DetailCredit__general">
                        <h3>Información del crédito</h3>
                        <div className="DetailCredit__table">
                            <div>
                                <p className="Head">Valor cuota</p>
                                <span>{"$ 235.35"}</span>
                            </div>
                            <div>
                                <p className="Head">Días de mora</p>
                                <span>{"15"}</span>
                            </div>
                            <div>
                                <p className="Head">Fecha de pago</p>
                                <span>{"2024/8/5"}</span>
                            </div>
                            <div>
                                <p className="Head">Cuotas Pendientes</p>
                                <span>{"2"}</span>
                            </div>
                            <div>
                                <p className="Head">Cuotas pagadas</p>
                                <span>{"10"}</span>
                            </div>
                            <div>
                                <p className="Head">Total adeudado</p>
                                <span>{"$ 470.7"}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="Ggestion__regist">
                    <div className="Ggestion__principal">
                        <div>
                            <h3>Contactos</h3>
                            <button>Agregar nuevo</button>
                            <div>
                                <p>3 contactos registrados</p>
                                <div>
                                    <p>0978950498</p>
                                    <div>
                                        <button>Llamar</button>
                                        <button>WhatsApp</button>
                                        <button>Borrar</button>
                                    </div>
                                </div>
                                <div>
                                    <p>0978950498</p>
                                    <div>
                                        <button>Llamar</button>
                                        <button>WhatsApp</button>
                                        <button>Borrar</button>
                                    </div>
                                </div>
                                <div>
                                    <p>0978950498</p>
                                    <div>
                                        <button>Llamar</button>
                                        <button>WhatsApp</button>
                                        <button>Borrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3>Estado de gestión</h3>

                        </div>
                    </div>

                    <div className="Ggestion__historial">
                        <h3>Historial</h3>
                        <div className="Ggestion__historialHead">

                        </div>
                        <div className="Ggestion__historialItem">

                        </div>
                    </div>
                </div>

            </div>
            <button>Guardar y continuar</button>
        </div>
    );
}