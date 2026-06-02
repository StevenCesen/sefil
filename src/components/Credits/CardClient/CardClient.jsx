import { Mail, User, ChevronDown, ChevronUp, MessageSquareText } from "lucide-react";
import sendpush from "../../../helpers/sendpush";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./CardClient.css";
import { useStoreEmail } from "../../../stores/useStoreEmail";
import ClickToCopy from "../../../helpers/ClickToCopy";
import { useState } from "react";
import getContacts from "../../../helpers/Contacts/getContacts";
import toggleContactStatus from "../../../helpers/Contacts/toggleContactStatus";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";
import { useStoreSMS } from "../../../stores/useStoreSMS";
import RelationshipTree from "./RelationshipTree";

export default function CardClient({ id, credit_id, name, email, ci, sector_economico, days_past_due, type, total_amount, actions, showContactsButton, relationships = [] }) {

    const store_management = useStoreManagement();
    const store_email = useStoreEmail();
    const store_call = useStoreProgressCall();
    const store_sms = useStoreSMS();
    const [showContacts, setShowContacts] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const role = localStorage.getItem('role');
    const canToggle = ['admin', 'superadmin', 'supervisor'].includes(role);

    // Normaliza contacto independientemente del formato (local o central API)
    const normalizeContact = (c) => ({
        id: c.id,
        phone: c.phone || c.phone_number,
        type: c.type || c.phone_type,
        isActive: c.is_active !== undefined ? c.is_active : c.phone_status === 'ACTIVE',
        source: c.source || null,
        createdBy: c.created_by || null,
        createdSource: c.created_source || null,
        callsEffective: c.calls_effective ?? c.nro_sucessful ?? 0,
        callsNotEffective: c.calls_not_effective ?? c.nro_fails ?? 0,
        callByWweb: c.call_by_wweb ?? false,
    });

    const handleToggleStatus = async (contact) => {
        const newStatus = contact.isActive ? 'INACTIVE' : 'ACTIVE';
        setTogglingId(contact.id);
        try {
            await toggleContactStatus(contact.id, newStatus);
            setContacts(prev => prev.map(c =>
                c.id === contact.id ? { ...c, isActive: !contact.isActive } : c
            ));
            sendpush({
                title: 'Contacto actualizado',
                message: `Número ${newStatus === 'ACTIVE' ? 'activado' : 'inactivado'}`,
                type: 'Push--sucessful',
                timeout: 2000
            });
        } catch {
            sendpush({ title: 'Error', message: 'No se pudo actualizar el contacto', type: 'Push--error', timeout: 3000 });
        } finally {
            setTogglingId(null);
        }
    };

    const handleCopy = ({ text }) => {
        ClickToCopy({ text });
    };

    const handleToggleContacts = async (e) => {
        e.stopPropagation();
        if (!showContacts && contacts.length === 0) {
            setLoading(true);
            try {
                const response = await getContacts(ci);
                if (response && response.result && response.result.data) {
                    const all = response.result.data;
                    const canSeeAll = ['admin', 'superadmin', 'supervisor'].includes(role);
                    setContacts(canSeeAll
                        ? all
                        : all.filter(c => c.created_by === 'FACES' || c.created_source === 'Collecta')
                    );
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

    const hasExtra = showContactsButton && (contacts.length > 0 || relationships.length > 0 || showContacts);

    return (
        <div className={`CardClient--wrapper ${showContacts ? 'contacts-open' : ''}`}>
            <div
                onClick={() => {
                    store_management.setClient({
                        client_name: name,
                        client_ci: ci,
                        client_type: type,
                        credit_id,
                        client_id: id
                    });
                    store_management.setPhones({ client_id: id });
                    sendpush({
                        title: 'Estado',
                        message: 'Se seleccionó un cliente',
                        type: 'Push--sucessful',
                        timeout: 1000
                    });
                }}
                className={`CardClient ${(store_management.client_ci == ci) ? "CardClient--active" : ""}`}
            >
                <label><User /></label>
                <div>
                    <h3 onClick={() => { handleCopy({ text: name }) }}>{name}</h3>
                    <span onClick={() => { handleCopy({ text: ci }) }}>Cédula: {ci}</span>
                </div>
                <div>
                    <span className="CardClient__sector">Sector económico: {sector_economico}</span>
                    <span className={`${(type === 'TITULAR') ? 'CardClient--titular' : 'CardClient--garante'}`} onClick={() => { handleCopy({ text: `${name} | ${type} ${ci}` }) }}>{type}</span>
                    {actions && (
                        <button onClick={() => {
                            store_email.setContact({ name, type, view: true, days_past_due, total_amount, email });
                        }} title='Enviar correo electrónico a este cliente'>
                            <Mail size={18} />
                        </button>
                    )}
                    {showContactsButton && (
                        <button
                            onClick={handleToggleContacts}
                            title='Ver contactos y relaciones'
                            className="CardClient__toggle-btn"
                        >
                            {loading ? '...' : (showContacts ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
                        </button>
                    )}
                </div>
            </div>

            {showContacts && (
                <div className="CardClient__contacts-list">
                    {/* Contactos */}
                    {contacts.length > 0 ? (
                        contacts.map((raw) => {
                            const contact = normalizeContact(raw);
                            return (
                                <div key={contact.id} className="CardClient__contact-item">
                                    <div className="CardClient__contact-info">
                                        <p className={`CardClient__contact-phone ${!contact.isActive ? 'CardClient__contact-phone--INACTIVE' : contact.createdBy === 'FACES' ? 'CardClient__contact-phone--FACES' : ''}`}>
                                            {contact.phone}
                                        </p>
                                        {contact.type && (
                                            <span className="CardClient__contact-type">{contact.type}</span>
                                        )}
                                        {contact.createdSource && (
                                            <span className={`CardClient__contact-source ${contact.createdBy === 'FACES' ? 'CardClient__contact-source--faces' : ''}`}>
                                                {contact.createdSource}
                                            </span>
                                        )}
                                        <span className={`CardClient__contact-status ${contact.isActive ? 'active' : 'inactive'}`}>
                                            {contact.isActive ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                        <span className="CardClient__contact-metrics">
                                            <span className="metric--ok" title="Llamadas efectivas">{contact.callsEffective > 10 ? '+10' : contact.callsEffective}</span>
                                            <span className="metric--fail" title="Llamadas no efectivas">{contact.callsNotEffective > 10 ? '+10' : contact.callsNotEffective}</span>
                                        </span>
                                        {contact.callByWweb && (
                                            <span className="CardClient__contact-wweb" title="Puede llamar por WhatsApp Web">WA</span>
                                        )}
                                    </div>
                                    <div className="CardClient__contact-actions">
                                        {canToggle && (
                                            <button
                                                title={contact.isActive ? 'Inactivar contacto' : 'Activar contacto'}
                                                className={`CardClient__toggle-status ${contact.isActive ? 'CardClient__toggle-status--active' : 'CardClient__toggle-status--inactive'}`}
                                                disabled={togglingId === contact.id}
                                                onClick={() => handleToggleStatus(contact)}
                                            >
                                                {togglingId === contact.id ? '...' : (contact.isActive ? 'ACTIVE' : 'INACTIVE')}
                                            </button>
                                        )}
                                        <button
                                            title="Enviar SMS a este contacto"
                                            onClick={() => {
                                                if (contact.phone?.length == 10) {
                                                    store_sms.setContact({
                                                        phone_number: contact.phone,
                                                        name, ci, type, view: true,
                                                        total_amount, days_past_due,
                                                        campain_id: store_call.campain_id,
                                                        credit_id: store_call.credit_id,
                                                        client_id: id
                                                    });
                                                } else {
                                                    sendpush({ title: 'Número incorrecto para SMS', message: 'Número no soporta SMS', type: 'Push--danger', timeout: 3000 });
                                                }
                                            }}
                                        >
                                            <MessageSquareText size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="CardClient__contacts-empty">No hay contactos adicionales</p>
                    )}

                    {/* Relaciones */}
                    <RelationshipTree clientName={name} relationships={relationships} />
                </div>
            )}
        </div>
    );
}
