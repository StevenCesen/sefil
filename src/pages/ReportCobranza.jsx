import { useState } from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./pages.css";

export default function ReportCobranza(){

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
    const [empresa_1,setEmpresa1]=useState("SEFIL_1");
    const [empresa_2,setEmpresa2]=useState("");

    const [fecha_inicio,setFechaInicio]=useState("");
    const [fecha_final,setFechaFinal]=useState("");
    const [agent,setAgent]=useState("");

    const [fecha_inicio_1,setFechaInicio1]=useState("");
    const [fecha_final_1,setFechaFinal1]=useState("");

    const [fecha_inicio_2,setFechaInicio2]=useState("");
    const [fecha_final_2,setFechaFinal2]=useState("");

    const [nro_credit,setNro]=useState();
    const [amount_credits,setAmount]=useState();
    const [mora,setMoraCredit]=useState();
    const [select_agency_amount,setAgencyAmount]=useState();
    const [select_agency_mora,setAgencyMora]=useState();
    const [type_unificate,setUnificate]=useState('normal');

    const [pdf_report,setReport]=useState();

    const [carteras,setCarteras]=useState();

    const [total_months,setTotalMonths]=useState();

    const [number,setNumber]=useState();
    const [type_search,setTypeSearch]=useState();

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
    const [campains,setCampains]=useState();
    const [campain,setCampain]=useState();

    useEffect(()=>{
        setReport({
            status:false,
            data:['','',''],
            state_cartera:{},
            credits_active:{},
            credits_by_month:{},
            credits_by_mora:{},
            filters:{}
        });

        setNumber(0);
        setTypeSearch('0');

        fetch(`${import.meta.env.VITE_URL_BASE}/campains`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/users/departament?role=cobranza`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setAgents(data));

        fetch(`${import.meta.env.VITE_URL_BASE}/bussines`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
            });

        setEmpresa("");
        setEmpresa2("");
        setAgencyAmount("catacocha");
        setUnificate('normal');

        setSelect("");
        setProvincia("");
        setCanton("");
        setResults([]);
        setFechaInicio("");
        setFechaFinal("");
        setFechaInicio1("");
        setFechaFinal1("");
        setFechaInicio2("");
        setFechaFinal2("");
        setAgent("");
    },[]);

    if(!business) return <></>
    if(!campains) return <></>

    return (
        <div className="Reports">
            <div className="Reports__content">
                <h4 className="Reports__title">Facturación de gastos de cobranza</h4>
                <div className="Reports__filters Reports__filters--columns-5">

                    <label className="Reports__filter">
                        Fecha de inicio
                        <input
                            type="date"
                            value={fecha_inicio_2}
                            onChange={(e)=>{
                                setFechaInicio2(e.target.value);
                            }}
                        />
                    </label>

                    <label className="Reports__filter">
                        Fecha de corte
                        <input 
                            type="date" 
                            value={fecha_final_2} 
                            onChange={(e)=>{
                                setFechaFinal2(e.target.value);
                            }}/>
                    </label>

                    <label className="Reports__filter">
                        Empresa
                        <select 
                            value={empresa_2}
                            onChange={(e)=>{
                                setEmpresa2(e.target.value);
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
                            const splits_inicio=fecha_inicio_2.split('-');
                            const inicio=`${splits_inicio[0]}/${splits_inicio[1]}/${splits_inicio[2]}`;

                            const splits_final=fecha_final_2.split('-');
                            const final=`${splits_final[0]}/${splits_final[1]}/${splits_final[2]}`;

                            location.href=`${import.meta.env.VITE_URL_BASE}/gcobranza?cartera=${empresa_2}&user=${localStorage.getItem('name')}&fecha_inicio=${inicio}&fecha_final=${final}`;
                        }}
                    >Generar EXCEL</NavLink>
                </div>
            </div>
        </div>
    );
}
