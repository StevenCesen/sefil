import { useStoreManagement } from "../../../stores/useStoreManagement";
import AddContact from "../../Contacts/AddContact/AddContact";
import CardContact from "../../Contacts/CardContact/CardContact";
import "./ListContacts.css";

export default function ListContacts(){

    const store_management=useStoreManagement();

    if(store_management.phones==null) return <></>
    
    return(
        <div className="ListContacts custom-scroll">
            <h4>Contactos</h4>
            <AddContact/>
            <div className="ListContacts__list">
                {
                    store_management.phones.map((phone)=>(
                         <CardContact
                            key={phone.numero}
                            phone_number={phone.numero}
                            nro_fails={'0'}
                            nro_sucessful={phone.nro_efectivo}
                            name={store_management.client_name}
                            ci={store_management.client_ci}
                            type={store_management.client_type}
                            total_amount={store_management.monto}
                            days_past_due={store_management.dias_vencidos}
                            channel={phone.channel}
                        />
                    ))
                }
            </div>
        </div>
    );
}