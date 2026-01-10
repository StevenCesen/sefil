import { Mail, User, ChevronDown, ChevronUp, MessageSquareText } from "lucide-react";
import sendpush from "../../../helpers/sendpush";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./CardClient.css";
import { useStoreEmail } from "../../../stores/useStoreEmail";
import ClickToCopy from "../../../helpers/ClickToCopy";
import { useState } from "react";
import getContacts from "../../../helpers/Contacts/getContacts";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";
import { useStoreSMS } from "../../../stores/useStoreSMS";

export default function CardClient({id,credit_id,name,email,ci,sector_economico,days_past_due,type,total_amount,actions,showContactsButton}){

    const store_management=useStoreManagement();
    const store_email=useStoreEmail();
    const store_call=useStoreProgressCall();
    const store_sms=useStoreSMS();
    const [showContacts, setShowContacts] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCopy=({text})=>{
        const copy=ClickToCopy({text});
    }

    const handleToggleContacts = async (e) => {
        e.stopPropagation();
        if (!showContacts && contacts.length === 0) {
            setLoading(true);
            try {
                const response = await getContacts(ci);
                if (response && response.result && response.result.data) {
                    setContacts(response.result.data);
                }
            } catch (error) {
                sendpush({
                    title: 'Error',
                    message: 'No se pudieron cargar los contactos',
                    type: 'Push--error',
                    timeout: 3000
                });
            } finally {
                setLoading(false);
            }
        }
        setShowContacts(!showContacts);
    };

    return(
        <div className={`CardClient--wrapper ${showContacts ? 'contacts-open' : ''}`}>
        <div
            onClick={()=>{
                store_management.setClient({
                    client_name:name,
                    client_ci:ci,
                    client_type:type,
                    credit_id,
                    client_id:id
                });

                store_management.setPhones({
                    client_id:id
                });
                    
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
                {
                    (actions)
                    ?
                        <>
                            <button onClick={()=>{
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
                        </>
                    :   <></>
                }
                {
                    (showContactsButton)
                    ?
                        <button
                            onClick={handleToggleContacts}
                            title='Ver todos los contactos'
                            className="CardClient__toggle-btn"
                        >
                            {loading ? '...' : (showContacts ? <ChevronUp size={18}/> : <ChevronDown size={18}/>)}
                        </button>
                    :   <></>
                }
            </div>
        </div>

        {showContacts && (
            <div className="CardClient__contacts-list">
                {contacts.length > 0 ? (
                    contacts.map((contact) => (
                        <div key={contact.id} className="CardClient__contact-item">
                            <div className="CardClient__contact-info">
                                {
                                    console.log(contact)
                                }
                                <p className={`CardClient__contact-phone ${contact.is_external ? 'CardClient__contact-phone--EXTERNAL' : ''}`}>{contact.phone_number}</p>
                                <span className="CardClient__contact-type">{contact.phone_type}</span>
                                <span className={`CardClient__contact-status ${contact.phone_status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                                    {contact.phone_status}
                                </span>
                            </div>
                            <div className="CardClient__contact-actions">
                                <button
                                    title="Enviar SMS a este contacto"
                                    onClick={()=>{
                                        if(contact.phone_number.length==10){
                                            store_sms.setContact({
                                                phone_number: contact.phone_number,
                                                name,
                                                ci,
                                                type,
                                                view:true,
                                                total_amount,
                                                days_past_due,
                                                campain_id:store_call.campain_id,
                                                credit_id:store_call.credit_id,
                                                client_id:id
                                            });
                                        }else{
                                            sendpush({
                                                title:'Número incorrecto para SMS',
                                                message:'Número no soporta SMS',
                                                type:'Push--danger',
                                                timeout:3000
                                            });
                                        }
                                    }}
                                >
                                    <MessageSquareText size={16}/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="CardClient__contacts-empty">No hay contactos adicionales</p>
                )}
            </div>
        )}
        </div>
    );
}
