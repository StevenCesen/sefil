import { useState } from "react";
import useFilters from "../hooks/useFilters";
import { useEffect } from "react";
import useCheckbox from "../hooks/useCheckbox";
import { JsonToExcel } from "react-json-to-excel";

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

    useEffect(()=>{
        fetch("https://sefil.softsen.space/public/api/users/departament?role=cobranza",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setAgents(data));
        
        fetch("https://sefil.softsen.space/public/api/report/pays",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setReports(data));
    
    },[]);

    if(!agents) return <></>
    if(!reports) return <></>

    return (
        <div className="Reports">
            <div>
                <div className="Reports__headers">
                    <div>
                        <label>Cartera original</label>
                    </div>
                    <div>
                        <label>Valores recuperados</label>
                    </div>
                    <div>
                        <label>Valores a recuperar</label>
                    </div>
                    
                </div>

                <div className="Reports__subheaders">
                    <div>
                        <label>ID</label>
                    </div>
                    <div>
                        <label>Saldo capital</label>
                    </div>
                    <div>
                        <label>Interes</label>
                    </div>
                    <div>
                        <label>Mora</label>
                    </div>
                    <div>
                        <label>Seguro desgravamen</label>
                    </div>
                    <div>
                        <label>Gastos de cobranza</label>
                    </div>
                    <div>
                        <label>Gastos judiciales</label>
                    </div>
                    <div>
                        <label>Otros valores</label>
                    </div>


                    <div>
                        <label>Saldo capital</label>
                    </div>
                    <div>
                        <label>Interes</label>
                    </div>
                    <div>
                        <label>Mora</label>
                    </div>
                    <div>
                        <label>Seguro desgravamen</label>
                    </div>
                    <div>
                        <label>Gastos de cobranza</label>
                    </div>
                    <div>
                        <label>Gastos judiciales</label>
                    </div>
                    <div>
                        <label>Otros valores</label>
                    </div>

                    <div>
                        <label>Saldo capital</label>
                    </div>
                    <div>
                        <label>Interes</label>
                    </div>
                    <div>
                        <label>Mora</label>
                    </div>
                    <div>
                        <label>Seguro desgravamen</label>
                    </div>
                    <div>
                        <label>Gastos de cobranza</label>
                    </div>
                    <div>
                        <label>Gastos judiciales</label>
                    </div>
                    <div>
                        <label>Otros valores</label>
                    </div>

                </div>

                <div className="Reports__items">
                    <div>
                        <label>ID</label>
                    </div>
                    <div>
                        <label>Saldo capital</label>
                    </div>
                    <div>
                        <label>Interes</label>
                    </div>
                    <div>
                        <label>Mora</label>
                    </div>
                    <div>
                        <label>Seguro desgravamen</label>
                    </div>
                    <div>
                        <label>Gastos de cobranza</label>
                    </div>
                    <div>
                        <label>Gastos judiciales</label>
                    </div>
                    <div>
                        <label>Otros valores</label>
                    </div>


                    <div>
                        <label>Saldo capital</label>
                    </div>
                    <div>
                        <label>Interes</label>
                    </div>
                    <div>
                        <label>Mora</label>
                    </div>
                    <div>
                        <label>Seguro desgravamen</label>
                    </div>
                    <div>
                        <label>Gastos de cobranza</label>
                    </div>
                    <div>
                        <label>Gastos judiciales</label>
                    </div>
                    <div>
                        <label>Otros valores</label>
                    </div>

                    <div>
                        <label>Saldo capital</label>
                    </div>
                    <div>
                        <label>Interes</label>
                    </div>
                    <div>
                        <label>Mora</label>
                    </div>
                    <div>
                        <label>Seguro desgravamen</label>
                    </div>
                    <div>
                        <label>Gastos de cobranza</label>
                    </div>
                    <div>
                        <label>Gastos judiciales</label>
                    </div>
                    <div>
                        <label>Otros valores</label>
                    </div>

                </div>

                {/* {
                    reports.map((report,index)=>(
                        <div className="Reports__items" key={index}>
                            <p>$ {Number(report.valor_recibido)-Number(report.valor_devuelto)} USD</p>
                            <p>{report.forma_pago.toUpperCase()}</p>
                            <p>{report.tipo_transaccion.toUpperCase()}</p>
                            <p>{report.byUser[0].name}</p>
                            <p>{report.fecha.split('/')[1]}</p>
                            <p>{report.fecha}</p>
                        </div>
                    ))
                } */}
            </div>

            {/* <div className="Reports__actions">
                <div className="Reports__exports">
                    <h4>Exportar tabla</h4>
                    <JsonToExcel
                        title="Descargar EXCEL"
                        data={reports}
                        fileName="sample-file"
                    />
                </div>
            </div> */}
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