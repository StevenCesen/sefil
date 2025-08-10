import CardContact from "../../Contacts/CardContact/CardContact";
import "./ListContacts.css";

export default function ListContacts(){
    return(
        <div className="ListContacts custom-scroll">
            <h4>Contactos</h4>
            <div className="ListContacts__list">
                <CardContact
                    phone_number={'0978950498'}
                    nro_fails={'3'}
                    nro_sucessful={'20'}
                />
                <CardContact
                    phone_number={'0978950498'}
                    nro_fails={'3'}
                    nro_sucessful={'20'}
                />
                <CardContact
                    phone_number={'0978950498'}
                    nro_fails={'3'}
                    nro_sucessful={'20'}
                />
                <CardContact
                    phone_number={'0978950498'}
                    nro_fails={'3'}
                    nro_sucessful={'20'}
                />
                <CardContact
                    phone_number={'0978950498'}
                    nro_fails={'3'}
                    nro_sucessful={'20'}
                />
                <CardContact
                    phone_number={'0978950498'}
                    nro_fails={'3'}
                    nro_sucessful={'20'}
                />
            </div>
        </div>
    );
}