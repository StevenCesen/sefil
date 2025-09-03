import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";
import MapDirection from "../components/MapDirection/MapDirection";

const render = (status) => {
    return <h1>{status}</h1>;
};

export default function Directions(){
    const param = useParams();

    const [points,setPoint]=useState();
    const [cartera,setCartera]=useState();
    const [agencia,setAgencia]=useState();
    const [ci,setCi]=useState();
    const [contrato,setContrato]=useState();
    const ref = useRef();

    const setSearchPoint=({ci,contrato})=>{

        let filter="";

        if(ci!==""){
            filter+=`&cedula=${ci}`;
        }

        if(contrato!==""){
            filter+=`&contrato=${contrato}`;
        }

        fetch(`${import.meta.env.VITE_URL_BASE}/campains/pointsmap?user_id=${localStorage.getItem('temp_uS')}&cartera=SEFIL_1&${filter}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setPoint(data);
            });
    }

    useEffect(()=>{

        setCartera("SEFIL_1");
        setAgencia("");
        setCi("");
        setContrato("");

        fetch(`${import.meta.env.VITE_URL_BASE}/campains/pointsmap?user_id=${localStorage.getItem('temp_uS')}&cartera=SEFIL_1`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setPoint(data);
            });
    },[]);

    if(!points) return <></>

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
                    
            <div class="Directions__search">
                <label>
                    Cliente
                    <input 
                        type="search" 
                        placeholder="CI o nombre"
                        value={ci}
                        onChange={(e)=>{
                            setCi(e.target.value);
                            setSearchPoint({
                                ci:e.target.value,
                                contrato:contrato
                            });
                        }}
                    />
                </label>
                <label>
                    Contrato
                    <input 
                        type="search" 
                        placeholder="# de contrato"
                        value={contrato}
                        onChange={(e)=>{
                            setContrato(e.target.value);
                            setSearchPoint({
                                ci:ci,
                                contrato:e.target.value
                            });
                        }}
                    />
                </label>
                <label>
                    Campaña
                    <select
                        value={cartera}
                        onChange={(e)=>{
                            setCartera(e.target.value);
                            fetch(`${import.meta.env.VITE_URL_BASE}/campains/pointsmap?user_id=${localStorage.getItem('temp_uS')}&cartera=${e.target.value}`,{
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    setPoint(data);
                                });
                        }}
                    >
                        <option value={"SEFIL_1"}>SEFIL 1</option>
                        <option value={"SEFIL_2"}>SEFIL 2</option>
                        <option value={"syncs"}>FACES</option>
                    </select>
                </label>
                <div>
                    <label>Agencia</label>
                    <select
                        onChange={(e)=>{
                            
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
                </div>
                <a href={`${import.meta.env.VITE_URL_BASE}/GenDirecciones?user_id=${localStorage.getItem('temp_uS')}&agente=${localStorage.getItem('name')}&cartera=${cartera}`} target="_blank">Descargar direcciones</a>
                <a href={`${import.meta.env.VITE_URL_BASE}/GenAsignacion?user_id=${localStorage.getItem('temp_uS')}&agente=${localStorage.getItem('name')}&cartera=${cartera}`} target="_blank">Descargar asignación</a>
            </div>
            
            <div className="Directions__mapa">
                <Wrapper apiKey="AIzaSyDqk_2FCNezPuFgd8Zaeu2s1idsDpdC1Qc" render={render}>
                    <MapDirection
                        center={(points.length>0) ? points[0].point : {lat:-3.9967137083847524,lng:-79.1969005633418}}
                        zoom={7}
                        height={"calc(100vh - 140px)"}
                        points={(points.length>0) ? points : []}
                    />
                </Wrapper>
            </div>
        </div>
    );
}