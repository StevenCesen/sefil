import { useStoreManagement } from "../../../stores/useStoreManagement";
import CardContact from "../../Contacts/CardContact/CardContact";
import "./ListContacts.css";

export default function ListContacts(){

    const store_management=useStoreManagement();

    if(store_management.phones==null) return <></>
    
    return(
        <div className="ListContacts custom-scroll">
            <h4>Contactos</h4>
            <div className="ListContacts__list">
                {
                    store_management.phones.map((phone)=>(
                         <CardContact
                            key={phone.numero}
                            phone_number={phone.numero}
                            nro_fails={'0'}
                            nro_sucessful={phone.nro_efectivo}
                        />
                    ))
                }
            </div>
        </div>
    );
}