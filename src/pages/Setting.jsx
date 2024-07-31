import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import CardCreateCartera from "../components/CardCreateCartera/CardCreateCartera";
import CardListCarteras from "../components/CardListCarteras/CardListCarteras";
import CardUpdateCartera from "../components/CardUpdateCartera/CardUpdateCartera";
import CardExportPays from "../components/CardExportPays/CardExportPays";
import CardUpdatePay from "../components/CardUpdatePay/CardUpdatePay";

export default function Setting(){
    const param = useParams();

    //Utilizables
    const [carteras,setCarteras]=useState();

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCarteras(data.data);
            });
    },[]);

    if(!carteras) return <></>

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
                <NavLink to="" onClick={()=>history.back()}>Regresar</NavLink>
            </div>

            {
                (param.ci!==undefined) 
                ?
                    (param.ci==='importdb')
                    ?
                        
                        <>
                            <div className="DetailCredit__sections">
                                <div>
                                    <p>Carteras cargadas</p>
                                    <label>Formato de archivo .xlsx (EXCEL) </label>
                                </div>
                                <CardCreateCartera/>
                            </div>

                            <div className="CardListCarteras__head">
                                <label>Cartera</label>
                                <label>Subida</label>
                                <label>Última actualización</label>
                                <label>Última carga</label>
                                <label>Estado</label>
                                <label>Descargar cartera</label>
                                <label>Descargar pagos</label>
                            </div>

                            {
                                carteras.map((cartera,index)=>(
                                    <CardListCarteras
                                        key={index}
                                        name={cartera.name}
                                        fecha_upload={cartera.created_at.substr(0,10)}
                                        last_update={cartera.last_update}
                                        fecha_carga={cartera.fecha_carga}
                                        // versions={JSON.parse(cartera.versions)}
                                        versions={[]}
                                        state={cartera.status}
                                    />
                                ))
                            }
                            
                            {/* <CardExportPays/> */}

                        </>
                    :
                        (param.ci==='importpays')
                        ?
                        <>
                            <div className="DetailCredit__sections">
                                <div>
                                    <p>Subir pagos</p>
                                    <label>Formato de archivo .xlsx (EXCEL) </label>
                                </div>
                            </div>
                            <div className="CardListUpdate__head">
                                <label>Cartera</label>
                                <label>Subir pagos</label>
                                <label>Estado</label>
                                <label>Última carga</label>
                                <label>En proceso</label>
                                <label>Créditos sin pagos</label>
                                <label>Acciones</label>
                            </div>

                            {
                                carteras.map((cartera,index)=>(
                                    <CardUpdatePay
                                        key={index}
                                        fecha_carga={cartera.fecha_carga}
                                        name={cartera.name}
                                        state={cartera.status}
                                    />
                                ))
                            }
                        </>

                        :  <></>
                : 
                    (
                        location.hash='/dashboard/configuracion/importdb'
                    )
            }
        </div>
    );
}