import CardMessage from "../CardMessage/CardMessage";
import HeaderCRM from "./HeaderCRM";
import SearchCRM from "./SearchCRM";
import "./index.css";

export default function NavLeftCRM(){
    return (
        <div className="NavLeftCRM">
            <HeaderCRM
                title="Mensajes"
                button_1="Nuevo mensaje"
                button_2="Filtrar mensajes"
            />
            <SearchCRM/>
            <div className="NavLeftCRM__contentMessage">
                <CardMessage 
                    image="./user1.png"
                    name="Juan Carlos Ontaneda"
                    message="Hasta luego"
                    fecha="30/1/2024"
                />
                <CardMessage 
                    image="./user2.png"
                    name="Leonel Armijos Vasquéz"
                    message="Su comprobante de pago esta registrado"
                    fecha="29/1/2024"
                />
                <CardMessage 
                    image="./user3.png"
                    name="Andy Fabricio Vega"
                    message="Buenos días, para realizar un pago"
                    fecha="29/1/2024"
                />
            </div>
        </div>
    );
}