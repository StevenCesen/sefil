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

export default function Gestion(){

    const [campain,setCampain]=useState('');
    const [campains,setCampains]=useState();

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

    const updateTray=(credit_id,destination)=>{
        let copy=data;
        let prev_credito=[];
        let new_pending=[],new_inprocess=[],new_processed=[];

        if(tray==='pending'){
            copy.pending.map(credito=>{
                if(credito.id_credito===credit_id){
                    prev_credito=credito;
                }else{
                    new_pending.push(credito);
                }
            });

            new_inprocess=copy.inprocess;
            new_processed=copy.processed;

        }else if(tray==='inprocess'){
            copy.inprocess.map(credito=>{
                if(credito.id_credito===credit_id){
                    prev_credito=credito;
                }else{
                    new_inprocess.push(credito);
                }
            });
            new_pending=copy.pending;
            new_processed=copy.processed;
        }else if(tray==='processed'){
            copy.processed.map(credito=>{
                if(credito.id_credito===credit_id){
                    prev_credito=credito;
                }else{
                    new_processed.push(credito);
                }
            });
            new_pending=copy.pending;
            new_inprocess=copy.inprocess;
        }

        if(destination==='pending'){
            copy.pending.push(prev_credito);
        }else if(destination==='inprocess'){
            copy.inprocess.push(prev_credito);
        }else if(destination==='processed'){
            copy.processed.push(prev_credito);
        }

        setData({
            pending:new_pending,
            inprocess:new_inprocess,
            processed:new_processed
        });
    }

    // Para pasar al siguiente crédito
    const updateNav=(index)=>{
        if(tray==='pending'){
            if(index<(data.pending.length-1)){
                setCurrenly(data.pending[index+1]);
                setNext(data.pending[index+2]);
                setIndex(index+1);
            }else{
                setForm(false);
            }
        }else if(tray==='inprocess'){
            if(index<(data.inprocess.length-1)){
                setCurrenly(data.inprocess[index+1]);
                setNext(data.inprocess[index+2]);
                setIndex(index+1);
            }else{
                setForm(false);
            }
        }else if(tray==='processed'){
            if(index<(data.processed.length-1)){
                setCurrenly(data.processed[index+1]);
                setNext(data.processed[index+2]);
                setIndex(index+1);
            }else{
                setForm(false);
            }
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
        setMora({
            min:"",
            max:""
        });

        // Consulto todas las compañas del usuario presente
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/gestion/campains?id=${localStorage.getItem('temp_uS')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                if(data.length===0){
                    setCampains([]);
                    setCampain([]);
                    
                    setData({
                        ...original_data,
                        pending:[],
                        inprocess:[],
                        processed:[]
                    });
                }else{
                    setCampains(data);
                    setCampain(data[0].id);
                    localStorage.setItem('campain_name',data[0].name);
                    // Asigno en pantalla principal la primer campaña del array
                    const credits=data[0].distributions;
                    console.log(data);
                    let pending=[],inprocess=[],process=[];

                    credits.map(credito=>{
                        if(credito.tray=='PENDIENTE'){
                            pending.push(credito);
                        }else if(credito.tray=='EN PROCESO'){
                            inprocess.push(credito);
                        }else{
                            process.push(credito);
                        }
                    });

                    setData({
                        ...data,
                        pending:pending,
                        inprocess:inprocess,
                        processed:process
                    });

                    setOriginal({
                        ...original_data,
                        pending:pending,
                        inprocess:inprocess,
                        processed:process
                    });
                }
        
            });

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/templates`,{
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

        const onBeforeUnload = (ev) => {
            ev.returnValue = "Anything you wanna put here!";
            return "Anything here as well, doesn't matter!";
        };
        
        window.addEventListener("beforeunload", onBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
        
    },[]);

    if(!campains) return <></>
    if(!data) return <></>
    if(!structure) return <></>

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
                    >Pendientes ({data.pending.length})</button>
                    <button
                        onClick={()=>{
                            setTray('inprocess')
                        }}
                    >En proceso ({data.inprocess.length})</button>
                    <button
                        onClick={()=>{
                            setTray('processed')
                        }}
                    >Gestionados ({data.processed.length})</button>
                    {/* <button
                        onClick={()=>{
                            setTray('processed')
                        }}
                    >Supervisión ({data.processed.length})</button> */}
                    <label>
                        Campaña
                        <select value={campain} onChange={(e)=>{
                            if(e.target.value!==''){
                                setCampain(e.target.value);

                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/gestion/campains?id=${localStorage.getItem('temp_uS')}&id_campain=${e.target.value}`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        setCampains(data);
                                        
                                        data.map((campa)=>{
                                            if(Number(campa.id)===Number(e.target.value)){
                                                localStorage.setItem('campain_name',campa.name);
                                                // console.log(campa)
                                                const credits=campa.distributions;
                
                                                let pending=[],inprocess=[],process=[];

                                                credits.map(credito=>{
                                                    if(credito.tray=='PENDIENTE'){
                                                        pending.push(credito);
                                                    }else if(credito.tray=='EN PROCESO'){
                                                        inprocess.push(credito);
                                                    }else{
                                                        process.push(credito);
                                                    }
                                                });

                                                setData({
                                                    ...data,
                                                    pending:pending,
                                                    inprocess:inprocess,
                                                    processed:process
                                                });

                                                setOriginal({
                                                    ...original_data,
                                                    pending:pending,
                                                    inprocess:inprocess,
                                                    processed:process
                                                });

                                            }
                                        });
                                    });
                            }
                        }}>
                                <option value={""}>--Seleccionar--</option>
                            {
                                campains.map((bus,index)=>(
                                    <option key={index} value={bus.id}>{bus.name.toUpperCase()}</option>
                                ))
                            }
                        </select>
                    </label>
                </div>
            </div>

            <div className="Gestion">

                <h4>Campaña actual: {localStorage.getItem('campain_name').toUpperCase()} - Bandeja actual: {
                    (tray==='pending')
                    ?
                        'PENDIENTES'
                    :   (tray==='inprocess')
                        ?
                            'EN PROCESO'
                        :   (tray==='processed')
                            ?   
                                'GESTIONADOS'
                            :   ""
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
                                            update:updateCredits,
                                            all:false
                                        })
                                    }else{
                                        useFilterText({
                                            tray:tray,
                                            data_org:original_data,
                                            value:e.target.value,
                                            update:updateCredits,
                                            all:true
                                        })
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
                                            update:updateCredits,
                                            all:false
                                        })
                                    }else{
                                        useFilterText({
                                            tray:tray,
                                            data_org:original_data,
                                            value:e.target.value,
                                            update:updateCredits,
                                            all:true
                                        })
                                    }
                                }}
                                placeholder="Cédula"
                            />
                        </label>
                    </div>

                    <div>
                        <label>Agencia</label>
                        <select
                            onChange={(e)=>{
                                
                                if(e.target.value!==''){
                                    useFilterAgency({
                                        tray:tray,
                                        data_org:original_data,
                                        value:e.target.value,
                                        update:updateCredits,
                                        all:false
                                    });
                                }else{
                                    useFilterAgency({
                                        tray:tray,
                                        data_org:original_data,
                                        value:e.target.value,
                                        update:updateCredits,
                                        all:true
                                    });
                                }
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
                                    value={mora.min}
                                    onChange={(e)=>{
                                        setMora({
                                            ...mora,
                                            min:Number(e.target.value)
                                        });

                                        useFilteMinMax({
                                            tray:tray,
                                            data_org:original_data,
                                            value:{
                                                min:e.target.value,
                                                max:mora.max
                                            },
                                            update:updateCredits,
                                            all:false
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label>Max</label>
                                <input 
                                    type="number"
                                    value={mora.max}
                                    onChange={(e)=>{
                                        setMora({
                                            ...mora,
                                            max:Number(e.target.value)
                                        });

                                        useFilteMinMax({
                                            tray:tray,
                                            data_org:original_data,
                                            value:{
                                                min:mora.min,
                                                max:e.target.value
                                            },
                                            update:updateCredits,
                                            all:false
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
                            onChange={(e)=>{
                                if(e.target.value!=='all'){
                                    useFilterState({
                                        tray:tray,
                                        data_org:original_data,
                                        value:e.target.value,
                                        update:updateCredits,
                                        all:false
                                    })
                                }else{
                                    useFilterState({
                                        tray:tray,
                                        data_org:original_data,
                                        value:e.target.value,
                                        update:updateCredits,
                                        all:true
                                    })
                                }
                            }}
                        >
                            <option value={"all"}>-- Seleccionar --</option>
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
                    </div>
                </div>
                
                {
                    (tray==='pending')
                    ?
                        data.pending.map((credit,index,credits)=>(
                            <div className="Gestion__item">
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
                            data.inprocess.map((credit,index,credits)=>(
                                <div className="Gestion__item">
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
                            data.processed.map((credit,index,credits)=>(
                                <div className="Gestion__item">
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
                }

            </div>

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
                            id_campain={campain}
                            setCancel={setStateCall}
                            setStatusGestion={setStateGestion}
                            state_gestion={state_gestion}
                            structure={structure}
                            updateTrays={updateTray}
                            number={data[tray]}
                        /> 
                        
                    </div>

                :   <></>
            }

        </div>
    );
}
