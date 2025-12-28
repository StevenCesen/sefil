import { useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import CardCreateCartera from "../components/CardCreateCartera/CardCreateCartera";
import CardListCarteras from "../components/CardListCarteras/CardListCarteras";
import CardUpdatePay from "../components/CardUpdatePay/CardUpdatePay";
import CardPrelacion from "../components/CardPrelacion/CardPrelacion";
import BackButton from "../components/BackButton/BackButton";

export default function Setting(){
    const param = useParams();

    //Utilizables
    const [carteras,setCarteras]=useState();
    const [view_prelacion,setView]=useState();
    const [current_cartera,setCurrent]=useState();

    useEffect(()=>{
        setView(false);
        fetch(`${import.meta.env.VITE_URL_BASE}/bussines`,{
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
            <BackButton />

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
                                <label>Prelación</label>
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
                                        view={setView}
                                        data_cartera={cartera}
                                        setCurrent={setCurrent}
                                    />
                                ))
                            }

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
            
            {
                (view_prelacion)
                ?   
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setView(false)}}>Volver</button>
                        <CardPrelacion
                            cartera={current_cartera}
                        />
                    </div>
                :   <></>
            }
        </div>
    );
}