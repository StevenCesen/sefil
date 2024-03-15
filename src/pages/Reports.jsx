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
import useFormatterNumber from "../hooks/useFormatterNumber";

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
        color: 'black',
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

export const options_nro = {
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
        color: 'black',
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

const labels_nro = ['Catacocha','Palanda','Cariamanga','Zamora','Zumba','Piñas','Celica','Catamayo','Malacatos','Santa Rosa','Oficina las pitas','Oficina centro','Oficina norte','San miguel de los bancos','Milagro','Santo Domingo','El carmen','Cayambe','Pasaje','Tumbaco','La troncal','Amaguaña','Naranjal','Quinche','Quininde'];

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

    const [nro_credit,setNro]=useState();
    const [amount_credits,setAmount]=useState();
    const [select_agency_amount,setAgencyAmount]=useState();

    const [carteras,setCarteras]=useState();

    const [total_months,setTotalMonths]=useState();

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
        fetch("https://sefil.softsen.space/public/api/vouchers/getTotalMonths",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setTotalMonths(data);
            });

        fetch("https://sefil.softsen.space/public/api/busines/estado",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                const labels=[];
                let x_1=[];
                let x_2=[];

                data.map((cartera)=>{
                    labels.push(cartera.busine);
                    x_1.push(cartera.original);
                    x_2.push(cartera.actual);
                });

                setCarteras({
                    labels:labels,
                    x1:x_1,
                    x2:x_2
                });
            });

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
        
        fetch(`https://sefil.softsen.space/public/api/cartera/estado?cartera=${empresa}&agencia=${""}&provincia=${""}&canton=${""}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setResults(data);
            });

        setEmpresa("SEFIL_1");
        setAgencyAmount("catacocha");

        fetch(`https://sefil.softsen.space/public/api/cartera/distribution?cartera=${empresa}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setNro(data);
            });
        
        fetch(`https://sefil.softsen.space/public/api/cartera/amounts?cartera=${empresa}&agencia=catacocha`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setAmount(data.data);
            });

        setSelect("");
        setProvincia("loja");
        setCanton("");
        setResults([]);
        setFechaInicio("");
        setFechaFinal("")
        setAgent("");
        
    
    },[]);

    if(!agents) return <></>
    if(!reports) return <></>
    if(!business) return <></>
    if(!results) return <></>
    if(!nro_credit) return <></>
    if(!total_months) return <></>

    return (
        <div className="Reports">
            {
                (param.ci==='estado')
                ?
                    <div className="Reports__content">
                        <h4 className="Reports__title">Valores a recuperar</h4>
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
                                        setAgencyAmount('all');
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
                                            setResults(data);
                                        });
                                    fetch(`https://sefil.softsen.space/public/api/cartera/distribution?cartera=${empresa}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setNro(data);
                                        });
                                    
                                    fetch(`https://sefil.softsen.space/public/api/cartera/amounts?cartera=${empresa}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setAmount(data.data);
                                        });

                                    fetch(`https://sefil.softsen.space/public/api/cartera/amounts?cartera=${empresa}&agencia=${select_agency_amount}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setAmount(data.data);
                                        });

                                }}
                            >Aplicar</NavLink>
                        </div>

                        {
                            ('data' in results) &&
                                <div className="Reports__results">
                                    
                                    <div className="Reports__resultsResume">
                                        <div className="Reports__resultsResumePrincipal">
                                            <h4>Valores a recuperar</h4>

                                            <div className="Reports__resultHead">
                                                <p><strong>Agencia:</strong> {(select_value==='') ? 'Todas' : select_value}</p>
                                                <p><strong>Provincia:</strong> {(provincia==='') ? 'Todas' : provincia.toUpperCase()}</p>
                                                <p><strong>Cantón:</strong> {(canton==='') ? 'Todos' : canton.toUpperCase()}</p>
                                                <p><strong>Empresa:</strong> {(empresa==='') ? 'Todas' : empresa.toUpperCase()}</p>
                                            </div>

                                            <div className="Reports__resultRubro">
                                                <label>Capital:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:results.data.actual.saldo_capital})}</span>
                                            </div>
                                            <div className="Reports__resultRubro">
                                                <label>Interés:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:results.data.actual.interes})}</span>
                                            </div>
                                            <div className="Reports__resultRubro">
                                                <label>Mora:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:results.data.actual.mora})}</span>
                                            </div>
                                            <div className="Reports__resultRubro">
                                                <label>Seguro:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:results.data.actual.seguro_desgravamen})}</span>
                                            </div>
                                            <div className="Reports__resultRubro">
                                                <label>Gastos de cobranza:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:results.data.actual.gastos_cobranza})}</span>
                                            </div>
                                            <div className="Reports__resultRubro">
                                                <label>Gastos judiciales:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:results.data.actual.gastos_judiciales})}</span>
                                            </div>
                                            <div className="Reports__resultRubro">
                                                <label>Otros valores:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:results.data.actual.otros_valores})}</span>
                                            </div>

                                            <div className="Reports__resultRubro">
                                                <label>Total:</label>
                                                <span>{useFormatterNumber({currency:'USD',value:(results.data.actual.saldo_capital+results.data.actual.mora+results.data.actual.interes+results.data.actual.seguro_desgravamen+results.data.actual.gastos_cobranza+results.data.actual.gastos_judiciales+results.data.actual.otros_valores)})}</span>
                                            </div>

                                        </div>
                                        <div className="Reports__resultTotals">
                                            <div>
                                                <label>Créditos activos:</label>
                                                <span>{results.data.actual.creditos_activos}</span>
                                            </div>
                                            <div>
                                                <label>Créditos inactivos:</label>
                                                <span>{results.data.actual.creditos_inactivos}</span>
                                            </div>
                                            <div>
                                                <label>Total:</label>
                                                <span>{Number(results.data.actual.creditos_activos)+Number(results.data.actual.creditos_inactivos)}</span>
                                            </div>
                                        </div>
                                    </div>        

                                </div>
                        }

                        <h4 className="Reports__title">Estado de carteras</h4>
                        <div className="Reports__resultGraphic">
                            <h3>Distribución por cartera</h3>

                            <div className="Reports__resumeGraphic">
                                <Bar
                                    key={1}
                                    width={"100%"}
                                    height={"30px"}
                                    data={{
                                        labels:carteras.labels,
                                        datasets:[
                                            {
                                                label:'Monto original',
                                                data:carteras.x1,
                                                backgroundColor: 'rgba(255, 99, 132, 0.5)'
                                            },
                                            {
                                                label:'Monto a recuperar',
                                                data:carteras.x2,
                                                backgroundColor: 'rgba(53, 162, 235, 0.5)'
                                            }
                                        ]
                                    }}
                                    options={options}
                                />

                                <div>
                                    <h3>Tendencia anual de recuperación</h3>
                                    <Line
                                        key={1}
                                        width={"100%"}
                                        height={"30px"}
                                        data={{
                                            labels:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
                                            datasets:[
                                                {
                                                    label:'Total',
                                                    data:total_months[0],
                                                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive:true,
                                                plugins:{
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'SEFIL 1'
                                                }
                                            }
                                        }}
                                    />
                                    <Line
                                        key={1}
                                        width={"100%"}
                                        height={"30px"}
                                        data={{
                                            labels:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
                                            datasets:[
                                                {
                                                    label:'Total',
                                                    data:total_months[1],
                                                    backgroundColor: 'rgba(53, 162, 235, 0.5)'
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive:true,
                                                plugins:{
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'SEFIL 2'
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                        </div>

                        <h4 className="Reports__title">Distribución de créditos</h4>
                        <div className="Reports__filters Reports__filters--columns-8">

                            {/* <label className="Reports__filter">
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
                            </label> */}

                            {/* <label className="Reports__filter">
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
                            </label> */}

                            {/* <label className="Reports__filter">
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
                            </label> */}

                            {/* <label className="Reports__filter">
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
                            </label> */}

                            {/* <label className="Reports__filter">
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
                            </label> */}

                            {/* <label className="Reports__filter">
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
                            </label> */}
                            
                            {/* <NavLink 
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
                            >Aplicar</NavLink> */}
                        </div>

                        <div className="Reports__resultsResume">
                            <div>
                                <h4>Créditos activos por agencia</h4>

                                {/* <div className="Reports__resultHead">
                                    <p><strong>Agencia:</strong> {(select_value==='') ? 'Todas' : select_value}</p>
                                    <p><strong>Provincia:</strong> {(provincia==='') ? 'Todas' : provincia.toUpperCase()}</p>
                                    <p><strong>Cantón:</strong> {(canton==='') ? 'Todos' : canton.toUpperCase()}</p>
                                    <p><strong>Empresa:</strong> {(empresa==='') ? 'Todas' : empresa.toUpperCase()}</p>
                                </div> */}
                                <div className="Reports__resultsResumeColumns">
                                    <p>Agencia</p>
                                    <p>Créditos</p>
                                    <p>Monto adeudado</p>
                                </div>

                                {
                                    nro_credit.map((credit,index)=>(
                                        ((credit.cartera_actual.activos+credit.cartera_actual.inactivos)>0) && 
                                            <div className="Reports__resultsResumeColumns" key={index}>
                                                <label>{credit.agency.toUpperCase()}:</label>
                                                <span>{credit.cartera_actual.activos}</span>
                                                <span>{useFormatterNumber({currency:'USD',value:credit.cartera_actual.monto})}</span>
                                            </div>
                                    ))
                                }
                                
                            </div>

                            <div>
                                <h4>Créditos por monto</h4>
                                <select 
                                    onChange={(e)=>{
                                        setAgencyAmount(e.target.value);
                                        fetch(`https://sefil.softsen.space/public/api/cartera/amounts?cartera=${empresa}&agencia=${e.target.value}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                setAmount(data.data);
                                            });
                                    }}
                                    value={select_agency_amount}
                                >
                                    <option value={'all'}>Todas</option>
                                    {
                                        nro_credit.map((credit,index)=>(
                                            ((credit.cartera_actual.activos+credit.cartera_actual.inactivos)>0) && 
                                                <option 
                                                    key={index}
                                                    value={credit.agency}
                                                >Agencia {`${credit.agency.substring(0,1).toUpperCase()}${credit.agency.substring(1)}`}:</option>
                                        ))
                                    }
                                </select>
                                
                                <div className="Reports__resultsRangeColumn">
                                    <p>Rango</p>
                                    <p>Créditos</p>
                                    <p>Monto adeudado</p>
                                </div>

                                {
                                    amount_credits.map((amount,index)=>(
                                        <div className="Reports__resultsRangeColumn" key={index}>
                                            {
                                                (amount.rango.split('-').length>1) 
                                                ?
                                                    <label>{amount.rango} $:</label>
                                                :
                                                    <label>Mayor a {amount.rango} $:</label>
                                            }
                                            <span>{amount.cantidad}</span>
                                            <span>{useFormatterNumber({currency:'USD',value:amount.monto})}</span>
                                        </div>
                                    ))
                                }
                            </div>

                        </div>

                        {/* <div className="Reports__resultGraphic">
                            <h3>Distribución de créditos por agencias</h3>
                            <Bar
                                key={2}
                                width={"100%"}
                                height={"30px"}
                                data={{
                                    labels:labels_nro,
                                    datasets:[
                                        {
                                            label:'Créditos activos',
                                            data:[
                                                nro_credit[0].cartera_actual.activos,
                                                nro_credit[1].cartera_actual.activos,
                                                nro_credit[2].cartera_actual.activos,
                                                nro_credit[3].cartera_actual.activos,
                                                nro_credit[4].cartera_actual.activos,
                                                nro_credit[5].cartera_actual.activos,
                                                nro_credit[6].cartera_actual.activos,
                                                nro_credit[7].cartera_actual.activos,
                                                nro_credit[8].cartera_actual.activos,
                                                nro_credit[9].cartera_actual.activos,
                                                nro_credit[10].cartera_actual.activos,
                                                nro_credit[11].cartera_actual.activos,
                                                nro_credit[12].cartera_actual.activos,
                                                nro_credit[13].cartera_actual.activos,
                                                nro_credit[14].cartera_actual.activos,
                                                nro_credit[15].cartera_actual.activos,
                                                nro_credit[16].cartera_actual.activos,
                                                nro_credit[17].cartera_actual.activos,
                                                nro_credit[18].cartera_actual.activos,
                                                nro_credit[19].cartera_actual.activos,
                                                nro_credit[20].cartera_actual.activos,
                                                nro_credit[21].cartera_actual.activos,
                                                nro_credit[22].cartera_actual.activos,
                                                nro_credit[23].cartera_actual.activos,
                                                nro_credit[24].cartera_actual.activos],
                                            backgroundColor: 'rgba(255, 99, 133, 0.8)'
                                        },
                                        {
                                            label:'Créditos inactivos',
                                            data:[
                                                nro_credit[0].cartera_actual.inactivos,
                                                nro_credit[1].cartera_actual.inactivos,
                                                nro_credit[2].cartera_actual.inactivos,
                                                nro_credit[3].cartera_actual.inactivos,
                                                nro_credit[4].cartera_actual.inactivos,
                                                nro_credit[5].cartera_actual.inactivos,
                                                nro_credit[6].cartera_actual.inactivos,
                                                nro_credit[7].cartera_actual.inactivos,
                                                nro_credit[8].cartera_actual.inactivos,
                                                nro_credit[9].cartera_actual.inactivos,
                                                nro_credit[10].cartera_actual.inactivos,
                                                nro_credit[11].cartera_actual.inactivos,
                                                nro_credit[12].cartera_actual.inactivos,
                                                nro_credit[13].cartera_actual.inactivos,
                                                nro_credit[14].cartera_actual.inactivos,
                                                nro_credit[15].cartera_actual.inactivos,
                                                nro_credit[16].cartera_actual.inactivos,
                                                nro_credit[17].cartera_actual.inactivos,
                                                nro_credit[18].cartera_actual.inactivos,
                                                nro_credit[19].cartera_actual.inactivos,
                                                nro_credit[20].cartera_actual.inactivos,
                                                nro_credit[21].cartera_actual.inactivos,
                                                nro_credit[22].cartera_actual.inactivos,
                                                nro_credit[23].cartera_actual.inactivos,
                                                nro_credit[24].cartera_actual.inactivos
                                            ],
                                            backgroundColor: 'rgba(53, 162, 236, 0.8)'
                                        }
                                    ]
                                }}
                                options={options_nro}
                            />
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