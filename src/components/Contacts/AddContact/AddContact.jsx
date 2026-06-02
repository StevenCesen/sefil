import { useState } from "react";
import "./AddContact.css";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import sendpush from "../../../helpers/sendpush";

export default function AddContact(){

    const [contact,setContact]=useState({
        phone_number:'',
        type:''
    });

    const store_management=useStoreManagement();

    const handleSaveContact=async (e)=>{
        e.target.textContent='Guardando...';

        if(contact.phone_number==='' || contact.type===''){
            sendpush({
                title:'Datos imcompletos.',
                message:'Ingrese todos los datos del número a guardar.',
                timeout:2000,
                type:'Push--danger'
            });
            e.target.textContent='Guardar contacto';
            return;
        }

        const data_phone={
            client_identification: store_management.client_ci,
            phone_number: contact.phone_number
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/contacts`,{
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data_phone)
            });

            const data = await response.json();
            
            if(data.code === 1){                        
                sendpush({
                    title:'Contacto guardado.',
                    message: data.message || 'Contacto creado exitosamente.',
                    timeout:2000,
                    type:'Push--sucessful'
                });
                
                // Limpiar el formulario
                setContact({
                    type:'',
                    phone_number:''
                });
                
                // Agregar el nuevo contacto al listado actual (no recargar desde servidor)
                if(data.result) {
                    store_management.setNewPhone(data.result);
                }
            }else{
                const field_errors = data.result && typeof data.result === 'object' && !Array.isArray(data.result)
                    ? Object.values(data.result).flat()[0]
                    : null;
                sendpush({
                    title: data.code === -1 ? 'Errores de validación.' : 'Error al guardar.',
                    message: field_errors || data.message || 'No se pudo guardar el contacto.',
                    timeout:3000,
                    type:'Push--danger'
                });
            }
        } catch (error) {
            console.error('Error al guardar contacto:', error);
            sendpush({
                title:'Error de conexión.',
                message:'No se pudo conectar con el servidor.',
                timeout:3000,
                type:'Push--danger'
            });
        }

        e.target.textContent='Guardar contacto';
    }

    return (
        <div className="AddContact">
            <h4>Nuevo número</h4>
            <div className="AddContactForm">
                <label>
                    Número de teléfono
                    <input placeholder="0XXXXXXXXX" onChange={(e)=>{setContact({...contact,phone_number:e.target.value})}} value={contact.phone_number} type="text"/>
                </label>
                <label>
                    Tipo
                    <select onChange={(e)=>{setContact({...contact,type:e.target.value})}} value={contact.type}>
                        <option value={''}>-- Seleccionar --</option>
                        <option value={'MOVIL'}>MOVIL</option>
                        <option value={'CON'}>CONVENCIONAL</option>
                    </select>
                </label>
            </div>
            <button onClick={async (e)=>{await handleSaveContact(e)}}>Guardar contacto</button>
        </div>
    );
}