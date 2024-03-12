import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import CardCreateCartera from "../components/CardCreateCartera/CardCreateCartera";
import CardListCarteras from "../components/CardListCarteras/CardListCarteras";
import CardUpdateCartera from "../components/CardUpdateCartera/CardUpdateCartera";
import CardExportPays from "../components/CardExportPays/CardExportPays";

export default function Setting(){
    const param = useParams();

    //Utilizables
    const [carteras,setCarteras]=useState();

    useEffect(()=>{
        fetch("https://sefil.softsen.space/public/api/bussines",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCarteras(data.data);
            });
        location.hash='#/dashboard/configuracion/importdb';
    },[]);

    if(!carteras) return <></>

    return (
        <div className="pageConsulta">

            <div className="DetailCredit__head">
                <NavLink to="" onClick={()=>history.back()}>Regresar</NavLink>
            </div>

            {
                (param.ci!==null | param.ci!=="") 
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
                                <label>Versiones</label>
                                <label>Acciones</label>
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
                                        // versions={JSON.parse(cartera.versions)}
                                        versions={[]}
                                        state={cartera.status}
                                    />
                                ))
                            }
                            
                            <CardExportPays/>

                        </>
                    :
                        (param.ci==='exportdb')
                        ?
                            <h1>Exportar bases de datos</h1>
                        :  <></>
                : <CardCreateCartera/>
            }
        </div>
    );
}