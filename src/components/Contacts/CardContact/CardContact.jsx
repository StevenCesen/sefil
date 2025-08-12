import { MessageSquareText, PhoneForwarded } from "lucide-react";
import "./CardContact.css";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";

export default function CardContact({phone_number,nro_sucessful,nro_fails}){
    const store_call=useStoreProgressCall();

    return(
        <div className="CardContact">
            <p>{phone_number}</p>
            <div className="CardContact__metrics">
                <label className="CardContact__item CardContact__item--success">{(nro_sucessful>10) ? '+10' : nro_sucessful}</label>
                <label className="CardContact__item CardContact__item--fails">{(nro_fails>10) ? '+10' : nro_fails}</label>
            </div>
            <div className="CardContact__actions">
                <label 
                    className="CardContact__item CardContact__item--normalcall"
                    onClick={()=>{
                        store_call.setInfoPhone({phone_number});
                    }}
                >
                    <PhoneForwarded size={18}/>
                </label>
                <label
                    className="CardContact__item CardContact__item--sms"
                    onClick={()=>{
                        
                    }}
                >
                    <MessageSquareText size={18}/>
                </label>
            </div>
        </div>
    );
}