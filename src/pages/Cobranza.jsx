import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import CardCredit from "../components/CardCredit/CardCredit";
import DetailCredit from "./DetailCredit";
import { useEffect, useRef, useState } from "react";
import useSearch from "../hooks/useSearch";
import useFormatterNumber from "../hooks/useFormatterNumber";

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

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setBusiness(data.data);
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
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines/${localStorage.getItem('cartera')}`,{
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

    },[]);

    if(!business) return <></>  

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
                                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/vouchers/search/${value}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                setFound(data.data);
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
                                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/vouchers/code/${value}`,{
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                setFound(data.data);
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

                        <label>
                            Empresa
                            <select value={aux_busines} onChange={(e)=>{
                                if(e.target.value!=='default'){
                                    setAux(e.target.value);
                                    localStorage.setItem('cartera',e.target.value);
                                    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines/${e.target.value}`,{
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
                            }}>
                                    <option value={"default"}>--Seleccionar--</option>
                                {
                                    business.map((bus,index)=>(
                                        <option key={index} value={bus.name}>{bus.name.toUpperCase()}</option>
                                    ))
                                }
                            </select>
                        </label>
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
                                            setClient(e.target.value);
                                            if(e.target.value==='GARANTE'){
                                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filterGarante`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateCredits(data.data)
                                                    });
                                            }else{
                                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit?cartera=SEFIL_1`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateCredits(data.data)
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
                                        value={aux_busines}
                                        onChange={(e)=>{
                                            if(e.target.value!=='default'){
                                                setAux(e.target.value);
                                                localStorage.setItem('cartera',e.target.value);
                                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/bussines/${e.target.value}`,{
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
                                        value={canton_input}
                                        type="text" 
                                        placeholder="Cantón"
                                        onChange={(e)=>{
                                            setInput(e.target.value);
                                            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filter?canton=${canton_input}`,{
                                                headers: {
                                                    Accept: 'application/json',
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                }
                                            })
                                                .then((response) => response.json())  
                                                .then((data) => {
                                                    updateCredits(data.data)
                                                });
                                        }}
                                    />
                            
                                </label>
                                <p>Parroquia</p>

                                <label>
                                    Estado
                                    <select
                                        value={parroquia}
                                        onChange={(e)=>{
                                            setParroquia(e.target.value);

                                            if(e.target.value==='vigente'){
                                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filter?estadoNot=Cancelado`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateCredits(data.data)
                                                    });
                                            }else{
                                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filter?estado=${e.target.value}&canton=${canton_input}&empresa=${aux_busines}`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateCredits(data.data)
                                                    });
                                            }
                                        }}
                                    >
                                        <option value={"vigente"}>Vigente</option>
                                        <option value={"cancelado"}>Cancelado</option>
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
        </div>
    );
}