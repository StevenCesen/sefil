import { useState } from "react";
import useFilters from "../hooks/useFilters";
import { useEffect } from "react";
import useCheckbox from "../hooks/useCheckbox";
import { NavLink, useParams } from "react-router-dom";

export default function Reports(){

    const [filter,setFilter]=useState({
        monto:'',
        forma_pago:'',
        transaccion:'',
        agente:'',
        mes:'',
        fecha:''
    });

    const [reports,setReports]=useState();

    const [provincia,setProvincia]=useState("loja");

    // const [cantones,setCantones]=({
    //     loja:[
            
    //     ],
    //     oro:[
    //         'Machala', 
    //         'Arenillas', 
    //         'Atahualpa', 
    //         'Balsas', 
    //         'Chila', 
    //         'El Guabo', 
    //         'Huaquillas', 
    //         'Marcabelí', 
    //         'Pasaje', 
    //         'Piñas', 
    //         'Portovelo', 
    //         'Santa Rosa', 
    //         'Zaruma',
    //         'Las Lajas'
    //     ],
    //     zamora:[
    //         'Centinela del Cóndor',
    //         'Chinchipe',
    //         'El Pangui',
    //         'Nangaritza',
    //         'Palanda',
    //         'Paquisha',
    //         'Yacuambi',
    //         'Yantzaza',
    //         'Zamora'
    //     ]
    // });

    const param=useParams();

    const updateMonto=(value)=>{
        setReports(value);
    };

    const updateForma=(value)=>{
        // setFilter({
        //     ...filter,
        //     forma_pago:value
        // });
        setReports(value);
    };

    const updateTransaccion=(value)=>{
        setReports(value);
    };

    const updateAgente=(value)=>{
        setReports(value);
    };

    const updateMes=(value)=>{
        setReports(value);
    };

    const updateFecha=(value)=>{
        setReports(value);
    };


    const [agents,setAgents]=useState();
    const [business,setBusiness]=useState();
    const [select_value,setSelect]=useState("all");

    useEffect(()=>{
        fetch("https://sefil.softsen.space/public/api/users/departament?role=cobranza",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setAgents(data));

        fetch("https://sefil.softsen.space/public/api/bussines",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
            });
        
        fetch("https://sefil.softsen.space/public/api/report/pays",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setReports(data));

        setSelect("all");
        setProvincia("loja");
    
    },[]);

    if(!agents) return <></>
    if(!reports) return <></>
    if(!business) return <></>

    return (
        <div className="Reports">
            {
                (param.ci==='estado')
                ?
                    <div className="Reports__content">
                        <h4 className="Reports__title">Resúmenes</h4>
                        <div className="Reports__filters Reports__filters--columns-8">

                            <label className="Reports__filter">
                                Agencia
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    <option value={"catacocha"}>CATACOCHA</option>
                                    <option value={"catacocha"}>PALANDA</option>
                                    <option value={"catacocha"}>CARIAMANGA</option>
                                    <option value={"catacocha"}>ZAMORA</option>
                                    <option value={"catacocha"}>ZUMBA</option>
                                    <option value={"catacocha"}>PIÑAS</option>
                                    <option value={"catacocha"}>CELICA</option>
                                    <option value={"catacocha"}>CATAMAYO</option>
                                    <option value={"catacocha"}>MALACATOS</option>
                                    <option value={"catacocha"}>SANTA ROSA</option>
                                    <option value={"catacocha"}>OFICINA LAS PITAS</option>
                                    <option value={"catacocha"}>OFICINA CENTRO</option>
                                    <option value={"catacocha"}>OFICINA NORTE</option>
                                    <option value={"catacocha"}>SAN MIGUEL DE LOS BANCOS</option>
                                    <option value={"catacocha"}>MILAGRO</option>
                                    <option value={"catacocha"}>SANTO DOMINGO</option>
                                    <option value={"catacocha"}>EL CARMEN</option>
                                    <option value={"catacocha"}>CAYAMBE</option>
                                    <option value={"catacocha"}>PASAJE</option>
                                    <option value={"catacocha"}>TUMBACO</option>
                                    <option value={"catacocha"}>LA TRONCAL</option>
                                    <option value={"catacocha"}>AMAGUAÑA</option>
                                    <option value={"catacocha"}>NARANJAL</option>
                                    <option value={"catacocha"}>QUINCHE</option>
                                    <option value={"catacocha"}>QUININDE</option>
                            
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Provincia
                                <select 
                                    value={provincia}
                                    onChange={(e)=>{
                                        setProvincia(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    <option value={'loja'}>Loja</option>
                                    <option value={'el oro'}>El Oro</option>
                                    <option value={'zamora chinchipe'}>Zamora Chinchipe</option>
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Cantón
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    {

                                        (provincia==="loja") 
                                        ?
                                            <>
                                                <option value={'zamora chinchipe'}>Calvas</option>
                                                <option value={'zamora chinchipe'}>Catamayo</option>
                                                <option value={'zamora chinchipe'}>Celica</option>
                                                <option value={'zamora chinchipe'}>Chaguarpamba</option>
                                                <option value={'zamora chinchipe'}>Espíndola</option>
                                                <option value={'zamora chinchipe'}>Gonzanamá</option>
                                                <option value={'zamora chinchipe'}>Loja</option>
                                                <option value={'zamora chinchipe'}>Macará</option>
                                                <option value={'zamora chinchipe'}>Olmedo</option>
                                                <option value={'zamora chinchipe'}>Paltas</option>
                                                <option value={'zamora chinchipe'}>Pindal</option>
                                                <option value={'zamora chinchipe'}>Puyango</option>
                                                <option value={'zamora chinchipe'}>Quilanga</option>
                                                <option value={'zamora chinchipe'}>Saraguro</option>
                                                <option value={'zamora chinchipe'}>Sozoranga</option>
                                                <option value={'zamora chinchipe'}>Zapotillo</option>
                                            </>
                                        : (provincia==="el oro")
                                            ?
                                                <>
                                                    <option value={'zamora chinchipe'}>Calvas</option>
                                                    <option value={'zamora chinchipe'}>Catamayo</option>
                                                    <option value={'zamora chinchipe'}>Celica</option>
                                                    <option value={'zamora chinchipe'}>Chaguarpamba</option>
                                                    <option value={'zamora chinchipe'}>Espíndola</option>
                                                    <option value={'zamora chinchipe'}>Gonzanamá</option>
                                                    <option value={'zamora chinchipe'}>Loja</option>
                                                    <option value={'zamora chinchipe'}>Macará</option>
                                                    <option value={'zamora chinchipe'}>Olmedo</option>
                                                    <option value={'zamora chinchipe'}>Paltas</option>
                                                    <option value={'zamora chinchipe'}>Pindal</option>
                                                    <option value={'zamora chinchipe'}>Puyango</option>
                                                    <option value={'zamora chinchipe'}>Quilanga</option>
                                                    <option value={'zamora chinchipe'}>Saraguro</option>
                                                </>
                                            :<></>
                                        
                                    }
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Días en mora
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    <option value={'1-2'}>1-2</option>
                                    <option value={'3-10'}>3-10</option>
                                    <option value={'11-50'}>11-50</option>
                                    <option value={'51-100'}>51-100</option>
                                    <option value={'101'}>Mayor a 101</option>
                                    
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Monto
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    <option value={'0.01-500'}>0-500</option>
                                    <option value={'500.01-1000'}>500-1000</option>
                                    <option value={'1000.01-3000'}>1000-3000</option>
                                    <option value={'3000.01-5000'}>3000-5000</option>
                                    <option value={'5000.01-10000'}>5000-10000</option>
                                    <option value={'10000.01'}>Mayor a 10000</option>
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Empresa
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    {
                                        business.map((bus,index)=>(
                                            <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            
                            <NavLink 
                                className="Reports__button"
                                to={"https://sefil.softsen.space/public/api/cierre"}
                                onClick={(e)=>{
                                    console.log(select_value)
                                }}
                            >Aplicar</NavLink>
                        </div>
                    </div>
                :
                    <div className="Reports__content">
                        <h4 className="Reports__title">Histórico de pagos</h4>
                        <div className="Reports__filters Reports__filters--columns-5">

                            <label className="Reports__filter">
                                Fecha de inicio
                                <input type="date"/>
                            </label>

                            <label className="Reports__filter">
                                Fecha de corte
                                <input type="date"/>
                            </label>

                            <label className="Reports__filter">
                                Usuario
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    <option value={"Maria Bravo"}>María Bravo</option>
                                    {
                                        agents.map((agent,index)=>(
                                            <option key={index} value={agent.name}>{agent.name}</option>
                                        ))
                                    }
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Empresa
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
                                    <option value={'all'}>--Todos--</option>
                                    {
                                        business.map((bus,index)=>(
                                            <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            
                            <NavLink 
                                className="Reports__button"
                                to={"https://sefil.softsen.space/public/api/cierre"}
                                onClick={(e)=>{
                                    console.log(select_value)
                                }}
                            >Generar EXCEL</NavLink>


                        </div>
                    </div>
            }
        </div>
    );
}







/*
<div className="Reports__headers">
    <div>
        <label onClick={(e)=>{useFilters(e.target,'Reports__headers--active')}}>Monto
            <img src="./icons/arrowDown.png"/>
        </label>
        <div>
            <label>
                -----TODOS-----
                <input type="radio" value="" onChange={(e)=>{
                    useCheckbox("monto",updateMonto)
                }} name="monto"/>
            </label>
            <label>
                1-100
                <input type="radio" value="1-100" onChange={(e)=>{
                    useCheckbox("monto",updateMonto)
                }} name="monto"/>
            </label>
            <label>
                101-500
                <input type="radio" value="101-500" onChange={(e)=>{
                    useCheckbox("monto",updateMonto)
                }} name="monto"/>
            </label>
            <label>
                Mayor a 500
                <input type="radio" value="500" onChange={(e)=>{
                    useCheckbox("monto",updateMonto)
                }} name="monto"/>
            </label>
        </div>
    </div>

    <div>
        <label onClick={(e)=>{useFilters(e.target,'Reports__headers--active')}}>Forma de pago
            <img src="./icons/arrowDown.png"/>
        </label>
        <div>
            <label>
                -----TODAS-----
                <input type="radio" onChange={(e)=>{
                    useCheckbox("forma_pago",updateForma);
                }} name="forma_pago" value=""/>
            </label>
            <label>
                Efectivo
                <input name="forma_pago" type="radio" onChange={(e)=>{
                    useCheckbox("forma_pago",updateForma);
                }} value="efectivo"/>
            </label>
            <label>
                Transferencia
                <input name="forma_pago" type="radio" onChange={(e)=>{
                    useCheckbox("forma_pago",updateForma);
                }} value="transferencia"/>
            </label>
            <label>
                Depósito
                <input name="forma_pago" type="radio" onChange={(e)=>{
                    useCheckbox("forma_pago",updateForma);
                }} value="deposito"/>
            </label>
        </div>
    </div>
    <div>
        <label onClick={(e)=>{useFilters(e.target,'Reports__headers--active')}}>Transacción
            <img src="./icons/arrowDown.png"/>
        </label>
        <div>
            <label>
                -----TODOS-----
                <input type="radio" name="transaccion" onChange={(e)=>{
                    useCheckbox("transaccion",updateTransaccion);
                }} value=""/>
            </label>
            <label>
                Total
                <input type="radio" name="transaccion" onChange={(e)=>{
                    useCheckbox("transaccion",updateTransaccion);
                }} value="total"/>
            </label>
            <label>
                Parcial
                <input type="radio" name="transaccion" onChange={(e)=>{
                    useCheckbox("transaccion",updateTransaccion);
                }} value="parcial"/>
            </label>
        </div>
    </div>
    <div>
        <label onClick={(e)=>{useFilters(e.target,'Reports__headers--active')}}>Agente
            <img src="./icons/arrowDown.png"/>
        </label>
        <div>
            <label>
                -----TODOS-----
                <input type="radio" value="" name="agente"/>
            </label>
            {
                agents.map((agent,index)=>(
                    <label key={index}>
                        {agent.name}
                        <input type="radio" name="agente" onChange={(e)=>{
                            useCheckbox("agente",updateAgente);
                        }} value={agent.id}/>
                    </label>
                ))    
            }
        
        </div>
    </div>
    <div>
        <label onClick={(e)=>{useFilters(e.target,'Reports__headers--active')}}>Mes
            <img src="./icons/arrowDown.png"/>
        </label>
        <div>
            <label>
                -----TODOS-----
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value=""/>
            </label>
            <label>
                Enero
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="01"/>
            </label>
            <label>
                Febrero
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="02"/>
            </label>
            <label>
                Marzo
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="03"/>
            </label>
            <label>
                Abril
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="04"/>
            </label>
            <label>
                Mayo
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="05"/>
            </label>
            <label>
                Junio
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="06"/>
            </label>
            <label>
                Julio
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="07"/>
            </label>
            <label>
                Agosto
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="08"/>
            </label>
            <label>
                Septiembre
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="09"/>
            </label>
            <label>
                Octubre
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="10"/>
            </label>
            <label>
                Noviembre
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="11"/>
            </label>
            <label>
                Diciembre
                <input type="radio" name="mes" onChange={(e)=>{
                    useCheckbox("mes",updateMes);
                }} value="12"/>
            </label>
        </div>
    </div>
    <div>
        <label onClick={(e)=>{useFilters(e.target,'Reports__headers--active')}}>Fecha
            <img src="./icons/arrowDown.png"/>
        </label>
        <div>
            <label>
                    -----TODAS-----
                    <input type="checkbox" name="fecha" onChange={(e)=>{
                        useCheckbox("fecha",updateFecha);
                    }} value=""/>
            </label>
            <input type="date" name="fecha" onChange={(e)=>{
                useCheckbox("fecha",updateFecha);
            }}/>
        </div>
    </div>

</div>
*/