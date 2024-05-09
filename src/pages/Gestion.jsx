import { NavLink } from "react-router-dom";
import "./pages.css";
import { useEffect, useState } from "react";

export default function Gestion(){
    useEffect(()=>{
        
    },[]);

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

            <div className="Gestion">
                <div className="Gestion__head">
                    <div>

                    </div>
                    <div>
                        <label>Nombre</label>
                    </div>

                    <div>
                        <label>Cédula</label>
                    </div>

                    <div>
                        <label>Agencia</label>
                        <select>
                            <option value={''}>--Todos--</option>
                            <option value={"catacocha"}>CATACOCHA</option>
                            <option value={"palanda"}>PALANDA</option>
                            <option value={"cariamanga"}>CARIAMANGA</option>
                            <option value={"zamora"}>ZAMORA</option>
                            <option value={"zumba"}>ZUMBA</option>
                            <option value={"piñas"}>PIÑAS</option>
                            <option value={"celica"}>CELICA</option>
                            <option value={"catamayo"}>CATAMAYO</option>
                            <option value={"malacatos"}>MALACATOS</option>
                            <option value={"santa rosa"}>SANTA ROSA</option>
                            <option value={"oficina las pitas"}>OFICINA LAS PITAS</option>
                            <option value={"oficina centro"}>OFICINA CENTRO</option>
                            <option value={"oficina norte"}>OFICINA NORTE</option>
                            <option value={"san miguel de los bancos"}>SAN MIGUEL DE LOS BANCOS</option>
                            <option value={"milagro"}>MILAGRO</option>
                            <option value={"santo domingo"}>SANTO DOMINGO</option>
                            <option value={"el carmen"}>EL CARMEN</option>
                            <option value={"cayambe"}>CAYAMBE</option>
                            <option value={"pasaje"}>PASAJE</option>
                            <option value={"tumbaco"}>TUMBACO</option>
                            <option value={"la troncal"}>LA TRONCAL</option>
                            <option value={"amaguaña"}>AMAGUAÑA</option>
                            <option value={"naranjal"}>NARANJAL</option>
                            <option value={"quinche"}>QUINCHE</option>
                            <option value={"quininde"}>QUININDE</option>
                        </select>
                    </div>

                    <div>
                        <label>Días de mora</label>
                        <div>
                            <div>
                                <label>Min</label>
                                <input type="number"/>
                            </div>
                            <div>
                                <label>Max</label>
                                <input type="number"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Monto</label>
                        <div>
                            <div>
                                <label>Min</label>
                                <input type="number"/>
                            </div>
                            <div>
                                <label>Max</label>
                                <input type="number"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Cuotas</label>
                        <div>
                            <div>
                                <label>Min</label>
                                <input type="number"/>
                            </div>
                            <div>
                                <label>Max</label>
                                <input type="number"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Estado</label>
                        <select>
                            <option value={"all"}>--Todos--</option>
                            <option value={"Vencido"}>Vencidos</option>
                            <option value={"Vigente"}>Vigentes</option>
                            <option value={"Judicial"}>Judicial</option>
                            <option value={"Prejudicial"}>Prejudicial</option>
                        </select>
                    </div>

                    <div>
                        <label>Compromiso</label>
                        <input type="date"/>
                    </div>

                </div>

                <div className="Gestion__item">
                    <button>
                        <NavLink
                            to={"/dashboard/gcall/2"}
                        >
                            <img src="./icons/go.png"/>
                        </NavLink>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>

                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>

                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>
                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>
                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>
                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>
                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>
                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>
                <div className="Gestion__item">
                    <button>
                        <img src="./icons/go.png"/>
                    </button>
                    <p>STEVEN CESEN PACCHA</p>
                    <p>1150575338</p>
                    <p>LOJA CENTRO</p>
                    <p>2-5</p>
                    <p>100-500</p>
                    <p>2-10</p>
                    <p>VIGENTE</p>
                    <p>2024/05/13</p>
                </div>

            </div>

            <div className="DetailCredit__access">
                <p>Registros del {}-{} de {}</p>
                <div>
                    <NavLink onClick={()=>{}}>Anterior</NavLink>
                    <NavLink onClick={()=>{}}>Siguiente</NavLink>
                </div>
            </div>
        </div>
    );
}
