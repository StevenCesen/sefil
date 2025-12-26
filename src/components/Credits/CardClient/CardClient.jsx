import { Mail, PiggyBank, User, Phone, ChevronDown, ChevronUp } from "lucide-react";
import sendpush from "../../../helpers/sendpush";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./CardClient.css";
import { useStoreEmail } from "../../../stores/useStoreEmail";
import ClickToCopy from "../../../helpers/ClickToCopy";
import { useState, useEffect } from "react";

export default function CardClient({credit_id,name,email,ci,sector_economico,days_past_due,type,total_amount,actions,view_contacts=false}){

    const store_management=useStoreManagement();
    const store_email=useStoreEmail();
    const [showContacts, setShowContacts] = useState(false);

    useEffect(() => {
        if (store_management.client_ci !== ci) {
            setShowContacts(false);
        }
    }, [store_management.client_ci, ci]);

    useEffect(() => {
        if (showContacts && store_management.client_ci === ci && view_contacts) {
            const loadPhones = async () => {
                await store_management.setPhones({
                    credit_id: credit_id,
                    identification: ci
                });
            };
            loadPhones();
        }
    }, [showContacts]);
    
    const handleCopy=({text})=>{
        const copy=ClickToCopy({text});
    }
    
    return(
        <div className={`CardClient__wrapper ${showContacts && view_contacts && store_management.client_ci === ci ? 'CardClient__wrapper--expanded' : ''}`}>
            <div
                onClick={()=>{
                    store_management.setClient({
                        client_name:name,
                        client_ci:ci,
                        client_type:type,
                        credit_id
                    });

                    if(!view_contacts){
                        store_management.setPhones({
                            credit_id:credit_id,
                            identification:ci
                        });
                    }

                    sendpush({
                        title:'Estado',
                        message:'Se seleccionó un cliente',
                        type:'Push--sucessful',
                        timeout:1000
                    });
                }}
                className={`CardClient ${(store_management.client_ci==ci) ? "CardClient--active" : ""}`}
            >
                <label>
                    <User/>
                </label>
                <div>
                    <h3 onClick={()=>{handleCopy({text:name})}}>{name}</h3>
                    <span onClick={()=>{handleCopy({text:ci})}}>Cédula: {ci}</span>
                </div>
                <div>
                    <span className="CardClient__sector">Sector económico: {sector_economico}</span>
                    <span className={`${(type==='TITULAR') ? 'CardClient--titular' : 'CardClient--garante'}`} onClick={()=>{handleCopy({text:`${name} | ${type} ${ci}`})}}>{type}</span>
                    <div className="CardClient__actions">
                        {
                            (actions)
                            ?
                                <button onClick={(e)=>{
                                    e.stopPropagation();
                                    store_email.setContact({
                                        name,
                                        type,
                                        view:true,
                                        days_past_due,
                                        total_amount,
                                        email
                                    });

                                    }} title='Enviar correo electrónico a este cliente'>
                                    <Mail size={18}/>
                                </button>
                            :   <></>
                        }
                        {
                            (view_contacts && store_management.client_ci === ci)
                            ?
                                <button
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        setShowContacts(!showContacts);
                                    }}
                                    title='Ver contactos'
                                    className="CardClient__contacts-toggle"
                                >
                                    {showContacts ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                </button>
                            :   <></>
                        }
                    </div>
                </div>
            </div>

            {
                (view_contacts && showContacts && store_management.client_ci === ci)
                ?
                    <div className="CardClient__contacts">
                        <h4><Phone size={16}/> Contactos</h4>
                        {
                            (store_management.phones && Array.isArray(store_management.phones) && store_management.phones.length > 0)
                            ?
                                <ul>
                                    {store_management.phones.map((phone, index) => (
                                        <li key={index} onClick={()=>{handleCopy({text:phone.numero})}}>
                                            <span className="CardClient__phone-number">{phone.numero}</span>
                                        </li>
                                    ))}
                                </ul>
                            : store_management.phones === null
                                ? <p className="CardClient__no-contacts">Cargando contactos...</p>
                                : <p className="CardClient__no-contacts">No hay contactos disponibles</p>
                        }
                    </div>
                :   <></>
            }
        </div>
    );
}
