import { useState } from "react";
import useFilters from "../hooks/useFilters";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Line, Bar,Doughnut} from 'react-chartjs-2';

import "./pages.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
      datalabels: {
        anchor: 'end',
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 0,
        color: 'white',
        display: function(context) {
          let dataset = context.dataset;
          let value = dataset.data[context.dataIndex];
          return value;
        },
        formatter: Math.round,
        font: {
          weight: 'bold',
          size: '25'
        },
       }
    }
};

const labels = ['Capital', 'Interés', 'Mora', 'Seguro desgravamen', 'Gastos de cobranza', 'Gastos judiciales', 'Otros valores'];

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

    const [results,setResults]=useState();

    const [provincia,setProvincia]=useState("loja");
    
    const [canton,setCanton]=useState("all");

    const [empresa,setEmpresa]=useState("SEFIL_1");

    const [fecha_inicio,setFechaInicio]=useState("");
    const [fecha_final,setFechaFinal]=useState("");
    const [agent,setAgent]=useState("");

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

        setSelect("");
        setProvincia("loja");
        setCanton("");
        setEmpresa("SEFIL_1");
        setResults([]);
        setFechaInicio("");
        setFechaFinal("")
        setAgent("");
    
    },[]);

    if(!agents) return <></>
    if(!reports) return <></>
    if(!business) return <></>
    if(!results) return <></>

    return (
        <div className="Reports">
            {
                (param.ci==='estado')
                ?
                    <div className="Reports__content">
                        <h4 className="Reports__title">Resumen de valores adeudados</h4>
                        <div className="Reports__filters Reports__filters--columns-8">

                            <label className="Reports__filter">
                                Agencia
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
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
                            </label>

                            <label className="Reports__filter">
                                Provincia
                                <select 
                                    value={provincia}
                                    onChange={(e)=>{
                                        setProvincia(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
                                    <option value={'loja'}>Loja</option>
                                    <option value={'el oro'}>El Oro</option>
                                    <option value={'zamora chinchipe'}>Zamora Chinchipe</option>
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Cantón
                                <select 
                                    value={canton}
                                    onChange={(e)=>{
                                        setCanton(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
                                    {

                                        (provincia==="loja") 
                                        ?
                                            <>
                                            
                                                <option value={'calvas'}>Calvas</option>
                                                <option value={'catamayo'}>Catamayo</option>
                                                <option value={'celica'}>Celica</option>
                                                <option value={'chaguarpamba'}>Chaguarpamba</option>
                                                <option value={'espíndola'}>Espíndola</option>
                                                <option value={'gonzanamá'}>Gonzanamá</option>
                                                <option value={'loja'}>Loja</option>
                                                <option value={'macará'}>Macará</option>
                                                <option value={'olmedo'}>Olmedo</option>
                                                <option value={'paltas'}>Paltas</option>
                                                <option value={'pindal'}>Pindal</option>
                                                <option value={'puyango'}>Puyango</option>
                                                <option value={'quilanga'}>Quilanga</option>
                                                <option value={'saraguro'}>Saraguro</option>
                                                <option value={'sozoranga'}>Sozoranga</option>
                                                <option value={'zapotillo'}>Zapotillo</option>
                                            </>
                                        : (provincia==="el oro")
                                            ?
                                                <>
                                                    <option value={'machala'}>Machala</option>
                                                    <option value={'arenillas'}>Arenillas</option>
                                                    <option value={'atahualpa'}>Atahualpa</option>
                                                    <option value={'balsas'}>Balsas</option>
                                                    <option value={'chila'}>Chila</option>
                                                    <option value={'el guabo'}>El Guabo</option>
                                                    <option value={'huaquillas'}>Huaquillas</option>
                                                    <option value={'marcabelí'}>Marcabelí</option>
                                                    <option value={'pasaje'}>Pasaje</option>
                                                    <option value={'piñas'}>Piñas</option>
                                                    <option value={'portovelo'}>Portovelo</option>
                                                    <option value={'santa rosa'}>Santa Rosa</option>
                                                    <option value={'zaruma'}>Zaruma</option>
                                                    <option value={'las lajas'}>Las Lajas</option>
                                                </>
                                            :   
                                                <>
                                                    <option value={'centinela del cóndor'}>Centinela del Cóndor</option>
                                                    <option value={'chinchipe'}>Chinchipe</option>
                                                    <option value={'el pangui'}>El Pangui</option>
                                                    <option value={'nangaritza'}>Nangaritza</option>
                                                    <option value={'palanda'}>Palanda</option>
                                                    <option value={'paquisha'}>Paquisha</option>
                                                    <option value={'yacuambi'}>Yacuambi</option>
                                                    <option value={'yantzaza'}>Yantzaza</option>
                                                    <option value={'zamora'}>Zamora</option>
                                                </>
                                        
                                    }
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Empresa
                                <select 
                                    value={empresa}
                                    onChange={(e)=>{
                                        setEmpresa(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
                                    {
                                        business.map((bus,index)=>(
                                            <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            
                            <NavLink 
                                className="Reports__button"
                                onClick={(e)=>{
                                    fetch(`https://sefil.softsen.space/public/api/cartera/estado?cartera=${empresa}&agencia=${select_value}&provincia=${provincia}&canton=${canton}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            console.log(data)
                                            setResults(data);
                                        });
                                }}
                            >Aplicar</NavLink>
                        </div>

                        {
                            ('data' in results) &&
                                <div className="Reports__results">
                                    
                                    <div className="Reports__resultsResume">
                                        <div>
                                            <h4>Valores a recuperar</h4>

                                            <div className="Reports__resultHead">
                                                <p><strong>Agencia:</strong> {(select_value==='') ? 'Todas' : select_value}</p>
                                                <p><strong>Provincia:</strong> {(provincia==='') ? 'Todas' : provincia.toUpperCase()}</p>
                                                <p><strong>Cantón:</strong> {(canton==='') ? 'Todos' : canton.toUpperCase()}</p>
                                                <p><strong>Empresa:</strong> {(empresa==='') ? 'Todas' : empresa.toUpperCase()}</p>
                                            </div>

                                            <div>
                                                <label>Capital:</label>
                                                <span> $ {Number(results.data.actual.saldo_capital).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} USD</span>
                                            </div>
                                            <div>
                                                <label>Interés:</label>
                                                <span> $ {Number(results.data.actual.interes).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} USD</span>
                                            </div>
                                            <div>
                                                <label>Mora:</label>
                                                <span> $ {Number(results.data.actual.mora).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} USD</span>
                                            </div>
                                            <div>
                                                <label>Seguro:</label>
                                                <span> $ {Number(results.data.actual.seguro_desgravamen).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} USD</span>
                                            </div>
                                            <div>
                                                <label>Gastos de cobranza:</label>
                                                <span> $ {Number(results.data.actual.gastos_cobranza).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} USD</span>
                                            </div>
                                            <div>
                                                <label>Gastos judiciales:</label>
                                                <span> $ {Number(results.data.actual.gastos_judiciales).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} USD</span>
                                            </div>
                                            <div>
                                                <label>Otros valores:</label>
                                                <span> $ {Number(results.data.actual.otros_valores).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} USD</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <label>Créditos activos:</label>
                                                <span>{results.data.actual.creditos_activos}</span>
                                            </div>
                                            <div>
                                                <label>Créditos inactivos:</label>
                                                <span>{results.data.actual.creditos_inactivos}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gráfica */}
                                    <div className="Reports__resultGraphic">
                                        <h3>Distribución de valores</h3>
                                        <Bar
                                            width={"100%"}
                                            height={"30px"}
                                            data={{
                                                labels,
                                                datasets:[
                                                    {
                                                        label:'Cartera original',
                                                        data:[results.data.original.saldo_capital,results.data.original.interes,results.data.original.mora,results.data.original.seguro_desgravamen,results.data.original.gastos_cobranza,results.data.original.gastos_judiciales,results.data.original.otros_valores],
                                                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                                                    },
                                                    {
                                                        label:'Cartera a recuperar',
                                                        data:[results.data.actual.saldo_capital,results.data.actual.interes,results.data.actual.mora,results.data.actual.seguro_desgravamen,results.data.actual.gastos_cobranza,results.data.actual.gastos_judiciales,results.data.actual.otros_valores],
                                                        backgroundColor: 'rgba(53, 162, 235, 0.5)'
                                                    }
                                                ]
                                            }}
                                            options={options}
                                        />
                                    </div>


                                </div>
                        }

                        {/* <h4 className="Reports__title">Resumen de distribución de créditos</h4>
                        <div className="Reports__filters Reports__filters--columns-8">

                            <label className="Reports__filter">
                                Agencia
                                <select 
                                    value={select_value}
                                    onChange={(e)=>{
                                        setSelect(e.target.value);
                                    }}
                                >
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
                            </label>

                            <label className="Reports__filter">
                                Provincia
                                <select 
                                    value={provincia}
                                    onChange={(e)=>{
                                        setProvincia(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
                                    <option value={'loja'}>Loja</option>
                                    <option value={'el oro'}>El Oro</option>
                                    <option value={'zamora chinchipe'}>Zamora Chinchipe</option>
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Cantón
                                <select 
                                    value={canton}
                                    onChange={(e)=>{
                                        setCanton(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
                                    {

                                        (provincia==="loja") 
                                        ?
                                            <>
                                            
                                                <option value={'calvas'}>Calvas</option>
                                                <option value={'catamayo'}>Catamayo</option>
                                                <option value={'celica'}>Celica</option>
                                                <option value={'chaguarpamba'}>Chaguarpamba</option>
                                                <option value={'espíndola'}>Espíndola</option>
                                                <option value={'gonzanamá'}>Gonzanamá</option>
                                                <option value={'loja'}>Loja</option>
                                                <option value={'macará'}>Macará</option>
                                                <option value={'olmedo'}>Olmedo</option>
                                                <option value={'paltas'}>Paltas</option>
                                                <option value={'pindal'}>Pindal</option>
                                                <option value={'puyango'}>Puyango</option>
                                                <option value={'quilanga'}>Quilanga</option>
                                                <option value={'saraguro'}>Saraguro</option>
                                                <option value={'sozoranga'}>Sozoranga</option>
                                                <option value={'zapotillo'}>Zapotillo</option>
                                            </>
                                        : (provincia==="el oro")
                                            ?
                                                <>
                                                    <option value={'machala'}>Machala</option>
                                                    <option value={'arenillas'}>Arenillas</option>
                                                    <option value={'atahualpa'}>Atahualpa</option>
                                                    <option value={'balsas'}>Balsas</option>
                                                    <option value={'chila'}>Chila</option>
                                                    <option value={'el guabo'}>El Guabo</option>
                                                    <option value={'huaquillas'}>Huaquillas</option>
                                                    <option value={'marcabelí'}>Marcabelí</option>
                                                    <option value={'pasaje'}>Pasaje</option>
                                                    <option value={'piñas'}>Piñas</option>
                                                    <option value={'portovelo'}>Portovelo</option>
                                                    <option value={'santa rosa'}>Santa Rosa</option>
                                                    <option value={'zaruma'}>Zaruma</option>
                                                    <option value={'las lajas'}>Las Lajas</option>
                                                </>
                                            :   
                                                <>
                                                    <option value={'centinela del cóndor'}>Centinela del Cóndor</option>
                                                    <option value={'chinchipe'}>Chinchipe</option>
                                                    <option value={'el pangui'}>El Pangui</option>
                                                    <option value={'nangaritza'}>Nangaritza</option>
                                                    <option value={'palanda'}>Palanda</option>
                                                    <option value={'paquisha'}>Paquisha</option>
                                                    <option value={'yacuambi'}>Yacuambi</option>
                                                    <option value={'yantzaza'}>Yantzaza</option>
                                                    <option value={'zamora'}>Zamora</option>
                                                </>
                                        
                                    }
                                </select>
                            </label>

                            <label className="Reports__filter">
                                Días en mora
                                <select 
                                    //value={select_value}
                                    onChange={(e)=>{
                                        //setSelect(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
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
                                    //value={select_value}
                                    onChange={(e)=>{
                                        //setSelect(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
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
                                    value={empresa}
                                    onChange={(e)=>{
                                        setEmpresa(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
                                    {
                                        business.map((bus,index)=>(
                                            <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            
                            <NavLink 
                                className="Reports__button"
                                onClick={(e)=>{
                                    fetch(`https://sefil.softsen.space/public/api/cartera/estado?cartera=${empresa}&agencia=${select_value}&provincia=${provincia}&canton=${canton}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            console.log(data)
                                        });
                                }}
                            >Aplicar</NavLink>
                        </div> */}

                    </div>
                :
                    <div className="Reports__content">
                        <h4 className="Reports__title">Histórico de pagos</h4>
                        <div className="Reports__filters Reports__filters--columns-5">

                            <label className="Reports__filter">
                                Fecha de inicio
                                <input 
                                    type="date"
                                    value={fecha_inicio}
                                    onChange={(e)=>{
                                        setFechaInicio(e.target.value);
                                    }}
                                />
                            </label>

                            <label className="Reports__filter">
                                Fecha de corte
                                <input 
                                    type="date" 
                                    value={fecha_final} 
                                    onChange={(e)=>{
                                        console.log("estoy aca")
                                        setFechaFinal(e.target.value);
                                    }}/>
                            </label>

                            <label className="Reports__filter">
                                Usuario
                                <select 
                                    value={agent}
                                    onChange={(e)=>{
                                        setAgent(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
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
                                    value={empresa}
                                    onChange={(e)=>{
                                        setEmpresa(e.target.value);
                                    }}
                                >
                                    <option value={''}>--Todos--</option>
                                    {
                                        business.map((bus,index)=>(
                                            <option key={index} value={bus.name.toUpperCase()}>{bus.name.toUpperCase()}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            
                            <NavLink 
                                className="Reports__button"
                                
                                onClick={(e)=>{
                                    const splits_inicio=fecha_inicio.split('-');
                                    const inicio=`${splits_inicio[0]}/${splits_inicio[1]}/${splits_inicio[2]}`;

                                    const splits_final=fecha_final.split('-');
                                    const final=`${splits_final[0]}/${splits_final[1]}/${splits_final[2]}`;

                                    location.href=`https://sefil.softsen.space/public/api/cierre?cartera=${empresa}&fecha_inicio=${inicio}&fecha_final=${final}&agente=${agent}`;
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