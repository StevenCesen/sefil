import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";

const render = (status) => {
    return <h1>{status}</h1>;
};

export default function Garantes(){
    const param = useParams();

    const [garantes,setGarantes]=useState();

    const updateData=(url)=>{
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => setCredits(data));
    }
    
    const refMap=useRef();
    const [map, setMap] = useState();

    useEffect(()=>{
        fetch(`https://sefil.softsen.space/public/api/credit/${param.ci}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((response) => response.json())  
        .then((data) => {
            console.log(data)
            setGarantes(data.data);
        });

        if (refMap.current && !map) {
            setMap(new window.google.maps.Map(refMap.current, {zoom:1}));
        }
    },[refMap,map]);


    if(!garantes) return <></>

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
                <NavLink to="" onClick={()=>history.back()}>Regresar</NavLink>
            </div>
            {
                JSON.parse(garantes.contactos).map((contacto,index)=>(
                    (contacto.name) &&
                        <>
                            <div key={index} className="DetailCredit__head">
                                <div>
                                    <p>Garante</p>
                                    <label>{contacto.name} | {contacto.ci}</label>
                                </div>
                                <div>
                                    <p>Créditos asociados</p>
                                    <select onChange={(e)=>{
                                        fetch(`https://sefil.softsen.space/public/api/credit/${e.target.value}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                console.log(data)
                                            });
                                    }}>
                                        <option value={''}>GARANTE | </option>
                                        {
                                            JSON.parse(garantes.contactos).map((contacto)=>(
                                                (contacto.reference_credits) ?
                                                    contacto.reference_credits.map((reference,index)=>(
                                                        <option key={index} value={reference.id}>{reference.type} | {reference.credito}</option>
                                                    ))
                                                : <></>
                                            ))
                                                
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="DetailCredit__dates">
                                <div className="DetailCredit__general">
                                    <h3>Información del garante</h3>
                                    <div className="DetailCredit__table">
                                        <div>
                                            <p className="Head">Provincia</p>
                                            <span>{contacto.provincia.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="Head">Cantón</p>
                                            <span>{contacto.canton.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="Head">Parroquia</p>
                                            <span>{contacto.parroquia.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="Head">Barrio</p>
                                            <span>{contacto.barrio}</span>
                                        </div>
                                        <div>
                                            <p className="Head">Dirección</p>
                                            <span>{contacto.direccion}</span>
                                        </div>
                                
                                    </div>
                                </div>
                                <div className="DetailCredit__general">
                                    <h3>Contactos del garante</h3>
                                    <div className="DetailCredit__table">
                                        <div>
                                            <p className="Head">Contacto 1</p>
                                            <span>0978950498</span>
                                        </div>
                                        <div>
                                            <p className="Head">Contacto 2</p>
                                            <span>0978956748</span>
                                        </div>
                                        <div>
                                            <p className="Head">Contacto 3</p>
                                            <span>0967564543</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="DetailCredit__general">
                                    <h3>Ubicación del garante</h3>
                                    <Wrapper  apiKey="AIzaSyDqk_2FCNezPuFgd8Zaeu2s1idsDpdC1Qc" render={render}>
                                        <div ref={refMap}>
                                        </div>
                                    </Wrapper>
                                    {/* <div ref={refMap}>

                                    </div> */}
                                </div>
                            </div>

                        </>
                ))
            }
        </div>
    );
}