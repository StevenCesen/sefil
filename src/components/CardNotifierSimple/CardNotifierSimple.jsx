import { useContext } from "react";
import "./CardNotifierSimple.css";
import { NotifierContext } from "../../contexts/notifierContext";

export default function CardNotifierSimple({message,byUser,id}){
    const dataContext=useContext(NotifierContext);

    return (
        <div className="CardNotifierSimple">
            <div className="CardNotifierSimple__contentText">
                <p>{message}</p>
                <span>Generado por {byUser}</span>
            </div>
            <div>
                <button 
                    className="CardNotifierSimple__button CardNotifierModify__button--success"
                    onClick={(e)=>{
                        e.target.textContent='Autorizando...';
                        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/vouchers/reprint/${id}`,{
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                e.target.textContent='Autorizado';
                                dataContext.removePush(id);
                            });
                    }}
                >Autorizar</button>
                <button 
                    className="CardNotifierSimple__button CardNotifierModify__button--failed"
                    onClick={(e)=>{
                        dataContext.removePush(id);
                    }}
                >Negar</button>
            </div>
        </div>
    );
}