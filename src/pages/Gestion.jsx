import { NavLink } from "react-router-dom";
import "./pages.css";
import {useEffect, useState } from "react";
import CardGestion from "../components/CardGestion/CardGestion";
import addNotification from "react-push-notification";
import useWindows from "../hooks/useWindows";
import useFormatterNumber from "../hooks/useFormatterNumber";
import useFilterAgency from "../hooks/useFilterAgency";
import useFilterText from "../hooks/useFilterText";
import useFilterState from "../hooks/useFilterState";
import useFilteMinMax from "../hooks/useFilterMinMax";
import Loader from "../components/Loader/loader";

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

        // if(tray==='pending'){
        //     copy.pending.data.map(credito=>{
        //         if(Number(credito.id)===Number(credit_id)){
        //             prev_credito=credito;
        //         }else{
        //             new_pending.push(credito);
        //         }
        //     });

        //     new_inprocess=copy.inprocess;
        //     new_processed=copy.processed;

        // }else if(tray==='inprocess'){
            
        //     copy.inprocess.data.map(credito=>{
        //         if(Number(credito.id)===Number(credit_id)){
        //             prev_credito=credito;
        //         }else{
        //             new_inprocess.push(credito);
        //         }
        //     });
        //     new_pending=copy.pending;
        //     new_processed=copy.processed;

        // }else if(tray==='processed'){
        //     copy.processed.data.map(credito=>{
        //         if(Number(credito.id)===Number(credit_id)){
        //             prev_credito=credito;
        //         }else{
        //             new_processed.push(credito);
        //         }
        //     });
        //     new_pending=copy.pending;
        //     new_inprocess=copy.inprocess;
        // }

        // if(destination==='pending'){
        //     copy.pending.data.push(prev_credito);
        // }else if(destination==='inprocess'){
        //     copy.inprocess.data.push(prev_credito);
        // }else if(destination==='processed'){
        //     copy.processed.data.push(prev_credito);
        // }

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

        // Consulto todas las compañas del usuario presente
        fetch(`${import.meta.env.VITE_URL_BASE}/gestion/trays?agente=${localStorage.getItem('temp_uS')}&cartera=SEFIL_1`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
    
                setData({
                    pending:data.pendiente,
                    inprocess:data.proceso,
                    processed:data.gestionado,
                    inactive:data.inactivos
                });
        
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

        fetch(`${import.meta.env.VITE_URL_BASE}/indexcampains`,{
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
                                setLoading(true);
                                // Consulto todas las compañas del usuario presente
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
                            }
                        }}>
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
                                    if(e.target.value!==''){
                                        useFilterText({
                                            tray:tray,
                                            data_org:original_data,
                                            value:e.target.value,
                                            update:updateCredits2,
                                            all:false,
                                            campain:campain
                                        })
                                    }else{
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
                                placeholder="Nombre"
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
                            <option value={"COMPROMISO DE PAGO"}>COMPROMISO DE PAGO</option>
                            <option value={"Judicial"}>MENSAJE A TERCEROS</option>
                            <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                            <option value={"YA PAGÓ"}>YA PAGÓ</option>
                            <option value={"MENSAJE DE TEXTO"}>MENSAJE DE TEXTO</option>
                            <option value={"NO CONTESTA"}>NO CONTESTA</option>
                            <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                            <option value={"NUMERO INCORRECTO"}>NUMERO INCORRECTO</option>
                            <option value={"FUERA DEL AREA DE COBERTURA"}>FUERA DEL AREA DE COBERTURA</option>
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
                            <div className={`Gestion__item ${
                                (credit.nro_tried==1)
                                ?
                                    "Gestion__item--level1"
                                :   (credit.nro_tried==1)
                                    ?   
                                        "Gestion__item--level2"
                                    :   (credit.nro_tried==3)
                                        ?
                                            "Gestion__item--level3"
                                        :   (credit.nro_tried>=4)
                                            ?
                                                "Gestion__item--level4"
                                            :   ""
                            }`}>
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
                                <div className={`Gestion__item ${
                                    (credit.nro_tried==1)
                                    ?
                                        "Gestion__item--level1"
                                    :   (credit.nro_tried==1)
                                        ?   
                                            "Gestion__item--level2"
                                        :   (credit.nro_tried==3)
                                            ?
                                                "Gestion__item--level3"
                                            :   (credit.nro_tried>=4)
                                                ?
                                                    "Gestion__item--level4"
                                                :   ""
                                }`}>
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
                                    <div className={`Gestion__item ${
                                        (credit.nro_tried==1)
                                        ?
                                            "Gestion__item--level1"
                                        :   (credit.nro_tried==1)
                                            ?   
                                                "Gestion__item--level2"
                                            :   (credit.nro_tried==3)
                                                ?
                                                    "Gestion__item--level3"
                                                :   (credit.nro_tried>=4)
                                                    ?
                                                        "Gestion__item--level4"
                                                    :   ""
                                    }`}>
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
                                    <div className={`Gestion__item ${
                                        (credit.nro_tried==1)
                                        ?
                                            "Gestion__item--level1"
                                        :   (credit.nro_tried==1)
                                            ?   
                                                "Gestion__item--level2"
                                            :   (credit.nro_tried==3)
                                                ?
                                                    "Gestion__item--level3"
                                                :   (credit.nro_tried>=4)
                                                    ?
                                                        "Gestion__item--level4"
                                                    :   ""
                                    }`}>
                                        <button
                                            onClick={()=>{
                                                // ver si se queda así o solo quito el botón de guardar gestión y llamar
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
                                        addNotification({
                                            title: 'Gestión en curso',
                                            subtitle: 'Se ha realizado una llamada y no se ha guardado gestión',
                                            message: 'Por favor, guarde la gestión',
                                            native: false,
                                            backgroundTop: '#FF9619',
                                            backgroundBottom: '#fdb864',
                                            colorTop: 'white',
                                            colorBottom: 'white',
                                            closeButton: 'Cerrar',
                                            duration: 3000,
                                        });
                                    }
                                    
                                }else{
                                
                                    addNotification({
                                        title: 'Gestión en curso',
                                        subtitle: 'Se ha realizado una llamada y no se ha guardado',
                                        message: 'Por favor, guarde la llamada',
                                        native: false,
                                        backgroundTop: '#FF9619',
                                        backgroundBottom: '#fdb864',
                                        colorTop: 'white',
                                        colorBottom: 'white',
                                        closeButton: 'Cerrar',
                                        duration: 3000,
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
