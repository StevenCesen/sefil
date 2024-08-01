import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./CardGestion.css"
import CardCall from "../CardCall/CardCall";
import addNotification from "react-push-notification";
import useFormatterNumber from "../../hooks/useFormatterNumber";

export default function CardGestion({currently,next,index,setNext,id_campain,setCancel,setStatusGestion,state_gestion,structure,updateTrays}){
    
    const [call,setCall]=useState(false);
    const [credit,setCredit]=useState(); //Información netamente de la persona actual
    const [contacts,setContacts]=useState(); //Información de garantes
    const [info_credit,setInfo]=useState(); //Información del crédito

    const [data_gestion,setDataGestion]=useState();
    const [historial,setHistorial]=useState();
    const [pagos,setPagos]=useState();
    const [phone_actual,setPhone]=useState();
    const [data_phones,setPhones]=useState();
    const [states,setStates]=useState();

    const [template,setTemplate]=useState();
    const [view_details,setDetails]=useState();
    const [tray,setTray]=useState();
    const [message_state,setMessage]=useState();
    const [phones_secondaries,setSecondaries]=useState();

    const close=()=>{
        setCall(false);
    }

    const changeNro=(index)=>{
        console.log(index)
        console.log(data_phones.length)

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
        extras.push(id);

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

    const update_phones=(phones)=>{
        let new_phones=[];

        phones.map(phone=>{
            if(phone.nro!=="N/D"){
                new_phones.push(phone);
            }
        });

        setPhones(new_phones);
        setPhone({
            nro:new_phones[0].nro,
            index:0
        });
    }

    useEffect(()=>{

        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managments?id_campain=${id_campain}&id_credit=${currently.id}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setHistorial(data.data.data);
            });
        
        setCall(false);
        setDetails(false);
        setCredit(currently);
        setPagos([]);
        setTray('Historial');
        setMessage('No gestionado aún');
        setInfo({
            id:currently.id,
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

        setStates([]);

        setContacts(JSON.parse(currently.contactos));

        const phones_c=[
            {
                // nro:'0978950498',
                nro:currently.phone,
                efec:0
            },
            {
                nro:currently.phone2,
                efec:0
            },
            {
                nro:currently.phone3,
                efec:0
            },
            {
                nro:currently.phone4,
                efec:0
            }
        ];

        update_phones(phones_c);

        setSecondaries([
            {
                // nro:'0978950498',
                nro:'0978950498',
                parentesco:'Hermano-TITULAR',
                efec:0
            },
            {
                // nro:'0978950498',
                nro:'0978950498',
                parentesco:'Esposa-TITULAR',
                efec:0
            },
            {
                // nro:'0978950498',
                nro:'0978950498',
                parentesco:'Esposa-TITULAR',
                efec:0
            }
        ]);

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

        setDataGestion({
            id_campain:id_campain,
            id_call:'', //Llamada con gestión
            id_calls_extras:[],
            id_credit:currently.id,
            state_gestion:temp.default[1].options[0],
            substate_gestion:'',
            date_promise:'',
            observation:'',
            byUser:'',
            fecha:'',
            client_name:currently.name,
            client_ci:currently.ci,
            type:currently.tipo,
            dias_vencidos:currently.dias_vencidos
        });

    },[currently]);

    if(!historial) return <></>
    if(!credit) return <></>
    if(!contacts) return <></>
    if(!data_gestion) return <></>
    if(!template) return <></>
    if(!message_state) return <></> 

    return (
        <div className="Ggestion">
            <div className="Ggestion__dates">
                    
                <div className={`DetailCredit__detail ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm" : ""}`}>
                    <div className={`DetailCredit__body ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnCo" : ""}`}>
                        <h3
                            onClick={(e)=>{
                                setCredit(currently)

                                const phones_c=[
                                    {
                                        nro:currently.phone,
                                        efec:0
                                    },
                                    {
                                        nro:currently.phone2,
                                        efec:0
                                    },
                                    {
                                        nro:currently.phone3,
                                        efec:0
                                    },
                                    {
                                        nro:currently.phone4,
                                        efec:0
                                    }
                                ];
                        
                                update_phones(phones_c)
                            }}
                        >{credit.name}</h3>
                        <h3>{credit.ci}</h3>
                    </div>

                    <div className="CardGestion__garantes">
                        {
                            contacts.map((contact,index)=>(
                                (contact.name!=='') &&
                                    <button 
                                        onClick={(e)=>{
                                            contacts.map((garante,index)=>{
                                                if(garante.ci===contact.ci){
                                                    const phones_c=[
                                                        {
                                                            nro:garante.phone,
                                                            efec:0
                                                        },
                                                        {
                                                            nro:garante.phone2,
                                                            efec:0
                                                        },
                                                        {
                                                            nro:garante.phone3,
                                                            efec:0
                                                        },
                                                        {
                                                            nro:garante.phone4,
                                                            efec:0
                                                        }
                                                    ];
                                                    
                                                    update_phones(phones_c)
                                                    
                                                    setCredit(garante);
                                                    setDataGestion({
                                                        ...data_gestion,
                                                        client_name:garante.name,
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
                            <p><strong>Capital:</strong> $ {info_credit.capital}</p>
                            <p><strong>Interés:</strong> $ {info_credit.interes}</p>
                            <p><strong>Mora: </strong> $ {info_credit.mora}</p>
                            <p><strong>Seguro desgravamen:</strong> $ {info_credit.seguro}</p>
                            <p><strong>Gastos judiciales:</strong> $ {info_credit.judicial}</p>
                            <p><strong>Gastos de cobranza:</strong> $ {info_credit.gastos}</p>
                            <p><strong>Otros valores:</strong> $ {info_credit.otros}</p>
                        </div>

                        <div className="DetailCredit__info">
                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Días de mora</label>
                                <p>{info_credit.dias_vencidos}</p>
                            </div>
                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Último pago</label>
                                <p>{info_credit.paymentDate.split(' ')[0]}</p>
                            </div>
                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Monto adeudado</label>
                                <p>{useFormatterNumber({value:info_credit.totalAmount,currency:'USD'})}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`DetailCredit__footer ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? 'DetailCredit__footer--warn' : "DetailCredit__footer--success"}`}>
                        <p>AG. {info_credit.agency}</p>
                        <p>{info_credit.collectionState}</p>
                    </div>

                </div>

                <div className="DetailCredit__dial">
                    <div>
                        <div className="DetailCredit__dial__addPhone">
                            <h3 className="Ggestion__title">Contactos</h3>
                            <button className="Ggestion__button">
                                <img src="./icons/add.png"/>
                            </button>
                        </div>
                        
                        <div>
                            <p style={{fontWeight:'600'}}>Contactos principales</p>
                            {
                                data_phones.map((phone,index)=>(
                                    <div key={index} className="Ggestion__contact">
                                        <p>{phone.nro} ({phone.efec})</p>
                                        {/* <div>
                                            <button
                                                onClick={async (e)=>{
                                                    const request=await fetch(`originate.php?exten=${phone.nro}&id=9&channel=${localStorage.getItem('extension')}`);
                                                    const response=await request.json();

                                                    setPhone({
                                                        nro:phone.nro,
                                                        index:index
                                                    });
                                                    setCall(true);
                                                    setCancel(false);
                                                    setStatusGestion(false);
                                                }}
                                            >
                                                <img src="./icons/call.png"/>
                                            </button>
                                            <button>
                                                <img src="./icons/send_waps.png"/>
                                            </button>
                                        </div> */}
                                    </div>
                                ))
                            }

                            <p style={{fontWeight:'600'}}>Contactos secundarios</p>
                            {
                                phones_secondaries.map((phone,index)=>(
                                    <div key={index} className="Ggestion__contact">
                                        <div className="Ggestion__contactSecond">
                                            <p>{phone.parentesco}</p>
                                            <p>{phone.nro} ({phone.efec})</p>
                                        </div> 
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <CardCall
                        phone={phone_actual}
                        channel={localStorage.getItem('extension')}
                        id_campain={id_campain}
                        id_credit={info_credit.id}
                        change={changeNro}
                        setCancel={setCancel}
                        addCall={add_id_call}
                        addStates={add_state_call}
                    />
                    
                </div>
            </div>

            <div className="Ggestion__regist">
                <div className="Ggestion__principal">
                    <div>
                        <div className="Ggestion__principalHead">
                            <h3 className="Ggestion__title">Gestión ({message_state})</h3>
                            {/* En este botón se hace verificación de estados de llamadas para guardar en bandeja de "EN PROCESO" */}

                            <button
                                className="Ggestion__buttons--blank"
                                onClick={(e)=>{

                                    let count=0;

                                    if(states.length>0){
                                        states.map((state)=>{
                                            if(state==='CONTACTADO'){
                                                count++;
                                            }
                                        });
    
                                        if(count===0){
                                            console.log("Se hicieron llamadas y todas fueron no CONTACTADO");

                                            const data={
                                                id_campain:data_gestion.id_campain,
                                                id_credit:data_gestion.id_credit
                                            };

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
                                                    if(data.status===200){
                                                        console.log(data)
                                                        setNext(index);
                                                    }
                                                });
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

                        <div className="Ggestion__form">
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
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                date_promise:e.target.value
                                            });
                                        }}
                                        value={data_gestion.data_promise}
                                        type="date" 
                                        placeholder="STEVEN RAFAEL CESEN"
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
                        </div>
                    </div>
                </div>

                <div className="Ggestion__buttons">
                    <button
                        className="Ggestion__buttons--save"
                        onClick={(e)=>{

                            e.target.textContent="Guardando...";

                            if(data_gestion.date_promise==='' | data_gestion.substate_gestion===''){
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
                                data_send.id_call=data_send.id_calls_extras[data_send.id_calls_extras.length-1];
                                data_send.id_calls_extras=JSON.stringify(data_send.id_calls_extras);

                                if(data_gestion.observation===''){
                                    data_send.observation='.';
                                }

                                console.log(`URL: https://sefil.softsen.space/public/api/managments`)
                                console.log(data_send);
                                setMessage('Gestionado');

                                // fetch(`${import.meta.env.VITE_URL_BASE}/public/api/managments`,{
                                //     method:'POST',
                                //     headers: {
                                //         Accept: 'application/json',
                                //         Authorization: `Bearer ${localStorage.getItem('token')}`
                                //     },
                                //     body:new URLSearchParams(data_send)
                                // })
                                //     .then((response) => response.json())  
                                //     .then((data) => {
                                //         if(data.status===200){
                                //             addNotification({
                                //                 title: 'Éxito',
                                //                 subtitle: 'Gestión guardada correctamente',
                                //                 message: '',
                                //                 native: false,
                                //                 backgroundTop: '#009793',
                                //                 backgroundBottom: '#459d9a',
                                //                 colorTop: 'white',
                                //                 colorBottom: 'white',
                                //                 closeButton: 'Cerrar',
                                //                 duration:3000,
                                //             });
                                //             //setNext(index);

                                //             setDataGestion({
                                //                 id_campain:id_campain,
                                //                 id_call:'',
                                //                 id_calls_extras:[],
                                //                 id_credit:currently.id,
                                //                 state_gestion:'',
                                //                 substate_gestion:'',
                                //                 date_promise:'',
                                //                 observation:'',
                                //                 byUser:'',
                                //                 fecha:'',
                                //                 client_name:currently.name
                                //             });

                                //             e.target.textContent="Guardado";
                                //         }else{
                                //             e.target.textContent="Error, inténtalo de nuevo";
                                //         }
                                //     });
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
                                fetch(`${import.meta.env.VITE_URL_BASE}/api/vouchers/group/${info_credit.id}?cartera=${info_credit.cartera}`,{
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        console.log(data)
                                        setPagos(data);
                                    });
                                setTray('Pagos');
                            }}
                        >Pagos</button>
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
                                <>
                                    <label>Fecha pago</label>
                                    <label>Tipo de pago</label>
                                    <label>Monto</label>
                                </>
                        }
                    </div>

                    {
                        (historial.length>0 & tray==='Historial')
                        ?   
                            historial.map((item,index)=>(
                                <div key={index} className="Ggestion__historialItem">
                                    <label>{item.fecha}</label>
                                    <label>{item.client_name}</label>
                                    <label>{item.state_gestion}</label>
                                    <label>{item.date_promise}</label>
                                    <label>{item.observation}</label>
                                    <label>{item.byUser}</label>
                                </div>
                            ))
                        :   
                            (tray==='Pagos' & pagos.length>0)
                            ?
                                pagos.map((item,index)=>(
                                    <div key={index} className="Ggestion__historialItem">
                                        <label>{item.fecha}</label>
                                        <label>{item.forma_pago}</label>
                                        <label>{useFormatterNumber({value:item.valor_recibido,currency:'USD'})}</label>
                                    </div>
                                ))
                            :   
                                <div className="Ggestion__historialItem">
                                    <label>Sin pagos</label>
                                </div>
                    }
                    
                </div>
            </div>    
        </div>
    );
}