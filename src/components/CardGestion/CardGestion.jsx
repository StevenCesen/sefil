import { useContext, useEffect, useRef, useState } from "react";
import "./CardGestion.css"
import CardCall from "../CardCall/CardCall";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useClickToCopy from "../../hooks/useClickToCopy";
import MyMapComponent from "../Map/Map";
import useVerifyCondonation from "../../hooks/useVerifyCondonation";
import CardCondonacion from "../CardCondonacion/CardCondonacion";
import { PDFViewer } from "@react-pdf/renderer";
import PDFcondonacion from "../PDFcondonacion";
import CardStructure from "../CardStructure/CardStructure";
import useVerifyStruct from "../../hooks/useVerifyRestruct";
import CardViewConvenio from "../CardViewConvenio/CardViewConvenio";
import CardSendMail from "../CardSendMail/CardSendMail";
import CardSendSMS from "../CardSendSMS/CardSendSMS";
import sendpush from "../../helpers/sendpush";

const render = (status) => {
    return <p>{status}</p>;
};

export default function CardGestion({currently,total,index,setNext,id_campain,setCancel,setStatusGestion,state_gestion,structure,updateTrays,number,alert,bandeja}){
    
    const [call,setCall]=useState(false);
    const [credit,setCredit]=useState(); //Información netamente de la persona actual
    const [contacts,setContacts]=useState(); //Información de garantes
    const [info_credit,setInfo]=useState(); //Información del crédito

    const [data_gestion,setDataGestion]=useState(); //ESTE SE DEBE ANULAR

    // Información adicional del crédito
    const [historial,setHistorial]=useState();
    const [pagos,setPagos]=useState();
    const [direcciones,setDirecciones]=useState();
    const [phone_actual,setPhone]=useState();
    const [data_phones,setPhones]=useState();
    const [states,setStates]=useState();
    const [view_condonation,setViewCondonation]=useState(true);
    const [viewPDFCondonation,setPDFcondonation]=useState(false);
    const [value_condonacion,setData]=useState([]);
    const [view_reestructurar,setReestructurar]=useState(true);

    //  Para seleccionar la plantilla que se va a usar
    const [template,setTemplate]=useState();

    //  Para selecccionar la bandeja de créditos
    const [tray,setTray]=useState();

    const [message_state,setMessage]=useState();
    const [incall,setIncall]=useState();
    const [gasto_cobranza,setGasto]=useState(0);

    const [new_phone,setNumber]=useState();
    const [view_new_phone,setViewNewPhone]=useState();
    const [total_tray,setTotalTray]=useState();

    const form=useRef();
    const ref_titular=useRef();
    const [view_convenio,setViewConvenio]=useState();
    const [convenio_data,setConvenioData]=useState();
    const [view_sendmail,setViewSendmail]=useState();
    const [view_sendsms,setViewSendsms]=useState();

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

        let extras=[];

        if(Array.isArray(data_gestion.id_calls_extras)){
            extras=data_gestion.id_calls_extras;
        }else{
            extras=JSON.parse(data_gestion.id_calls_extras);
        }

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

        if(incall===false){
            setPhone({
                nro:(phones.length) ? phones[0].nro : 0,
                index:0
            });
        }

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
        setViewSendmail(false);
        setViewSendsms(false);

        let cuota_mensual=0, total_pendiente=0, fecha_pago="";

        // Seleccionamos el historial de gestiones del crédito actual
        fetch(`${import.meta.env.VITE_URL_BASE}/managments?id_credit=${currently.id_credito}&cartera=${currently.cartera}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setHistorial(data.data.data);
            });

        if((currently.cartera==='SEFIL_1' | currently.cartera==='SEFIL_2')){
            if(currently.collectionState!=="Convenio de pago"){
                fetch(`${import.meta.env.VITE_URL_BASE}/genGastos?cartera=${currently.cartera}&credito=${currently.id_credito}`,{
                    method:'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                })
                    .then((response) => response.json())  
                    .then((data) => {
                        setGasto(data.gastos);
                    });
            }

            setInfo({
                id:currently.id_credito,
                name:currently.name,
                ci:currently.ci,
                monthlyFeeAmount:(currently.collectionState==='Convenio de pago') ? cuota_mensual : currently.monthlyFeeAmount,
                dias_vencidos:currently.dias_vencidos,
                paymentDate:(currently.collectionState==='Convenio de pago') ? fecha_pago : currently.paymentDate,
                pendingFees:currently.pendingFees,
                paidFees:currently.paidFees,
                collectionState:currently.collectionState,
                totalAmount:(currently.collectionState==='Convenio de pago') ? currently.totalAmount: currently.totalAmount,
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

        }else if((currently.cartera==='SEFIL_1' | currently.cartera==='SEFIL_2')){
            setGasto(0);
            setConvenioData([]);

            fetch(`${import.meta.env.VITE_URL_BASE}/credit/viewconvenio?credito=${currently.id_credito}&cartera=${currently.cartera}`,{
                method:'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setConvenioData(data[0]);
                    
                    let flag=true;

                    JSON.parse(data.data[0].detail).map((cuota,n)=>{
                        if(cuota.estado==='PENDIENTE' & flag & n>0){
                            cuota_mensual+=Number(cuota.valor);
                            total_pendiente+=Number(cuota.valor);
                            fecha_pago=cuota.fecha_pago;
                            flag=false;
                        }else if(cuota.estado==='PENDIENTE' & flag){
                            cuota_mensual+=Number(cuota.valor);
                            total_pendiente+=Number(cuota.valor);
                            fecha_pago=cuota.fecha_pago;
                        }
                    });

                    setInfo({
                        id:currently.id_credito,
                        name:currently.name,
                        ci:currently.ci,
                        monthlyFeeAmount:(currently.collectionState==='Convenio de pago') ? cuota_mensual : currently.monthlyFeeAmount,
                        dias_vencidos:currently.dias_vencidos,
                        paymentDate:(currently.collectionState==='Convenio de pago') ? fecha_pago : currently.paymentDate,
                        pendingFees:currently.pendingFees,
                        paidFees:currently.paidFees,
                        collectionState:currently.collectionState,
                        totalAmount:(currently.collectionState==='Convenio de pago') ? currently.totalAmount : currently.totalAmount,
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

                });
        }else{
            setGasto(0);
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
        }
        
        setCall(false);
        setViewNewPhone(false);
        setNumber("");
        setIncall(false);
        setCredit(currently);
        setPagos([]);
        setDirecciones([]);
        setTray('Historial');

        //  ASOCIAR ESTE MENSAJE DE ACUERDO A LA ULTIMA GESTIÓN DEL DÍA
        setMessage('No gestionado aún');

        localStorage.setItem('cartera',currently.cartera);
        localStorage.setItem('id_credito',currently.id_credito);
        localStorage.setItem('dias_vencidos',currently.dias_vencidos);
        localStorage.setItem('client_ci',currently.ci);
        localStorage.setItem('state_gestion','');
        localStorage.setItem('substate_gestion','');
        localStorage.setItem('date_promise','');
        localStorage.setItem('client_name',currently.name);
        localStorage.setItem('observation',currently.name);

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

        if(localStorage.getItem('rol')==='call'){
            
            temp=JSON.parse(structure[2]);

            setTemplate({
                states:temp.default[1].options,
                substates:temp.default[2].suboptions
            });

        }else if(localStorage.getItem('rol')==='super' | localStorage.getItem('rol')==='administrador'){
            
            if(currently.dias_vencidos>=91){
                temp=JSON.parse(structure[1]);
            }else{
                temp=JSON.parse(structure[2]);
            }
            
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
            id_campain:id_campain.split('/')[0],
            id_call:'', //Llamada con gestión
            id_calls_extras:[],
            id_credit:currently.id_credito,
            state_gestion:'',
            substate_gestion:'',
            date_promise:"",
            observation:'',
            byUser:'',
            fecha:'',
            client_name:currently.name,
            client_ci:currently.ci,
            type:currently.tipo,
            dias_vencidos:currently.dias_vencidos,
            cartera:currently.cartera,
            monto:currently.totalAmount,
            monto_pagar:0.00,
            nro_notificacion:""
        });

        console.log(currently);

        setTotalTray(total);

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
                    <div ref={ref_titular} className={`DetailCredit__body DetailCredit__body--focus ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Castigado' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnCo" : ""}`}>
                        <h3
                            onClick={(e)=>{
                                useClickToCopy(e.target.textContent);

                                if(incall===false){

                                    setCredit(currently);
                                    setDataGestion({
                                        ...data_gestion,
                                        client_name:currently.name,
                                        client_ci:currently.ci,
                                        type:currently.tipo,
                                    });

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

                                                    console.log(currently)

                                                    setDataGestion({
                                                        ...data_gestion,
                                                        client_name:garante.name,
                                                        client_ci:garante.ci,
                                                        type:garante.tipo,
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
                            <p><strong>Cuotas pendientes: </strong>{currently.pendingFees}</p>
                            {
                                (localStorage.getItem('rol')==="campo" | localStorage.getItem('rol')==='administrador')
                                ?
                                    <>
                                        <p><strong>Cuotas pagadas: </strong>{currently.paidFees}</p>
                                        <p><strong>Cuotas totales: </strong>{currently.totalFees}</p>
                                        <p><strong>Capital:</strong> $ {info_credit.capital}</p>
                                        <p><strong>Interés:</strong> $ {info_credit.interes}</p>
                                        <p><strong>Mora: </strong> $ {info_credit.mora}</p>
                                        <p><strong>Seguro desgravamen:</strong> $ {info_credit.seguro}</p>
                                        <p><strong>Gastos judiciales:</strong> $ {info_credit.judicial}</p>
                                        <p><strong>Gastos de cobranza:</strong> $ {info_credit.gastos}</p>
                                        <p><strong>Gastos de cobranza SEFIL: </strong> {useFormatterNumber({value:gasto_cobranza,currency:'USD'})}</p>
                                        <p><strong>Otros valores:</strong> $ {info_credit.otros}</p>
                                        <p><strong>Valor cuota:</strong> $ {info_credit.monthlyFeeAmount}</p>
                                    </>
                                :   <></>
                            }
                        </div>

                        <div className="DetailCredit__info">
                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Días de mora</label>
                                <p>{info_credit.dias_vencidos}</p>
                            </div>

                            {
                                (currently.cartera!=='syncs')
                                ?
                                    <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                        <label>Último pago</label>
                                        <p>{info_credit.paymentDate.split(' ')[0]}</p>
                                    </div>
                                :   
                                    <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                        <label>Fecha de pago</label>
                                        <p>{info_credit.paymentDate}</p>
                                    </div>
                            }

                            {/* <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Monto total</label>
                                <p>{useFormatterNumber({value:(Number(info_credit.totalAmount)+((gasto_cobranza>0) ? gasto_cobranza : 0)),currency:'USD'})}</p>
                            </div> */}

                            <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                <label>Total pendiente</label>
                                <p>{
                                    (currently.cartera=="syncs")
                                    ?
                                        useFormatterNumber({value:(info_credit.collectionState==='Vigente') 
                                            ? Number(info_credit.monthlyFeeAmount) 
                                            : Number(info_credit.totalAmount) ,currency:'USD'})
                                    :   
                                        useFormatterNumber({value:(info_credit.collectionState==='Vigente') 
                                            ?   (Number(info_credit.totalAmount)+Number(gasto_cobranza))
                                            :   (Number(info_credit.totalAmount)+Number(gasto_cobranza))
                                        ,currency:'USD'})
                                    }
                                </p>
                            </div>

                            {
                                (currently.cartera=="syncs")
                                ?
                                    <>
                                        
                                        {
                                            (currently.oferta!=="")
                                            ?
                                                <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                                    <label>Oferta pago</label>
                                                    <p>{currently.oferta}</p>
                                                </div>
                                            :   <></>
                                        }

                                        {
                                            (currently.compromiso!=="")
                                            ?
                                                <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                                    <label>Compromiso</label>
                                                    <p>{currently.compromiso}</p>
                                                </div>
                                            :   <></>
                                        }

                                        {
                                            (currently.notificacion!=="")
                                            ?
                                                <div className={`${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' |info_credit.collectionState==='VENCIDO TOTAL') ? "DetailCredit__footer--warnTm DetailCredit__footer--warnCo" : ""}`}>
                                                    <label>Notificación extrajudicial</label>
                                                    <p>{currently.notificacion}</p>
                                                </div>
                                            :   <></>
                                        }

                                    </>
                                :   <></>
                            }

                        </div>
                    </div>

                    <div className={`DetailCredit__footer ${(info_credit.collectionState==='Cartera Vendida' | info_credit.collectionState==='Vencido' | info_credit.collectionState==='Castigado' | info_credit.collectionState==='VENCIDO TOTAL') ? 'DetailCredit__footer--warn' : "DetailCredit__footer--success"}`}>
                        <p>AG. {info_credit.agency}</p>
                        <p>{info_credit.collectionState} | {currently.frecuencia}</p>
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

                                            fetch(`${import.meta.env.VITE_URL_BASE}/contacts`,{
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

                                                    if(incall===false){
                                                        setPhone({
                                                            nro:phone.nro,
                                                            index:index
                                                        });
                                                    }else{
                                                        sendpush({
                                                            title:'ERR: Llamada en progreso.',
                                                            message:'Por favor, termine la llamada para marcar a otro número.',
                                                            type:'Push--danger',
                                                            timeout:3000
                                                        });
                                                    }
                                                
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
                        </div>
                    </div>

                    {
                        (bandeja!=='inactive')
                        ?
                            <CardCall
                                phone={phone_actual}
                                channel={localStorage.getItem('extension')}
                                id_campain={id_campain.split('/')[0]}
                                id_credit={info_credit.id}
                                cartera={data_gestion.cartera}
                                change={changeNro}
                                setCancel={setCancel}
                                addCall={add_id_call}
                                addStates={add_state_call}
                                setInit={setIncall}
                            />
                        :   <></>
                    }
                    
                </div>
            </div>

            <div className="Ggestion__regist">
                <div className="Ggestion__principal">
                    <div>
                        <div className="Ggestion__principalHead">
                            <div>
                                <h3 className="Ggestion__title">Gestión ({message_state})</h3>
                                <p>Quedan ({total_tray})</p>
                            </div>
                            
                            {/* En este botón se hace verificación de estados de llamadas para guardar en bandeja de "EN PROCESO" */}

                            <button
                                className="Ggestion__buttons--blank"
                                onClick={(e)=>{

                                    let count=0;
                                    
                                    form.current.reset();
                                
                                    if(incall){
                                        sendpush({
                                            title:'ERR: Llamada en progreso.',
                                            message:'Por favor, termine la llamada para marcar a otro número.',
                                            type:'Push--danger',
                                            timeout:3000
                                        });

                                        e.target.textContent="Seguir";

                                    }else if(states.length>0){
                                        states.map((state)=>{
                                            if(state==='CONTACTADO'){
                                                count++;
                                            }
                                        });
    
                                        if(count===0){
                                            const data={
                                                id_campain:id_campain.split('/')[0],
                                                id_credit:data_gestion.id_credit,
                                                cartera:data_gestion.cartera
                                            };

                                            e.target.textContent="Espere...";

                                            if(data.id_campain!==undefined & data.id_credit!==undefined & data.cartera!==undefined){
                                                fetch(`${import.meta.env.VITE_URL_BASE}/trays`,{
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
                                                setTotalTray(total-1);
                                            }else{
                                                
                                                sendpush({
                                                    title:'Gestión en curso.',
                                                    message:'Se ha realizado una llamada con estado CONTACTADO y no se ha guardado gestión.',
                                                    type:'Push--sucessful',
                                                    timeout:3000
                                                });
                                            }
                                        }
                                        
                                    }else{
                                        setNext(index);
                                    }

                                    let elements=document.getElementsByClassName('DetailCredit__body--focus');
                                        elements=[].slice.call(elements);

                                    elements.map((ele)=>{
                                        ele.classList.remove('DetailCredit__body--focus');
                                    });

                                    ref_titular.current.classList.add('DetailCredit__body--focus');
                                }}
                            >
                                Seguir
                            </button>
                        </div>

                        <form ref={form} className="Ggestion__form">
                            <div className="Ggestion__threeGroup">

                                <label className="Ggestion__input">
                                    Nombre del contacto
                                    <input 
                                        type="text" 
                                        placeholder="NOMBRE DEL CLIENTE"
                                        value={data_gestion.client_name}
                                    />
                                </label>

                                <label className="Ggestion__select">
                                    Estado
                                    <select 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                state_gestion:e.target.value
                                            });
                                        }}
                                        value={data_gestion.state_gestion}
                                    >
                                        <option>-- Seleccionar estado --</option>
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
                                            });
                                        }} 
                                        value={data_gestion.substate_gestion}
                                    >
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
                                    Fecha de oferta / compromiso
                    
                                    <input
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                date_promise:e.target.value
                                            });
                                        }}
                                        value={data_gestion.date_promise}
                                        type="date" 
                                    />
                                    {
                                        (data_gestion.substate_gestion==='COMPROMISO DE PAGO')
                                        ?   
                                            <label className="Ggestion__input" style={{width:"150px",display:'inline-flex',marginTop:"10px"}}>
                                                Nro. notificación
                                                <input 
                                                    value={data_gestion.nro_notificacion} 
                                                    type="text" 
                                                    placeholder="00XXX"
                                                    onChange={(e)=>{
                                                        setDataGestion({
                                                            ...data_gestion,
                                                            nro_notificacion:e.target.value
                                                        });
                                                    }}
                                                />
                                            </label>
                                        :   <></>
                                    }
                                </label>

                                <label className="Ggestion__input">
                                    Monto a pagar
                                    <div className="Ggestion__inputNumber">
                                        <input 
                                            type="number" 
                                            value={data_gestion.monto_pagar} 
                                            step={0.01}
                                            onChange={(e)=>{
                                                setDataGestion({
                                                    ...data_gestion,
                                                    monto_pagar: e.target.value
                                                });
                                            }}
                                        />

                                        <label>
                                            <input 
                                                type="checkbox"
                                                onChange={(e)=>{
                                                    if(e.target.checked){

                                                        setDataGestion({
                                                            ...data_gestion,
                                                            monto_pagar: (info_credit.collectionState==='Vigente') ? info_credit.monthlyFeeAmount : info_credit.totalAmount
                                                        });

                                                    }else{
                                                        setDataGestion({
                                                            ...data_gestion,
                                                            monto_pagar:0
                                                        });
                                                    }
                                                }}
                                            />
                                            Total
                                        </label>
                                    </div>
                                </label>

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
                    {
                        ((localStorage.getItem('permission').split(',').includes("convenio:set") | localStorage.getItem('permission').split(',').includes("condonar:set")) & bandeja!=='inactive')
                        ?
                            <div className="Ggestion__principalActions">
                                <h3>Acciones</h3>
                                
                                {
                                    (localStorage.getItem('permission').split(',').includes("condonar:set"))
                                    ?
                                        <button 
                                            title="Solicitar condonación"
                                            onClick={async (e)=>{
                                                if(await useVerifyCondonation(currently.id)){
                                                    setViewCondonation(!view_condonation);
                                                }else{
                                                
                                                    sendpush({
                                                        title:'ERR: Condonación existente.',
                                                        message:'No se puede, ya se ha registrado una condonación.',
                                                        type:'Push--danger',
                                                        timeout:3000
                                                    });

                                                    clean;
                                                }
                                            }}
                                        >Condonar</button>
                                    :   <></>
                                }
                                {
                                    (localStorage.getItem('permission').split(',').includes("convenio:set"))
                                    ?
                                        <button
                                            title="Solicitar Convenio de Pago"
                                            onClick={async (e)=>{
                                                if(await useVerifyStruct(currently.id)){
                                                    setReestructurar(!view_reestructurar);
                                                }else{
                                                    sendpush({
                                                        title:'ERR: Convenio existente.',
                                                        message:'No se puede, hay un convenio ya creado.',
                                                        type:'Push--danger',
                                                        timeout:3000
                                                    });
                                                }
                                            }}
                                        >Convenio</button>
                                    :   <></>
                                }
                                {
                                    (info_credit.collectionState==='Convenio de pago')
                                    ?   <button
                                            onClick={async (e)=>{

                                                const request= await fetch(`${import.meta.env.VITE_URL_BASE}/credit/viewconvenio?credito=${info_credit.id}&cartera=${data_gestion.cartera}`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                });
                                                
                                                const response=await request.json();
                                                setViewConvenio(true);
                                                setConvenioData(response.data[0]);
                                            }}
                                        >Ver convenio</button>
                                    :   <></>
                                }
                                <button
                                    onClick={async (e)=>{
                                        setViewSendmail(true);
                                    }}
                                >Enviar correo</button>
                                <button
                                    onClick={async (e)=>{
                                        setViewSendsms(true);
                                    }}
                                >Enviar SMS</button>
                            </div>
                        :   <></>
                    }
                </div>

                {
                    (bandeja!=='inactive')
                    ?
                        <div className="Ggestion__buttons">
                            <button
                                className="Ggestion__buttons--save"
                                onClick={(e)=>{

                                    e.target.textContent="Guardando...";
                                
                                    if((data_gestion.date_promise==='' & data_gestion.substate_gestion=='COMPROMISO DE PAGO') | data_gestion.substate_gestion===''){
                                        e.target.textContent="Intentar de nuevo";

                                        sendpush({
                                            title:'ERR: Datos imcompletos.',
                                            message:'Por favor, llene todos los datos de la gestión.',
                                            type:'Push--danger',
                                            timeout:5000
                                        });

                                    }else{

                                        if(incall===false){

                                            if(data_gestion.substate_gestion=='COMPROMISO DE PAGO' & data_gestion.nro_notificacion===""){

                                                sendpush({
                                                    title:'ERR: NRO Notificación.',
                                                    message:'Por favor, ingrese un NRO DE NOTIFICACIÓN para el COMPROMISO DE PAGO, caso contrario, seleccione OFERTA DE PAGO.',
                                                    type:'Push--danger',
                                                    timeout:5000
                                                });

                                                e.target.textContent="Guardar";

                                            }else{
                                                setStatusGestion(true);
                                                const data_send=data_gestion;

                                                if(Array.isArray(data_send.id_calls_extras)){
                                                    if(data_send.id_calls_extras.length>0){
                                                        data_send.id_call=data_send.id_calls_extras[data_send.id_calls_extras.length-1];
                                                    }else{
                                                        data_send.id_call=0;
                                                    }
                                                }else{
                                                    data_send.id_calls_extras=JSON.parse(data_send.id_calls_extras);
                                                    data_send.id_call=data_send.id_calls_extras[data_send.id_calls_extras.length-1];
                                                }

                                                data_send.id_calls_extras=JSON.stringify(data_send.id_calls_extras);
                                                data_send.cartera=localStorage.getItem('cartera');
                                                
                                                fetch(`${import.meta.env.VITE_URL_BASE}/managments`,{
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

                                                            sendpush({
                                                                title:'Éxito.',
                                                                message:'Gestión guardada correctamente.',
                                                                type:'Push--sucessful',
                                                                timeout:3000
                                                            });

                                                            updateTrays(data.data,'processed');

                                                            let elements=document.getElementsByClassName('DetailCredit__body--focus');
                                                            elements=[].slice.call(elements);

                                                            elements.map((ele)=>{
                                                                ele.classList.remove('DetailCredit__body--focus');
                                                            });

                                                            form.current.reset();

                                                            setDataGestion({
                                                                id_campain:id_campain.split('/')[0],
                                                                id_call:'',
                                                                id_calls_extras:[],
                                                                id_credit:currently.id_credito,
                                                                state_gestion:'',
                                                                substate_gestion:'',
                                                                date_promise:'',
                                                                observation:'',
                                                                byUser:'',
                                                                fecha:'',
                                                                client_name:currently.name,
                                                                cartera:currently.cartera
                                                            });

                                                            setStates([]);

                                                            e.target.textContent="Guardar";
                                                        }else{
                                                            e.target.textContent="Error, inténtalo de nuevo";
                                                        }
                                                    });
                                            }

                                        }else{

                                            sendpush({
                                                title:'ERR: llamada en progreso',
                                                message:'Por favor, termine la llamada o espere que se guarde para registrar gestión.',
                                                type:'Push--warning',
                                                timeout:3000
                                            });

                                            e.target.textContent="Guardar";
                                        }
                                    }
                                }}
                            >Guardar</button>
                        </div>
                    :   <></>
                }

                <div className="Ggestion__historial">
                    <div>

                        <button
                            onClick={(e)=>{
                                setTray('Historial');
                            }}
                        >Historial</button>

                        {
                            (localStorage.getItem('rol')==='campo' | localStorage.getItem('rol')==='administrador' | localStorage.getItem('rol')==='super')
                            ?
                                <>
                                    <button
                                        onClick={(e)=>{
                                            fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/group/${info_credit.id}?cartera=${info_credit.cartera}`,{
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
                                </>
                            :   <></>
                        }

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
                                            <label>{useFormatterNumber({value:Number(item.valor_recibido.replace(',','.')),currency:'USD'})}</label>
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
                        id={currently.id_credito}
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
                (view_convenio) 
                ?
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setViewConvenio(false)}}>Volver</button>
                        <CardViewConvenio
                            restruct={convenio_data}
                        />
                    </div>
                :   <></>
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
                        id={currently.id_credito}
                        cartera={currently.cartera}
                        cobranza={gasto_cobranza}
                        status_cobranza={'no'}
                    />
            }

            {
                (view_sendmail)
                ?   
                    <CardSendMail
                        clients={currently.contactos}
                        days_past_due={currently.dias_vencidos}
                        total_amount={currently.totalAmount}
                    />
                :   <></>
            }

            {
                (view_sendsms)
                ?   
                    <CardSendSMS
                        clients={currently.contactos}
                        days_past_due={currently.dias_vencidos}
                        total_amount={currently.totalAmount}
                    />
                :   <></>
            }

        </div>
    );
}