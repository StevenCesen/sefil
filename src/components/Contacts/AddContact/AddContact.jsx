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

        const data_phone={
            credito:store_management.credit_id,
            tipo:contact.phone_number,
            nombre:store_management.client_name,
            parentesco:store_management.client_type,
            numero:contact.phone_number,
            nro_efectivo:1,
            cartera:store_management.cartera,
            ci:store_management.client_ci,
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
            body:new URLSearchParams(data_phone)
        })
            .then((response) => response.json())  
            .then((data) => {
                if(data.status===200){
                    
                    setContact({
                        type:'',
                        phone_number:''
                    });

                    store_management.setNewPhone(data_phone);
                    
                    sendpush({
                        title:'Contacto guardado.',
                        message:'Se guardado correctamente el número.',
                        timeout:2000,
                        type:'Push--sucessful'
                    });

                    e.target.textContent='Guardar';

                }else{
                    e.target.textContent='Error';
                }
            });
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