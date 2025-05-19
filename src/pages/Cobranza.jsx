import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import DetailCredit from "./DetailCredit";
import { useEffect, useRef, useState } from "react";
import useSearch from "../hooks/useSearch";
import useFormatterNumber from "../hooks/useFormatterNumber";
import Loader from "../components/Loader/loader";

export default function Cobranza(){
    const param = useParams();

    //Estados para filtro de búsqueda en cabecera
    const [type_client,setClient]=useState('TITULAR');
    const [canton_input,setInput]=useState('');
    const [canton,setCanton]=useState('all');
    const [parroquia,setParroquia]=useState('all');

    const [credits,setCredits]=useState({
        current_page:1,
        data:[],
        first_page_url:'',
        from:1,
        last_page:0,
        last_page_url:'',
        links:[],
        next_page_url:'',
        path:'',
        per_page:0,
        prev_page_url:'',
        to:0,
        total:0,
        acumulado:0,
    });

    const [found,setFound]=useState([]);
    const [reference,setReference]=useState("");
    const [reference_2,setReference2]=useState("");

    const [business,setBusiness]=useState();

    const [aux_busines,setAux]=useState("");
    const [loading,setLoading]=useState();

    const [filter,setFilter]=useState();

    const updateFilter=({canton,status,campain,agente,estado_credito})=>{
        let filter="";


        if(canton!==""){
            filter+=`&canton=${canton}`;
        }

        if(status!==""){
            filter+=`&status=${status}`;
        }

        if(agente!==""){
            filter+=`&user_id=${agente}`;
        }

        if(estado_credito!==""){
            filter+=`&estado=${estado_credito}`;
        }
        
        filter=filter.substring(1)

        fetch(`${import.meta.env.VITE_URL_BASE}/bussines/${campain}?${filter}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCredits(data);
                setLoading(false);
            });
    }

    const updateCredits=(data)=>{
        setCredits({
            ...credits,
            data:data
        })
    }

    const updateData=(url,btn,text)=>{
        fetch(url,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
	        .then((data) => {
                setCredits(data);
                btn.textContent=text;
            });
    }

    useEffect(()=>{

        setClient('TITULAR');
        setInput('');
        setCanton('all');
        setParroquia('all');

        setFound([]);
        setReference("");
        setReference2("");
        setLoading(false);

        setFilter({
            campain:"SEFIL_1",
            canton:"",
            status:"",
            user_id:"",
            collection_state:""
        });

        setCredits({
            ...credits,
            data:[],
            links:[]
        });

        localStorage.setItem('cartera','SEFIL_1');
        setAux(localStorage.getItem('cartera'));

        if(localStorage.getItem('cartera')!=='' & localStorage.getItem('cartera')!==null){
            setAux(localStorage.getItem('cartera'));
            fetch(`${import.meta.env.VITE_URL_BASE}/bussines/${localStorage.getItem('cartera')}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setCredits(data);
                });
        }

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
    },[]);

    if(!business) return <Loader/>
    if(!filter) return <Loader/>

    return (
        <div className="pageConsulta">
            {
                (!param.id) &&
                    <div className="pageConsulta__search">
                        <label>
                            Buscar cliente
                            <input onKeyUp={(e)=>{
                                const ci=e.target.value;
                                if(aux_busines!==""){
                                    useSearch(ci,aux_busines,updateCredits,setCredits);
                                }else{
                                    setLoading(false);
                                }

                            }} placeholder="Ingrese cédula o nombre"/>
                        </label>

                        <label>
                            Buscar referencia
                            <input
                                onKeyUp={(e)=>{
                                    const value=e.target.value;
                                    setReference(e.target.value);

                                    if(value!==""){
                                        setLoading(true);

                                        fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/search/${value}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                setFound(data.data);
                                                setLoading(false);
                                            });
                                    }
                                }}
                                placeholder="Código de referencia"
                            />
                            {
                                (('name' in found) & reference!=="") 
                                ?
                                    <div>
                                        {
                                            <NavLink target="_blank" to={`/dashboard/comprobantes/view/${found.ci}?cartera=${found.cartera}&${found.name}`}>{found.name} | {found.institucion_financiera}</NavLink>
                                        }
                                    </div>
                                : 
                                    (reference!=="")
                                    ?
                                        <div>
                                            <p>No hay coincidencias</p>
                                        </div>
                                    :   <></>
                            }
                        </label>
                
                        <label>
                            Buscar comprobante
                            <input
                                onKeyUp={(e)=>{
                                    const value=e.target.value;
                                    setReference2(e.target.value);

                                    if(value!==""){
                                        setLoading(true);
                                        fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/code/${value}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                setFound(data.data);
                                                setLoading(false);
                                            });
                                    }
                                }}
                                placeholder="Código de comprobante"
                            />
                            {
                                (('name' in found) & reference_2!=="") 
                                ?
                                    <div>
                                        {
                                            <NavLink target="_blank" to={`/dashboard/comprobantes/view/${found.ci}?cartera=${found.cartera}&${found.name}`}>{found.name} | {found.institucion_financiera}</NavLink>
                                        }
                                    </div>
                                : 
                                    (reference_2!=="")
                                    ?
                                        <div>
                                            <p>No hay coincidencias</p>
                                        </div>
                                    :   <></>
                            }
                        </label>

                        {/* <label>
                            Empresa
                            <select value={aux_busines} onChange={(e)=>{
                                if(e.target.value!=='default'){
                                    setLoading(true);
                                    setAux(e.target.value);
                                    localStorage.setItem('cartera',e.target.value);
                                    fetch(`${import.meta.env.VITE_URL_BASE}/bussines/${e.target.value}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setCredits(data);
                                            setLoading(false);
                                        });
                                }
                            }}>
                                    <option value={"default"}>--Seleccionar--</option>
                                {
                                    business.map((bus,index)=>(
                                        <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                    ))
                                }
                            </select>
                        </label> */}
                    </div>
            }
            <div className="pageConsulta__results">

                {
                    (!param.id)
                    ?
                    <div className="pageConsulta__results">
                        <div className="DetailCredit__pays">
                            <div>
                                <p>ID</p>
                                <p>Crédito</p>
                                <label>
                                    Tipo
                                    <select
                                        value={type_client}
                                        onChange={(e)=>{
                                            setLoading(true);
                                            setClient(e.target.value);
                                            if(e.target.value==='GARANTE'){
                                                fetch(`${import.meta.env.VITE_URL_BASE}/credit/filterGarante`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateCredits(data.data);
                                                        setLoading(false);
                                                    });
                                            }else{
                                                fetch(`${import.meta.env.VITE_URL_BASE}/credit?cartera=SEFIL_1`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateCredits(data.data);
                                                        setLoading(false);
                                                    });
                                            }

                                        }}
                                    >
                                        <option value={"TITULAR"}>TITULAR</option>
                                        <option value={"GARANTE"}>GARANTE</option>
                                    </select>
                                </label>

                                <p>Nombre</p>
                                <p>Monto</p>
                                <p>Cédula</p>

                                <label>
                                    Compañia
                                    <select
                                        value={filter.campain}
                                        onChange={(e)=>{
                                            if(e.target.value!=='default'){
                                                setLoading(true);
                                                localStorage.setItem('cartera',e.target.value);

                                                setFilter({
                                                    ...filter,
                                                    campain:e.target.value
                                                });

                                                updateFilter({
                                                    canton:filter.canton,
                                                    campain:e.target.value,
                                                    agente:filter.user_id,
                                                    status:filter.status,
                                                    estado_credito:filter.collection_state
                                                });

                                                // fetch(`${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=${localStorage.getItem('cartera')}`,{
                                                //     headers: {
                                                //         Accept: 'application/json',
                                                //         Authorization: `Bearer ${localStorage.getItem('token')}`
                                                //     }
                                                // })
                                                //     .then((response) => response.json())  
                                                //     .then((data) => {
                                                //         setAgents(data);
                                                //         setLoading(false);
                                                //     });
                                            }
                                        }}
                                    >
                                        {
                                            business.map((bus,index)=>(
                                                <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                            ))
                                        }
                                    </select>
                                </label>

                                <p>Provincia</p>
                                <label>
                                    Cantón
                                    <input
                                        value={filter.canton}
                                        type="text" 
                                        placeholder="Cantón"
                                        onChange={(e)=>{
                                            setInput(e.target.value);
                                            setLoading(true);

                                            setFilter({
                                                ...filter,
                                                canton:e.target.value
                                            });

                                            updateFilter({
                                                canton:e.target.value,
                                                campain:filter.campain,
                                                agente:filter.user_id,
                                                status:filter.status,
                                                estado_credito:filter.collection_state
                                            });
                                        }}
                                    />
                            
                                </label>
                                <p>Parroquia</p>

                                <label>
                                    Estado
                                    <select
                                        value={filter.collection_state}
                                        onChange={(e)=>{
                                            setLoading(true);
                                            setFilter({
                                                ...filter,
                                                collection_state:e.target.value
                                            });

                                            updateFilter({
                                                canton:filter.canton,
                                                campain:filter.campain,
                                                agente:filter.user_id,
                                                status:filter.status,
                                                estado_credito:e.target.value
                                            });
                                        }}
                                    >
                                        <option value={""}>-- Seleccionar --</option>
                                        <option value={"Vencido"}>Vencido</option>
                                        <option value={"Cancelado"}>Cancelado</option>
                                        <option value={"CONVENIO DE PAGO"}>Convenio</option>
                                    </select>
                                </label>
                            </div>

                            {
                                credits.data.map((credit,index)=>(
                                    <div key={index}>
                                        <NavLink to={`/dashboard/recaudacion/view/${credit.cartera}?id=${credit.id}`} onClick={()=>{localStorage.setItem('hash',location.hash)}}>{credit.id}</NavLink>
                                        <p>{credit.cartera}-{credit.credito}</p>
                                        <p>{credit.tipo}</p>
                                        <p>{credit.name}</p>
                                        <p>{useFormatterNumber({value:credit.totalAmount,currency:'USD'})}</p>
                                        <p>{credit.ci}</p>
                                        <p>{credit.company}</p>
                                        <p>{credit.provincia}</p>
                                        <p>{credit.canton}</p>
                                        <p>{credit.parroquia}</p>
                                        <p>{credit.collectionState}</p>
                                    </div> 
                                ))
                            }

                        </div>

                        <div className="DetailCredit__access">
                            <p>Registros del {credits.from}-{credits.to} de {credits.total}</p>
                            <div>
                            {
                                credits.links.map((button,index)=>(
                                    (index===0)?
                                        <NavLink key={index} onClick={(e)=>{
                                            e.target.textContent='Cargando...';
                                            updateData(button.url,e.target,'Anterior');
                                        }}>Anterior</NavLink>
                                    : 
                                        (index===(credits.links.length-1)) ?
                                            <NavLink key={index} onClick={(e)=>{
                                                e.target.textContent='Cargando...';
                                                updateData(button.url,e.target,'Siguiente')
                                            }}>Siguiente</NavLink>
                                        :
                                            <></>
                                ))
                            }
                            </div>
                        </div>

                    </div>
                    :
                    <DetailCredit
                        id={param.id}
                        ci="1150575338"
                        name={"STEVEN RAFAEL CESEN PACCHA"}
                        data_pays=""
                    />
                }

            </div>

            {
                (loading)
                ?
                    <Loader/>
                :   <></>
            }
        </div>
    );
}