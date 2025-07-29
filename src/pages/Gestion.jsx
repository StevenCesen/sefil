import { NavLink } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import CardGestion from "../components/CardGestion/CardGestion";
import useWindows from "../hooks/useWindows";
import useFormatterNumber from "../hooks/useFormatterNumber";
import useFilterAgency from "../hooks/useFilterAgency";
import useFilterText from "../hooks/useFilterText";
import useFilterState from "../hooks/useFilterState";
import useFilteMinMax from "../hooks/useFilterMinMax";
import Loader from "../components/Loader/loader";
import sendpush from "../helpers/sendpush";

export default function Gestion(){

    const [campain,setCampain]=useState('');
    const [campains,setCampains]=useState();
    const [id_campain,setIdCampain]=useState();
    const [alert,setAlert]=useState();

    const [data,setData]=useState(); //Aquí tenemos todos los créditos
    const [view_form,setForm]=useState(false); //Este es para ver el formulario de gestión
    const [next_credit,setNext]=useState(); //Este es para setear el siguiente registro
    const [index,setIndex]=useState(); //Este es para llevar el indice actual
    const [credit_actual,setCurrenly]=useState();
    const [original_data,setOriginal]=useState();
    const [results_campo,setResults]=useState();

    const [state_call,setStateCall]=useState(false);
    const [state_gestion,setStateGestion]=useState(false);
    const [mora,setMora]=useState();
    const [structure,setStructure]=useState();
    const [tray,setTray]=useState();

    const [filters,setFilters]=useState();
    const [loading,setLoading]=useState();

    const generate_uri=({
        campain,
        bandeja,
        agente,
        agencia,
        mora,
        estado_gestion,
        compromiso
    })=>{
        let filters="";
    
        filters+=`?campain=${campain}`;

        filters+=(bandeja==='pending') ? `&tray=PENDIENTE` : (bandeja==='inprocess') ? `&tray=EN PROCESO` : `&tray=GESTIONADO`;

        if(mora!==""){
            if(mora.min!=="" & Number(mora.min)!==0){
                filters+=`&mora_min=${mora.min}`;
            }
            if(mora.max!=="" & Number(mora.max)!==0){
                filters+=`&mora_max=${mora.max}`;
            }
        }

        if(estado_gestion!==""){
            filters+=`&management=${estado_gestion}`;
        }

        if(agencia!==""){
            filters+=`&agencia=${agencia}`;
        }

        if(agente){
            filters+=`&user=${agente}`;
        }

        if(compromiso!==""){
            filters+=`&compromiso=${compromiso}`;
        }

        return filters;
    }

    const updateFilter=({campain,bandeja,agente,agencia,mora,estado_gestion,compromiso})=>{
        
        let filters=generate_uri({
            campain,
            bandeja,
            agente,
            agencia,
            mora,
            estado_gestion,
            compromiso
        });

        setLoading(true);

        fetch(`${import.meta.env.VITE_URL_BASE}/campains/filtertray${filters}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((datas) => {
                if(bandeja==='pending'){
                    setData({
                        ...data,
                        pending:datas
                    });
                }else if(bandeja==='inprocess'){
                    setData({
                        ...data,
                        inprocess:datas
                    });
                }else{
                    setData({
                        ...data,
                        processed:datas
                    });
                }
                setLoading(false);
            });
        
    }

    const updateTray=(credit_id,destination)=>{
        let copy=data;
        let prev_credito=[];
        let actual_bandeja=[];

        //Le quitó al actual
        copy[tray].data.map(credito=>{
            if(Number(credito.id)===Number(credit_id)){
                prev_credito=credito;
            }else{
                actual_bandeja.push(credito);
            }
        });

        copy[tray].data=actual_bandeja;
        copy[tray].total=copy[tray].total-1;

        //Le agrego al destino
        copy[destination].data.push(prev_credito);
        copy[destination].total=copy[destination].total+1;

        setData({
            ...data,
            pending:copy.pending,
            inprocess:copy.inprocess,
            processed:copy.processed
        });
    }

    // Para pasar al siguiente crédito
    const updateNav=(index)=>{
        if(index<(data[tray].data.length-1)){
            setAlert(false);
            if(tray==='pending'){
                if(index<(data.pending.data.length-1)){
                    setCurrenly(data.pending.data[index+1]);
                    setNext(data.pending.data[index+2]);
                    setIndex(index+1);
                }else{
                    setForm(false);
                }
            }else if(tray==='inprocess'){
                if(index<(data.inprocess.data.length-1)){
                    setCurrenly(data.inprocess.data[index+1]);
                    setNext(data.inprocess.data[index+2]);
                    setIndex(index+1);
                }else{
                    setForm(false);
                }
            }else if(tray==='processed'){
                if(index<(data.processed.data.length-1)){
                    setCurrenly(data.processed.data[index+1]);
                    setNext(data.processed.data[index+2]);
                    setIndex(index+1);
                }else{
                    setForm(false);
                }
            }

        }else{
            //Actualizamos con los siguientes registros
            let url="",bandeja="",complemento="",filtro="";

            if(tray==='pending' & data.pending.next_page_url!==null){
                url=data.pending.next_page_url;
                bandeja="PENDIENTE";

                if(url.includes('filtertray')){
                    complemento=`&user=${localStorage.getItem('temp_uS')}&campain=${localStorage.getItem('cartera')}`;
                    filtro=generate_uri({
                        campain:localStorage.getItem('cartera'),
                        bandeja:tray,
                        agente:localStorage.getItem('temp_uS'),
                        agencia:filters.agencias,
                        mora:filters.mora,
                        estado_gestion:filters.estado_gestion,
                        compromiso:filters.compromiso
                    });
                }else{
                    complemento=`&agente=${localStorage.getItem('temp_uS')}&cartera=${localStorage.getItem('cartera')}`;
                }

            }else if(tray==='inprocess' & data.inprocess.next_page_url!==null){
                url=data.inprocess.next_page_url;
                bandeja="EN PROCESO";

                if(url.includes('filtertray')){
                    complemento=`&user=${localStorage.getItem('temp_uS')}&campain=${localStorage.getItem('cartera')}`;
                    filtro=generate_uri({
                        campain:localStorage.getItem('cartera'),
                        bandeja:tray,
                        agente:localStorage.getItem('temp_uS'),
                        agencia:filters.agencias,
                        mora:filters.mora,
                        estado_gestion:filters.estado_gestion,
                        compromiso:filters.compromiso
                    });
                }else{
                    complemento=`&agente=${localStorage.getItem('temp_uS')}&cartera=${localStorage.getItem('cartera')}`;
                }

            }else if(tray==='processed' & data.processed.next_page_url!==null){
                url=data.processed.next_page_url;
                bandeja="GESTIONADO";

                if(url.includes('filtertray')){
                    complemento=`&user=${localStorage.getItem('temp_uS')}&campain=${localStorage.getItem('cartera')}`;
                    filtro=generate_uri({
                        campain:localStorage.getItem('cartera'),
                        bandeja:tray,
                        agente:localStorage.getItem('temp_uS'),
                        agencia:filters.agencias,
                        mora:filters.mora,
                        estado_gestion:filters.estado_gestion,
                        compromiso:filters.compromiso
                    });
                }else{
                    complemento=`&agente=${localStorage.getItem('temp_uS')}&cartera=${localStorage.getItem('cartera')}`;
                }
            }

            if(url!==""){
                setLoading(true);

                fetch(`${url}${complemento}${filtro.replace('?','&')}`,{
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then((response) => response.json())  
                    .then((datas) => {
                        setLoading(false);

                        if(tray==='pending'){
                            if(url.includes('filtertray')){
                                setData({
                                    ...data,
                                    pending:datas
                                });
                                setCurrenly(datas.data[0]);
                                setNext(datas.data[1]);
                                setIndex(0);
                            }else{
                                setData({
                                    ...data,
                                    pending:datas.pendiente
                                });
                                setCurrenly(datas.pendiente.data[0]);
                                setNext(datas.pendiente.data[1]);
                                setIndex(0);
                            }
                        }else if(tray==='inprocess'){
                            if(url.includes('filtertray')){
                                setData({
                                    ...data,
                                    inprocess:datas
                                });
                                setCurrenly(datas.data[0]);
                                setNext(datas.data[1]);
                                setIndex(0);
                            }else{
                                setData({
                                    ...data,
                                    inprocess:datas.proceso
                                });
                                setCurrenly(datas.proceso.data[0]);
                                setNext(datas.proceso.data[1]);
                                setIndex(0);
                            }
                        }else if(tray==='processed'){
                            if(url.includes('filtertray')){
                                setData({
                                    ...data,
                                    processed:datas
                                });
                                setCurrenly(datas.data[0]);
                                setNext(datas.data[1]);
                                setIndex(0);
                            }else{
                                setData({
                                    ...data,
                                    processed:datas.gestionado
                                });
                                setCurrenly(datas.gestionado.data[0]);
                                setNext(datas.gestionado.data[1]);
                                setIndex(0);
                            }
                        }
                    });
            }else{
                setForm(false);
                setLoading(false);
            }
        }
    }

    const updateCredits2=(data_c,tray)=>{
        if(tray==='pending'){
            let copy=data.pending;
            copy.data=data_c;

            setData({
                ...data,
                pending:copy
            });
        }else if(tray==='inprocess'){
            let copy=data.inprocess;
            copy.data=data_c;

            setData({
                ...data,
                inprocess:copy
            });
        }else if(tray==='processed'){
            let copy=data.processed;
            copy.data=data_c;

            setData({
                ...data,
                processed:copy
            });
        }
    }

    const updateCredits=(data_c,tray)=>{
        if(tray==='pending'){
            setData({
                ...data,
                pending:data_c 
            });
        }else if(tray==='inprocess'){
            setData({
                ...data,
                inprocess:data_c 
            });
        }else if(tray==='processed'){
            setData({
                ...data,
                processed:data_c
            });
        }
    }

    useEffect(()=>{

        location.hash='/dashboard/call';

        setForm(false);
        setStateCall(true);
        setStateGestion(true);
        setNext(0);
        setIndex(0);
        useWindows();
        setTray('pending');
        setLoading(false);
        setAlert(false);

        setMora({
            min:"",
            max:""
        });

        setFilters({
            mora:{
                min:"",
                max:""
            },
            agencias:"",
            estado_gestion:"",
            compromiso:""
        });

        setCampain('SEFIL_1');

        localStorage.setItem('campain_name','SEFIL_1');
        localStorage.setItem('cartera','SEFIL_1');

        setResults(0);

        setData({
            pending:{
                total:0,
                data:[]
            },
            inprocess:{
                total:0,
                data:[]
            },
            processed:{
                total:0,
                data:[]
            },
            inactive:{
                total:0,
                data:[]
            }
        });

        fetch(`${import.meta.env.VITE_URL_BASE}/templates`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                const templates=[];
                data.map((struc)=>{
                    if(struc.status==="EN USO"){
                        templates.push(struc.structure);
                    }
                });
                setStructure(templates);
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/indexcampains?agente=${localStorage.getItem('temp_uS')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCampains(data);
                setIdCampain(`${data[0].id}/${data[0].name}`)
            });
        
    },[]);

    if(!data) return <Loader/>
    if(!structure) return <Loader/>
    if(!campains) return <Loader/>
    if(!id_campain) return <Loader/>

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

                <div className="DetailCredit__head--label">

                    {/* <div className="DetailCredit__head--recuperado">
                        <div>
                            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12.5C11.0717 12.5 10.1815 12.8687 9.52513 13.5251C8.86875 14.1815 8.5 15.0717 8.5 16C8.5 16.9283 8.86875 17.8185 9.52513 18.4749C10.1815 19.1313 11.0717 19.5 12 19.5C12.9283 19.5 13.8185 19.1313 14.4749 18.4749C15.1313 17.8185 15.5 16.9283 15.5 16C15.5 15.0717 15.1313 14.1815 14.4749 13.5251C13.8185 12.8687 12.9283 12.5 12 12.5ZM10.5 16C10.5 15.6022 10.658 15.2206 10.9393 14.9393C11.2206 14.658 11.6022 14.5 12 14.5C12.3978 14.5 12.7794 14.658 13.0607 14.9393C13.342 15.2206 13.5 15.6022 13.5 16C13.5 16.3978 13.342 16.7794 13.0607 17.0607C12.7794 17.342 12.3978 17.5 12 17.5C11.6022 17.5 11.2206 17.342 10.9393 17.0607C10.658 16.7794 10.5 16.3978 10.5 16Z" fill="#7CBD9C"/>
                                <path d="M17.526 5.11716L14.347 0.660156L2.658 9.99816L2.01 9.99116V10.0012H1.5V22.0012H22.5V10.0012H21.538L19.624 4.40216L17.526 5.11716ZM19.425 10.0012H9.397L16.866 7.45516L18.388 6.96816L19.425 10.0012ZM15.55 5.79116L7.84 8.41916L13.946 3.54116L15.55 5.79116ZM3.5 18.1702V13.8302C3.92218 13.6812 4.30565 13.4396 4.62231 13.1231C4.93896 12.8066 5.18077 12.4232 5.33 12.0012H18.67C18.8191 12.4234 19.0609 12.807 19.3775 13.1236C19.6942 13.4403 20.0777 13.6821 20.5 13.8312V18.1712C20.0777 18.3203 19.6942 18.562 19.3775 18.8787C19.0609 19.1953 18.8191 19.5789 18.67 20.0012H5.332C5.18218 19.5788 4.93996 19.1953 4.62302 18.8785C4.30607 18.5618 3.9224 18.3197 3.5 18.1702Z" fill="#7CBD9C"/>
                            </svg>
                        </div>
                    </div> */}

                    {
                        (results_campo!==0)
                        ?
                            <>
                                {/* <label>
                                    Monto asignado
                                    <p>{useFormatterNumber({value:results_campo.monto_asignado,currency:'USD'})}</p>
                                </label>
                                
                                <label>
                                    Monto recuperado
                                    <p>{useFormatterNumber({value:results_campo.monto_recuperado,currency:'USD'})}</p>
                                </label> */}
                            </>
                        :   <></>
                    }

                    <button
                        onClick={()=>{
                            setTray('pending')
                        }}
                    >Pendientes ({data.pending.total})</button>
                    <button
                        onClick={()=>{
                            setTray('inprocess');
                        }}
                    >En proceso ({data.inprocess.total})</button>
                    <button
                        onClick={()=>{
                            setTray('processed')
                        }}
                    >Gestionados ({data.processed.total})</button>
                    {
                        (localStorage.getItem('rol')==='campo')
                        ?
                        <button
                            onClick={()=>{
                                setTray('inactive')
                            }}
                        >Inactivos ({data.inactive.total})</button>
                        :   <></>
                    }
                    <label>
                        Campaña
                        <select value={id_campain} onChange={(e)=>{
                            if(e.target.value!==''){
                                setIdCampain(e.target.value);
                                setCampain(e.target.value.split('/')[1]);
                                setLoading(true);
                            
                                fetch(`${import.meta.env.VITE_URL_BASE}/gestion/trays?agente=${localStorage.getItem('temp_uS')}&cartera=${e.target.value.split('/')[1]}`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        localStorage.setItem('cartera',e.target.value.split('/')[1]);
                                        setData({
                                            pending:data.pendiente,
                                            inprocess:data.proceso,
                                            processed:data.gestionado,
                                            inactive:data.inactivos
                                        });
                                        setLoading(false);
                                    });
                                
                                if(localStorage.getItem('rol')==='campo' & e.target.value.split('/')[1]==='syncs'){
                                    fetch(`${import.meta.env.VITE_URL_BASE}/getResultsByAgent?user_id=${localStorage.getItem('temp_uS')}&campain=${e.target.value.split('/')[0]}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            setResults(data);
                                        });
                                }
                            }
                        }}>
                            <option value="">-- Seleccionar --</option>
                            {
                                campains.map((camp)=>(
                                    <option value={`${camp.id}/${camp.cartera}`}>{camp.name}</option>
                                ))
                            }
                        </select>
                    </label>
                </div>
            </div>

            <div className="Gestion">

                <h4>Campaña actual: {localStorage.getItem('cartera').toUpperCase()} - Bandeja actual: {
                    (tray==='pending')
                    ?
                        'PENDIENTES'
                    :   (tray==='inprocess')
                        ?
                            'EN PROCESO'
                        :   (tray==='processed')
                            ?   
                                'GESTIONADOS'
                            :   "INACTIVOS"
                }</h4>

                <div className="Gestion__head">
                    <div>
                    </div>
                    
                    <div>
                        <label>
                            Nombre
                            <input
                                onChange={(e)=>{
                                    if(e.target.value!=='' & e.target.value.length>5){
                                        
                                        useFilterText({
                                            tray:tray,
                                            data_org:original_data,
                                            value:e.target.value,
                                            update:updateCredits2,
                                            all:false,
                                            campain:campain
                                        });

                                    }else if(e.target.value===''){
                                        //Actualizamos la consulta
                                        updateFilter({
                                            campain:campain,
                                            bandeja:tray,
                                            agente:localStorage.getItem('temp_uS'),
                                            agencia:filters.agencias,
                                            mora:filters.mora,
                                            estado_gestion:filters.estado_gestion,
                                            compromiso:filters.compromiso
                                        });
                                    }
                                }}
                                placeholder="Nombre o crédito"
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Cédula
                            <input
                                onChange={(e)=>{
                                    if(e.target.value!==''){
                                        useFilterText({
                                            tray:tray,
                                            data_org:original_data,
                                            value:e.target.value,
                                            update:updateCredits2,
                                            all:false,
                                            campain:localStorage.getItem('cartera')
                                        });
                                    }else{
                                        //Actualizamos la consulta
                                        updateFilter({
                                            campain:localStorage.getItem('cartera'),
                                            bandeja:tray,
                                            agente:localStorage.getItem('temp_uS'),
                                            agencia:filters.agencias,
                                            mora:filters.mora,
                                            estado_gestion:filters.estado_gestion,
                                            compromiso:filters.compromiso
                                        });
                                    }
                                }}
                                placeholder="Cédula"
                            />
                        </label>
                    </div>

                    <div>
                        <label>Agencia</label>
                        <select
                            value={filters.agencias}
                            onChange={(e)=>{
                                
                                setFilters({
                                    ...filters,
                                    agencias:e.target.value
                                });

                                //Actualizamos la consulta
                                updateFilter({
                                    campain:localStorage.getItem('cartera'),
                                    bandeja:tray,
                                    agente:localStorage.getItem('temp_uS'),
                                    agencia:e.target.value,
                                    mora:filters.mora,
                                    estado_gestion:filters.estado_gestion,
                                    compromiso:filters.compromiso
                                });
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

                    <div>
                        <label>Días de mora</label>
                        <div>
                            <div>
                                <label>Min</label>
                                <input 
                                    type="number"
                                    value={filters.mora.min}
                                    onChange={(e)=>{
                                        setFilters({
                                            ...filters,
                                            mora:{
                                                min:e.target.value,
                                                max:filters.mora.max
                                            }
                                        });
                                        //Actualizamos la consulta
                                        updateFilter({
                                            campain:localStorage.getItem('cartera'),
                                            bandeja:tray,
                                            agente:localStorage.getItem('temp_uS'),
                                            agencia:filters.agencias,
                                            mora:{
                                                min:e.target.value,
                                                max:filters.mora.max
                                            },
                                            estado_gestion:filters.estado_gestion,
                                            compromiso:filters.compromiso
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label>Max</label>
                                <input 
                                    type="number"
                                    value={filters.mora.max}
                                    onChange={(e)=>{
                                        setFilters({
                                            ...filters,
                                            mora:{
                                                max:e.target.value,
                                                min:filters.mora.min
                                            }
                                        });
                                        //Actualizamos la consulta
                                        updateFilter({
                                            campain:localStorage.getItem('cartera'),
                                            bandeja:tray,
                                            agente:localStorage.getItem('temp_uS'),
                                            agencia:filters.agencias,
                                            mora:{
                                                max:e.target.value,
                                                min:filters.mora.min
                                            },
                                            estado_gestion:filters.estado_gestion,
                                            compromiso:filters.compromiso
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Monto</label>
                    </div>

                    <div>
                        <label>Cuotas</label>
                    </div>

                    <div>
                        <label>Estado gestión</label>
                        <select
                            value={filters.estado_gestion}
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    estado_gestion:e.target.value
                                });
                                //Actualizamos la consulta
                                updateFilter({
                                    campain:localStorage.getItem('cartera'),
                                    bandeja:tray,
                                    agente:localStorage.getItem('temp_uS'),
                                    agencia:filters.agencias,
                                    mora:filters.mora,
                                    estado_gestion:e.target.value,
                                    compromiso:filters.compromiso
                                });
                            }}
                        >
                            <option value={""}>-- Seleccionar --</option>
                            <option value={"PENDIENTE"}>PENDIENTE</option>
                            <option value={"OFERTA DE PAGO"}>OFERTA DE PAGO</option>
                            <option value={"VISITA CAMPO"}>VISITA CAMPO</option>
                            <option value={"COMPROMISO DE PAGO"}>COMPROMISO DE PAGO</option>
                            <option value={"MENSAJE A TERCEROS"}>MENSAJE A TERCEROS</option>
                            <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                            <option value={"YA PAGÓ"}>YA PAGÓ</option>
                            <option value={"MENSAJE DE TEXTO"}>MENSAJE DE TEXTO</option>
                            <option value={"NO CONTESTA"}>NO CONTESTA</option>
                            <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                            <option value={"NUMERO INCORRECTO"}>NUMERO INCORRECTO</option>
                            <option value={"FUERA DEL AREA DE COBERTURA"}>FUERA DEL AREA DE COBERTURA</option>
                            <option value={"SUSPENDIDO POR FALTA DE PAGO"}>SUSPENDIDO POR FALTA DE PAGO</option>
                            <option value={"CLIENTE SE NIEGA A PAGAR"}>CLIENTE SE NIEGA A PAGAR</option>
                            <option value="CLIENTE INDICA QUE NO ES SU DEUDA">CLIENTE INDICA QUE NO ES SU DEUDA</option>
                            <option value="PASAR A TRAMITE LEGAL">PASAR A TRAMITE LEGAL</option>
                            <option value="VOLVER A LLAMAR">VOLVER A LLAMAR</option>
                            <option value="CONVENIO DE PAGO">CONVENIO DE PAGO</option>
                            <option value="CONTACTO INDICA QUE ESTA EQUIVOCADO">CONTACTO INDICA QUE ESTA EQUIVOCADO</option>
                            <option value="CLIENTE ESCUCHA Y NO HABLA">CLIENTE ESCUCHA Y NO HABLA</option>
                            <option value="CLIENTE ESTA OCUPADO">CLIENTE ESTA OCUPADO</option>
                            <option value="CONTESTA MENOR DE EDAD">CONTESTA MENOR DE EDAD</option>
                            <option value="CORTA LA LLAMADA">CORTA LA LLAMADA</option>
                            <option value="INUBICABLE">INUBICABLE</option>
                            <option value="NO VIVE EN LA MISMA DIRECCIÓN">NO VIVE EN LA MISMA DIRECCIÓN</option>
                        </select>
                    </div>

                    <div>
                        <label>Compromiso</label>
                        <input
                            value={filters.compromiso}
                            type="date"
                            onChange={(e)=>{
                                setFilters({
                                    ...filters,
                                    compromiso:e.target.value
                                });
                                
                                //Actualizamos la consulta
                                updateFilter({
                                    campain:localStorage.getItem('cartera'),
                                    bandeja:tray,
                                    agente:localStorage.getItem('temp_uS'),
                                    agencia:filters.agencias,
                                    mora:filters.mora,
                                    estado_gestion:filters.estado_gestion,
                                    compromiso:e.target.value
                                });
                            }}
                        />
                    </div>
                </div>
                
                {
                    (tray==='pending')
                    ?
                        data.pending.data.map((credit,index,credits)=>(
                            <div className={`Gestion__item `}>
                                <button
                                    onClick={()=>{
                                        
                                        setCurrenly(credit);
                                        setForm(true);
                                        setNext(credits[index++]);
                                        setIndex(index-1);
                                    }}
                                >
                                    <img src="./icons/go.png"/>
                                </button>
                                <p>{credit.name}</p>
                                <p>{credit.ci}</p>
                                <p>{credit.agency}</p>
                                <p>{credit.dias_vencidos}</p>
                                <p>{useFormatterNumber({value:credit.totalAmount,currency:'USD'})}</p>
                                <p>{credit.pendingFees}</p>
                                <p>{credit.status_managment}</p>
                                <p>{credit.date_promise}</p>
                            </div>
                        ))
                    :   (tray==='inprocess')
                        ?
                            data.inprocess.data.map((credit,index,credits)=>(
                                <div className={`Gestion__item`}>
                                    <button
                                        onClick={()=>{
                                            setCurrenly(credit);
                                            setForm(true);
                                            setNext(credits[index++])
                                            setIndex(index-1)
                                        }}
                                    >
                                        <img src="./icons/go.png"/>
                                    </button>
                                    <p>{credit.name}</p>
                                    <p>{credit.ci}</p>
                                    <p>{credit.agency}</p>
                                    <p>{credit.dias_vencidos}</p>
                                    <p>{useFormatterNumber({value:credit.totalAmount,currency:'USD'})}</p>
                                    <p>{credit.pendingFees}</p>
                                    <p className={`${(credit.status_managment==='COMPROMISO DE PAGO') ? "Gestion__item--alert" : ""}`}>{credit.status_managment}</p>
                                    <p>{credit.date_promise}</p>
                                </div>
                            ))
                        :   (tray==='processed')
                            ?
                                data.processed.data.map((credit,index,credits)=>(
                                    <div className={`Gestion__item`}>
                                        <button
                                            onClick={()=>{
                                                setCurrenly(credit);
                                                setForm(true);
                                                setNext(credits[index++])
                                                setIndex(index-1)
                                            }}
                                        >
                                            <img src="./icons/go.png"/>
                                        </button>
                                        <p>{credit.name}</p>
                                        <p>{credit.ci}</p>
                                        <p>{credit.agency}</p>
                                        <p>{credit.dias_vencidos}</p>
                                        <p>{useFormatterNumber({value:credit.totalAmount,currency:'USD'})}</p>
                                        <p>{credit.pendingFees}</p>
                                        <p>{credit.status_managment}</p>
                                        <p>{credit.date_promise}</p>
                                    </div>
                                ))
                            :   
                                data.inactive.data.map((credit,index,credits)=>(
                                    // ${
                                    //     (credit.nro_tried==1)
                                    //     ?
                                    //         "Gestion__item--level1"
                                    //     :   (credit.nro_tried==1)
                                    //         ?   
                                    //             "Gestion__item--level2"
                                    //         :   (credit.nro_tried==3)
                                    //             ?
                                    //                 "Gestion__item--level3"
                                    //             :   (credit.nro_tried>=4)
                                    //                 ?
                                    //                     "Gestion__item--level4"
                                    //                 :   ""
                                    // }
                                    <div className={`Gestion__item `}>
                                        <button
                                            onClick={()=>{
                                                // ver si se queda así o solo quito el botón de guardar gestión y llamar
                                                setCurrenly(credit);
                                                setForm(true);
                                                setNext(credits[index++])
                                                setIndex(index-1)
                                            }}
                                        >
                                            <img src="./icons/go.png"/>
                                        </button>
                                        <p>{credit.name}</p>
                                        <p>{credit.ci}</p>
                                        <p>{credit.agency}</p>
                                        <p>{credit.dias_vencidos}</p>
                                        <p>{useFormatterNumber({value:credit.totalAmount,currency:'USD'})}</p>
                                        <p>{credit.pendingFees}</p>
                                        <p>{credit.status_managment}</p>
                                        <p>{credit.date_promise}</p>
                                    </div>
                                ))
                }

            </div>

            {
                (localStorage.getItem('rol')==='campo' | localStorage.getItem('rol')==='super' | localStorage.getItem('rol')==='administrador')
                ?
                    <div className="Gestion__footerNav">
                        <p>Registros del {data[tray].from} al {data[tray].to} de {data[tray].total}</p>

                        <button
                            onClick={(e)=>{
                                if(data[tray].prev_page_url!==null){
                                    const url=data[tray].prev_page_url;
                                    let complemento="",filtro="";

                                    if(url.includes('filtertray')){
                                        complemento=`&user=${localStorage.getItem('temp_uS')}&campain=${localStorage.getItem('cartera')}`;
                                        filtro=generate_uri({
                                            campain:localStorage.getItem('cartera'),
                                            bandeja:tray,
                                            agente:localStorage.getItem('temp_uS'),
                                            agencia:filters.agencias,
                                            mora:filters.mora,
                                            estado_gestion:filters.estado_gestion,
                                            compromiso:filters.compromiso
                                        });
                                    }else{
                                        complemento=`&agente=${localStorage.getItem('temp_uS')}&cartera=${localStorage.getItem('cartera')}`;
                                    }

                                    setLoading(true);

                                    fetch(`${url}${complemento}${filtro.replace('?','&')}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((datas) => {
                        
                                            if(tray==='pending'){
                                                if(url.includes('filtertray')){
                                                    setData({
                                                        ...data,
                                                        pending:datas
                                                    });
                                                    setCurrenly(datas.data[0]);
                                                    setNext(datas.data[1]);
                                                    setIndex(0);
                                                }else{
                                                    setData({
                                                        ...data,
                                                        pending:datas.pendiente
                                                    });
                                                    setCurrenly(datas.pendiente.data[0]);
                                                    setNext(datas.pendiente.data[1]);
                                                    setIndex(0);
                                                }
                                            }else if(tray==='inprocess'){
                                                if(url.includes('filtertray')){
                                                    setData({
                                                        ...data,
                                                        inprocess:datas
                                                    });
                                                    setCurrenly(datas.data[0]);
                                                    setNext(datas.data[1]);
                                                    setIndex(0);
                                                }else{
                                                    setData({
                                                        ...data,
                                                        inprocess:datas.proceso
                                                    });
                                                    setCurrenly(datas.proceso.data[0]);
                                                    setNext(datas.proceso.data[1]);
                                                    setIndex(0);
                                                }
                                            }else if(tray==='processed'){
                                                if(url.includes('filtertray')){
                                                    setData({
                                                        ...data,
                                                        processed:datas
                                                    });
                                                    setCurrenly(datas.data[0]);
                                                    setNext(datas.data[1]);
                                                    setIndex(0);
                                                }else{
                                                    setData({
                                                        ...data,
                                                        processed:datas.gestionado
                                                    });
                                                    setCurrenly(datas.gestionado.data[0]);
                                                    setNext(datas.gestionado.data[1]);
                                                    setIndex(0);
                                                }
                                            }
                                            setLoading(false);
                                        });
                                }
                            }}
                        ></button>
                        <button
                            onClick={(e)=>{
                                if(data[tray].next_page_url!==null){
                                    const url=data[tray].next_page_url;
                                    let complemento="",filtro="";

                                    if(url.includes('filtertray')){
                                        complemento=`&user=${localStorage.getItem('temp_uS')}&campain=${localStorage.getItem('cartera')}`;
                                        filtro=generate_uri({
                                            campain:campain,
                                            bandeja:tray,
                                            agente:localStorage.getItem('temp_uS'),
                                            agencia:filters.agencias,
                                            mora:filters.mora,
                                            estado_gestion:filters.estado_gestion,
                                            compromiso:filters.compromiso
                                        });
                                    }else{
                                        complemento=`&agente=${localStorage.getItem('temp_uS')}&cartera=${localStorage.getItem('cartera')}`;
                                    }

                                    setLoading(true);

                                    fetch(`${url}${complemento}${filtro.replace('?','&')}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((datas) => {
                        
                                            if(tray==='pending'){
                                                if(url.includes('filtertray')){
                                                    setData({
                                                        ...data,
                                                        pending:datas
                                                    });
                                                    setCurrenly(datas.data[0]);
                                                    setNext(datas.data[1]);
                                                    setIndex(0);
                                                }else{
                                                    setData({
                                                        ...data,
                                                        pending:datas.pendiente
                                                    });
                                                    setCurrenly(datas.pendiente.data[0]);
                                                    setNext(datas.pendiente.data[1]);
                                                    setIndex(0);
                                                }
                                            }else if(tray==='inprocess'){
                                                if(url.includes('filtertray')){
                                                    setData({
                                                        ...data,
                                                        inprocess:datas
                                                    });
                                                    setCurrenly(datas.data[0]);
                                                    setNext(datas.data[1]);
                                                    setIndex(0);
                                                }else{
                                                    setData({
                                                        ...data,
                                                        inprocess:datas.proceso
                                                    });
                                                    setCurrenly(datas.proceso.data[0]);
                                                    setNext(datas.proceso.data[1]);
                                                    setIndex(0);
                                                }
                                            }else if(tray==='processed'){
                                                if(url.includes('filtertray')){
                                                    setData({
                                                        ...data,
                                                        processed:datas
                                                    });
                                                    setCurrenly(datas.data[0]);
                                                    setNext(datas.data[1]);
                                                    setIndex(0);
                                                }else{
                                                    setData({
                                                        ...data,
                                                        processed:datas.gestionado
                                                    });
                                                    setCurrenly(datas.gestionado.data[0]);
                                                    setNext(datas.gestionado.data[1]);
                                                    setIndex(0);
                                                }
                                            }
                                            setLoading(false);
                                        });
                                }
                            }}
                        ></button>
                    </div>
                :   <></>
            }

            {
                (view_form)
                ?   
                    <div className="CardPay">
                        <button 
                            className="CardCondonacion__close" 
                            style={{
                                top:"10px",
                                right:"10px"
                            }}
                            onClick={()=>{
                                if(state_call){
                                    if(state_gestion){
                                        setForm(false);
                                    }else{

                                        sendpush({
                                            title:'ERR: Gestión en progreso.',
                                            message:'Se ha realizado una llamada y no se ha guardado gestión.',
                                            type:'Push--danger',
                                            timeout:5000
                                        });
                                    
                                    }
                                    
                                }else{
                                    sendpush({
                                        title:'ERR: Gestión en progreso.',
                                        message:'Se ha realizado una llamada y no se ha guardado.',
                                        type:'Push--danger',
                                        timeout:5000
                                    });
                                }
                            }}
                        >
                            Volver
                        </button>
                        
                        <CardGestion
                            currently={credit_actual}
                            next={next_credit}
                            index={index}
                            setNext={updateNav}
                            id_campain={id_campain}
                            setCancel={setStateCall}
                            setStatusGestion={setStateGestion}
                            state_gestion={state_gestion}
                            structure={structure}
                            updateTrays={updateTray}
                            number={data[tray]}
                            alert={alert}
                            bandeja={tray}
                            total={
                                (tray==='pending')
                                    ?
                                        data.pending.total
                                    :   (tray==='inprocess')
                                        ?
                                            data.inprocess.total
                                        :   (tray==='processed')
                                            ?   
                                                data.processed.total
                                            :   ""
                            }
                        /> 
                        
                    </div>

                :   <></>
            }

            {
                (loading)
                ?
                    <Loader/>
                :   <></>
            }

        </div>
    );
}
