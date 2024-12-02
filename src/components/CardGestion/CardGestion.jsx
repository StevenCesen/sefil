import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./CardGestion.css"
import CardCall from "../CardCall/CardCall";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import addNotification from "react-push-notification";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useClickToCopy from "../../hooks/useClickToCopy";
import MyMapComponent from "../Map/Map";
import useVerifyCondonation from "../../hooks/useVerifyCondonation";
import CardCondonacion from "../CardCondonacion/CardCondonacion";
import { PDFViewer } from "@react-pdf/renderer";
import PDFcondonacion from "../PDFcondonacion";
import CardStructure from "../CardStructure/CardStructure";
import useVerifyStruct from "../../hooks/useVerifyRestruct";

const render = (status) => {
    return <p>{status}</p>;
};

export default function CardGestion({currently,next,index,setNext,id_campain,setCancel,setStatusGestion,state_gestion,structure,updateTrays,number}){
    
    const [call,setCall]=useState(false);
    const [credit,setCredit]=useState(); //Información netamente de la persona actual
    const [contacts,setContacts]=useState(); //Información de garantes
    const [info_credit,setInfo]=useState(); //Información del crédito

    const [data_gestion,setDataGestion]=useState();
    const [historial,setHistorial]=useState();
    const [pagos,setPagos]=useState();
    const [direcciones,setDirecciones]=useState();
    const [phone_actual,setPhone]=useState();
    const [data_phones,setPhones]=useState();
    const [states,setStates]=useState();

    const [template,setTemplate]=useState();
    const [view_details,setDetails]=useState();
    const [tray,setTray]=useState();
    const [message_state,setMessage]=useState();
    const [phones_secondaries,setSecondaries]=useState();
    const [incall,setIncall]=useState();
    const [gasto_cobranza,setGasto]=useState(0);
    const [view_condonation,setViewCondonation]=useState(true);
    const [viewPDFCondonation,setPDFcondonation]=useState(false);
    const [value_condonacion,setData]=useState([]);
    const [view_reestructurar,setReestructurar]=useState(true);
    
    const ref_date=useRef();

    const [new_phone,setNumber]=useState();
    const [view_new_phone,setViewNewPhone]=useState();
    // const [phone_external,setCallExternal]=useState(); PENDIENTE, para que puedan marcar a cualquier otro número que no este registrado

    const form=useRef();
    const dates=useRef();

    const close=()=>{
        setCall(false);
    }

    const changeNro=(index)=>{

        if((index+1)<data_phones.length){
            setPhone({
                nro:data_phones[index+1].nro,
                index:index+1
            });
        }else{
            setPhone({
                nro:data_phones[index].nro,
                index:index
            });
        }
    }

    const add_id_call=(id)=>{
        let extras=data_gestion.id_calls_extras;
        if(extras.length>0){
            extras.push(id);
        }else{
            extras=[id];
        }

        setDataGestion({
            ...data_gestion,
            id_calls_extras:extras
        });
    }

    const add_state_call=(state)=>{
        let copy=states;
        copy.push(state);
        setStates(copy);
    }

    const add_phone=(phone)=>{
        let phones=data_phones;
        
        phones.push({
            nro:phone.numero,
            efec:phone.nro_efectivo
        });

        setPhones(phones);

        setPhone({
            nro:(phones.length) ? phones[0].nro : 0,
            index:0
        });
    }

    const update_phones=(phones)=>{
        let new_phones=[];

        phones.map(phone=>{
            if(phone.nro!=="N/D"){
                new_phones.push(phone);
            }
        });

        setPhones(new_phones);

        setPhone({
            nro:(new_phones.length) ? new_phones[0].nro : 0,
            index:0
        });

    }

    const view=()=>{
        setPDFcondonation(true);
    }

    useEffect(()=>{
        setReestructurar(false);
        setViewCondonation(false);
        setPDFcondonation(false);
        // Seleccionamos el historial de gestiones del crédito actual
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managments?id_credit=${currently.id_credito}&cartera=${currently.cartera}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setHistorial(data.data.data);
            });

        if(currently.cartera==='SEFIL_1' | currently.cartera==='SEFIL_2'){

            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/genGastos?cartera=${currently.cartera}&credito=${currently.id}`,{
                method:'GET',
                headers: {
                    Accept: 'application/json'
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setGasto(data.gastos);
                });
        }else{
            setGasto(0);
        }
        
        setCall(false);
        setDetails(false);
        setViewNewPhone(false);
        setNumber("");
        setIncall(false);
        setCredit(currently);
        setPagos([]);
        setDirecciones([]);
        setTray('Historial');
        setMessage('No gestionado aún');
        setInfo({
            id:currently.id_credito,
            name:currently.name,
            ci:currently.ci,
            monthlyFeeAmount:currently.monthlyFeeAmount,
            dias_vencidos:currently.dias_vencidos,
            paymentDate:currently.paymentDate,
            pendingFees:currently.pendingFees,
            paidFees:currently.paidFees,
            collectionState:currently.collectionState,
            totalAmount:currently.totalAmount,
            agency:currently.agency,
            capital:currently.saldo_capital,
            mora:currently.mora,
            interes:currently.interes,
            seguro:currently.seguro_desgravamen,
            gastos:currently.gastos_cobranza,
            otros:currently.otros_valores,
            judicial:currently.gastos_judiciales,
            cartera:currently.cartera
        });

        localStorage.setItem('cartera',currently.cartera);
        localStorage.setItem('id_credito',currently.id_credito);
        localStorage.setItem('dias_vencidos',currently.dias_vencidos);
        localStorage.setItem('client_ci',currently.ci);

        setStates([]);
        setContacts(currently.contactos);

        const phones_c=[];

        const phones_titular=currently.phones;
        phones_titular.map(phone=>{
            phones_c.push({
                nro:phone.numero,
                efec:phone.nro_efectivo
            });
        });

        update_phones(phones_c);

        // Seleccionamos la plantilla
        let temp=[];

        if(localStorage.getItem('rol')==='super' | localStorage.getItem('rol')==='administrador' | localStorage.getItem('rol')==='call'){
            temp=JSON.parse(structure[2]);

            setTemplate({
                states:temp.default[1].options,
                substates:temp.default[2].suboptions
            });

        }else if(localStorage.getItem('rol')==='campo'){

            if(currently.dias_vencidos>=91){
                temp=JSON.parse(structure[1]);
            }else{
                temp=JSON.parse(structure[2]);
            }

            setTemplate({
                states:temp.default[1].options,
                substates:temp.default[2].suboptions
            });

        }else if(localStorage.getItem('rol')==='legal'){
            temp=JSON.parse(structure[0]);
            setTemplate({
                states:temp.default[1].options,
                substates:temp.default[2].suboptions
            });
        }

        // Esto se envía al backend para guardar la gestión
        setDataGestion({
            id_campain:id_campain,
            id_call:'', //Llamada con gestión
            id_calls_extras:[],
            id_credit:currently.id_credito,
            state_gestion:temp.default[1].options[0],
            substate_gestion:'',
            date_promise:"",
            observation:'',
            byUser:'',
            fecha:'',
            client_name:currently.name,
            client_ci:currently.ci,
            type:currently.tipo,
            dias_vencidos:currently.dias_vencidos,
            cartera:currently.cartera
        }) 

    },[currently]);

    if(!data_gestion) return <></>
    if(!historial) return <></>
    if(!credit) return <></>
    if(!contacts) return <></>
    if(!template) return <></>
    if(!message_state) return <></> 

    return (
        <div className="Ggestion">
            <div className="Ggestion__dates">
                    
                <div className={`DetailCredit__detail ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Castigado' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm" : ""}`}>
                    <div className={`DetailCredit__body DetailCredit__body--focus ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Castigado' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnCo" : ""}`}>
                        <h3
                            onClick={(e)=>{

                                useClickToCopy(e.target.textContent);
                                if(incall===false){

                                    setCredit(currently);
                                    localStorage.setItem('client_ci',currently.ci);

                                    let elements=document.getElementsByClassName('DetailCredit__body--focus');
                                    elements=[].slice.call(elements);

                                    elements.map((ele)=>{
                                        ele.classList.remove('DetailCredit__body--focus');
                                    });
                                    e.target.parentElement.classList.add('DetailCredit__body--focus');

                                    const phones_c=[];

                                    const phones_titular=currently.phones;
                                    phones_titular.map(phone=>{
                                        phones_c.push({
                                            nro:phone.numero,
                                            efec:phone.nro_efectivo
                                        });
                                    });

                                    update_phones(phones_c);
                                }
                            }}
                        >{currently.name} | TITULAR</h3>
                        <h3
                            onClick={(e)=>{
                                useClickToCopy(e.target.textContent);
                            }}
                        >{currently.ci}</h3>
                    </div>

                    <div className="CardGestion__garantes">
                        {
                            contacts.map((contact,index)=>(
                                (contact.name!=='') &&
                                    <button 
                                        onClick={(e)=>{
                                            useClickToCopy(e.target.textContent);

                                            contacts.map((garante,index)=>{
                                                if(garante.ci===contact.ci & incall===false){
                                                    const phones_c=[];

                                                    form.current.reset();
                                                    let elements=document.getElementsByClassName('DetailCredit__body--focus');
                                                    elements=[].slice.call(elements);

                                                    elements.map((ele)=>{
                                                        ele.classList.remove('DetailCredit__body--focus');
                                                    });
                                                    e.target.classList.add('DetailCredit__body--focus');

                                                    const phones_titular=garante.phones;
                                                    phones_titular.map(phone=>{
                                                        phones_c.push({
                                                            nro:phone.numero,
                                                            efec:phone.nro_efectivo
                                                        });
                                                    });

                                                    update_phones(phones_c);
                                                    setCredit(garante);
                                                    
                                                    localStorage.setItem('client_ci',garante.ci);

                                                    setDataGestion({
                                                        ...data_gestion,
                                                        client_name:garante.name,
                                                        id_credit:currently.id_credito,
                                                        client_ci:garante.ci,
                                                        type:garante.tipo
                                                    });
                                                    
                                                }
                                            });
                                        }}
                                        key={index}
                                    >{contact.name} | GARANTE - {contact.ci}</button>
                            ))
                        }
                    </div>

                    <div className="CardGestion__itemsDetail">
                        <div className="CardGestion__Details">
                            <h4>Detalle del crédito</h4>
                            <p><strong>ID crédito: </strong>{currently.credito}</p>
                            <p><strong>Capital:</strong> $ {info_credit.capital}</p>
                            <p><strong>Interés:</strong> $ {info_credit.interes}</p>
                            <p><strong>Mora: </strong> $ {info_credit.mora}</p>
                            <p><strong>Seguro desgravamen:</strong> $ {info_credit.seguro}</p>
                            <p><strong>Gastos judiciales:</strong> $ {info_credit.judicial}</p>
                            <p><strong>Gastos de cobranza:</strong> $ {info_credit.gastos}</p>
                            <p><strong>Gastos de cobranza SEFIL: </strong> {useFormatterNumber({value:gasto_cobranza,currency:'USD'})}</p>
                            <p><strong>Otros valores:</strong> $ {info_credit.otros}</p>
                        </div>

                        <div className="DetailCredit__info">
                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Días de mora</label>
                                <p>{info_credit.dias_vencidos}</p>
                            </div>
                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Último pago</label>
                                <p>{info_credit.paymentDate.split(' ')[0]}</p>
                            </div>
                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Monto adeudado</label>
                                <p>{useFormatterNumber({value:(Number(info_credit.totalAmount)+((gasto_cobranza>0) ? gasto_cobranza : 0)),currency:'USD'})}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`DetailCredit__footer ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' | info_credit.collectionState==='VENCIDO TOTAL') ? 'DetailCredit__footer--warn' : "DetailCredit__footer--success"}`}>
                        <p>AG. {info_credit.agency}</p>
                        <p>{info_credit.collectionState}</p>
                    </div>

                </div>

                <div className="DetailCredit__dial">
                    <div>
                        <div className="DetailCredit__dial__addPhone">
                            <h3 className="Ggestion__title">Contactos</h3>
                            <button 
                                onClick={(e)=>{
                                    setViewNewPhone(!view_new_phone);
                                }}
                                className="Ggestion__button"
                            >
                                <img src="./icons/add.png"/>
                            </button>
                        </div>

                        {
                            (view_new_phone)
                            ?
                                <label className="Ggestion__inputNewPhone">
                                    <input  
                                        value={new_phone}
                                        onChange={(e)=>{
                                            setNumber(e.target.value);
                                        }}
                                        type="text" 
                                        placeholder="09XXXXXXX"
                                    />
                                    <button
                                        onClick={(e)=>{
                                            e.target.textContent='Guardando...';
                                            const data={
                                                credito:currently.id,
                                                tipo:credit.tipo,
                                                nombre:credit.name,
                                                parentesco:credit.tipo,
                                                numero:new_phone,
                                                nro_efectivo:1,
                                                cartera:currently.cartera,
                                                ci:credit.ci,
                                                byUserCreate:localStorage.getItem('temp_uS'),
                                                byUserDelete:'N/D',
                                                byUserUpdate:'N/D',
                                                estado:'ACTIVE'
                                            };

                                            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/contacts`,{
                                                method:'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                },
                                                body:new URLSearchParams(data)
                                            })
                                                .then((response) => response.json())  
                                                .then((data) => {
                                                    if(data.status===200){
                                                        
                                                        add_phone(data.data);
                                                        setViewNewPhone(false);
                                                        setNumber("");
                                                        e.target.textContent='Guardar';

                                                    }else{
                                                        e.target.textContent='Error';
                                                    }
                                                });

                                        }}
                                    >Guardar</button>
                                </label>
                            :   <></>
                        }
                        
                        <div>
                            <p style={{fontWeight:'600'}}>Contactos principales</p>
                            {
                                data_phones.map((phone,index)=>(
                                    <div key={index} className="Ggestion__contact">
                                        <p
                                            onClick={(e)=>{
                                                useClickToCopy(e.target.textContent);
                                            }}
                                        >{phone.nro} ({phone.efec})</p>
                                        <div>

                                            <button
                                                onClick={async (e)=>{
                                                    // const request=await fetch(`originate.php?exten=${phone.nro}&id=9&channel=${localStorage.getItem('extension')}`);
                                                    // const response=await request.json();

                                                    setPhone({
                                                        nro:phone.nro,
                                                        index:index
                                                    });

                                                    // setCall(true);
                                                    // setCancel(false);
                                                    // setStatusGestion(false);
                                                }}
                                            >
                                                <img src="./icons/call.png"/>
                                            </button>

                                            {/* <button>
                                                <img src="./icons/send_waps.png"/>
                                            </button> */}

                                        </div>
                                    </div>
                                ))
                            }
                            

                            {/* <p style={{fontWeight:'600'}}>Contactos secundarios</p>
                            {
                                phones_secondaries.map((phone,index)=>(
                                    <div key={index} className="Ggestion__contact">
                                        <div className="Ggestion__contactSecond">
                                            <p>{phone.parentesco}</p>
                                            <p>{phone.nro} ({phone.efec})</p>
                                        </div> 
                                    </div>
                                ))
                            } */}
                        </div>
                    </div>

                    <CardCall
                        phone={phone_actual}
                        channel={localStorage.getItem('extension')}
                        id_campain={id_campain}
                        id_credit={info_credit.id}
                        cartera={data_gestion.cartera}
                        change={changeNro}
                        setCancel={setCancel}
                        addCall={add_id_call}
                        addStates={add_state_call}
                        setInit={setIncall}
                    />
                    
                </div>
            </div>

            <div className="Ggestion__regist">
                <div className="Ggestion__principal">
                    <div>
                        <div className="Ggestion__principalHead">
                            <div>
                                <h3 className="Ggestion__title">Gestión ({message_state})</h3>
                                <p>Quedan ({number.length})</p>
                            </div>
                            
                            {/* En este botón se hace verificación de estados de llamadas para guardar en bandeja de "EN PROCESO" */}

                            <button
                                className="Ggestion__buttons--blank"
                                onClick={(e)=>{

                                    let count=0;
                                    
                                    form.current.reset();
                                    dates.current.value="";

                                    if(states.length>0){
                                        states.map((state)=>{
                                            if(state==='CONTACTADO'){
                                                count++;
                                            }
                                        });
    
                                        if(count===0){
                                            const data={
                                                id_campain:data_gestion.id_campain,
                                                id_credit:data_gestion.id_credit,
                                                cartera:data_gestion.cartera
                                            };

                                            console.log(data);

                                            e.target.textContent="Espere...";

                                            if(data.id_campain!==undefined & data.id_credit!==undefined & data.cartera!==undefined){
                                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/trays`,{
                                                    method:'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    },
                                                    body:new URLSearchParams(data)
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateTrays(data.data,'inprocess');
    
                                                        if(data.state===200){
                                                            setNext(index);
                                                            e.target.textContent="Seguir";
                                                        }
                                                    });
                                            }else{
                                                setNext(index);
                                                e.target.textContent="Seguir";
                                            }

                                        }else{
                                            if(state_gestion){
                                                setNext(index);
                                            }else{
                                                addNotification({
                                                    title: 'Gestión en curso',
                                                    subtitle: 'Se ha realizado una llamada con estado CONTACTADO y no se ha guardado gestión',
                                                    message: 'Por favor, guarde la gestión',
                                                    native: false,
                                                    backgroundTop: '#FF9619',
                                                    backgroundBottom: '#fdb864',
                                                    colorTop: 'white',
                                                    colorBottom: 'white',
                                                    closeButton: 'Cerrar',
                                                    duration: 3500
                                                });
                                            }
                                        }
                                    }else{
                                        setNext(index);
                                    }
                                
                                }}
                            >
                                Seguir
                            </button>
                        </div>

                        <form ref={form} className="Ggestion__form">
                            <div className="Ggestion__threeGroup">

                                <label className="Ggestion__input">
                                    Nombre del contacto
                                    <input type="text" placeholder="STEVEN RAFAEL CESEN" value={credit.name}/>
                                </label>

                                <label className="Ggestion__select">
                                    Estado
                                    <select 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                state_gestion:e.target.value
                                            })
                                        }}
                                        value={data_gestion.state_gestion}
                                    >
                                        {
                                            template.states.map((option,index)=>(
                                                <option key={index} value={option}>{option}</option>
                                            ))
                                        }
                                    </select>
                                </label>

                                <label className="Ggestion__select">
                                    Subestado
                                    <select
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                substate_gestion:e.target.value
                                            })
                                        }}
                                        value={data_gestion.substate_gestion
                                    }>
                                        <option value={""}>-- Seleccionar --</option>
                                        {
                                            template.substates.map((option)=>(
                                                (option.title===data_gestion.state_gestion) &&
                                                    option.options.map((sub,index)=>(
                                                        <option key={index} value={sub}>{sub}</option>
                                                    ))
                                            ))
                                        }
                                    </select>
                                </label>
                            </div>

                            <div className="Ggestion__twoGroup">
                                <label className="Ggestion__input" style={{width:"calc((100% / 3) - 15px)"}}>
                                    Fecha de compromiso
                    
                                    <input
                                        ref={dates}
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                date_promise:e.target.value
                                            });
                                        }}
                                        value={data_gestion.data_promise}
                                        type="date" 
                                    />
                                </label>

                                {/* <label className="Ggestion__select">
                                    Motivo No Pago
                                    <select className="Ggestion__select">
                                        <option value={"NO CONTESTA"}>--Seleccionar--</option>
                                    </select>
                                </label> */}

                            </div>

                            <div className="Ggestion__oneGroup">
                                <label className="Ggestion__textarea">
                                    Observación
                                    <textarea 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                observation:e.target.value
                                            });
                                        }}
                                        value={data_gestion.observation}
                                        placeholder="Escribe aquí"
                                    >
                                    </textarea>
                                </label>
                            </div>
                        </form>
                    </div>
                    <div className="Ggestion__principalActions">
                        <h3>Acciones</h3>
                        <button 
                            title="Solicitar condonación"
                            onClick={async (e)=>{
                                if(await useVerifyCondonation(currently.id)){
                                    setViewCondonation(!view_condonation);
                                }else{
                                    addNotification({
                                        title: 'ERROR',
                                        subtitle: 'Crédito con condonación',
                                        message: 'No se puede, ya se ha registrado una condonación',
                                        native: false,
                                        backgroundTop: '#FF9619',
                                        backgroundBottom: '#fdb864',
                                        colorTop: 'white',
                                        colorBottom: 'white',
                                        closeButton: 'Cerrar',
                                        duration: 3500
                                    });
                                    clean;
                                }
                            }}
                        >Condonar</button>

                        <button
                            title="Solicitar Convenio de Pago"
                            onClick={async (e)=>{
                                if(await useVerifyStruct(currently.id)){
                                    setReestructurar(!view_reestructurar);
                                }else{
                                    addNotification({
                                        title: 'ERROR',
                                        subtitle: 'Crédito con convenio',
                                        message: 'No se puede, hay un convenio ya creado',
                                        native: false,
                                        backgroundTop: '#FF9619',
                                        backgroundBottom: '#fdb864',
                                        colorTop: 'white',
                                        colorBottom: 'white',
                                        closeButton: 'Cerrar',
                                        duration: 3500
                                    });
                                }
                            }}
                        >Convenio</button>
                    </div>
                </div>

                <div className="Ggestion__buttons">
                    <button
                        className="Ggestion__buttons--save"
                        onClick={(e)=>{

                            e.target.textContent="Guardando...";
                        
                            if((data_gestion.date_promise==='' & data_gestion.substate_gestion=='COMPROMISO DE PAGO') | data_gestion.substate_gestion===''){
                                e.target.textContent="Intentar de nuevo";

                                addNotification({
                                    title: 'Datos imcompletos',
                                    subtitle: 'Por favor, llene todos los datos de la gestión',
                                    message: '',
                                    native: false,
                                    backgroundTop: '#FF9619',
                                    backgroundBottom: '#fdb864',
                                    colorTop: 'white',
                                    colorBottom: 'white',
                                    closeButton: 'Cerrar',
                                    duration: 3000,
                                });

                            }else{
                                setStatusGestion(true);

                                const data_send=data_gestion;

                                if(data_send.id_calls_extras.length>0){
                                    data_send.id_call=data_send.id_calls_extras[data_send.id_calls_extras.length-1];
                                    data_send.id_calls_extras=JSON.stringify(data_send.id_calls_extras);
                                }else{
                                    data_send.id_call=0;
                                    data_send.id_calls_extras=JSON.stringify([]);
                                }
                                

                                if(data_gestion.observation===''){
                                    data_send.observation='.';
                                }

                                data_send.monto=currently.totalAmount;
                                data_send.cuotas_pagadas=currently.paidFees;
                                data_send.cuotas_pendientes=currently.pendingFees;
                                data_send.id_credit=localStorage.getItem('id_credito');
                                data_send.cartera=localStorage.getItem('cartera');
                                data_send.date_promise=dates.current.value;
                                data_send.dias_vencidos=localStorage.getItem('dias_vencidos');
                                data_send.client_ci=localStorage.getItem('credit_ci');

                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managments`,{
                                    method:'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams(data_send)
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        
                                        if(data.status===200){
                                            setMessage('Gestionado');
                                            addNotification({
                                                title: 'Éxito',
                                                subtitle: 'Gestión guardada correctamente',
                                                message: '',
                                                native: false,
                                                backgroundTop: '#009793',
                                                backgroundBottom: '#459d9a',
                                                colorTop: 'white',
                                                colorBottom: 'white',
                                                closeButton: 'Cerrar',
                                                duration:3000,
                                            });

                                            updateTrays(data.data,'processed');

                                            form.current.reset();

                                            setDataGestion({
                                                id_campain:id_campain,
                                                id_call:'',
                                                id_calls_extras:[],
                                                id_credit:currently.id_credito,
                                                state_gestion:template.states[0],
                                                substate_gestion:'',
                                                date_promise:'',
                                                observation:'',
                                                byUser:'',
                                                fecha:'',
                                                client_name:currently.name
                                            });

                                            e.target.textContent="Guardar";
                                        }else{
                                            e.target.textContent="Error, inténtalo de nuevo";
                                        }
                                    });
                            }
                        }}
                    >Guardar</button>
                </div>

                <div className="Ggestion__historial">
                    <div>

                        <button
                            onClick={(e)=>{
                                setTray('Historial');
                            }}
                        >Historial</button>

                        <button
                            onClick={(e)=>{
                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/vouchers/group/${info_credit.id}?cartera=${info_credit.cartera}`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        setPagos(data);
                                    });
                                setTray('Pagos');
                            }}
                        >Pagos</button>

                        <button
                            onClick={(e)=>{
                                setDirecciones(currently.direcciones);
                                setTray('Direcciones');
                            }}
                        >Direcciones</button>

                    </div>
                    <div className="Ggestion__historialHead">
                        {
                            (tray==='Historial')
                            ?
                                <>
                                    <label>Fecha</label>
                                    <label>Cliente</label>
                                    <label>Estado de gestión</label>
                                    <label>Fecha compromiso</label>
                                    <label>Observación</label>
                                    <label>Agente</label>
                                </>
                            :
                                (tray==='Pagos')
                                    ?
                                        <>
                                            <label>Fecha pago</label>
                                            <label>Tipo de pago</label>
                                            <label>Monto</label>
                                            <label>Estado</label>
                                        </>
                                    :
                                        <>
                                            <label>Nombre</label>
                                            <label>Ciudad</label>
                                            <label>Parroquia</label>
                                            <label>Dirección</label>
                                            <label>Ubicación</label>
                                        </>
                        }
                    </div>

                    {
                        (tray==='Historial')
                        ?   
                            historial.map((item,index)=>(
                                <div key={index} className="Ggestion__historialItem">
                                    <label>{item.fecha}</label>
                                    <label>{item.client_name}</label>
                                    <label>{item.substate_gestion}</label>
                                    <label>{item.date_promise}</label>
                                    <label>{item.observation}</label>
                                    <label>{item.byUser}</label>
                                </div>
                            ))
                        :   
                            (tray==='Pagos')
                            ?   
                                (pagos.length>0)
                                ?
                                    pagos.map((item,index)=>(
                                        <div key={index} className="Ggestion__historialItem">
                                            <label>{item.fecha}</label>
                                            <label>{item.forma_pago}</label>
                                            <label>{useFormatterNumber({value:item.valor_recibido,currency:'USD'})}</label>
                                            <label>{item.status.toUpperCase()}</label>
                                        </div>
                                    ))
                                :   
                                    <div className="Ggestion__historialItem">
                                        <label>Sin pagos</label>
                                    </div>
                            :
                                direcciones.map((item,index)=>(
                                    <div key={index} className="Ggestion__historialItem">
                                        <label>{item.nombre}</label>
                                        <label>{item.ciudad}</label>
                                        <label>{item.parroquia}</label>
                                        <label>{item.direccion}</label>

                                        {
                                            (item.ubicacion.lat!=="")
                                            ?
                                                <Wrapper apiKey="AIzaSyDqk_2FCNezPuFgd8Zaeu2s1idsDpdC1Qc" render={render}>
                                                    <MyMapComponent
                                                        center={{lat:parseFloat(item.ubicacion.lat),lng:parseFloat(item.ubicacion.lng)}}
                                                        zoom={15}
                                                    />
                                                </Wrapper>
                                            :   <p style={{fontWeight:"100",textAlign:"center"}}>No hay ubicación</p>
                                        }
                                        
                                    </div>
                                ))
                    }
                    
                </div>
            </div>

            {
                (view_condonation) &&
                    <CardCondonacion 
                        capital={credit.saldo_capital}
                        mora={credit.mora}
                        interes={credit.interes}
                        seguro_desgravamen={credit.seguro_desgravamen}
                        gastos_judiciales={credit.gastos_judiciales}
                        gastos_cobranza={credit.gastos_cobranza}
                        otros_valores={credit.otros_valores}
                        total={Number(credit.totalAmount)}
                        set={setViewCondonation}
                        id={currently.id}
                        cartera={currently.cartera}
                        setData={setData}
                        view={view}
                        update={null}
                    />
            }

            {
                (viewPDFCondonation) &&
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setPDFcondonation(false)}}>Volver</button>
                        <PDFViewer width={'800px'} height={'600px'}>
                            <PDFcondonacion
                                // ci={"1104266075"}
                                // credito={"467"}
                                // name={"BARROS GUTIERREZ JORGE LUIS"}
                                // fecha={"2024/09/30 19:11:56"}
                                // prevDates={'{"mora":"0","interes":"0","capital":"290.41","seguro_desgravamen":"0","gastos_cobranza":"0","gastos_judiciales":"0","otros_valores":"0"}'}
                                // postDates={'{"capital":"145.2","interes":"0","mora":"0","seguro_desgravamen":"0","gastos_cobranza":"0","gastos_judiciales":"0","otros_valores":"0"}'}
                                // user_auth={'María Bravo'}
                                ci={value_condonacion.ci}
                                credito={value_condonacion.credito}
                                name={value_condonacion.name}
                                fecha={value_condonacion.fecha}
                                prevDates={value_condonacion.prevDates}
                                postDates={value_condonacion.postDates}
                                user_auth={value_condonacion.by_user}
                            />
                        </PDFViewer>
                    </div>
            }

            {
                (view_reestructurar) &&
                    <CardStructure
                        original_dates={{
                            totalAmount:credit.totalAmount,
                            saldo_capital:credit.saldo_capital,
                            mora:credit.mora,
                            interes:credit.interes,
                            seguro_desgravamen:credit.seguro_desgravamen,
                            gastos_judiciales:credit.gastos_judiciales,
                            gastos_cobranza:credit.gastos_cobranza,
                            otros_valores:credit.otros_valores
                        }}
                        total={credit.totalAmount}
                        set={setReestructurar}
                        id={currently.id}
                        cartera={currently.cartera}
                        cobranza={gasto_cobranza}
                    />
            }

        </div>
    );
}